import React from "react"
import {GatsbyImage, StaticImage} from "gatsby-plugin-image"
import * as styles from "./TeaserM.module.scss"
import {artDirection} from "~utils"

const Teaser = props => {
    let images = false
    if (props.image?.teaserMDesktop && props.image?.teaserSMobile) {
        images = artDirection(
            props.image.teaserMDesktop.childImageSharp,
            props.image.teaserSMobile.childImageSharp,
        );
    }
    let targetUrl = 'https://www.salzburgerland.com/' + props.slug
    return (
        <a href={targetUrl} className={styles.teaserM} target={'_blank'} rel={'noreferrer'}>
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
                        width={270}
                        height={270}
                    />
                )}
            </figure>
            <div className={styles.content}>
                <h4>{props.children}</h4>
                <div className={styles.text}>
                    {props.text}
                </div>
            </div>
        </a>
    )
}

export default Teaser