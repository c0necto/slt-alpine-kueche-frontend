import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import Quotation from '~components/Quotation/Quotation'

const QuoteAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>
            <Container>
                <Quotation
                    statement={elements.blockquote_statement?.text}
                    author={elements.blockquote_author?.text}
                />
            </Container>
        </ContentArea>
    );
}

export default QuoteAreabrick