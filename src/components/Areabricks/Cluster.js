import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Cluster from '~components/Teaser/Cluster'

const ClusterAreabrick = props => {
    const { elements } = props
    const grey = elements.grey?.checked
    if ( !elements.teasers.relations )  {
        return false
    }
    return (
        <ContentArea className={'top80'} color={grey ? 'grey' : null}>
            <Cluster elements={elements} />
        </ContentArea>
    )
}

export default ClusterAreabrick