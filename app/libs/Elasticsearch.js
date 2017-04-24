import elasticsearch from 'elasticsearch';

export default class ES {
    constructor(props) {
        this.indexname = props.indexname;
        this.doctype = props.doctype;
        this.schema = props.schema;
        this.search = new elasticsearch.Client({host: props.url});
    }

    indexCreate() {
        return new Promise((resolve, reject) => {
            this.search.indices.create({
                index: this.indexname,
                body: {},
                //This lets us ignore the error when the index already exists.
                ignore:[400]
            })
            .then(body => {
                /* If we were being clever we could read this from a seperate file */
                this.search.indices.putMapping({
                    index: this.indexname,
                    type:this.doctype,
                    body: this.schema
                })
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        });
    }

    addItems(items) {
        return new Promise((resolve, reject) => {
            this.search.bulk({
                index: this.indexname,
                type: this.doctype,
                body: items
            }, function(err, response) {
                if (err) {
                    return reject(JSON.stringify(err));
                }
                return resolve(JSON.stringify(response));
            });
        });
    }
}
