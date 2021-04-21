 import React from 'react'
import {useDownloadPDF} from "../../Domain/useCases"
import {saveAs} from "file-saver"

const DownloadPDF = ({
    template,
    pedidoID,
    setFazerPedido,
    refecth,
    setIsRefetch
}) => {
    const {
        data: result, 
        isFetching: pdfFetching
    } = useDownloadPDF(template, pedidoID)

    React.useEffect(()=>{
        if(!pdfFetching){
            saveAs(result, `pedido_${pedidoID}`)
            setIsRefetch(true)
            refecth()
            setFazerPedido(false)
        }
    }, [pdfFetching])
    // if(isFetching) return (<CircularProgress size={30} />)

    return (
        <div>
            
        </div>
    )
}
export default DownloadPDF