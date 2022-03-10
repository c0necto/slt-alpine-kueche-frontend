import React from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
//import { stripTags } from "~utils"
import * as styles from "./TeaserMVariant.module.scss"
import { artDirection } from "~utils"

const Teaser = props => {

  const images = artDirection(
    props.image.childImageSharp.desktop,
    props.image.childImageSharp.mobile
  )

  return (
    <Link to={props.slug} className={styles.teaserM}>
      <figure>
        <GatsbyImage
          image={images}
          alt={props.text}
          className={styles.image} />
      </figure>
      <div className={styles.content}>
        <h4>{props.children}</h4>
        {/*{!!props.text && (
          <div className={styles.text}>
            {props.text}
          </div>
        )}*/}
      </div>
    </Link>
  )
}

export default Teaser