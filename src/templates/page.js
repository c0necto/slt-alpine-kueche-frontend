import { graphql } from 'gatsby';
import Layout from '~layout/Layout';
import { Helmet } from 'react-helmet';
import React, { createContext, useContext, useMemo, useState } from 'react';
import Gallery from '~components/Gallery/Gallery';
import HeaderMedia from '~components/HeaderMedia/HeaderMedia';

import Quotation from '~components/Quotation/Quotation';
import ContentArea from '~components/ContentArea/ContentArea';
import Container from '~components/Container/Container';
import Headline from '~components/Headline/Headline';
import Intro from '~components/Intro/Intro';
import Button from '~components/Button/Button';
import TeaserL from '~components/Teaser/TeaserL';
import Pagination from '~components/Pagination/Pagination';

import Slider from '~components/Slider/Slider';
import TeaserS from '~components/Teaser/TeaserS';

import * as pagesStyles from '../pages/Pages.module.scss';
import parse from 'html-react-parser';
import { GatsbyImage, StaticImage } from 'gatsby-plugin-image';

import { artDirection } from '~utils';
import { imageAtts } from '~utils';

// TODO Move to individual file
const PimcoreContext = createContext({
    // The current document
    document: null,
    // The root document
    rootDocument: null,
});

// TODO Move to gatsby-node.js
/**
 * Get direct descendants of elements in parent namespace.
 * The namespaces include the separator.
 * To get children of the "content" element, pass "content:" as the parent namespace.
 * The default separator is ":" and returns direct children of the element.
 * @param elements
 * @param parentNamespace
 * @returns {*}
 */
const getDirectChildren = (elements, parentNamespace = '') => {
    return elements.filter(element => {
        const name = element._editableName;

        return (
            name.indexOf(parentNamespace) === 0 &&
            name.indexOf(':', parentNamespace.length) === -1 &&
            name !== parentNamespace
        );
    });
};

// TODO Move to gatsby-node.js
/**
 * Organize document elements into a tree structure where areablocks have a list of children.
 * A detailed explanation of how this works can be found in the Readme file.
 * @param elements
 * @param namespace
 * @returns {*}
 */
const getHierarchy = (elements, namespace = '') => {
    const parents = getDirectChildren(elements, namespace);

    return parents.map(element => {
        const name = element._editableName.substring(namespace.length);

        if (element._editableType === 'areablock') {
            // Map element.data to the corresponding element in the hierarchy
            return {
                ...element,
                name,
                data: element.data.map(child => {
                    const childNamespace =
                        element._editableName + ':' + child.key + '.';
                    return {
                        ...child,
                        children: getHierarchy(elements, childNamespace),
                    };
                }),
            };
        }

        if (element._editableType === 'block') {
            // Map element.data to the corresponding element in the hierarchy
            return {
                ...element,
                name,
                data: element.indices.map((child, index) => {
                    const childNamespace =
                        element._editableName + ':' + parseInt(index + 1) + '.';
                    return {
                        ...child,
                        children: getHierarchy(elements, childNamespace),
                    };
                }),
            };
        }

        return {
            ...element,
            name,
        };
    });
};

// =========================
// Area Bricks
// =========================

const ColsAreabrick = props => {
    const { children } = props;

    // Get children with column_content in their name
    const columns = children.filter(
        child => child.name.indexOf('column_content') === 0,
    );

    return (
        <>
            <ContentArea className={'bottom80'}>
                <Container>
                    {columns.map(column => (
                        <AreabrickList key={column.name} {...column} />
                    ))}
                </Container>
            </ContentArea>
        </>
    );
};

const GalleryAreabrick = props => {
    const { elements } = props;

    return (
        <ContentArea className={'bottom80'}>
            <Container>
                <Gallery nodes={elements.images.relations} />
            </Container>
        </ContentArea>
    );
};

const ImageAreabrick = props => {
    const { elements } = props;
    const { document } = useContext(PimcoreContext);

    let images = false;
    let imageMeta = false;
    if (elements.image?.image?.desktop && elements.image?.image?.mobile) {
        images = artDirection(
            elements.image.image.desktop.childImageSharp,
            elements.image.image.mobile.childImageSharp,
        );
        imageMeta = imageAtts(document.title, elements.image.image.metadata);
    }
    return (
        <ContentArea className={'bottom80'}>
            <Container variant={'mobileFullwidth'}>
                {!!images ? (
                    <GatsbyImage
                        image={images}
                        alt={imageMeta.alt}
                        title={imageMeta?.compound ?? null}
                    />
                ) : (
                    <StaticImage
                        src={'../images/1170x660.png'}
                        alt="Bitte Bild hinterlegen"
                    />
                )}
                {imageMeta.title && <figcaption>{imageMeta.title}</figcaption>}
            </Container>
        </ContentArea>
    );
};

const QuoteAreabrick = props => {
    const { elements } = props;

    return (
        <ContentArea className={'bottom80'}>
            <Container>
                <Quotation
                    statement={elements.blockquote_statement?.text}
                    author={elements.blockquote_author?.text}
                />
            </Container>
        </ContentArea>
    );
};

const TextAreabrick = props => {
    const { elements } = props;

    return (
        <ContentArea className={'bottom80'}>
            <Container variant={'narrow'}>
                {parse(elements?.text?.text)}
            </Container>
        </ContentArea>
    );
};

const IntrotextAreabrick = props => {
    const { elements } = props;

    return (
        <ContentArea className={'bottom80'}>
            <Container variant={'narrow'}>
                <Intro>{parse(elements?.text?.text)}</Intro>
            </Container>
        </ContentArea>
    );
};

const HeadlineAreabrick = props => {
    const { elements } = props;
    return (
        <ContentArea className={'bottom30'}>
            <Container variant={'narrow'}>
                <Headline
                    title={parse(elements?.h3?.text)}
                    level={'h3'}></Headline>
            </Container>
        </ContentArea>
    );
};

const IframeAreabrick = props => {
    const { elements } = props;
    return (
        <ContentArea className={'bottom80'}>
            <Container>
                <div className={pagesStyles.iframeYoutube}>
                    <iframe
                        className={pagesStyles.iframe}
                        title={elements?.iframe_url?.text}
                        src={elements?.iframe_url?.text}
                        height={elements?.iframe_url?.number}
                        width="100%"
                        frameBorder="0"></iframe>
                </div>
            </Container>
        </ContentArea>
    );
};

const UnknownAreabrick = props => {
    const { type } = props;

    return (
        <ContentArea className={'bottom80'}>
            <Container variant={'narrow'}>
                Unknown Areabrick of type "{type}". Available elements:
                <pre>{JSON.stringify(Object.keys(props.elements))}</pre>
            </Container>
        </ContentArea>
    );
};

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
        });
    }

    // Get the areabrick component or the fallback
    const Component = brickComponents[type]
        ? brickComponents[type]
        : brickComponents.unknown;

    // Pass all the settings of the areabrick as props to the component
    // Additionally pass the children as an object with the names of the children as keys
    return <Component {...props} elements={childrenByName} />;
};

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
            {/*{data.map(element => (
                <Areabrick {...element} />
            ))}*/}
        </>
    );
};

// Defines the mapping between the 'type' property of an areabrick and the component to render
const brickComponents = {
    areablock: AreabrickList,
    headline: HeadlineAreabrick,
    cols: ColsAreabrick,
    gallery: GalleryAreabrick,
    image: ImageAreabrick,
    quote: QuoteAreabrick,
    text: TextAreabrick,
    introtext: IntrotextAreabrick,
    iframe: IframeAreabrick,
    unknown: UnknownAreabrick,
};

// =========================
// Templates
// =========================
const DefaultTemplate = props => {
    const { author, content, date, h1, image, subtitle, hideDateAuthor } =
        props;
    const { document, pages } = useContext(PimcoreContext);

    // remove empty entries from pages
    const pagesWithoutEmpty = pages.children.filter(
        value => Object.keys(value).length !== 0,
    );

    // filter document.id from pagesWithoutEmpty
    const pagesFiltered = pagesWithoutEmpty.filter(
        page => page.id !== document.id,
    );

    // date & author beneath h1
    const dateFormatted = date?.formatted ? date.formatted + ' ' : '';
    const authorFormatted = author?.text ? 'by ' + author.text : '';
    const h1Desc = hideDateAuthor?.checked
        ? null
        : dateFormatted + authorFormatted;

    return (
        <>
            {!!image && !!image.image && (
                <HeaderMedia
                    portal={false}
                    image={image.image}
                    alt={document.title}
                    meta={image.image.metadata}
                />
            )}

            <main className={pagesStyles.pageMain} role="main" id="main">
                <ContentArea className={'bottom55'}>
                    <Headline
                        level={'h1'}
                        title={h1?.text ?? ''}
                        description={h1Desc}
                    />
                </ContentArea>
                <ContentArea className={'bottom55Center'}>
                    <Button
                        to={document?.parent?.fullpath}
                        color={'greyInvertedArrow'}>
                        Übersicht
                    </Button>
                </ContentArea>

                <AreabrickList {...content} />

                {/* Related Articles Slider */}
                <ContentArea className={'top80Grey'}>
                    <Container>
                        <Headline level={'h2'} title={'Verwandte Artikel'} />
                    </Container>
                </ContentArea>
                <ContentArea className={'grey'}>
                    <Container variant={'mobileFullwidth'}>
                        <Slider noarrows>
                            {pagesFiltered.map((page, i) => {
                                const elements = getHierarchy(page.elements);
                                const elementsByName = {};
                                elements.forEach(element => {
                                    elementsByName[element.name] = element;
                                });
                                return (
                                    <TeaserS
                                        slug={page.fullpath}
                                        key={'article-slider-item-' + page.id}
                                        image={elementsByName.image?.image}
                                        title={elementsByName.h1?.text}
                                        text={elementsByName.subtitle?.text}>
                                        {elementsByName.h1?.text}
                                    </TeaserS>
                                );
                            })}
                        </Slider>
                    </Container>
                </ContentArea>
            </main>
        </>
    );
};

const OverviewTemplate = props => {
    const { content, h1, sub } = props;
    const { document, pages, locale } = useContext(PimcoreContext);

    // TODO Use library for translations
    const buttonText =
        locale === 'de' || locale === undefined ? 'weiterlesen' : 'Read more';

    // Get the editables as an object with the names of the editables as keys
    // They are then passed to the template component as individual props.
    // For example, if the editable is named 'headline', it will be accessible as props.headline in the TemplateComponent
    const elementsByName = {};
    document.elements?.forEach(element => {
        elementsByName[element._editableName] = element;
    });

    /* List */

    // Get all pages and remove empty entries
    const subpages = pages.children.filter(
        value => Object.keys(value).length !== 0,
    );

    /* Hero */
    const heroId = elementsByName.hero?.id;
    const heroElementsByName = {};
    const hero = subpages.find(obj => {
        return parseInt(obj.id) === heroId;
    });
    if (hero?.elements) {
        const heroElements = getHierarchy(hero.elements);
        heroElements.forEach(element => {
            heroElementsByName[element.name] = element;
        });
    }

    /* Pagination stuff */
    const ITEMSPERPAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const paginatedPages = useMemo(() => {
        // Slicing
        const firstPageIndex = (currentPage - 1) * ITEMSPERPAGE;
        const lastPageIndex = firstPageIndex + ITEMSPERPAGE;
        return subpages.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, subpages, ITEMSPERPAGE]);

    return (
        <>
            {heroElementsByName.image?.image && heroElementsByName.h1 ? (
                <HeaderMedia
                    portal={true}
                    image={heroElementsByName.image?.image}
                    alt={heroElementsByName.h1?.text}
                    title={heroElementsByName.h1?.text}
                    buttoncolor="green"
                    buttontext={buttonText}
                    buttonlink={hero?.fullpath}
                    meta={heroElementsByName.image?.image?.metadata}
                />
            ) : null}
            <main className={pagesStyles.pageMain} role="main" id="main">
                {!!h1?.text && (
                    <ContentArea className={'bottom30'}>
                        <Container>
                            <Headline
                                level={'h1'}
                                title={h1.text}
                                description={sub?.text}
                            />
                        </Container>
                    </ContentArea>
                )}

                <AreabrickList {...content} />

                <Pagination
                    currentPage={currentPage}
                    totalCount={subpages.length}
                    pageSize={ITEMSPERPAGE}
                    onPageChange={page => setCurrentPage(page)}
                />

                <ContentArea className={'bottom30'}>
                    <Container>
                        {paginatedPages.map((page, i) => {
                            const elements = getHierarchy(page.elements);
                            const elementsByName = {};
                            elements.forEach(element => {
                                elementsByName[element.name] = element;
                            });
                            return (
                                <TeaserL
                                    key={
                                        'homepage-article-' + page.id + '-' + i
                                    }
                                    title={elementsByName.h1?.text}
                                    to={page.fullpath}
                                    image={elementsByName.image?.image}
                                    text={elementsByName.subtitle?.text}
                                    buttontext={buttonText}
                                    fakebutton={true}
                                />
                            );
                        })}
                    </Container>
                </ContentArea>

                <Pagination
                    currentPage={currentPage}
                    totalCount={subpages.length}
                    pageSize={ITEMSPERPAGE}
                    className={'noMarginTop'}
                    onPageChange={page => setCurrentPage(page)}
                />
            </main>
        </>
    );
};

// Mapping from controller action name to template component
// For example, if the controller action name is 'defaultAction', the template component will be DefaultTemplate
const templateComponents = {
    default: DefaultTemplate,
    overview: OverviewTemplate,
};

// TODO This should be in a separate file
const getPageById = (id, rootDocument) => {
    // Check the
    if (parseInt(rootDocument.id, 10) === parseInt(id, 10)) {
        return rootDocument;
    }

    // Look through any children
    if (rootDocument.children?.length) {
        for (let i = 0; i < rootDocument.children.length; i++) {
            const child = rootDocument.children[i];
            const page = getPageById(id, child);
            if (page) {
                return page;
            }
        }
    }

    return false;
};

const Article = ({ pageContext, data }) => {
    const document = data.pimcore.getDocument;
    const pages = data.pages.getDocumentFolder;

    const { rootDocument, snippets } = pageContext;

    const contextValue = { document, pages, rootDocument, snippets };

    // Example usage of getPageById
    //console.log(pageContext, getPageById(12, rootDocument));

    // Get the "templateAction" part from App\Controller::templateAction
    const action = document.controller.substring(
        document.controller.indexOf('::') + 2,
    );
    // Remove the "Action" from it to be left with the name of the template
    const template = action.replace('Action', '');
    // Get the template component
    const TemplateComponent = templateComponents[template];

    // Map the list of editables to a hierarchy where the top level are editables defined in the layout
    // Should there be areablocks defined in the layout, they will have a list of children
    const elements = getHierarchy(document.elements);

    /*console.log('Document elements:', document.elements);
    console.log('Elements:', elements);*/

    // Get the editables as an object with the names of the editables as keys
    // They are then passed to the template component as individual props.
    // For example, if the editable is named 'headline', it will be accessible as props.headline in the TemplateComponent
    const elementsByName = {};
    elements.forEach(element => {
        elementsByName[element.name] = element;
    });

    //console.log("Document:", document)
    //console.log("Template: " + template)
    //console.log("Element list:", elements)
    //console.log("Elements by Name:", elementsByName)

    // Language
    const language = document?.page_language[0]?.text;

    // Footer
    const footerElements = data.footer?.getDocument?.elements;
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
        });
    }
    // if footerElementsByname is empty object set it to null
    if (Object.keys(footerElementsByName).length === 0) {
        footerElementsByName = null;
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
};

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
                        assetThumbWide: fullpath(thumbnail: "cover_wide")

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
`;

export default Article;
