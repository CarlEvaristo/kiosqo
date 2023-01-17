import React from "react"

const NewsContext = React.createContext()

function NewsContextProvider(props) {
    const [news, setNews] = React.useState()

    function newsSetter(data) {
        setNews(data)
    }

    return (
        <NewsContext.Provider value={{news, newsSetter}}>
            {props.children}
        </NewsContext.Provider>
    )
}

export {NewsContextProvider, NewsContext}