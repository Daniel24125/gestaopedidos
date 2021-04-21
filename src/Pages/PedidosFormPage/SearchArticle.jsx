import React from 'react'
import {useGetArticle} from "../../Domain/useCases"
const SearchArticle = ({
    term, 
    setArticlesResult, 
    performSearch, 
    setPerformSearch
}) => {
    const {
        data: articles, 
        isFetching: searchArticleFetching, 
        refetch
    } = useGetArticle(term)
    React.useEffect(()=>{
        if(performSearch){
            refetch()
        }
    },[performSearch])

    React.useEffect(()=>{
        if(!searchArticleFetching ){
            setArticlesResult(articles.data)
            setPerformSearch(false)
        }
    }, [searchArticleFetching])
    return (
        <>
            {/* {performSearch && <CircularProgress size={20} color="primary" />} */}
        </>
    )
}
export default SearchArticle