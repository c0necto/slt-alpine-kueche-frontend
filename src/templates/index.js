import React from 'react'
import Layout from '~layout/Layout'
import { Helmet } from 'react-helmet'
import PimcoreContext from "~src/context/PimcoreContext"
import ArticleTemplate from "./default"
import OverviewTemplate from "./overview"
import { getHierarchy } from '~utils'

// Mapping from controller action name to template component
// For example, if the controller action name is 'defaultAction', the template component will be DefaultTemplate
const templateComponents = {
    overview: OverviewTemplate,
    default: ArticleTemplate,
}

const index = (props) => {
    const { pageContext } = props
    const { pageData, rootDocument, snippets, modificationDate } = pageContext
    console.log(Object.keys(pageData))

    const document = pageData.pimcore?.getDocument
    const pages = pageData.pages?.getDocumentFolder
    if(!document) {
        console.error("Could not find document " + pageContext.id)
        return null
    }

    console.log("Mod date: " + document.id + ': ' + modificationDate)


    const contextValue = { document, pages, rootDocument, snippets }

    // Example usage of getPageById
    //console.log(pageContext, getPageById(12, rootDocument));

    // Get the "templateAction" part from App\Controller::templateAction
    const action = document.controller.substring(
        document.controller.indexOf('::') + 2,
    )

    // Remove the "Action" from it to be left with the name of the template
    const template = action.replace('Action', '')

    // Get the template component
    const TemplateComponent = templateComponents[template]

    // Map the list of editables to a hierarchy where the top level are editables defined in the layout
    // Should there be areablocks defined in the layout, they will have a list of children
    const elements = getHierarchy(document.elements)

    /*console.log('Document elements:', document.elements);
    console.log('Elements:', elements);*/

    // Get the editables as an object with the names of the editables as keys
    // They are then passed to the template component as individual props.
    // For example, if the editable is named 'headline', it will be accessible as props.headline in the TemplateComponent
    const elementsByName = {};
    elements.forEach(element => {
        elementsByName[element.name] = element;
    })

    // Language
    const language = document?.page_language[0]?.text

    // Footer
    const footerElements = pageData.footer?.getDocument?.elements
    const filteredFooter = footerElements
        ? footerElements.filter(value => Object.keys(value).length !== 0)
        : null;
    const hierarchyFooter = filteredFooter
        ? getHierarchy(filteredFooter)
        : null;
    let footerElementsByName = {};
    if (hierarchyFooter) {
        hierarchyFooter.forEach(element => {
            footerElementsByName[element.name] = element;
        })
    }
    // if footerElementsByname is empty object set it to null
    if (Object.keys(footerElementsByName).length === 0) {
        footerElementsByName = null
    }

    return (
        <PimcoreContext.Provider value={contextValue}>
            <Layout
                logoLink={'/' + language}
                language={language}
                footer={footerElementsByName}>
                <Helmet>
                    <meta charset="utf-8" />
                    <title>{document.title} - Alpine Küche</title>
                    <meta name="description" content={document.description} />
                </Helmet>

                <TemplateComponent
                    {...elementsByName}
                    {...pageContext}
                    {...pageContext.pageData}
                />
            </Layout>
        </PimcoreContext.Provider>
    );
}

export default index