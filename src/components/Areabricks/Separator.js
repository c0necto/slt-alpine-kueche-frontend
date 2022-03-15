import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import Separator from '~components/Separator/Separator'

const SeparatorAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'noSpacing'} color={grey ? 'grey' : null}>
            <Container>
                <Separator />
            </Container>
        </ContentArea>
    )
}

export default SeparatorAreabrick