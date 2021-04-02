const fileUtil = require('../util/file.util');
const configuration = require('../configuration');

const bitbucket = require('./bitbucket');
const github = require('./github');


class Strategy {

    async getProvider() {
        try {
            const path = configuration.workingDirectory + '/event.json';
            const eventPayload = await fileUtil.fetchFile(path);
            return eventPayload.pull_request ? github : bitbucket;
        } catch(e) {
            // we not support bitbucket here for now, and it shouldnt be used in correct use case
            return github;
        }
    }

}
