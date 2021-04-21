import React from 'react'
import {useDeleteArtigo} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"

const  DeleteArtigo = ({
    id,
    setOpenDelete,
    setDeleteArtigo,
    refetch
}) => {
    const {
        isFetching: deleteFetching 
    } = useDeleteArtigo(id)

    React.useEffect(()=>{
        if(!deleteFetching){
            setOpenDelete(false)
            refetch()
            setDeleteArtigo(false)
        }
    }, [deleteFetching])
    
    if(deleteFetching) return (<CircularProgress />)
    return (
        <div>
            
        </div>
    )
}
export default DeleteArtigo