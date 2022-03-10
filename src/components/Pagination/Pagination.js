import React from "react"
import * as styles from "./Pagination.module.scss"
import { usePagination, DOTS } from "./usePagination"
import cn from "classnames"

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  })

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }
  const onNext = () => {
    onPageChange(currentPage + 1)
  }
  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange[paginationRange.length - 1]
  return (
    <ul className={cn(styles.paginationContainer, styles[className])}>
      <li>
        <button
          className={cn(styles.paginationItem, styles.arrowContainer, {
            [styles.disabled]: currentPage === 1
          })}
          onClick={onPrevious}
          onKeyUp={onPrevious}>
          <div className={cn(styles.arrow, styles.left)} />
        </button>
      </li>

      {paginationRange.map((pageNumber, key) => {
        if (pageNumber === DOTS) {
          return <li className={cn(styles.paginationItem, styles.dots)}>&#8230;</li>
        }
        return (
          <li key={key}>
            <button
              className={cn(styles.paginationItem, {
                [styles.selected]: pageNumber === currentPage
              })}
              onClick={() => onPageChange(pageNumber)}
              onKeyUp={() => onPageChange(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        )
      })}
      <li>
        <button
          className={cn(styles.paginationItem, styles.arrowContainer, {
            [styles.disabled]: currentPage === lastPage
          })}
          onClick={onNext}
          onKeyUp={onNext}>
          <div className={cn(styles.arrow, styles.right)} />
        </button>
      </li>
    </ul>
  )
}

export default Pagination