import React from 'react'
import {useSetArtigoFaturado} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"

const FaturarArtigos = ({
    pedidoID, 
    index, 
    faturado, 
    refetch,
    setRefetch,
    setChangeArtigoFaturado
}) => {
    const {
        data: result, 
        isFetching 
    } = useSetArtigoFaturado(pedidoID ,index,faturado)

    React.useEffect(()=>{
        if(!isFetching){
            refetch()
            setChangeArtigoFaturado(false)
            setRefetch(true)
        }
    }, [isFetching])
    
    if(isFetching) return (<CircularProgress size={30} />)
    return (<div></div>)
}
export default FaturarArtigos