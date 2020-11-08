/**
 * Global wrapper to override default Next.js App component to initialize pages
 * https://github.com/vercel/next.js/blob/master/errors/css-global.md
 */

import 'bootstrap/dist/css/bootstrap.css';

const _app = ({ Component, pageProps }) => {
    return <Component {...pageProps} />
};

export default _app;