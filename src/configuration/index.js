module.exports = {
    apiToken: process.env.CF_API_KEY || '5ee8c6ac8c93b8e09476606f.4ab93b0f27de416a67c7583b2e28677a',
    host: process.env.CODEFRESH_HOST || 'https://g.codefresh.io',
    image: process.env.IMAGE_SHA || 'sha256:5dc5a57ec85c31f5a26f762f4893826e7e6be13cd7c03bb8d469d052661dbd73',
    branch: process.env.BRANCH,
    repo: process.env.REPO
};
