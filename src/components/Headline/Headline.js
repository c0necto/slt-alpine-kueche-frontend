import React from "react"
import cn from "classnames"
import * as styles from "./Headline.module.scss"

const Headline = ({title, description, level, className}) => {
  const validHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    safeHeading = level ? level.toLowerCase() : '',
    Title = validHeadingLevels.includes(safeHeading) ? safeHeading : 'p'
  return (
    <div className={cn(styles.headline, styles[className])}>
      <Title>
        <span className={styles.large}>{title}</span>
        {!!description && (
          <span className={styles.small}>{description}</span>
        )}
      </Title>
    </div>
  )
}

export default Headline
