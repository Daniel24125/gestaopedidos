import React from 'react'
import {useExportSaldos} from "../../Domain/useCases"
import {saveAs} from "file-saver"
import { CircularProgress } from '@material-ui/core'


const Export = ({
    setExport
}) => {
    const {
        data: result, 
        isFetching: donwloadFetching
    } = useExportSaldos()

    React.useEffect(()=>{
        if(!donwloadFetching){
            saveAs(result, `Saldos.xlsx`)
            setExport(false)
        }
    }, [donwloadFetching])
    return (<CircularProgress color="primary" />)
}

export default Export
