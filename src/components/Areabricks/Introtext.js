import parse from "html-react-parser"
import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import Intro from '~components/Intro/Intro'

const IntrotextAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>
            <Container variant={'narrow'}>
                <Intro>{parse(elements?.text?.text)}</Intro>
            </Container>
        </ContentArea>
    )
}

export default IntrotextAreabrick