import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from  '~components/Container/Container'
import Grid from '~components/Grid/Grid'
import TeaserM from '~components/Teaser/TeaserM'

const TeaserMAreabrick = props => {
    const {elements} = props
    //const grey = elements.grey?.checked
    return (
        <ContentArea className={'top80'} color={'grey'}>
            <Container>
                <Grid cols={2}>
                    {elements.teasers.relations.map((teaser, index) => {
                        return (
                            <TeaserM
                                key={teaser.title + '_' + index}
                                title={teaser.title}
                                text={teaser.text}
                                image={teaser.image}
                                blank={true}
                                slug={teaser.slug[0]?.slug}>
                                {teaser.title}
                            </TeaserM>
                        )
                    })}
                </Grid>
            </Container>
        </ContentArea>
    )
}

export default TeaserMAreabrick