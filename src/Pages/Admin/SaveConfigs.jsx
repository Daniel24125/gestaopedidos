import { CircularProgress } from '@material-ui/core'
import React from 'react'
import {useSaveConfig} from "../../Domain/useCases"

const SaveConfigs = ({
    configs, 
    setSaveConfigs,
    setOpenSnackbar
}) => {

    const {
        data: result, 
        isFetching: saveConfigFetching,
    } = useSaveConfig(configs)

    React.useEffect(()=>{
        if(!saveConfigFetching){
            setOpenSnackbar(true)
            setSaveConfigs(false)
        }
    }, [saveConfigFetching])

    if(saveConfigFetching) return <CircularProgress size={30}/>
    return (
        <div>
            
        </div>
    )
}
export default  SaveConfigs