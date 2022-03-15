import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from  '~components/Container/Container'

const UnknownAreabrick = props => {
    const { type } = props
    return (
        <ContentArea className={'bottom80'}>
            <Container variant={'narrow'}>
                Unknown Areabrick of type "{type}". Available elements:
                <pre>{JSON.stringify(Object.keys(props.elements))}</pre>
            </Container>
        </ContentArea>
    )
}

export default UnknownAreabrick