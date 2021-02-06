import React from 'react'
import {useDownloadDistCumGrupo, useGetGrupoByID} from "../../Domain/useCases"
import {saveAs} from "file-saver"

const DownloadDisGrupo = ({
    setExportDistAnualGrupo,
    grupoID
}) => {
    const {
        data: result, 
        isFetching 
    } = useDownloadDistCumGrupo(grupoID)

    const {
        data: grupo, 
        isFetching: fetchingGrupo 
    } = useGetGrupoByID(grupoID)

    React.useEffect(()=>{
        if(!isFetching && !fetchingGrupo){
            saveAs(result, `Distribuição Cumulativa ${new Date().getFullYear()} - ${grupo.data.abrv}.pdf`)
            setExportDistAnualGrupo(false)
        }
    }, [isFetching])
    return (
        <div>
            
        </div>
    )
}

export default DownloadDisGrupo
