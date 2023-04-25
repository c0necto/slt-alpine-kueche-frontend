import React, { memo } from "react";
import ContentArea from '~components/ContentArea/ContentArea'
import Container from  '~components/Container/Container'
import Ticketsbutton from '~components/Ticketsbutton/Ticketsbutton'

const TicketsbuttonAreabrick = memo(({ elements: { title, subtitle, link } }) => (
    <ContentArea className="bottom80">
        <Container variant={'narrow'}>
            <Ticketsbutton
                title={title?.text}
                subtitle={subtitle?.text}
                to={link?.linkData?.path}
                target={link?.linkData?.windowTarget}
            />
        </Container>
    </ContentArea>
));

export default TicketsbuttonAreabrick