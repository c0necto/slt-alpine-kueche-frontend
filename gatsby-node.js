const path = require(`path`);
//const chunk = require(`lodash/chunk`)

const {createRemoteFileNode} = require('gatsby-source-filesystem');
const {graphql} = require("gatsby");

// This is a simple debugging tool
// dd() will prettily dump to the terminal and kill the process
// const { dd } = require(`dumper.js`)

/** ---------------------- P A G E    C R E A T I O N ---------------------- **/

/**
 * exports.createPages is a built-in Gatsby Node API.
 * It's purpose is to allow you to create pages for your site! 💡
 *
 * See https://www.gatsbyjs.com/docs/node-apis/#createPages for more info.
 */
exports.createPages = async gatsbyUtilities => {
    const {createRedirect} = gatsbyUtilities.actions;

    // Redirect from / to /de
    createRedirect({
        fromPath: '/',
        exactPath: true,
        isPermanent: false,
        redirectInBrowser: true,
        toPath: '/de',
    });

    // Redirect from /anmeldung to /de/anmeldung
    createRedirect({
        fromPath: '/anmeldung',
        exactPath: true,
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/de/anmeldung',
    })

    // Query our documents from the GraphQL server
    const rootDocument = await fetchDocument(gatsbyUtilities, 1);

    const snippets = findSnippets(rootDocument);

    // Create the pages
    await createIndividualDocumentPages(
        snippets,
        rootDocument,
        rootDocument,
        gatsbyUtilities,
    );

    // Create a simple list of all the pages
    // createListPage(rootDocument, gatsbyUtilities);
};

const findSnippets = rootDocument => {
    const ret = [];

    if (rootDocument.__typename === 'Pimcore_document_snippet') {
        ret.push(rootDocument);
    }

    if (rootDocument.children) {
        rootDocument.children.forEach(child => {
            ret.push(...findSnippets(child));
        });
    }

    return ret;
};

/**
 * This function creates all the individual pages in this site
 */
const createIndividualDocumentPages = async (
    snippets,
    rootDocument,
    document,
    gatsbyUtilities,
) => {
    // createPage is an action passed to createPages
    // See https://www.gatsbyjs.com/docs/actions#createPage for more info

    // TODO This will be configurable.
    // For multi-language sites, we'll keep it on and otherwise, we'll turn it off.
    const skipRootPage = true;

    // Create the page if the node is a pimcore page.
    if (
        document.__typename === 'Pimcore_document_page' &&
        !(skipRootPage && document.fullpath === '/')
    ) {
        const locale = document.language ? document.language[0].text : 'de';
        if (process.env.SHOW_UNPUBLISHED_PAGES == 1 || document.published) {

            /*console.log('----');
            console.log('fullpath', document.fullpath);
            console.log('folder', '/' + locale);
            console.log('footer', '/' + locale + '/Footer');
            console.log('id', parseInt(document.id));
            console.log('----');*/

            const pageData = await getPageData(document, locale, gatsbyUtilities);

            gatsbyUtilities.actions.createPage({
                path: document.fullpath,
                component: path.resolve(`./src/templates/index.js`),
                context: {
                    locale,
                    rootDocument,
                    id: parseInt(document.id),
                    isPreview: process.env.SHOW_UNPUBLISHED_PAGES == 1,
                    fullpath: document.fullpath,
                    modificationDate: document.modificationDate,
                    snippets,
                    footer: '/' + locale + '/Footer',
                    folder: '/' + locale,
                    pageData
                },
            });
        }
    }

    // Now do the same for all children
    if (process.env.NODE_ENV === 'development' || process.env.SHOW_UNPUBLISHED_PAGES == 1 || document.published) {
        return Promise.all(
            document.children.map(
                async page =>
                    await createIndividualDocumentPages(
                        snippets,
                        rootDocument,
                        page,
                        gatsbyUtilities,
                    ),
            ),
        );
    }
};

async function getPageData(page, locale, gatsbyUtilities) {
    const {cache, graphql} = gatsbyUtilities;

    const cacheKey = `pimcore_page_${page.id}_${locale}_${process.env.SHOW_UNPUBLISHED_PAGES}`;
    const cachedData = await cache.get(cacheKey);

    gatsbyUtilities.reporter.info("Cached data for " + page.id + ":" + JSON.stringify(Object.keys(cachedData ?? [])))
    const pageData = cachedData ? cachedData?.pimcore?.getDocument : null;

    if (process.env.SHOW_UNPUBLISHED_PAGES != 1 && page.modificationDate <= pageData?.modificationDate) {
        gatsbyUtilities.reporter.info("Page is up to date: " + page.id + " (" + page.modificationDate + " <= " + pageData?.modificationDate + ")");

        return cachedData
    } else {
        if (process.env.SHOW_UNPUBLISHED_PAGES == 1) {
            gatsbyUtilities.reporter.info("Skipping cache for page " + page.id);
        }
        const result = await graphql(`
            fragment elements on Pimcore_document_page {
                elements(unpublished: $unpublished) {
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
                                        width: 1920
                                        height: 1280
                                    )
                                }
                            }
                            desktopWide: imageNode(field: "assetThumbWide") {
                                childImageSharp {
                                    gatsbyImageData(
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        layout: CONSTRAINED
                                        width: 1920
                                        height: 661
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
                                            layout: FULL_WIDTH
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
                                internal {
                                    path
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
            
            fragment publishedElements on Pimcore_document_page {
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
                                            layout: FULL_WIDTH
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
                                internal {
                                    path
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
                elements(unpublished: $unpublished) {
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
        
            query DocumentById($id: Int!, $footer: String!, $folder: String!, $unpublished: Boolean) {
                pimcore {
                    getDocument(id: $id, unpublished: $unpublished) {
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
                                ...publishedElements
                            }
                        }
                    }
                }
        
                footer: pimcore {
                    getDocument(fullpath: $footer, unpublished: $unpublished) {
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
        `, {
            id: parseInt(page.id, 10),
            unpublished: process.env.SHOW_UNPUBLISHED_PAGES == 1,
            folder: '/' + locale,
            footer: '/' + locale + '/Footer',
        })

        if (!result.errors && result.data) {
            await cache.set(cacheKey, result.data);
            gatsbyUtilities.reporter.info("Updated cache for page " + page.id + " at " + page.modificationDate);
        } else {
            gatsbyUtilities.reporter.error("Error updating cache for page " + page.id + " at " + page.modificationDate + ": " + JSON.stringify(result.errors))
        }
        return result.data
    }
}

/**
 * This function creates a simple list of all the pages
 */

/*const createListPage = (document, gatsbyUtilities) => {
    // createPage is an action passed to createPages
    // See https://www.gatsbyjs.com/docs/actions#createPage for more info

    // Create the page if the node is a pimcore page.
    if (document.__typename === 'Pimcore_document_page') {
        gatsbyUtilities.actions.createPage({
            path: '/',
            component: path.resolve(`./src/templates/dokumente.js`),
            context: {
                document,
            },
        });
    }
};*/

/**
 * This function queries Gatsby's GraphQL server and asks for
 * All Pimcore Article pages. If there is any GraphQL error it throws an error
 * Otherwise it will return the pages 🙌
 *
 * We're passing in the utilities we got from createPages.
 * So see https://www.gatsbyjs.com/docs/node-apis/#createPages for more info!
 */
async function fetchDocument(gatsbyUtilities, id) {
    const {cache, graphql, reporter} = gatsbyUtilities;

    const graphqlResult = await graphql(
        /* GraphQL */ `
            fragment EmailProperties on Pimcore_document_email {
                id
                fullpath
                published
                modificationDate
                language: properties(keys: "language") {
                    ... on Pimcore_property_text {
                        text
                    }
                }
            }

            fragment FolderProperties on Pimcore_document_folder {
                id
                fullpath
            }

            fragment HardlinkProperties on Pimcore_document_hardlink {
                id
                fullpath
                published
                modificationDate
                language: properties(keys: "language") {
                    ... on Pimcore_property_text {
                        text
                    }
                }
            }

            fragment LinkProperties on Pimcore_document_link {
                id
                fullpath
                published
                modificationDate
                language: properties(keys: "language") {
                    ... on Pimcore_property_text {
                        text
                    }
                }
            }

            fragment PageProperties on Pimcore_document_page {
                id
                fullpath
                published
                modificationDate
                language: properties(keys: "language") {
                    ... on Pimcore_property_text {
                        text
                    }
                }
            }

            fragment SnippetProperties on Pimcore_document_snippet {
                id
                fullpath
                published
                modificationDate
                language: properties(keys: "language") {
                    ... on Pimcore_property_text {
                        text
                    }
                }
            }

            query DocumentsQuery($id: Int!, $unpublished: Boolean) {
                pimcore {
                    getDocument(id: $id, unpublished: $unpublished) {
                        __typename
                        ...EmailProperties
                        ...HardlinkProperties
                        ...LinkProperties
                        ...PageProperties
                        ...SnippetProperties
                        ... on Pimcore_document_email {
                            children {
                                __typename
                                ...EmailProperties
                                ...FolderProperties
                                ...HardlinkProperties
                                ...LinkProperties
                                ...PageProperties
                                ...SnippetProperties
                            }
                        }
                        ... on Pimcore_document_hardlink {
                            children {
                                __typename
                                ...EmailProperties
                                ...FolderProperties
                                ...HardlinkProperties
                                ...LinkProperties
                                ...PageProperties
                                ...SnippetProperties
                            }
                        }
                        ... on Pimcore_document_link {
                            children {
                                __typename
                                ...EmailProperties
                                ...FolderProperties
                                ...HardlinkProperties
                                ...LinkProperties
                                ...PageProperties
                                ...SnippetProperties
                            }
                        }
                        ... on Pimcore_document_snippet {
                            children {
                                __typename
                                ...EmailProperties
                                ...FolderProperties
                                ...HardlinkProperties
                                ...LinkProperties
                                ...PageProperties
                                ...SnippetProperties
                            }
                        }
                        ... on Pimcore_document_page {
                            children {
                                __typename
                                ...EmailProperties
                                ...FolderProperties
                                ...HardlinkProperties
                                ...LinkProperties
                                ...PageProperties
                                ...SnippetProperties
                            }
                        }
                    }
                }
            }
        `,
        {id, unpublished: process.env.SHOW_UNPUBLISHED_PAGES == 1},
    );

    if (graphqlResult.errors) {
        reporter.panicOnBuild(
            `There was an error loading your documents`,
            graphqlResult.errors,
        );
        return;
    }

    const document = graphqlResult.data.pimcore.getDocument;

    if (!document) console.log('Error! Document not found! ID: ' + id);

    // Fetch children
    // TODO Replace with check if children list exists
    if (document.__typename === 'Pimcore_document_page') {
        document.children = await Promise.all(
            document.children.map(
                async child =>
                    await fetchDocument(
                        gatsbyUtilities,
                        parseInt(child.id, 10),
                    ),
            ),
        );
    }

    return document;
}

/**
 * This function queries Gatsby's GraphQL server and asks for
 * All Pimcore Article pages. If there is any GraphQL error it throws an error
 * Otherwise it will return the pages 🙌
 *
 * We're passing in the utilities we got from createPages.
 * So see https://www.gatsbyjs.com/docs/node-apis/#createPages for more info!
 */



function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}

exports.createResolvers = ({
                               actions,
                               cache,
                               createNodeId,
                               createResolvers,
                               store,
                               reporter,
                           }) => {
    const {createNode} = actions;

    const resolvers = {
        Pimcore_asset: {
            imageNode: {
                type: 'File',
                args: {
                    field: {
                        type: 'String',
                        default: 'assetThumb',
                    },
                },
                resolve: (source, args, context, info) => {
                    const {field} = args;
                    const image = source[field ?? 'assetThumb'];

                    // Bail out if there is no image
                    if (!image || typeof image !== 'string') {
                        return null;
                    }

                    //sleep(100)

                    // Create a remote file node for the image and return it
                    return createRemoteFileNode({
                        url: 'https://alpine-kueche.conecto.rocks' + image,
                        store,
                        cache,
                        createNode,
                        createNodeId,
                        reporter,
                    });
                },
            },
        },
    };
    createResolvers(resolvers);
};

/**
 * Create Aliases and silences errors
 * @param stage
 * @param actions
 * @param getConfig
 */
exports.onCreateWebpackConfig = ({stage, actions, getConfig}) => {
    /**
     * Create aliases for absolute paths when importing components
     */
    actions.setWebpackConfig({
        resolve: {
            alias: {
                '~components': path.resolve(__dirname, 'src/components'),
                '~layout': path.resolve(__dirname, 'src/layout'),
                '~pages': path.resolve(__dirname, 'src/pages'),
                '~utils': path.resolve(__dirname, 'src/utils'),
                '~static': path.resolve(__dirname, 'static'),
                '~scss': path.resolve(__dirname, 'src/scss'),
                '~templates': path.resolve(__dirname, 'src/templates'),
                '~images': path.resolve(__dirname, 'src/images'),
                '~src': path.resolve(__dirname, 'src'),
            },
            fallback: {
                "process": false
            }
        },
    });
    /**
     * Silence CSS module order warnings
     */
    if (stage === 'build-javascript' || stage === 'develop') {
        const config = getConfig();
        const miniCssExtractPlugin = config.plugins.find(
            plugin => plugin.constructor.name === 'MiniCssExtractPlugin',
        );
        if (miniCssExtractPlugin) {
            miniCssExtractPlugin.options.ignoreOrder = true;
        }
        actions.replaceWebpackConfig(config);
    }
};
