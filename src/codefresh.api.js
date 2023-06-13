const axios = require('axios');

const _handleError = (prefix) => (e) => {
    throw new Error(prefix
        ? `${prefix} (${e.message})`
        : e.message)
}

class CodefreshAPI {
    constructor(host = 'https://g.codefresh.io', apiKey) {
        this.axiosClient = axios.create({
            baseURL: `${host}/api`,
            headers: {
                /* eslint-disable-next-line @typescript-eslint/naming-convention */
                'Authorization': `Bearer ${apiKey}`
            },
        })
    }


    async getContext(name, type) {
        if (type && !['git', 'atlassian'].includes(type)) {
            throw new Error(`Wrong context type: ${type}`)
        }
        return this.axiosClient(`/contexts/${name}?decrypt=true${type ? '&regex=true&type=' + type : ''}`)
            .then(response => response.data)
            .catch(_handleError(''))
    }


}

module.exports = CodefreshAPI