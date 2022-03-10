import React from "react"
import classNames from "classnames"
import * as styles from "./Button.module.scss"

const Fakebutton = props => {
  return (
    <div
      onClick={props.onClick}
      onKeyDown={props.onClick}
      role={'button'}
      tabIndex={0}
      className={classNames(styles.btn, {
        [styles[props.color]]: props.color,
        [styles[props.display]]: props.display
      })}
    >
      {!props.noarrow ? <div className={styles.arrowRight}></div>: null}
      {props.children}
    </div>
  )
}

export default Fakebutton
