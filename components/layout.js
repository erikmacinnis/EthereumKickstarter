import React from 'react';
import Header from './header';
import Head from 'next/head';

const layout = (props) => {
    return(
        <div style={{ marginLeft: '20px', marginRight: '20px'}}>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"/>
            </Head>
            <Header/>
            {props.children}
        </div>
    );
}

export default layout;