/**
 * Custom queries - used to prevent rendering of components in different sizes
 * @type {{tablet: string, desktop: string, mobile: string}}
 */
const sltQueries = {
    mobile: '(max-width: 767px)',
    tablet: '(max-width: 1229px)',
    desktop: '(min-width: 1230px)',
};

module.exports = {
    siteMetadata: {
        title: `Alpine Küche`,
        siteUrl: `https://www.alpine-kueche.com`,
        description: ``,
    },
    plugins: [
        `gatsby-plugin-image`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        /*`gatsby-plugin-sharp`,*/
        {
            resolve: `gatsby-plugin-sharp`,
            options: {
                defaults: {
                    quality: 90
                }
            }
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Alpine Küche`,
                short_name: `alpine-kueche`,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#69be28`,
                display: `minimal-ui`,
                icon: `static/apple-touch-icon_alpine_kueche.png`,
            },
        },
        {
            resolve: `gatsby-plugin-netlify`,
            options: {
                headers: (
                    process.env.SHOW_UNPUBLISHED_PAGES == 1 ?
                    {
                        // Preview build
                        '/*': [
                        'X-Frame-Options: SAMEORIGIN',
                        'Content-Security-Policy: frame-ancestors \'self\' https://alpine-kueche.salzburgerland.com',
                        ],
                    } : {
                        // Default build
                    }
                )
            }
        },
        `gatsby-plugin-react-helmet`,

        {
            resolve: `gatsby-plugin-react-helmet-canonical-urls`,
            options: {
                siteUrl: `https://www.alpine-kueche.com`,
            },
        },
        {
            resolve: 'gatsby-plugin-sass',
            options: {
                cssLoaderOptions: {
                    modules: {
                        exportLocalsConvention: 'camelCaseOnly',
                    },
                },
                implementation: require('node-sass'),
            },
        },
        {
            resolve: `gatsby-plugin-minify-classnames`,
            options: {
                dictionary:
                    'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789',
                //enable: process.env.NODE_ENV === 'production',
                enable: false,
                prefix: '',
                suffix: '',
            },
        },
        'gatsby-plugin-optimize-svgs',
        {
            resolve: 'gatsby-source-graphql',
            options: {
                typeName: 'Pimcore',
                fieldName: 'pimcore',
                url: 'https://alpine-kueche.salzburgerland.com/pimcore-graphql-webservices/unique',
                headers: {
                    'x-api-key': '73a4b2666ddc7b99bea73863d50a84d1',
                },
                batch: false,
                dataLoaderOptions: {
                    maxBatchSize: 1,
                },
            },
        },
        {
            resolve: `gatsby-plugin-i18n`,
            options: {
                langKeyDefault: 'de',
                langKeyForNull: 'de',
                prefixDefault: false,
                useLangKeyLayout: false,
            },
        },
        /*{
            resolve: 'gatsby-plugin-google-marketing-platform',
            options: {
                tagmanager: {
                    id: 'GTM-T6HVCHW'
                }
            },
        },*/

        // todo: update to gatsby4 before using this plugin
        /*{
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
                id: "GTM-T6HVCHW",

                // Include GTM in development.
                //
                // Defaults to false meaning GTM will only be loaded in production.
                includeInDevelopment: false,
            },
        },*/
       /* {
            // https://github.com/nitrofi/gatsby-plugin-cookiebot
            resolve: 'gatsby-plugin-cookiebot',
            options: {
                cookiebotId: '67e059ad-1f0f-40be-a06c-ce0e05698407',
                manualMode: false, // Optional. Turns on Cookiebot's manual mode. Defaults to false.
                blockGtm: false, //  Optional. Skip blocking of GTM. Defaults to true if manualMode is set to true.
                includeInDevelopment: false, // Optional. Enables plugin in development. Will cause gatsby-plugin-google-tagmanager to thrown an error when pushing to dataLayer. Defaults to false.
            },
        }*/
    ],
};
