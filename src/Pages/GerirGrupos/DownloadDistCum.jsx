import React from 'react'
import {useDownloadDistCum} from "../../Domain/useCases"
import {saveAs} from "file-saver"
import {CircularProgress} from "@material-ui/core"
const DownloadDistCum = ({
    setExportDistAnual, 
    selectedYear
}) => {
    const {
        data: result, 
        isFetching: downloadDistFetching 
    } = useDownloadDistCum(selectedYear)
    React.useEffect(()=>{
        if(!downloadDistFetching){
            saveAs(result, `Distribuição Mensal ${new Date().getFullYear()}.xlsx`)
            setExportDistAnual(false)
        }
    }, [downloadDistFetching])
    return (
        <CircularProgress size={20} style={{color: "white", marginRight: 10}}/>
    )
}

export default DownloadDistCum