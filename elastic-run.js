const path = require('path');
const spawn = require('child_process').spawn;
const configElasticPath = path.join(__dirname, path.normalize('./config/elasticsearch'));

try {
    var ls = spawn('elasticsearch', [
        `-Epath.conf=${configElasticPath}`
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
