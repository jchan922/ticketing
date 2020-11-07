module.exports = {
    // Docker fix: tells webpack to poll all files every 3ms to reflect changes
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
};