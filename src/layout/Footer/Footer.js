import React from 'react';
import Icon from '~components/Icon/Icon';
import Container from '~components/Container/Container';
import * as styles from './Footer.module.scss';
import svg from './logo-badge.svg';
//import { Link } from 'gatsby';

const Footer = props => {
    // if props is null return false
    if (!props.footer) return false;
    const {
        address,
        company,
        email,
        phone,
        footer_links,
        footer_heading_1,
        footer_heading_2,
        footer_heading_3,
    } = props.footer;
    return (
        <footer className={styles.footer}>
            <div className={styles.bottom}>
                <Container>
                    <div className={styles.sections}>
                        <div className={styles.section + ' ' + styles.hotline}>
                            {footer_heading_1 ? (
                                <h2>{footer_heading_1.text}</h2>
                            ) : null}
                            {phone ? (
                                <a
                                    href={'tel:' + phone.text?.replace(' ', '')}
                                    className={styles.phone}>
                                    {phone.text}
                                </a>
                            ) : null}

                            {email ? (
                                <a
                                    href={'mailto:' + email.text}
                                    className={styles.email}>
                                    {email.text}
                                </a>
                            ) : null}
                        </div>

                        <div className={styles.section + ' ' + styles.contact}>
                            {footer_heading_2 ? (
                                <h2>{footer_heading_2.text}</h2>
                            ) : null}
                            {company ? <strong>{company.text}</strong> : null}

                            {address ? (
                                <address>
                                    {address.text
                                        .split('\n')
                                        .map((str, index) => (
                                            <p key={index}>{str}</p>
                                        ))}
                                </address>
                            ) : null}
                        </div>

                        <div className={styles.section + ' ' + styles.times}>
                            {footer_heading_3 ? (
                                <h2>{footer_heading_3.text}</h2>
                            ) : null}
                            <ul className={styles.verticalMenu}>
                                {footer_links?.data?.map((link, index) => {
                                    const data = link.children[0]?.linkData;
                                    return (
                                        <li key={index}>
                                            <a
                                                href={data.path}
                                                target={data.windowTarget}>
                                                {data.text}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        {/* <div className={styles.section + ' ' + styles.nav}>
                            <ul className={styles.menu}>
                                <li>
                                    <Link to="/">
                                        Impressum und Datenschutz
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/">salzburgerland.com</Link>
                                </li>
                            </ul>
                        </div>*/}
                        <div className={styles.section + ' ' + styles.social}>
                            <div className={styles.logoSocial}>
                                <a
                                    href="https://www.salzburgerland.com"
                                    className={styles.sltLogo}>
                                    <img
                                        loading={'lazy'}
                                        src={svg}
                                        width={100}
                                        height={45}
                                        alt={'Alpine Küche'}
                                    />
                                </a>
                                <ul className={styles.socialIcons}>
                                    <li>
                                        <a
                                            href="https://www.facebook.com/salzburgerland/"
                                            target={'_blank'}
                                            rel="noreferrer"
                                            className={styles.facebook}>
                                            Facebook
                                            <Icon name="facebook" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.instagram.com/salzburgerland/"
                                            target={'_blank'}
                                            rel="noreferrer"
                                            className={styles.instagram}>
                                            Instagram
                                            <Icon name="instagram" />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.youtube.com/user/salzburgerland"
                                            target={'_blank'}
                                            rel="noreferrer"
                                            className={styles.youtube}>
                                            Youtube
                                            <Icon name="youtube" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
