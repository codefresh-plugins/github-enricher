const Promise = require('bluebird');
const fs = require('fs');

const configuration = require('../configuration');



class File {

    async _fetchFile(path) {
        try {
            return JSON.parse(await Promise.fromCallback((cb) => fs.readFile(path, 'utf8', cb)));
        } catch(e) {
            throw new Error(`${path} file not found`);
        }
    }

    async pullRequests() {
        const path = configuration.workingDirectory + '/event.json';
        const pr = (await this._fetchFile(path)).pull_request;
        if(pr) {
            const result = {
                number: pr.number,
                title: pr.title,
                url: pr.url.replace("api.github.com/repos", "github.com").replace("/pulls/", "/pull/"),
            }
            if(pr.user) {
                result.committer = {
                    userName: pr.user.login,
                    avatar: pr.user.avatar_url,
                }
            }
            return [result]
        }
        throw new Error(`PR section not found in ${path}, it can be if build was run not with PR event`);
    }

}
module.exports = new File();
