import React from "react";
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'

const HeadlineAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'bottom30'} color={grey ? 'grey' : null}>
            <Container variant={'narrow'}>
                <div dangerouslySetInnerHTML={{__html: elements?.html?.text}} />
            </Container>
        </ContentArea>
    );
}

export default HeadlineAreabrick