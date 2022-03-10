import React, { useState, useMemo } from "react"
import * as styles from "./List.module.scss"
import Icon from "~components/Icon/Icon"
import TeaserList from "~components/Teaser/List"
import TeaserS from "~components/Teaser/TeaserS"
import TeaserMVariant from "~components/Teaser/TeaserMVariant"
import Fakeselect from "~components/Fakeselect/Fakeselect"
import Pagination from "~components/Pagination/Pagination"
import cn from "classnames"

// 20 20 12
let sizeList = 10
let sizeTiles = 12
let sizeLarge = 9

const TeaserVariant = ({ layout, name, image, slug }) => {
  if (layout === "list") {
    return <TeaserList
      slug={slug}
      text={name}>
      {name}
    </TeaserList>
  }
  if (layout === "tiles") {
    return <TeaserS
      slug={slug}
      text={name}
      image={image}>
      {name}
    </TeaserS>
  }
  if (layout === "large") {
    return <TeaserMVariant
      slug={slug}
      text={name}
      image={image}>
      {name}
    </TeaserMVariant>
  }
}

const List = props => {

  const [layout, setLayout] = useState("list")
  const [sorting, setSorting] = useState("rand")
  const [searchfilter, setSearchfilter] = useState("")

  /**
   * changeLayout
   * @param name
   * @param size
   */
  const changeLayout = (name, size) => {
    setSize(size)
    setLayout(name)
    setCurrentPage(1)
  }

  /**
   * sortObjects
   * @param objects
   * @param direction
   * @returns {*}
   */
  const sortObjects = (objects, direction) => {
    return objects.sort(function(a, b) {
      let x = a.name.toLowerCase(),
        y = b.name.toLowerCase()
      if (direction === "desc") {
        return (x > y) ? -1 : 1
      } else {
        return (x < y) ? -1 : 1
      }
    })
  }

  const [size, setSize] = useState(sizeList)
  const [totalCurrent, setTotalCurrent] = useState(props.results.length)
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * viewedResults
   * Pagination, Sorting and Filtering
   */
  const viewedResults = useMemo(() => {

    // Faker: object to array
    const results = Object.values(props.results)

    // Filtering
    const search = searchfilter.toLowerCase()

    const filtered = results.filter(value => value.name.toLowerCase().includes(search))

    // Sorting
    let sorted = filtered
    if ( sorting !== 'rand' ) {
      sorted = sortObjects(filtered, sorting)
      setTotalCurrent(filtered.length)
    }

    // Slicing
    const firstPageIndex = (currentPage - 1) * size
    const lastPageIndex = firstPageIndex + size
    return sorted.slice(firstPageIndex, lastPageIndex)

  }, [currentPage, size, props.results, sorting, searchfilter])

  let activeClass = styles.active,
    ascActive = (sorting === "asc") ? activeClass : null,
    descActive = (sorting === "desc") ? activeClass : null,
    listActive = (layout === "list") ? activeClass : null,
    tilesActive = (layout === "tiles") ? activeClass : null,
    largeActive = (layout === "large") ? activeClass : null


  return (
    <div className={styles.list}>

      <div className={styles.toolbar}>

        {/* Search */}
        <div className={styles.tbSearch}>
          <input type={"text"}
                 placeholder={"Finden ..."}
                 onKeyUp={ev => setSearchfilter(ev.target.value)} />
        </div>

        {/* Layout */}
        <div className={styles.toolbarSelects}>

          {/* Filters */}
          <Fakeselect name={"Filter"} icon={"filter"}>
            <div>
              <Icon name={"gallery"} />
              <span>Filter</span>
            </div>
          </Fakeselect>

          {/* Sorting */}
          <Fakeselect name={"Sortierung"} icon={"sortasc"}>
            <div className={ascActive}
                 role={"treeitem"}
                 tabIndex={0}
                 onKeyUp={() => setSorting("asc")}
                 onClick={() => setSorting("asc")}>
              <Icon name={"sortasc"} /> <span>Name aufsteigend</span>
            </div>
            <div className={descActive}
                 role={"treeitem"}
                 tabIndex={0}
                 onKeyUp={() => setSorting("desc")}
                 onClick={() => setSorting("desc")}>
              <Icon name={"sortdesc"} /> <span>Name absteigend</span>
            </div>
          </Fakeselect>

          {/* View */}
          <Fakeselect name={"Darstellung"} icon={"list"}>
            <div className={listActive}
                 role={"treeitem"}
                 tabIndex={0}
                 onKeyUp={() => changeLayout("list", sizeList)}
                 onClick={() => changeLayout("list", sizeList)}>
              <Icon name={"list"} /> <span>Liste</span>
            </div>
            <div className={tilesActive}
                 role={"treeitem"}
                 tabIndex={0}
                 onKeyUp={() => changeLayout("tiles", sizeTiles)}
                 onClick={() => changeLayout("tiles", sizeTiles)}>
              <Icon name={"tiles"} /> <span>Kacheln</span>
            </div>
            <div className={largeActive}
                 role={"treeitem"}
                 tabIndex={0}
                 onKeyUp={() => changeLayout("large", sizeLarge)}
                 onClick={() => changeLayout("large", sizeLarge)}>
              <Icon name={"largetiles"} /> <span>Große Kacheln</span>
            </div>
          </Fakeselect>

        </div>

      </div>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCurrent}
        pageSize={size}
        className={"noMarginTop"}
        onPageChange={page => setCurrentPage(page)}
      />

      <div className={cn(styles.results, styles[layout])}>
        {viewedResults.map((currentElement, index) => {
          let imageVariant
          if ( layout === 'tiles') { imageVariant = currentElement.teaserImage.teaserS }
          if ( layout === 'large') { imageVariant = currentElement.teaserImage.TeaserMVariant }
          return (<TeaserVariant
            layout={layout}
            name={currentElement.name}
            key={index}
            slug={currentElement.slug}
            image={imageVariant} />)
          }
        )}
      </div>
      {totalCurrent === 0 &&
        <div className={styles.error}>Keine Ergebnisse gefunden!</div>
      }


      <Pagination
        currentPage={currentPage}
        totalCount={totalCurrent}
        pageSize={size}
        className={"noMarginTop"}
        onPageChange={page => setCurrentPage(page)}
      />

    </div>
  )
}

export default List