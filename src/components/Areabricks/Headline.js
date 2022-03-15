import parse from "html-react-parser";
import React from "react";
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import Headline from '~components/Headline/Headline'

const HeadlineAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'bottom30'} color={grey ? 'grey' : null}>
            <Container variant={'narrow'}>
                <Headline
                    title={parse(elements?.h3?.text)}
                    level={'h3'}></Headline>
            </Container>
        </ContentArea>
    );
}

export default HeadlineAreabrick