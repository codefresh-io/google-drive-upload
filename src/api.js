const { google } = require('googleapis');
const Promise = require('bluebird');
const fs = require('fs');
// const path = require('path');
// const { client_email, private_key } = require('./jwt.keys');

let drive;
let user;

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

                result.success.push(f.data);
            } catch (error) {
                result.error.push(error);
            }
        });

        return result;
    }
}

async function runSample() {
    const res = await drive.files.list({
        pageSize: 10,
        // fields: 'nextPageToken, files(id, name)',
    });
    const about = await drive.about.get({
        fields: 'user',
    });
    const perm = await drive.permissions.list({
        fileId: '0B_uEsCKoieGEc3RhcnRlcl9maWxl',
        // fields: 'nextPageToken, files(id, name)',
    });
    const one = await drive.permissions.get({
        fileId: '0B_uEsCKoieGEc3RhcnRlcl9maWxl',
        permissionId: '11281608261086712464',
        // supportsAllDrives: true,
        // useDomainAdminAccess: true,
        fields: '*',
        // fields: 'nextPageToken, files(id, name)',
    });

    const upd = await drive.permissions.create({
        fileId: '0B_uEsCKoieGEc3RhcnRlcl9maWxl',
        // transferOwnership: true,
        // useDomainAdminAccess: true,
        fields: '*',
        requestBody: {
            emailAddress: 'andpr99@gmail.com',
            role: 'writer',
            type: 'user',
        },
        // fields: 'nextPageToken, files(id, name)',
    });

    const newone = await drive.permissions.get({
        fileId: '0B_uEsCKoieGEc3RhcnRlcl9maWxl',
        permissionId: upd.data.id,
        // supportsAllDrives: true,
        // useDomainAdminAccess: true,
        fields: '*',
        // fields: 'nextPageToken, files(id, name)',
    });

    console.log(upd, newone);

    return res.data;
}

if (module === require.main) {
    runSample().catch(console.error);
}

// Exports for unit testing purposes
module.exports = GoogleDriveClient;
