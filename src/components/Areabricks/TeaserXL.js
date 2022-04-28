import React from "react"
import ContentArea from '~components/ContentArea/ContentArea'
import TeaserXL from '~components/Teaser/TeaserXL'

const TeaserXLAreabrick = props => {
    const {elements} = props
    const grey = elements.grey?.checked
    if ( !elements.teaser.relations )  {
         return false
    }
    const teaser = elements.teaser.relations[0];
    return (
        <ContentArea className={''} color={grey ? 'grey' : null}>
            <TeaserXL
                title={teaser.title}
                subtitle={'Lorem ipsum dolor sit amet...'}
                buttontext={'Weiterlesen'}
                fakebutton={true}
                text={teaser.text}
                image={teaser.image}
                blank={true}
                slug={teaser.slug[0]?.slug}>
                {teaser.title}
            </TeaserXL>
        </ContentArea>
    )
}

export default TeaserXLAreabrick