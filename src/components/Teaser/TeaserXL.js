import { Link } from "gatsby"
import React from "react"
import Container from "~components/Container/Container"
import { GatsbyImage } from "gatsby-plugin-image"
import Cta from "~components/Cta/Cta"
import * as styles from "./TeaserXL.module.scss"
import { artDirection } from "~utils"

const Teaser = props => {

  const images = artDirection(
    props.image.childImageSharp.desktop,
    props.image.childImageSharp.mobile
  )

  return (
    <Link to={props.to} className={styles.xl}>
      <figure>
        <GatsbyImage
          image={images}
          alt={props.title}
          className={styles.image} />
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
                  buttoncolor={"inverted"}
                  fakebutton={props.fakebutton}
                  additionalClass={'small'}
                />
              </Container>
            </div>
          </div>
        </Container>
      </div>
    </Link>
  )
}

export default Teaser
