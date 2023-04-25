import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from  '~components/Container/Container'
import Ticketsbutton from '~components/Ticketsbutton/Ticketsbutton'


const TicketsbuttonAreabrick = props => {
    const { data } = props
    console.log('data: ', data)
    return (
        <ContentArea className={'bottom80'}>
            <Container variant={'narrow'}>
                <Ticketsbutton></Ticketsbutton>
            </Container>
        </ContentArea>
    )
}

export default TicketsbuttonAreabrick