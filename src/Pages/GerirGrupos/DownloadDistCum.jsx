import React from 'react'
import {useDownloadDistCum} from "../../Domain/useCases"
import {saveAs} from "file-saver"
import {CircularProgress} from "@material-ui/core"
const DownloadDistCum = ({
    setExportDistAnual
}) => {
    const {
        data: result, 
        isFetching 
    } = useDownloadDistCum()
    React.useEffect(()=>{
        if(!isFetching){
            saveAs(result, `Distribuição Cumulativa ${new Date().getFullYear()}.pdf`)
            setExportDistAnual(false)
        }
    }, [isFetching])
    return (
        <CircularProgress size={20} style={{color: "white", marginRight: 10}}/>
    )
}

export default DownloadDistCum