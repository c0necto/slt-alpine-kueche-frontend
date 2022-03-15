import React from 'react';
import {Link} from 'gatsby';
import {GatsbyImage, StaticImage} from 'gatsby-plugin-image';
import * as styles from './TeaserS.module.scss';
import {artDirection} from '~utils';

// todo: include slider if more than 4 items

const TitleText = props => {
    return (
        <>
            <h4>{props.children}</h4>
            {props.text ? <div className={styles.text}>
                {props.text}
            </div> : null}
        </>
    )
}

const TeaserContent = props => {

    let images = false
    if (props.image?.teaserSDesktop && props.image?.teaserSMobile) {
        images = artDirection(
            props.image.teaserSDesktop.childImageSharp,
            props.image.teaserSMobile.childImageSharp,
        )
    }

    return (
        <>
            <figure>
                {!!images ? (
                    <GatsbyImage
                        image={images}
                        alt={props.title}
                        className={styles.image}
                    />
                ) : (
                    <StaticImage
                        src={'../../images/placeholder.jpg'}
                        alt="Bitte Bild hinterlegen"
                        width={270}
                        height={152}
                    />
                )}
            </figure>
            <div className={styles.content}>
                {props.slider
                    ? <a href={props.url} target={'_blank'} rel={'noreferrer'}><TitleText {...props} /></a>
                    : <TitleText {...props} />
                }
            </div>
        </>
    )
}

const LinkComponent = props => {
    return (
        <Link to={props.slug} className={styles.teaserS}>
            <TeaserContent {...props} url={props.slug} />
        </Link>
    )
}

const HrefComponent = props => {
    return (
        <a href={props.targetUrl} className={styles.teaserS} target={'_blank'} rel={'noreferrer'}>
            <TeaserContent {...props} url={props.targetUrl} />
        </a>
    )
}

const DivComponent = props => {
    return (
        <div className={styles.teaserS}>
            <TeaserContent {...props} url={props.slug} />
        </div>
    )
}

const Teaser = props => {
    let targetUrl = 'https://www.salzburgerland.com' + props.slug
    if (props.blank) {
        return <HrefComponent {...props} targetUrl={targetUrl} />
    } else if ( props.slider ) {
        return <DivComponent {...props} />
    } else {
        return <LinkComponent {...props} />
    }
}

export default Teaser;
