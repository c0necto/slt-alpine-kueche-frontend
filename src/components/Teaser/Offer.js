import { Link } from "gatsby"
import React from "react"
import * as styles from "./Offer.module.scss"
import Fakebutton from "~components/Button/Fakebutton"
import { GatsbyImage } from "gatsby-plugin-image"
import { artDirection } from "~utils"

const Teaser = props => {

  const images = artDirection(
    props.image.childImageSharp.desktop,
    props.image.childImageSharp.mobile
  )

  return (
    <Link to={`${props.slug}`} className={styles.teaserOffer}>
      <figure>
        <GatsbyImage
          image={images}
          alt={props.text}
          className={styles.image} />
      </figure>
      <div className={styles.content}>
        <h3>{props.children}</h3>
        <div className={styles.text}>
          ab <strong>{props.price}</strong> p.P.
        </div>
        <Fakebutton color={'blue'} to={'/'}>Zum Angebot</Fakebutton>
      </div>
    </Link>
  )
}

export default Teaser