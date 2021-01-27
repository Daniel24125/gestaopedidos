import React from 'react'
import {CircularProgress} from "@material-ui/core"
import { useAddFatura} from "../../Domain/useCases"

const SubmitFatura = ({
    fatura,
    setSubmitFatura,
    refetchFaturas,
    setAddFat,
    setTempFatura
}) => {
    const {
        data: result, 
        isFetching
    } = useAddFatura(fatura)
    
    React.useEffect(()=>{
        if(!isFetching){
            refetchFaturas()
            setAddFat(false)
            setTempFatura({
                name: "", 
                data_emissao: "", 
                valor_fatura: 0, 
                notas: "", 
            })
            setSubmitFatura(false)
        }
    },[isFetching])

    if(isFetching)return <CircularProgress/>
    return (
        <div>
            
        </div>
    )
}
export default SubmitFatura