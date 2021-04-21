import React from 'react'
import {useDownloadDistCumGrupo, useGetGrupoByID} from "../../Domain/useCases"
import {saveAs} from "file-saver"

const DownloadDisGrupo = ({
    setExportDistAnualGrupo,
    grupoID
}) => {
    const {
        data: result, 
        isFetching: donwloadFetching
    } = useDownloadDistCumGrupo(grupoID)

    const {
        data: grupo, 
        isFetching: fetchingGrupo 
    } = useGetGrupoByID(grupoID)

    React.useEffect(()=>{
        if(!donwloadFetching && !fetchingGrupo){
            saveAs(result, `Distribuição Cumulativa ${new Date().getFullYear()} - ${grupo.data.abrv}.pdf`)
            setExportDistAnualGrupo(false)
        }
    }, [donwloadFetching, fetchingGrupo])
    return (
        <div>
            
        </div>
    )
}

export default DownloadDisGrupo
