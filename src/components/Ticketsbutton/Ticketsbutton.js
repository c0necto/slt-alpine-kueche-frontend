import React from "react"
import TicketIcon from "./tickets.svg"
import * as styles from "./Ticketsbutton.module.scss"

const ExternalLink = ({to, title, subtitle, target, children}) => (
    <a href={to}
       target={target}
       className={styles.ticketsbutton}
       rel="noopener noreferrer">
        {children}
    </a>
);

const Ticketsbutton = props => {
    console.log(props)
    return (
        <ExternalLink to={'#'}>
            <i>
                <img src={TicketIcon} alt={'#'}/>
            </i>
            <div className={styles.ticketsbuttonText}>
                <strong>Jetzt Tickets kaufen!</strong>
                <div>Der Early Bird Vorverkaufspreis gilt bis 30.06.2023</div>
            </div>
        </ExternalLink>
    )
}

export default Ticketsbutton
