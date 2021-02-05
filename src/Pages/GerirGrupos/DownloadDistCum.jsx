import React from 'react'
import {useDownloadDistCum} from "../../Domain/useCases"
import {saveAs} from "file-saver"

const DownloadDistCum = ({
    setIsRefetch,
    refecth,
    setExportDistAnual
}) => {
    const {
        data: result, 
        isFetching 
    } = useDownloadDistCum(template)

    React.useEffect(()=>{
        if(!isFetching){
            saveAs(result, `Distribuição Cumulativa ${new Date.getFullYear()}`)
            setIsRefetch(true)
            refecth()
            setExportDistAnual(false)
        }
    }, [isFetching])
    return (
        <div>
            
        </div>
    )
}

export default DownloadDistCum