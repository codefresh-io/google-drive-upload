const plugin = require('./src/plugin');

plugin()
    .then((response) => {
        console.log(`${response.success.length} files uploaded. ${response.error.length} errors.`);

        if (response.success.length) {
            response.success.forEach((file, index) => {
                console.log(`_file ${index + 1}_`);
                console.log(`contentType: ${file.mimeType}`);
                console.log(`fileName: ${file.name}`);
            });
        }

        if (response.error.length) {
            response.error.forEach((error, index) => {
                console.error(`_error ${index + 1}_`);
                console.error(`message: ${error.message}`);
            });
        }
    })
    .catch((e) => {
        console.error(e);
    });
