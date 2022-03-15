import parse from "html-react-parser"
import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'

const TextAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>
            <Container variant={'narrow'}>
                {parse(elements?.text?.text)}
            </Container>
        </ContentArea>
    )
}

export default TextAreabrick