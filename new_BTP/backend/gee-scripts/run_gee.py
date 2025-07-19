import argparse
import os
import zipfile
import json
import geopandas as gpd
import pandas as pd
import ee
import matplotlib.pyplot as plt
from datetime import datetime

# Initialize the Earth Engine API with credentials
SERVICE_ACCOUNT = 'btp25-860@gee-project2022.iam.gserviceaccount.com'
KEY_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'credentials.json'))
 # Instead of '../credentials.json'

# Authentication of script using service account
credentials = ee.ServiceAccountCredentials(SERVICE_ACCOUNT, KEY_FILE)
ee.Initialize(credentials)

# Mapping DB sensor names to GEE collections and band mappings
sensor_map = {
    'Sentinel Sensor': {
        'collection': 'COPERNICUS/S2_SR_HARMONIZED',
        'bands': {
            'NIR': 'B8',
            'RED': 'B4',
            'BLUE': 'B2',
            'GREEN': 'B3'
        },
        'scale': 10
    },
    'Landsat Sensor': {
        'collection': 'LANDSAT/LC08/C02/T1_L2',
        'bands': {
            'NIR': 'SR_B5',
            'RED': 'SR_B4',
            'BLUE': 'SR_B2',
            'GREEN': 'SR_B3'
        },
        'scale': 30
    }
}

def parse_args():
    # Set up argument parsing
    parser = argparse.ArgumentParser()
    parser.add_argument('--sensor', required=True, help='Sensor type (e.g., Sentinel Sensor, Landsat Sensor)')
    parser.add_argument('--index', required=True, help='Index to calculate (e.g., NDVI, EVI)')
    parser.add_argument('--start', required=True, help='Start date (e.g., 2021-01-01)')
    parser.add_argument('--end', required=True, help='End date (e.g., 2021-12-31)')
    parser.add_argument('--shapefile', help='Path to the shapefile for region')
    parser.add_argument('--zipfile', help='Path to ZIP file containing shapefiles')
    return parser.parse_args()

# Recursive function to convert any Timestamps to strings
def convert_timestamps(obj):
    if isinstance(obj, pd.Timestamp):
        return obj.strftime('%Y-%m-%d')
    elif isinstance(obj, list):
        return [convert_timestamps(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_timestamps(value) for key, value in obj.items()}
    return obj

# Converts entire GeoDataFrame to GeoJSON format
def shapefile_to_geojson(shapefile_path):
    gdf = gpd.read_file(shapefile_path)

    # 'start_date' and 'end_date' columns to strings 
    if 'start_date' in gdf.columns:
        gdf['start_date'] = gdf['start_date'].astype(str)
    if 'end_date' in gdf.columns:
        gdf['end_date'] = gdf['end_date'].astype(str)

    # Apply timestamp conversion recursively to the GeoDataFrame
    for col in gdf.columns:
        gdf[col] = gdf[col].map(convert_timestamps)

    # Convert GeoDataFrame to GeoJSON
    geojson = json.loads(gdf.to_json())
    return geojson

# Extracts geometries from the GeoJSON into Earth Engine format (supports Polygon and MultiPolygon)
def extract_ee_geometry(geojson):
    feature = geojson['features'][0]
    geom_type = feature['geometry']['type']
    coords = feature['geometry']['coordinates']

    if geom_type == 'Polygon':
        # Wrapped in a list of linear rings
        if not isinstance(coords[0][0], list):
            coords = [coords]
        return ee.Geometry.Polygon(coords)

    elif geom_type == 'MultiPolygon':
        # Use the first polygon part
        coords = coords[0]
        if not isinstance(coords[0][0], list):
            coords = [coords]
        return ee.Geometry.Polygon(coords)

    else:
        raise ValueError(f'Unsupported geometry type: {geom_type}')

# Extracts shapefiles from a ZIP file
def extract_shapefiles_from_zip(zipfile_path, extract_to='temp_shapefiles'):
    with zipfile.ZipFile(zipfile_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)

    shapefiles = [os.path.join(extract_to, f) for f in os.listdir(extract_to) if f.endswith('.shp')]
    return shapefiles

def calculate_index(image, index_name, bands):
    if index_name == 'NDVI (Normalized Difference Vegetation Index)':
        return image.normalizedDifference([bands['NIR'], bands['RED']]).rename('NDVI')
    elif index_name == 'EVI (Enhanced Vegetation Index)':
        return image.expression(
            '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
                'NIR': image.select(bands['NIR']),
                'RED': image.select(bands['RED']),
                'BLUE': image.select(bands['BLUE'])
            }).rename('EVI')
    elif index_name == 'EVI2 (Enhanced Vegetation Index 2)':
        return image.expression(
            '2.5 * ((NIR - RED) / (NIR + 2.4 * RED + 1))', {
                'NIR': image.select(bands['NIR']),
                'RED': image.select(bands['RED'])
            }).rename('EVI2')
    elif index_name == 'NDWI (Normalized Difference Water Index)':
        return image.normalizedDifference([bands['GREEN'], bands['NIR']]).rename('NDWI')
    else:
        raise ValueError('Unsupported index: ' + index_name)

def run_index(sensor_name, index_name, start, end, region_geom):
    # Ensure that sensor_name is a string and exists in the sensor_map
    if not isinstance(sensor_name, str):
        raise ValueError(f"Sensor name must be a string. Got: {type(sensor_name)}")
    
    if sensor_name not in sensor_map:
        raise ValueError(f"Unsupported sensor: {sensor_name}")
    
    sensor_info = sensor_map[sensor_name]
    collection = ee.ImageCollection(sensor_info['collection']) \
        .filterBounds(region_geom) \
        .filterDate(ee.Date(start), ee.Date(end))  # Convert to ee.Date

    if sensor_name == 'Sentinel Sensor':  # cloud cover (for Sentinel only)
        collection = collection.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

    def add_index(img):
        index_img = calculate_index(img, index_name, sensor_info['bands'])
        return index_img.copyProperties(img, img.propertyNames())

    index_series = collection.map(add_index)

    def compute_stats(image):
        stat = image.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region_geom,
            scale=sensor_info['scale'],
            maxPixels=1e13
        )
        return image.set(stat)

    stats_collection = index_series.map(compute_stats)

    # list of dictionaries with date and index mean value
    stats_list = stats_collection.aggregate_array('system:time_start').getInfo()
    values_list = stats_collection.aggregate_array(index_name.split()[0]).getInfo()

    # Combine result
    output = []
    for date_ms, value in zip(stats_list, values_list):
        date = datetime.utcfromtimestamp(date_ms / 1000).strftime('%Y-%m-%d')
        output.append({'date': date, 'value': value})

    # Plotting the results
    dates = [item['date'] for item in output]
    values = [item['value'] for item in output]

    plot_filename = 'output_plot.png'
    plt.figure(figsize=(10, 6))
    plt.plot(dates, values, marker='o', linestyle='-', color='b')
    plt.xlabel('Date')
    plt.ylabel(f'{index_name} Value')
    plt.title(f'{index_name} Time Series')
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Save the plot to a file (for example, output_plot.png)
    plt.savefig(plot_filename)

    #csv file add
    csv_filename = 'output_data.csv'
    df = pd.DataFrame(output)
    df.to_csv(csv_filename, index=False)

    print(plot_filename)
    print(csv_filename)

    return plot_filename, csv_filename

def main():
    args = parse_args()
    
    # Ensure the sensor is valid
    sensor_name = args.sensor
    if sensor_name not in sensor_map:
        raise ValueError(f"Sensor '{sensor_name}' not found in sensor map.")

    sensor_info = sensor_map[sensor_name]  # This is the object mapped from the sensor name

    print(f"Using sensor: {sensor_name}")
    print(f"Sensor info: {sensor_info}")

    # Check if zipfile is provided
    if args.zipfile:
        # Extract shapefiles from zip
        shapefiles = extract_shapefiles_from_zip(args.zipfile)
        # Process each shapefile
        for shapefile in shapefiles:
            print(f'Processing shapefile: {shapefile}')
            region_geom_json = shapefile_to_geojson(shapefile)
            region_geom = extract_ee_geometry(region_geom_json)
            run_index(args.sensor, args.index, args.start, args.end, region_geom)
    else:
        # If no zipfile, process a single shapefile
        region_geom_json = shapefile_to_geojson(args.shapefile)
        region_geom = extract_ee_geometry(region_geom_json)
        run_index(args.sensor, args.index, args.start, args.end, region_geom)

if __name__ == "__main__":
    main()