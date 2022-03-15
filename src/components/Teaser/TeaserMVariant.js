import React from "react"
import {GatsbyImage, StaticImage} from "gatsby-plugin-image"
//import { stripTags } from "~utils"
import * as styles from "./TeaserMVariant.module.scss"
import { artDirection } from "~utils"

const Teaser = props => {
    let images = false
    if (props.image?.teaserM) {
        images = artDirection(
            props.image.teaserM.childImageSharp,
            props.image.teaserM.childImageSharp,
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
    </a>
  )
}

export default Teaser