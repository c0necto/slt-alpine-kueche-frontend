import React, { memo } from "react"
import * as styles from "./Ticketsbutton.module.scss"
import TicketIcon from "./tickets.svg"

const ExternalLink = memo(({ to, title, target, children }) => (
    <a
        href={to}
        target={target}
        title={title}
        aria-label={title}
        className={styles.ticketsbutton}
        rel="noopener noreferrer"
    >
        {children}
    </a>
))

const Ticketsbutton = memo(({ title, subtitle, to, target }) => {
    const buttonText = (
        <div className={styles.ticketsbuttonText}>
            <strong>{title}</strong>
            <div>{subtitle}</div>
        </div>
    )

    return (
        <ExternalLink to={to} title={title} target={target}>
            <i><img src={TicketIcon} alt={title} /></i>
            {buttonText}
        </ExternalLink>
    )
})

export default Ticketsbutton
