import React from "react"
import Container from "~components/Container/Container"
import { GatsbyImage } from "gatsby-plugin-image"
import Icon from "~components/Icon/Icon"
import * as styles from "./Quotation.module.scss"
import { artDirection } from "~utils"

const TextQuotation = ({ statement, author }) => {
  return (
    <blockquote className={styles.blockquote}>
      <div className={styles.icon}>
        <Icon name={"quote"}></Icon>
      </div>
      <div className={styles.statement}>{statement}</div>
      <div className={styles.author}>{author}</div>
    </blockquote>
  )
}

const ImageQuotation = ({ statement, author }) => {
  return (
    <div className={styles.content}>
      <Container>
        <TextQuotation statement={statement} author={author} />
      </Container>
    </div>
  )
}

const Teaser = ({ statement, author, imageUrl }) => {

  let images
  if ( imageUrl ) {
    images = artDirection(
      imageUrl.childImageSharp.desktop,
      imageUrl.childImageSharp.mobile
    )
  }

  return (
    <div className={imageUrl ? styles.imageQuotation : null}>
      {!!imageUrl && (
        <figure>
          <GatsbyImage
            image={images}
            alt={statement}
            className={styles.image} />
        </figure>
      )}
      {imageUrl
        ? <ImageQuotation statement={statement} author={author} />
        : <TextQuotation statement={statement} author={author} />
      }
    </div>
  )
}

export default Teaser