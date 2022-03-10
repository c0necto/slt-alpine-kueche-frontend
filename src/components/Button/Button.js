import React from "react"
import { Link } from "gatsby"
import classNames from "classnames"
import * as styles from "./Button.module.scss"

const Button = props => {
  return (
      <Link
        to={props.to}
        className={classNames(styles.btn, {
          [styles[props.color]]: props.color,
        })}
      >
        {!props.noarrow ? <div className={styles.arrowRight}></div>: null}
        {props.children}
      </Link>
  )
}

export default Button