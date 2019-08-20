const _ = require('lodash');
const GoogleDriveApi = require('./api');

const REQUIRED_VARAIBLES = [
    'USER_EMAIL',
    'SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
];

// checking config
function getConfig() {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
        process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = new Buffer(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, 'base64').toString('utf-8');
    }

    const config = {
        user: process.env.USER_EMAIL,
        client_email: process.env.SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    };

    REQUIRED_VARAIBLES.forEach((variable) => {
        if (!process.env[variable]) {
            console.error(`${variable} env variable should be present`);
            process.exit(1);
        }
    });

    return config;
}

async function runPlugin() {
    const config = getConfig();

    // Parse files
    const vars = Object.entries(process.env).map(([key, value]) => {
        if (/^UPLOAD_FILE_/.test(key)) {
            const [path, name, contentType] = value.split(',');
            return { path, name, contentType };
        }

        return null;
    });
    const files = _.compact(vars);

    if (!files.length) {
        console.error('At least one file should be specified for uploading. Set UPLOAD_FILE_1 variable.');
        process.exit(1);
    }

    const api = new GoogleDriveApi(config);
    return api.upload(files);
}

module.exports = runPlugin;
