module.exports = {
    apiToken: process.env.CF_API_KEY,
    host: process.env.CODEFRESH_HOST || 'https://g.codefresh.io',
    image: process.env.IMAGE_SHA,
    branch: process.env.BRANCH,
    repo: process.env.REPO
};
