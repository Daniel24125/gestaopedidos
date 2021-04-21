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
        isFetching: changeStatusFetching
    } = useSetArtigoState(pedidoID ,index,chegada_data)

    React.useEffect(()=>{
        if(!changeStatusFetching){
            openArtigoChegadaForm(false)
            refetch()
            setChegadaArtigosState(false)
            setRefetch(true)
        }
    }, [changeStatusFetching])
    
    // if(isFetching) return (<CircularProgress size={30} />)
    return (
        <div>
            
        </div>
    )
}
export default ChageArtigosStatus