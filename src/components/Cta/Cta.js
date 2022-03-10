import React from 'react';
import classNames from 'classnames';
import Button from '~components/Button/Button';
import Fakebutton from '~components/Button/Fakebutton';

import * as styles from './Cta.module.scss';

const Cta = props => {
    return (
        <>
            {props.title ? (
                <div
                    className={classNames(styles.title, {
                        [styles[props.additionalClass]]: props.additionalClass,
                    })}>
                    <span>{props.title}</span>
                </div>
            ) : null}
            {props.subtitle ? (
                <div className={styles.subtitle}>
                    <span>{props.subtitle}</span>
                </div>
            ) : null}
            {props.buttonlink ? (
                <div className={styles.ctaButton}>
                    <Button to={props.buttonlink} color={props.buttoncolor}>
                        {props.buttontext}
                    </Button>
                </div>
            ) : null}
            {props.fakebutton ? (
                <div className={styles.ctaButton}>
                    <Fakebutton to={props.buttonlink} color={props.buttoncolor}>
                        {props.buttontext}
                    </Fakebutton>
                </div>
            ) : null}
        </>
    );
};

export default Cta;
