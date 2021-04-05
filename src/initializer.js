const codefreshApi = require('./codefresh.api');
const config = require('./configuration');

class Initializer {

    async _prepareConfig() {
        try {
            const context = await codefreshApi.getContext(config.contextName);
            const type = context.spec.type;
            const token = context.spec.data.auth.password;
            config.contextType = type;
            config.contextCreds = token;
        } catch (e) {

        }

    }

    async init() {
        await this._prepareConfig();
    }

}
module.exports = new Initializer();
