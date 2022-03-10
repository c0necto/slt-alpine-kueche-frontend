import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, StaticImage } from 'gatsby-plugin-image';
import * as styles from './TeaserS.module.scss';
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
        <div className={styles.teaserS}>
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
                        src={'../../images/270x150.png'}
                        alt="Bitte Bild hinterlegen"
                    />
                </figure>
            )}
            <div className={styles.content}>
                <Link to={props.slug}>
                    <h4>{props.children}</h4>
                </Link>
            </div>
        </div>
    );
};

export default Teaser;
