const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });
async function uploadToDrive(localFilePath, fileName, mimeType = 'application/zip') {
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(localFilePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });
  const fileId = response.data.id;
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      type: 'user',
      role: 'reader',
      emailAddress: 'btp.lsi2022@gmail.com', 
    },
  });

  return fileId;
}

module.exports = uploadToDrive
