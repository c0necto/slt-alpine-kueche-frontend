import {Link} from "gatsby"
import React from "react"
import Container from "~components/Container/Container"
import {GatsbyImage, StaticImage} from "gatsby-plugin-image"
import Cta from "~components/Cta/Cta"
import * as styles from "./TeaserXL.module.scss"
import {artDirection} from "~utils"

const Teaser = props => {
    let images = false
    if (props.image?.teaserXLMobile && props.image?.teaserXLDesktop) {
        images = artDirection(
            props.image.teaserXLDesktop.childImageSharp,
            props.image.teaserXLMobile.childImageSharp,
        );
    }
    let targetUrl = 'https://www.salzburgerland.com/' + props.slug
    return (
        <a href={targetUrl} className={styles.xl} target={'_blank'} rel={'noreferrer'}>
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
        </a>
    )
}

export default Teaser
