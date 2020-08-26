const api = require('./api');
const file = require('./file');


class PullRequest {

    async get() {
        try {
            return await file.pullRequests();
        } catch(e) {
            return await api.pullRequests();
        }
    }

}
module.exports = new PullRequest();
