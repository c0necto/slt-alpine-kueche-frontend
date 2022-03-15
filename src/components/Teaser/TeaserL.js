import {Link} from 'gatsby';
import React from 'react';
import Cta from '~components/Cta/Cta';
import {GatsbyImage, StaticImage} from 'gatsby-plugin-image';
import * as styles from './TeaserL.module.scss';
import {artDirection} from '~utils';
import cn from "classnames";

const TeaserContent = props => {

    let images = false
    if (props.image?.teaserSMobile) {
        images = artDirection(
            props.image.teaserSMobile.childImageSharp,
            props.image.teaserSMobile.childImageSharp,
        )
    }

    return (
        <>
            <figure>
                {!!images ? (
                    <GatsbyImage
                        image={images}
                        alt={props.text ? props.text : props.title}
                        className={styles.image}
                    />
                ) : (
                    <StaticImage
                        src={'../../images/placeholder.jpg'}
                        alt="Bitte Bild hinterlegen"
                        width={1170}
                        height={661}
                    />
                )}
            </figure>

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
        </>
    )
}

const LinkComponent = props => {
    return (
        <Link to={props.slug} className={styles.teaserL}>
            <TeaserContent {...props} />
        </Link>
    )
}

const HrefComponent = props => {
    return (
        <a href={props.targetUrl} className={cn(styles.teaserL, styles.noMargin)} target={'_blank'} rel={'noreferrer'}>
            <TeaserContent {...props} />
        </a>
    )
}

const divComponent = props => {
    return (
        <div className={styles.teaserL}>
            <TeaserContent {...props} />
        </div>
    )
}

const Teaser = props => {
    let targetUrl = 'https://www.salzburgerland.com/' + props.slug
    if (props.blank) {
        return <HrefComponent {...props} targetUrl={targetUrl} />
    } else {
        return <LinkComponent {...props} />
    }
}

export default Teaser;