import { Link } from 'gatsby';
import React from 'react';
import Cta from '~components/Cta/Cta';
import { GatsbyImage, StaticImage } from 'gatsby-plugin-image';
import * as styles from './TeaserL.module.scss';
import { artDirection } from '~utils';

const Teaser = props => {
    let images = false;
    if (props.image?.desktop && props.image?.mobile) {
        images = artDirection(
            props.image.desktop.childImageSharp,
            props.image.mobile.childImageSharp,
        );
    }
    return (
        <Link to={props.to} className={styles.teaserL}>
            {!!images ? (
                <figure>
                    <GatsbyImage
                        image={images}
                        alt={props.title}
                        className={styles.image}
                    />
                </figure>
            ) : (
                <figure>
                    <StaticImage
                        src={'../../images/1170x660.png'}
                        alt="Bitte Bild hinterlegen"
                    />
                </figure>
            )}
            <div className={styles.content}>
                <div className={styles.ctaPosition}>
                    <div className={styles.innerContent}>
                        <Cta
                            title={props.title}
                            subtitle={props.text}
                            buttontext={props.buttontext}
                            buttoncolor={'green'}
                            fakebutton={props.fakebutton}
                            additionalClass={'small'}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Teaser;
