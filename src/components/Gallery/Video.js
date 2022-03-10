import React from "react"
import ImageS from "~components/Image/GalleryS"
import ImageM from "~components/Image/GalleryM"
import ImageL from "~components/Image/GalleryL"
import Icon from "~components/Icon/Icon"
import Cta from "~components/Cta/Cta"
import * as styles from "./Video.module.scss"

const imageVariant = (size, src, alt) => {
  switch (size) {
    case 1:
      return <ImageL src={src} alt={alt} />
    case 2:
      return <ImageM src={src} alt={alt} />
    default:
      return <ImageS src={src} alt={alt} />
  }
}

const Teaser = ({ size, src, alt, subtitle, videoUrl }) => {
  let isSmall = size === 3 ? true : false
  return (
    <a
      srl_video_loop="false"
      href={videoUrl}
      className={styles.teaserVideo}>
      {imageVariant(size, src, alt)}
      <button className={styles.play}>
        <Icon name={"play"} />
      </button>
      <div className={styles.content}>
        <div className={styles.ctaPosition}>
          {!isSmall
            ? <Cta title={alt} subtitle={subtitle} />
            : null
          }
        </div>
      </div>
    </a>
  )
}

export default Teaser
