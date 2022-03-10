import React from 'react';
import classNames from 'classnames';
import { GatsbyImage } from 'gatsby-plugin-image';
import Container from '~components/Container/Container';
import Cta from '~components/Cta/Cta';
import * as styles from './HeaderMedia.module.scss';
import { artDirection } from '~utils';
import { imageAtts } from '~utils';

const HeaderMedia = props => {
    let portalClass = null;
    if (props.portal) {
        portalClass = styles.portal;
    }

    const images = artDirection(
        props.image.desktop.childImageSharp,
        props.image.mobile.childImageSharp,
    );

    const meta = imageAtts(props.alt, props.meta);

    return (
        <div className={classNames(styles.headermedia, portalClass)}>
            <div className={styles.media}>
                <GatsbyImage
                    image={images}
                    alt={meta.alt}
                    title={meta.compound ? meta.compound : null}
                />
                {meta.title ? (
                    <div className={styles.compound}>{meta.title}</div>
                ) : null}
            </div>

            <div className={styles.containerInner}>
                <Container>
                    {!!props.title && (
                        <Cta
                            title={props.title}
                            subtitle={props.subtitle}
                            buttonlink={props.buttonlink}
                            buttontext={props.buttontext}
                            buttoncolor={props.buttoncolor}
                            fakebutton={props.fakebutton}
                        />
                    )}
                </Container>
            </div>
        </div>
    );
};

export default HeaderMedia;
