import React from "react"
import cn from "classnames"
import * as styles from "./Grid.module.scss"

const Grid = props => {
  return (
    <div className={cn(styles.grid, styles["gridCols" + props.cols])}>
      {props.children}
    </div>
  )
}

export default Grid