/**
 * Global wrapper to override default Next.js App component to initialize pages
 * https://github.com/vercel/next.js/blob/master/errors/css-global.md
 */

import buildClient from '../api/build-client';
import Header from '../components/header';

import 'bootstrap/dist/css/bootstrap.css';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    );
}; 

// Next.js method for SSR rending
AppComponent.getInitialProps = async appContext => {
    const { Component, ctx } = appContext;
    const client = buildClient(ctx)
    const { data } = await client.get('/api/users/currentuser');
    
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return {
        pageProps,
        ...data
    };
 };

export default AppComponent;