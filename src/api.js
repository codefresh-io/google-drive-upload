const { google } = require('googleapis');
const Promise = require('bluebird');
const fs = require('fs');

class GoogleDriveClient {
    constructor(config) {
        const { client_email, private_key } = config;
        this.user = config.user;

        const jwt = new google.auth.JWT(
            client_email,
            null,
            private_key,
            'https://www.googleapis.com/auth/drive',
        );

        this.drive = google.drive({
            version: 'v3',
            auth: jwt,
        });
    }

    async upload(files) {
        const result = {
            success: [],
            error: [],
        };
        await Promise.each(files, async (file) => {
            try {
                if (!fs.existsSync(file.path)) {
                    throw new Error(`File ${file.path} not exists`);
                }

                const f = await this.drive.files.create({
                    requestBody: {
                        name: file.name,
                        mimeType: file.contentType,
                    },
                    media: {
                        mimeType: file.contentType,
                        body: fs.createReadStream(file.path),
                    },
                });

                await this.drive.permissions.create({
                    fileId: f.data.id,
                    fields: '*',
                    requestBody: {
                        emailAddress: this.user,
                        role: 'writer',
                        type: 'user',
                    },
                });

                result.success.push({ ...f.data, path: file.path });
            } catch (error) {
                result.error.push(error);
            }
        });

        return result;
    }
}

module.exports = GoogleDriveClient;
