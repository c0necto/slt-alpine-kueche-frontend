import { getImage, withArtDirection } from 'gatsby-plugin-image';

/**
 * Parses a menu item object and returns Gatsby-field URI.
 *
 * @param {object} menuItem a single menu item
 * @param wordPressUrl
 * @param blogURI
 */
export const CreateLocalLink = (menuItem, wordPressUrl, blogURI = 'blog/') => {
    const { url, connectedObject } = menuItem;

    if (url === '#') {
        return null;
    }
    /**
     * Always want to pull of our API URL.
     */
    let newUri = url.replace(wordPressUrl, '');

    /**
     * If it's a blog link, respect the users blogURI setting.
     */
    if (connectedObject && connectedObject.__typename === 'WPGraphQL_Post') {
        newUri = blogURI + newUri;
    }

    return newUri;
};

/**
 * Returns string free of tags
 * @param string
 * @returns {*|string}
 */
export const stripTags = string => {
    return !!string
        ? string.replace(/(<([^>]+)>)/gi, '').replace('&nbsp;', '')
        : '';
};

/**
 * Checks if URL string is valid
 * @param string
 * @returns {boolean}
 */
export const validURL = string => {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
};

/**
 * Checks if str contains '/Open
 * @param string
 * @returns {*}
 */
export const isOpen = string => {
    return string.includes('/Open');
};

/**
 * Takes an array of Objects and returns the sum of object.property
 * @param list
 * @param property
 * @returns {*}
 */
export const getSum = (list, property) => {
    return list.reduce(
        (acc, cur) => acc + parseFloat(cur[property] || 0, 10),
        0,
    );
};

export const artDirection = (desktopImage, mobileImage) => {
    // Grab the gatsby image nodes
    const desktop = getImage(desktopImage);
    const mobile = getImage(mobileImage);
    // Apply art direction style
    return withArtDirection(desktop, [
        {
            media: `(max-width: 767px)`,
            image: mobile,
        },
    ]);
};

/**
 * Returns a string of either title, caption, both or Null
 * @param {String} articleName
 * @param {object} metadata
 * @returns {String}
 */
export const imageAtts = (articleName, metadata) => {
    if (!metadata) {
        console.warn(
            'No metadata found for image in article: "',
            articleName + '"',
        );
        return {
            alt: '',
            title: null,
            copyright: null,
            compound: null,
        };
    }
    let alt = articleName;
    let title = null;
    let copyright = null;

    let compoundTitle = null;
    let copyrightString = '© ';
    let copyrightStringLong = ' | © ';

    metadata.forEach(meta => {
        if (meta.name === 'alt') {
            alt = meta.data;
        }
        if (meta.name === 'title') {
            title = meta.data;
        }
        if (meta.name === 'copyright') {
            copyright = meta.data;
        }
    });
    if (title) {
        compoundTitle = title;
    }
    if (copyright) {
        if (!title) {
            compoundTitle = copyrightString + copyright;
        } else {
            compoundTitle = title + copyrightStringLong + copyright;
        }
    }
    return {
        alt: alt,
        title: title,
        copyright: copyrightString + copyright,
        compound: compoundTitle,
    };
};


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
}

/**
 * Organize document elements into a tree structure where areablocks have a list of children.
 * A detailed explanation of how this works can be found in the Readme file.
 * @param elements
 * @param namespace
 * @returns {*}
 */
export const getHierarchy = (elements, namespace = '') => {
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
}

export const getPageById = (id, rootDocument) => {
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
}

