import React, { createContext, useReducer } from "react"

export const menuAction = {
    OPEN_MENU: 0,
    CLOSE_MENU: 1,
    CLOSE_EVERYTHING: 2,
    OPEN_SEARCH: 3,
    OPEN_REGIONS: 4,
    OPEN_BOOKING: 5,
    OPEN_LANGUAGES: 6
}

const initialState = {
    burgerOpen: false,
    menuOpen: false,
    infoOpen: false,
    searchOpen: false,
    regionsOpen: false,
    bookingOpen: false,
    languageOpen: false
};


const menuReducer = (state, action) => {
    switch (action.type) {
        case menuAction.OPEN_MENU:
            return  {
                ...state,
                burgerOpen: true,
                menuOpen: true
            }
        case menuAction.CLOSE_MENU:
            return {
                ...state,
                burgerOpen: false,
                menuOpen: false

            }
        case menuAction.CLOSE_EVERYTHING:
            return {
                ...state,
                infoOpen: false,
                burgerOpen: state.menuOpen,
                searchOpen: false,
                regionsOpen: false,
                bookingOpen: false,
                languageOpen: false
            }
        case menuAction.OPEN_SEARCH:
            return {
                ...state,
                infoOpen: true,
                burgerOpen: true,
                searchOpen: true
            }
        case menuAction.OPEN_REGIONS:
            return {
                ...state,
                infoOpen: true,
                burgerOpen: true,
                regionsOpen: true
            }
        case menuAction.OPEN_BOOKING:
            return {
                ...state,
                infoOpen: true,
                burgerOpen: true,
                bookingOpen: true
            }
        case menuAction.OPEN_LANGUAGES:
            return {
                ...state,
                infoOpen: true,
                burgerOpen: true,
                languageOpen: true
            }
        default: new Error()
    }
}

export const layoutContext = createContext({
    layoutState: initialState,
    dispatch: () => {}
});

const { Provider } = layoutContext;

const LayoutProvider = ({ children }) => {
    const [layoutState, dispatch] = useReducer(menuReducer, initialState)
    return <Provider value={{ layoutState, dispatch }}>{children}</Provider>;
};

export default LayoutProvider;
