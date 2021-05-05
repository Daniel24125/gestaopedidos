 import React from 'react'
import {useDownloadPDF} from "../../Domain/useCases"
import {saveAs} from "file-saver"
import { CircularProgress } from '@material-ui/core'

const DownloadPDF = ({
    pedidoID,
    setFazerPedido,
    refecth,
    setIsRefetch
}) => {
    const {
        data: result, 
        isFetching: pdfFetching
    } = useDownloadPDF( pedidoID)

    React.useEffect(()=>{
        if(!pdfFetching){
            saveAs(result, `pedido_${pedidoID}`)
            setIsRefetch(true)
            refecth()
            setFazerPedido(false)
        }
    }, [pdfFetching])
    // if(isFetching) return ()

    return (
        <CircularProgress color="primary"  size={30} />
    )
}
export default DownloadPDF