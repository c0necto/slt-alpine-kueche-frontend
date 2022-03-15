import React from "react"
import Areabrick from "./Areabrick"

/**
 * Area blocks consist of children, so we need to map them to a list of <Areabricks /> which in turn
 * will map the children to the correct component to be rendered
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const AreabrickList = props => {
    const { data } = props;

    // Render a list of <Areabricks /> and pass all data as props
    return (
        <>
            {data ? data.map(element => <Areabrick {...element} />) : null}
        </>
    )
}

export default AreabrickList