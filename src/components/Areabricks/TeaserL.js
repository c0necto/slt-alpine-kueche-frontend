import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import Container from  '~components/Container/Container'
import TeaserL from '~components/Teaser/TeaserL'

const TeaserLAreabrick = props => {
    const {elements} = props
    const grey = elements.grey?.checked
    console.log(elements)
    if ( !elements.teaser.relations )  {
        return false
    }
    const teaser = elements.teaser.relations[0]
    return (
        <ContentArea className={'top80'} color={grey ? 'grey' : null}>
            <Container>
                <TeaserL
                    title={teaser.title}
                    subtitle={'Lorem ipsum dolor sit amet...'}
                    buttontext={'Weiterlesen'}
                    fakebutton={true}
                    text={teaser.text}
                    image={teaser.image}
                    blank={true}
                    slug={teaser.slug[0]?.slug}>
                    {teaser.title}
                </TeaserL>
            </Container>
        </ContentArea>
    )
}

export default TeaserLAreabrick