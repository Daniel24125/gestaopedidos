import React from 'react'
import {useDownloadDistCumGrupo, useGetGrupoByID} from "../../Domain/useCases"
import {saveAs} from "file-saver"

const DownloadDisGrupo = ({
    setExportDistAnualGrupo,
    selectedYear,
    grupoID
}) => {
    const {
        data: result, 
        isFetching: donwloadFetching
    } = useDownloadDistCumGrupo(grupoID, selectedYear)

    const {
        data: grupo, 
        isFetching: fetchingGrupo 
    } = useGetGrupoByID(grupoID)

    React.useEffect(()=>{
        if(!donwloadFetching && !fetchingGrupo){
            saveAs(result, `Distribuição Mensal ${new Date().getFullYear()} - ${grupo.data.abrv}.xlsx`)
            setExportDistAnualGrupo(false)
        }
    }, [donwloadFetching, fetchingGrupo])
    return (
        <div>
            
        </div>
    )
}

export default DownloadDisGrupo
