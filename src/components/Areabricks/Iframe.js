import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from '~components/Container/Container'
import * as pagesStyles from "../../pages/Pages.module.scss"

const IframeAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    return (
        <ContentArea className={'bottom80'} color={grey ? 'grey' : null}>
            <Container>
                <div className={pagesStyles.iframeYoutube}>
                    <iframe
                        className={pagesStyles.iframe}
                        title={elements?.iframe_url?.text}
                        src={elements?.iframe_url?.text}
                        height={elements?.iframe_url?.number}
                        width="100%"
                        frameBorder="0"></iframe>
                </div>
            </Container>
        </ContentArea>
    )
}

export default IframeAreabrick