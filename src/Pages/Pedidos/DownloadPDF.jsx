 import React from 'react'
import {useExport} from "../../Domain/useCases"
import {saveAs} from "file-saver"
import { CircularProgress } from '@material-ui/core'

const DownloadPDF = ({
    type,
    pedidoID,
    setFazerPedido,
    refecth,
    setIsRefetch
}) => {
    const {
        data: result, 
        isFetching: exportFetch
    } = useExport( type,pedidoID)

    React.useEffect(()=>{
        if(!exportFetch){
            saveAs(result, `pedido_${pedidoID}`)
            setIsRefetch(true)
            refecth()
            setFazerPedido(false)
        }
    }, [exportFetch])
    // if(isFetching) return ()

    return (
        <CircularProgress color="primary"  size={30} />
    )
}
export default DownloadPDF