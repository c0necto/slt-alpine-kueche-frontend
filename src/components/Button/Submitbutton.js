import React from "react"
import classNames from "classnames"
import * as styles from "./Button.module.scss"

const Submitbutton = props => {
  return (
    <button type={"submit"}
            className={classNames(styles.btn, {
              [styles[props.color]]: props.color
            })}
    >
      {!props.noarrow ? <div className={styles.arrowRight}></div>: null}
      {props.children}
    </button>
  )
}

export default Submitbutton
