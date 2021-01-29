import React from 'react'
import {useSetArtigoState} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"

const ChageArtigosStatus = ({
    pedidoID, 
    index, 
    chegada_data, 
    setChegadaArtigosState,
    refetch,
    openArtigoChegadaForm,
    setRefetch
}) => {
    const {
        data: result, 
        isFetching 
    } = useSetArtigoState(pedidoID ,index,chegada_data)

    React.useEffect(()=>{
        if(!isFetching){
            openArtigoChegadaForm(false)
            refetch()
            setChegadaArtigosState(false)
            setRefetch(true)
        }
    }, [isFetching])
    
    // if(isFetching) return (<CircularProgress size={30} />)
    return (
        <div>
            
        </div>
    )
}
export default ChageArtigosStatus