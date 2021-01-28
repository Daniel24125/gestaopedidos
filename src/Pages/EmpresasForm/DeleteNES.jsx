import React from 'react'
import {CircularProgress} from "@material-ui/core"
import { useDeleteNES} from "../../Domain/useCases"

const DeleteNES = ({
    id,
    setOpenDelete,
    refetch,
    setDeleteNE
}) => {
    const {
        data: result, 
        isFetching,
    } = useDeleteNES(id)

    React.useEffect(()=>{
        if(!isFetching){
            setOpenDelete(false)
            refetch()
            setDeleteNE(false)
        }
    }, [isFetching])

    if(isFetching) return <CircularProgress color="primary" />
    return (
        <div>
            
        </div>
    )
}


export default DeleteNES