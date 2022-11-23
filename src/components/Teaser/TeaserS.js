import React from 'react';
import {Link} from 'gatsby';
import {GatsbyImage, StaticImage} from 'gatsby-plugin-image';
import * as styles from './TeaserS.module.scss';
import {artDirection} from '~utils';

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
const LinkedTitleText = props => {
    return (
        <>
            {props.blank
            ? <a href={props.targetUrl} target={'_blank'} rel={'noreferrer'}><TitleText {...props} /></a>
            : <Link to={props.slug}><TitleText {...props} /></Link>
            }
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
                <TitleText {...props} />
                {/*{props.slider
                    ? <LinkedTitleText {...props} />
                    : <TitleText {...props} />
                }*/}
            </div>
        </>
    )
}

const Internal = props => {
    let link = props.slug
    if ( props.internal ) {
        link = props.internal
    }

    return (
        <Link to={link} className={styles.teaserS}>
            <TeaserContent {...props} />
        </Link>
    )
}

const External = props => {
    return (
        <a href={props.targetUrl} className={styles.teaserS} target={'_blank'} rel={'noreferrer'}>
            <TeaserContent {...props} />
        </a>
    )
}

const Slider = props => {
    return (
        <div className={styles.teaserS}>
            <TeaserContent {...props} />
        </div>
    )
}

// if (props.slider) is undefined
// if (props.slider) is undefined



const Teaser = props => {
    const targetUrl = 'https://www.salzburgerland.com' + props.slug
    // standard teaser element, links to internal
    let containerComponent = <Internal {...props} />
    // standard teaser element, links to external
    if ( !props.internal ) {
        containerComponent = <External {...props} targetUrl={targetUrl} />
    }
    // slider teaser element
    if ( props.slider ) {
        containerComponent = <Internal {...props} />
        if ( props.blank ) {
            containerComponent = <External {...props} targetUrl={targetUrl} />
        }
    }
    return containerComponent
}

export default Teaser;
