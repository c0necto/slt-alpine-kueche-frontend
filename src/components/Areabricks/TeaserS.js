import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from  '~components/Container/Container'
import Slider from '~components/Slider/Slider'
import Grid from '~components/Grid/Grid'
import TeaserS from '~components/Teaser/TeaserS'

const TeaserSAreabrick = props => {
    const {elements} = props
    //const grey = elements.grey?.checked
    if ( !elements.teasers.relations )  {
        return false
    }
    return (
        <ContentArea className={'paddingTop80MarginBottom100'} color={'grey'}>
            {elements.teasers.relations.length > 4 ? (
                <Container variant={'mobileFullwidth'}>
                    <Slider noarrows>
                        {elements.teasers.relations.map((teaser, index) =>  {
                            return (
                                <TeaserS
                                    key={teaser.title + '_' + index}
                                    title={teaser.title}
                                    text={teaser.text}
                                    image={teaser.image}
                                    blank={true}
                                    slider={true}
                                    internal={teaser.internal?.path}
                                    slug={teaser.slug[0]?.slug}>
                                    {teaser.title}
                                </TeaserS>
                            )
                        })}
                    </Slider>
                </Container>
            ) : (
                <Container>
                    <Grid cols={4}>
                        {elements.teasers.relations.map((teaser, index) => {
                            return (
                                <TeaserS
                                    key={teaser.title + '_' + index}
                                    title={teaser.title}
                                    text={teaser.text}
                                    image={teaser.image}
                                    blank={true}
                                    internal={teaser.internal?.path}
                                    slug={teaser.slug[0]?.slug}>
                                    {teaser.title}
                                </TeaserS>
                            )
                        })}
                    </Grid>
                </Container>
            )}
        </ContentArea>
    )
}

export default TeaserSAreabrick