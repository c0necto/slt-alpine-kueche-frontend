import { Link } from "gatsby"
import { graphql, useStaticQuery } from "gatsby"
import React, { useMemo } from "react"
import ImageS from "~components/Image/GalleryS"
import ImageM from "~components/Image/GalleryM"
import ImageL from "~components/Image/GalleryL"

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

const Thumbnail = ({ size, src, alt }) => {

  // Image to load
  const data = useStaticQuery(graphql`
        query {
            images: allFile(filter: { internal: { mediaType: {} } }) {
                edges {
                    node {
                        relativePath
                        publicURL
                        childImageSharp {
                            gatsbyImageData(
                                width: 1920
                                height: 1280
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                            )
                        }
                    }
                }
            }
        }
    `)

  const match = useMemo(
    () => data.images.edges.find(({ node }) => src === node.relativePath),
    [data, src]
  )
  return (
    <Link to={match.node.childImageSharp.gatsbyImageData.images.fallback.src}>
      {imageVariant(size, src, alt)}
    </Link>
  )


}

export default Thumbnail
