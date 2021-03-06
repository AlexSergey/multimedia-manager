const path = require('path');
const spawn = require('child_process').spawn;
const configGlobal = require('./config/global');

const configElasticPath = path.join(__dirname, path.normalize(configGlobal.elasticsearch.config));

try {
    var ls = spawn('elasticsearch', [
        `-Epath.conf=${configElasticPath}`,
        `-Ehttp.port=${configGlobal.elasticsearch.port}`
    ]);

    ls.stdout.on('data', data => {
        console.log(data.toString());
    });

    ls.stderr.on('data', data => {
        console.log(data.toString());
    });

    ls.on('close', code => {
        console.log(`child process exited with code ${code.toString()}`);
        process.exit(code);
    });
} catch (e) {
    console.error(e);
    process.exit(1);
}
