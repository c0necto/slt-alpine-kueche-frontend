import React, { useState, useCallback } from 'react';

import Slick from 'react-slick';
import 'slick-carousel/slick/slick.css';
import * as styles from './Slider.module.scss';
import styled from 'styled-components';
import cn from 'classnames';

const SliderWrap = styled.div`
    .slick-track {
        display: flex;
    }
    .slick-slide {
        height: inherit;
    }
    .slick-slide > div {
        height: 100%;
    }
`;

const Slider = props => {
    /**
     * additionalClasses - handles behaviour when not enough children
     */

    let additionalClasses = [],
        slidesToShowMobile = props.visibleMobile ? props.visibleMobile : 1.35,
        largeSettings = {
            dots: !props.nodots,
            arrows: !props.noarrows,
        };

    if (props.children.length === 3) {
        additionalClasses.push(styles.nojs);
        additionalClasses.push(styles.onlyThree);
        largeSettings = 'unslick';
    }
    if (props.children.length === 2) {
        additionalClasses.push(styles.nojs);
        additionalClasses.push(styles.onlyTwo);
        largeSettings = 'unslick';
    }
    if (props.children.length === 1) {
        additionalClasses.push(styles.nojs);
        additionalClasses.push(styles.onlyOne);
        slidesToShowMobile = 1;
        largeSettings = 'unslick';
    }



    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: props.slidesToShow ? props.slidesToShow : 4,
        slidesToScroll: 4,
        draggable: true,
        arrows: false,
        fade: false,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: slidesToShowMobile,
                    slidesToScroll: 1,
                    infinite: false,
                    arrows: false,
                    dots: false,
                },
            },
            {
                breakpoint: 10000,
                settings: largeSettings,
            },
        ],
    };

    /* Child Click Behaviour when dragging */
    const [ClientXonMouseDown, setClientXonMouseDown] = useState();
    const [ClientYonMouseDown, setClientYonMouseDown] = useState();
    const handleOnMouseDown = (e) => {
        e.preventDefault();
        setClientXonMouseDown(e.clientX);
        setClientYonMouseDown(e.clientY);
    };

    const handleOnClick = (e) => {
        e.stopPropagation();
        if (ClientXonMouseDown !== e.clientX || ClientYonMouseDown !== e.clientY) {
            e.preventDefault();
        }
    };


    /* Styled components */

    return (
        <div className={cn(styles.outer, additionalClasses)} >
            <SliderWrap>
                <Slick {...props} {...settings}
                       >
                    {React.Children.map(props.children, (child, i) => {
                        return (
                            <div className={styles.slide} data-nr={i} onMouseDown={(e) => handleOnMouseDown(e)}
                                 onClick={(e) => handleOnClick(e)}>
                                {child}
                            </div>
                        );
                    })}
                </Slick>
            </SliderWrap>
        </div>
    );
};

export default Slider;
