import React from "react"

import AreabrickList from '~components/Areabricks/AreabrickList'
import ClusterAreabrick from '~components/Areabricks/Cluster'
import GalleryAreabrick from '~components/Areabricks/Gallery'
import HeadlineAreabrick from '~components/Areabricks/Headline'
import IframeAreabrick from '~components/Areabricks/Iframe'
import ImageAreabrick from '~components/Areabricks/Image'
import IntrotextAreabrick from '~components/Areabricks/Introtext'
import QuoteAreabrick from '~components/Areabricks/Quote'
import SeparatorAreabrick from '~components/Areabricks/Separator'
import TeaserLAreabrick from '~components/Areabricks/TeaserL'
import TeaserMAreabrick from '~components/Areabricks/TeaserM'
import TeaserMVariantAreabrick from '~components/Areabricks/TeaserMVariant'
import TeaserSAreabrick from '~components/Areabricks/TeaserS'
import TeaserXLAreabrick from '~components/Areabricks/TeaserXL'
import TextAreabrick from '~components/Areabricks/Text'
import UnknownAreabrick from '~components/Areabricks/Unknown'

// Defines the mapping between the 'type' property of an areabrick and the component to render
let brickComponents = {
    areablock: AreabrickList,
    headline: HeadlineAreabrick,
    gallery: GalleryAreabrick,
    image: ImageAreabrick,
    quote: QuoteAreabrick,
    text: TextAreabrick,
    introtext: IntrotextAreabrick,
    iframe: IframeAreabrick,
    unknown: UnknownAreabrick,
    cluster: ClusterAreabrick,
    separator: SeparatorAreabrick,
}

brickComponents['teaser-s'] = TeaserSAreabrick
brickComponents['teaser-m'] = TeaserMAreabrick
brickComponents['teaser-m-variant'] = TeaserMVariantAreabrick
brickComponents['teaser-l'] = TeaserLAreabrick
brickComponents['teaser-x-l'] = TeaserXLAreabrick

/**
 * Areabrick component which maps the 'type' property of the areablock to a component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Areabrick = props => {
    const { children, type } = props;

    // Provide the children as an object with the names of the children as keys
    // This allows the children to be accessed by their name (e.g. props.elements.headline)
    const childrenByName = {};
    if (!!children) {
        children.forEach(child => {
            childrenByName[child.name] = child;
        })
    }

    // Get the areabrick component or the fallback
    const Component = brickComponents[type]
        ? brickComponents[type]
        : brickComponents.unknown;

    // Pass all the settings of the areabrick as props to the component
    // Additionally pass the children as an object with the names of the children as keys
    return <Component {...props} elements={childrenByName} />
}

export default Areabrick