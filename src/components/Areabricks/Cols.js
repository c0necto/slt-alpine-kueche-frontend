import React from "react";

const ColsAreabrick = props => {
    const { children } = props
    //const grey = elements.grey?.checked

    // Get children with column_content in their name
    const columns = children.filter(
        child => child.name.indexOf('column_content') === 0,
    )
    return (
        <>
            <ContentArea className={'bottom80'}>
                <Container>
                    {columns.map(column => (
                        <AreabrickList key={column.name} {...column} />
                    ))}
                </Container>
            </ContentArea>
        </>
    );
}