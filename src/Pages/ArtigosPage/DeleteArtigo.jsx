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
        isFetching 
    } = useDeleteArtigo(id)

    React.useEffect(()=>{
        if(!isFetching){
            setOpenDelete(false)
            refetch()
            setDeleteArtigo(false)
        }
    }, [isFetching])
    
    if(isFetching) return (<CircularProgress />)
    return (
        <div>
            
        </div>
    )
}
export default DeleteArtigo