import React from 'react'
import { graphql } from 'gatsby'
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

const index = ({ pageContext, data }) => {

    const document = data.pimcore.getDocument
    const pages = data.pages.getDocumentFolder

    const { rootDocument, snippets } = pageContext;

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
    const footerElements = data.footer?.getDocument?.elements
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
                    {...data}
                />
            </Layout>
        </PimcoreContext.Provider>
    );
}

// TODO Move to gatsby-node.js and cache it
export const query = graphql`
    fragment elements on Pimcore_document_page {
        elements {
            __typename
            ... on Pimcore_document_editableAreablock {
                _editableType
                _editableName
                data {
                    key
                    type
                    hidden
                }
            }
            ... on Pimcore_document_editableBlock {
                _editableName
                _editableType
                indices
            }
            ... on Pimcore_document_editableCheckbox {
                _editableName
                _editableType
                checked
            }
            ... on Pimcore_document_editableDate {
                _editableName
                _editableType
                timestamp
                formatted(format: "d.m.Y")
            }
            ... on Pimcore_document_editableEmbed {
                _editableName
                _editableType
                url
            }
            ... on Pimcore_document_editableInput {
                _editableName
                _editableType
                text
            }
            ... on Pimcore_document_editableImage {
                _editableName
                _editableType
                image {
                    id
                    filename
                    assetThumb: fullpath(thumbnail: "cover")
                    assetThumbWide: fullpath(thumbnail: "cover_wide")
                    metadata {
                        name
                        data
                    }

                    teaserSMobile: imageNode(field: "assetThumb") {
                        childImageSharp {
                            gatsbyImageData(
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                aspectRatio: 1.78
                            )
                        }
                    }
                    teaserSDesktop: imageNode(field: "assetThumb") {
                        childImageSharp {
                            gatsbyImageData(
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                width: 270
                                height: 150
                            )
                        }
                    }
                    mobile: imageNode(field: "assetThumb") {
                        childImageSharp {
                            gatsbyImageData(
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                aspectRatio: 1.78
                            )
                        }
                    }
                    mobileWide: imageNode(field: "assetThumbWide") {
                        childImageSharp {
                            gatsbyImageData(
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                aspectRatio: 1.78
                            )
                        }
                    }
                    desktop: imageNode(field: "assetThumb") {
                        childImageSharp {
                            gatsbyImageData(
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                aspectRatio: 1.77
                            )
                        }
                    }
                    desktopWide: imageNode(field: "assetThumbWide") {
                        childImageSharp {
                            gatsbyImageData(
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                aspectRatio: 2.95
                            )
                        }
                    }
                    lightbox: imageNode {
                        childImageSharp {
                            gatsbyImageData(
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                width: 1920
                                height: 1080
                            )
                        }
                    }
                }
                alt
            }
            ... on Pimcore_document_editableLink {
                _editableName
                _editableType
                linkData: data {
                    internal
                    internalType
                    internalId
                    path
                    text
                    windowTarget
                    parameters
                    anchor
                    title
                    accesskey
                    relation
                    tabindex
                    class
                    attributes
                }
            }
            ... on Pimcore_document_editableMultiselect {
                _editableName
                _editableType
                selections
            }
            ... on Pimcore_document_editableNumeric {
                _editableName
                _editableType
                number
            }
            ... on Pimcore_document_editablePdf {
                _editableName
                _editableType
                pdf {
                    id
                    filename
                    fullpath
                }
            }
            ... on Pimcore_document_editableRelation {
                _editableName
                _editableType
                id
                type
                subtype
                relation {
                    ... on Pimcore_document_page {
                        elements {
                            __typename
                        }
                    }
                }
            }
            ... on Pimcore_document_editableRelations {
                _editableName
                _editableType
                relations {
                    __typename
                    ... on Pimcore_asset {
                        assetThumb: fullpath(thumbnail: "cover")
                        metadata {
                            name
                            data
                        }
                        mobile: imageNode(field: "assetThumb") {
                            childImageSharp {
                                gatsbyImageData(
                                    placeholder: BLURRED
                                    formats: [AUTO, WEBP]
                                    layout: CONSTRAINED
                                    aspectRatio: 1.78
                                )
                            }
                        }
                        mobileWide: imageNode(field: "assetThumbWide") {
                            childImageSharp {
                                gatsbyImageData(
                                    placeholder: BLURRED
                                    formats: [AUTO, WEBP]
                                    layout: CONSTRAINED
                                    aspectRatio: 1.78
                                )
                            }
                        }
                        desktop: imageNode(field: "assetThumb") {
                            childImageSharp {
                                gatsbyImageData(
                                    placeholder: BLURRED
                                    formats: [AUTO, WEBP]
                                    layout: CONSTRAINED
                                    aspectRatio: 1.77
                                )
                            }
                        }
                        desktopWide: imageNode(field: "assetThumbWide") {
                            childImageSharp {
                                gatsbyImageData(
                                    placeholder: BLURRED
                                    formats: [AUTO, WEBP]
                                    layout: CONSTRAINED
                                    aspectRatio: 2.95
                                )
                            }
                        }
                        lightbox: imageNode {
                            childImageSharp {
                                gatsbyImageData(
                                    placeholder: BLURRED
                                    formats: [AUTO, WEBP]
                                    layout: CONSTRAINED
                                    width: 1920
                                    height: 1080
                                )
                            }
                        }
                    }
                    ... on Pimcore_document_page {
                        id
                        title
                        fullpath
                    }
                    ... on Pimcore_object_Teaser {
                        title
                        subtitle
                        image {
                            assetThumb: fullpath(thumbnail: "cover")
                            teaserSMobile: imageNode(field: "assetThumb") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: CONSTRAINED
                                        aspectRatio: 1.78
                                    )
                                }
                            }
                            teaserSDesktop: imageNode(field: "assetThumb") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: CONSTRAINED
                                        width: 270
                                        height: 150
                                    )
                                }
                            }
                            teaserMDesktop: imageNode(field: "assetThumb") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: CONSTRAINED
                                        width: 270
                                        height: 270
                                    )
                                }
                            }
                            teaserM: imageNode(field: "assetThumb") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: CONSTRAINED
                                        width: 570
                                        height: 270
                                    )
                                }
                            }
                            teaserXLMobile: imageNode(field: "assetThumb") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: FULL_WIDTH
                                        aspectRatio: 0.82
                                    )
                                }
                            }
                            teaserXLDesktop: imageNode(field: "assetThumb") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: FULL_WIDTH
                                        aspectRatio: 2.5
                                    )
                                }
                            }
                            clusterDesktop: imageNode(field: "assetThumb") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: CONSTRAINED
                                        aspectRatio: 1.37
                                    )
                                }
                            }
                            
                        }
                        text
                        slug {
                            slug
                        }
                    }
                }
            }
            ... on Pimcore_document_editableSelect {
                _editableName
                _editableType
                text
            }
            ... on Pimcore_document_editableTextarea {
                _editableName
                _editableType
                text
            }
            ... on Pimcore_document_editableWysiwyg {
                _editableName
                _editableType
                text
            }
            ... on Pimcore_document_editableVideo {
                _editableName
                _editableType
                id
                type
                title
                description
                posterAsset {
                    id
                    filename
                    fullpath
                }
                videoAsset {
                    id
                    filename
                    fullpath
                }
            }
        }
    }
    fragment footerElements on Pimcore_document_snippet {
        elements {
            ... on Pimcore_document_editableInput {
                _editableName
                _editableType
                text
            }

            ... on Pimcore_document_editableTextarea {
                _editableName
                _editableType
                text
            }

            ... on Pimcore_document_editableBlock {
                _editableName
                _editableType
                indices
            }

            ... on Pimcore_document_editableLink {
                _editableName
                _editableType
                linkData: data {
                    internal
                    internalType
                    internalId
                    path
                    text
                    windowTarget
                    parameters
                    anchor
                    title
                    accesskey
                    relation
                    tabindex
                    class
                    attributes
                }
            }
        }
    }

    query DocumentById($id: Int!, $footer: String!, $folder: String!) {
        pimcore {
            getDocument(id: $id) {
                __typename
                ... on Pimcore_document_page {
                    id
                    modificationDate
                    title
                    description
                    controller

                    page_title: title
                    page_description: description
                    page_language: properties(keys: "language") {
                        ... on Pimcore_property_text {
                            text
                        }
                    }
                    page_navigation_name: properties(keys: "navigation_name") {
                        ... on Pimcore_property_text {
                            text
                        }
                    }
                    parent {
                        ... on Pimcore_document_page {
                            fullpath
                        }
                    }

                    ...elements
                }
            }
        }

        pages: pimcore {
            getDocumentFolder(fullpath: $folder) {
                children {
                    ... on Pimcore_document_page {
                        id
                        fullpath
                        title
                        ...elements
                    }
                }
            }
        }

        footer: pimcore {
            getDocument(fullpath: $footer) {
                __typename
                ... on Pimcore_document_snippet {
                    id
                    fullpath
                    title
                    ...footerElements
                }
            }
        }
    }
`

export default index