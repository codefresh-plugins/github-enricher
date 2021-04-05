const fileUtil = require('../util/file.util');
const configuration = require('../configuration');

const bitbucket = require('./bitbucket');
const github = require('./github');


class Strategy {

    async getProvider(path = configuration.workingDirectory + '/event.json') {
        try {
            const eventPayload = await fileUtil.fetchFile(path);
            if (eventPayload.pull_request) {
                return github;
            }
            if (eventPayload.pullrequest) {
                return bitbucket;
            }
        } catch(e) {
            // we not support bitbucket here for now, and it shouldnt be used in correct use case
            console.log(e);
        }

        if (configuration.contextType === 'git.github') {
            return github;
        }

        return bitbucket;
    }

}
module.exports = new Strategy();
