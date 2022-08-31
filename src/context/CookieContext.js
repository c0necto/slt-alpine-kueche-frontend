import React from "react";
export const BasicContext = React.createContext();

export default (props) => {
    const [marketing, setMarketing] = React.useState(false);
    const value = [marketing, setMarketing];
    return <BasicContext.Provider value={value} {...props} />;
};