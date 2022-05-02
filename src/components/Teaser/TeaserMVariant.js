import React from "react"
import {GatsbyImage, StaticImage} from "gatsby-plugin-image"
//import { stripTags } from "~utils"
import * as styles from "./TeaserMVariant.module.scss"
import { artDirection } from "~utils"
import {Link} from "gatsby";

const TeaserContent = props => {
    let images = false
    if (props.image?.teaserM) {
        images = artDirection(
            props.image.teaserM.childImageSharp,
            props.image.teaserM.childImageSharp,
        );
    }
    return (
        <>
            <figure>
                {!!images ? (
                    <GatsbyImage
                        image={images}
                        alt={props.text ? props.text : props.title}
                        className={styles.image}/>
                ) : (
                    <StaticImage
                        src={'../../images/placeholder.jpg'}
                        alt="Bitte Bild hinterlegen"
                        width={570}
                        height={270}
                    />
                )}
            </figure>
            <div className={styles.content}>
                <h4>{props.children}</h4>
                {/*{!!props.text && (
                    <div className={styles.text}>
                        {props.text}
                    </div>
                )}*/}
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
        <Link to={link} className={styles.teaserM}>
            <TeaserContent {...props} />
        </Link>
    )
}

const External = props => {
    return (
        <a href={props.targetUrl} className={styles.teaserM} target={'_blank'} rel={'noreferrer'}>
            <TeaserContent {...props} />
        </a>
    )
}

const Teaser = props => {
    let targetUrl = 'https://www.salzburgerland.com' + props.slug
    // links to internal
    let containerComponent = <Internal {...props} />
    // links to external
    if ( !props.internal ) {
        containerComponent = <External {...props} targetUrl={targetUrl} />
    }
    return containerComponent
}

export default Teaser