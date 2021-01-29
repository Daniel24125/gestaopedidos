import React from 'react'
import {useDownloadPDF} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"
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
        isFetching 
    } = useDownloadPDF(template, pedidoID)

    React.useEffect(()=>{
        if(!isFetching){
            saveAs(result, `pedido_${pedidoID}`)
            setIsRefetch(true)
            refecth()
            setFazerPedido(false)
        }
    }, [isFetching])
    // if(isFetching) return (<CircularProgress size={30} />)

    return (
        <div>
            
        </div>
    )
}
export default DownloadPDF