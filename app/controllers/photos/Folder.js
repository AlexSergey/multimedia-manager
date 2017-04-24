import {walk} from 'walk';
import {normalize} from 'path';

export default class Folder {
    constructor(props) {
        this.types = props.types;
    }

    getChildFiles(pathToFolder) {
        var childFiles = [];
        return new Promise((resolve, reject) => {
            var walker  = walk(pathToFolder);

            walker.on('file', (root, stat, next) => {
                // Add this file to the list of files
                if (this._strEndsWith(stat.name.toLowerCase(), this.types)) {
                    childFiles.push({
                        path: normalize(`${root}/${stat.name}`)
                    });
                }
                next();
            });
            walker.on('end', () => {
                return resolve(childFiles);
            });
        })
    }

    _strEndsWith(str, types) {
        var match = false;

        types.forEach(type => {
            var includeExtensions = str.match(type+"$");
            if (Array.isArray(includeExtensions)) {
                if (includeExtensions[0].indexOf(type) >= 0) {
                    match = true;
                }
            }
        });

        return match;
    }
}
