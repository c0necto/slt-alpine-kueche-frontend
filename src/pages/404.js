import React from 'react';
import { graphql } from 'gatsby';
import Layout from '~layout/Layout';
import { Helmet } from 'react-helmet';
import Intro from '~components/Intro/Intro';
import ContentArea from '~components/ContentArea/ContentArea';
import Container from '~components/Container/Container';
import Headline from '~components/Headline/Headline';
import * as pagesStyles from './Pages.module.scss';

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

const Index = ({ pageContext, data }) => {
    // meta stuff
    const desc =
        'Ein Manifest für die Kulinarik-Destination SalzburgerLand! Die Alpine Küche ist der Weg um dasSalzburgerLand zur kulinarischen Spitzendestination in Europa zu machen.';

    const language = 'de';

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
    // Header
    return (
        <Layout
            logoLink={'/' + language}
            language={language}
            footer={footerElementsByName}>
            <Helmet>
                <meta charset="utf-8" />
                <title>Fehler 404 - Alpine Küche</title>
                <meta name="description" content={desc} />
            </Helmet>
            <main className={pagesStyles.pageMain} role="main" id="main">
                <ContentArea className={'bottom30'}>
                    <Container>
                        <Headline
                            level={'h1'}
                            title={'Fehler 404'}
                            description={
                                'Das angeforderte Dokument wurde nicht gefunden.'
                            }
                            className={'uppercase'}
                        />
                    </Container>
                </ContentArea>

                <ContentArea className={'bottom80'}>
                    <Container variant={'narrow'}>
                        <Intro>
                            Manchmal geschehen Sachen die uns zwar zuerst
                            schrecklich ärgern und unfair vorkommen, aber wenn
                            du darüber nachdenkst, erkennst du, dass du ohne die
                            Meisterung dieser Hindernisse niemals dein
                            Potential, deine Willenskraft und Liebe verwirklicht
                            hättest.
                        </Intro>
                    </Container>
                </ContentArea>
            </main>
        </Layout>
    );
};

export default Index;

export const query = graphql`
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
    query {
        footer: pimcore {
            getDocument(fullpath: "/de/Footer") {
                __typename
                ... on Pimcore_document_snippet {
                    id
                    ...footerElements
                }
            }
        }
    }
`;
