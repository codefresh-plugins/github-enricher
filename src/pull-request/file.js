const Promise = require('bluebird');
const fs = require('fs');

const configuration = require('../configuration');



class File {

    async pullRequests() {
        const path = configuration.workingDirectory + '/event.json';
        const result = JSON.parse(await Promise.fromCallback((cb) => fs.readFile(path, 'utf8', cb)));
        const pr = result.pull_request;
        if(pr) {
            return [
                {
                    number: pr.number,
                    url: pr.url
                }
            ]
        }
        throw new Error('PR not found in file');
    }

}
module.exports = new File();
