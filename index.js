const plugin = require('./src/plugin');

plugin()
    .then((response) => {
        console.log(`${response.success.length} files uploaded. ${response.error.length} errors.\n`);

        response.success.forEach((file, index) => {
            console.log(`_file ${index + 1}_`);
            console.log(`contentType: ${file.mimeType}`);
            console.log(`file name: ${file.name}`);
            console.log(`file path: ${file.path}\n`);
        });

        response.error.forEach((error, index) => {
            console.error(`_error ${index + 1}_`);
            console.error(`message: ${error.message}\n`);
        });

        if (response.error.length) {
            process.exit(1);
        };

    })
    .catch((e) => {
        console.error(e);
    });
