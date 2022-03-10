import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '~layout/Header/Header';
import Footer from '~layout/Footer/Footer';
import * as styles from './Layout.module.scss';
import './layout.css';

const Layout = props => {
    const { logoLink, language, children, footer } = props;
    return (
        <>
            <Helmet htmlAttributes={{ lang: language }}>
                <meta charset="utf-8" />
            </Helmet>
            <div className={styles.pageWrap}>
                <Header logoLink={logoLink} />
                {children}
                <Footer footer={footer} />
            </div>
        </>
    );
};

export default Layout;
