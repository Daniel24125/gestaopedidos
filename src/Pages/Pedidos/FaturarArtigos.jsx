import React from 'react'
import {useSetArtigoFaturado} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"

const FaturarArtigos = ({
    pedidoID, 
    index, 
    faturado, 
    setChangeArtigoFaturado
}) => {
    const {
        data: result, 
        isFetching: faturadoFetching
    } = useSetArtigoFaturado(pedidoID ,index,faturado)

    React.useEffect(()=>{
        if(!faturadoFetching){
            setChangeArtigoFaturado(false)
        }
    }, [faturadoFetching])
    
    if(faturadoFetching) return (<></>)
    return (<div></div>)
}
export default FaturarArtigos