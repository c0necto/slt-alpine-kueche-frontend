import { useEffect, useState } from 'react';

import * as styles from './Header.module.scss';

/**
 * Hook to return scrolling information for whole document
 * @param threshold
 * @returns {{isUp: boolean, isBelow: boolean}}
 * @constructor
 */
export const Scrollinfo = threshold => {
    const [isUp, setIsUp] = useState(null);
    const [isBelow, setIsBelow] = useState(null);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
        let ticking = false;

        const updateScrollInfo = () => {
            const scrollY = window.pageYOffset;
            setIsUp(scrollY > lastScrollY ? false : true);
            setIsBelow(scrollY > threshold ? true : false);
            lastScrollY = scrollY > 0 ? scrollY : 0;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollInfo);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, [isUp, isBelow, threshold]);

    return {
        isUp,
        isBelow,
    };
};

/**
 * Handles behaviour of header stripe (by adding or removing classes depending on
 * scrollPosition and/or whether sth. in the header is active (menu or infoboxes)
 * @param isOpen - Is Main Menu Open?
 * @param isUp - Is Scroll Direction Up?
 * @param isBelow - Is Scroll Value Below Threshold?
 * @returns {*[]} - List of Classes
 */
export const handleStripeClasses = (isOpen, { isUp, isBelow }) => {
    let stripeClasses = [];
    if (!isOpen) {
        if (isBelow) {
            stripeClasses.push(styles.retractable);
            if (isUp) {
                stripeClasses.push(styles.extended);
            } else {
                stripeClasses = stripeClasses.filter(
                    item => item !== styles.extended,
                );
            }
        } else {
            stripeClasses = stripeClasses.filter(
                item => item !== styles.retractable,
            );
        }
    } else {
        stripeClasses.push(styles.headerStripNavOpen);
    }
    return stripeClasses;
};
