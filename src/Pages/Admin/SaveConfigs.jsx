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
        isFetching,
    } = useSaveConfig(configs)

    React.useEffect(()=>{
        if(!isFetching){
            setOpenSnackbar(true)
            setSaveConfigs(false)
        }
    }, [isFetching])

    if(isFetching) return <CircularProgress size={30}/>
    return (
        <div>
            
        </div>
    )
}
export default  SaveConfigs