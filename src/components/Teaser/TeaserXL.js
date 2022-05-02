import {Link} from "gatsby"
import React from "react"
import Container from "~components/Container/Container"
import {GatsbyImage, StaticImage} from "gatsby-plugin-image"
import Cta from "~components/Cta/Cta"
import * as styles from "./TeaserXL.module.scss"
import {artDirection} from "~utils"

const TeaserContent = props => {
    let images = false
    if (props.image?.teaserXLMobile && props.image?.teaserXLDesktop) {
        images = artDirection(
            props.image.teaserXLDesktop.childImageSharp,
            props.image.teaserXLMobile.childImageSharp,
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
                        width={1920}
                        height={768}
                    />
                )}
            </figure>
            <div className={styles.content}>
                <Container variant="restricted">
                    <div className={styles.ctaPosition}>
                        <div className={styles.innerContent}>
                            <Container>
                                <Cta
                                    title={props.title}
                                    subtitle={props.subtitle}
                                    buttontext={props.buttontext}
                                    buttoncolor={"green"}
                                    fakebutton={props.fakebutton}
                                    additionalClass={'small'}
                                />
                            </Container>
                        </div>
                    </div>
                </Container>
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
        <Link to={link} className={styles.xl}>
            <TeaserContent {...props} />
        </Link>
    )
}

const External = props => {
    return (
        <a href={props.targetUrl} className={styles.xl} target={'_blank'} rel={'noreferrer'}>
            <TeaserContent {...props} />
        </a>
    )
}

const Teaser = props => {
    let targetUrl = 'https://www.salzburgerland.com/' + props.slug
    // links to internal
    let containerComponent = <Internal {...props} />
    // links to external
    if ( !props.internal ) {
        containerComponent = <External {...props} targetUrl={targetUrl} />
    }
    return containerComponent
}

export default Teaser
