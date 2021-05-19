const _ = require('lodash');
const fileUtil = require('../../util/file.util');

const configuration = require('../../configuration');

class GitlabFile {

    async pullRequests() {
        const path = configuration.workingDirectory + '/event.json';
        const pr = (await fileUtil.fetchFile(path)).object_attributes;
        if(pr) {
            const result = {
                number: pr.id,
                title: pr.title,
                url: pr.url,
                committers: [{
                    userName: _.get(pr, 'assignee.username'),
                    avatar: _.get(pr, 'assignee.avatar_url'),
                }],
            };
            return [result]
        }
        throw new Error(`PR section not found in ${path}, it can be if build was run not with PR event`);
    }

}
module.exports = new GitlabFile();
