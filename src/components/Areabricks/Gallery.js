import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import Gallery from '~components/Gallery/Gallery'

const GalleryAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>
            <Container>
                <Gallery nodes={elements.images.relations} />
            </Container>
        </ContentArea>
    )
}

export default GalleryAreabrick