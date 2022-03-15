import React, {useContext} from "react";
import {GatsbyImage, StaticImage} from "gatsby-plugin-image";
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import PimcoreContext from '~src/context/PimcoreContext'
import { artDirection, imageAtts } from '~utils'

const ImageAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    const { document } = useContext(PimcoreContext)
    let images = false
    let imageMeta = false
    if (elements.image?.image?.desktop && elements.image?.image?.mobile) {
        images = artDirection(
            elements.image.image.desktop.childImageSharp,
            elements.image.image.mobile.childImageSharp,
        );
        imageMeta = imageAtts(document.title, elements.image.image.metadata)
    }
    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>
            <Container variant={'mobileFullwidth'}>
                {!!images ? (
                    <GatsbyImage
                        image={images}
                        alt={imageMeta.alt}
                        title={imageMeta?.compound ?? null}
                    />
                ) : (
                    <StaticImage
                        src={'../../images/1170x660.png'}
                        alt="Bitte Bild hinterlegen"
                    />
                )}
                {imageMeta.title && <figcaption>{imageMeta.title}</figcaption>}
            </Container>
        </ContentArea>
    )
}

export default ImageAreabrick