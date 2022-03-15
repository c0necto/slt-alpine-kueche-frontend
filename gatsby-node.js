const path = require(`path`);
//const chunk = require(`lodash/chunk`)

const { createRemoteFileNode } = require('gatsby-source-filesystem');

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
    const { createRedirect } = gatsbyUtilities.actions;

    createRedirect({
        fromPath: '/',
        exactPath: true,
        isPermanent: false,
        redirectInBrowser: true,
        toPath: '/de',
    });

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
        /*console.log('----');
        console.log('fullpath', document.fullpath);
        console.log('folder', '/' + locale);
        console.log('footer', '/' + locale + '/Footer');
        console.log('id', parseInt(document.id));
        console.log('----');*/
        gatsbyUtilities.actions.createPage({
            path: document.fullpath,
            component: path.resolve(`./src/templates/index.js`),
            context: {
                locale,
                rootDocument,
                id: parseInt(document.id),
                fullpath: document.fullpath,
                snippets,
                footer: '/' + locale + '/Footer',
                folder: '/' + locale,
            },
        });
    }

    // Now do the same for all children
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
};

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
    const { cache, graphql, reporter } = gatsbyUtilities;

    const graphqlResult = await graphql(
        /* GraphQL */ `
            fragment EmailProperties on Pimcore_document_email {
                id
                fullpath
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
                modificationDate
                language: properties(keys: "language") {
                    ... on Pimcore_property_text {
                        text
                    }
                }
            }

            query DocumentsQuery($id: Int!) {
                pimcore {
                    getDocument(id: $id) {
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
        { id },
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

exports.createResolvers = ({
    actions,
    cache,
    createNodeId,
    createResolvers,
    store,
    reporter,
}) => {
    const { createNode } = actions;

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
                    const { field } = args;
                    const image = source[field ?? 'assetThumb'];

                    // Bail out if there is no image
                    if (!image || typeof image !== 'string') {
                        return null;
                    }

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
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
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
