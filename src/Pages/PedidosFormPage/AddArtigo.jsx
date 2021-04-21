import React from 'react'
import {useAddArtigoToDB} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"

const AddArtigo = ({
    setAddArtigoToDB,
    setTempArticle,
    setShowAddArtigoForm,
    tempArticle,
    artigo,
    articlesMainPage, 
    refetch
}) => {
    const {
        data: result, 
        isFetching: addArtigoFetching
    } = useAddArtigoToDB(artigo)

    React.useEffect(()=>{
        if(!addArtigoFetching){
            if(!articlesMainPage){
                setTempArticle({
                    ...tempArticle,
                    referencia_artigo: artigo.code,
                    artigo: artigo.name
                })
            }else{
                setTempArticle({
                    name: "", 
                    code: ""
                })
                refetch()
            }
            setShowAddArtigoForm(false)
            setAddArtigoToDB(false)
        }
    }, [addArtigoFetching])
    
    if(addArtigoFetching) return (<CircularProgress size={30} />)

    return (
        <div>
            
        </div>
    )
}


export default AddArtigo