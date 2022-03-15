import {createContext} from "react"

const PimcoreContext = createContext({
    // The current document
    document: null,
    // The root document
    rootDocument: null,
})

export default PimcoreContext