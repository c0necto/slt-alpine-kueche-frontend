import React from "react";
export const CookieContext = React.createContext(false);

//export default (props) => {
const Context = props => {
    const [marketing, setMarketing] = React.useState(false);
    const value = [marketing, setMarketing];
    return <CookieContext.Provider value={value} {...props} />;
}

export default Context