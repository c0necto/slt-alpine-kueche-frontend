import React from 'react';
import { Link } from 'gatsby';
/*import Language from '~layout/Language/Language';*/
/*import Nav from '~layout/Nav/Nav';*/
import LayoutProvider from '~layout/context';

import * as styles from './Header.module.scss';
import svg from './logo.svg';

const HeaderComponents = props => {
    return (
        <div className={styles.headerStrip}>
            <Link to={props.logoLink} className={styles.logo}>
                Salzburger Land Tourismus
                <img src={svg} alt={'Alpine Küche'} />
            </Link>
            {/*<Language />*/}
            {/*<Nav />*/}
        </div>
    );
};

const Header = props => {
    return (
        <LayoutProvider>
            <header>
                <HeaderComponents logoLink={props.logoLink} />
            </header>
        </LayoutProvider>
    );
};

export default Header;
