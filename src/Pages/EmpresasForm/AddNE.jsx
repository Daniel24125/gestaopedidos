import React from 'react'
import {CircularProgress} from "@material-ui/core"
import { useAddNE} from "../../Domain/useCases"

const AddNE =({
    ne,
    empresa,
    empresaID,
    refetch, 
    setAddNe,
    setSubmitAddNE,
    setTempNE
})=> {
    const {
        data: result, 
        isFetching
    } = useAddNE({
        ...ne,
        data_registo: new Date().toJSON(),
        data_registo_timestamp: Date.now(),
        saldo_disponivel: ne.saldo_abertura,
        empresa, 
        empresa_id: empresaID
    })
    
    React.useEffect(()=>{
        if(!isFetching){
            refetch()
            setAddNe(false)
            setTempNE({
                ne: "",
                cabimento: "",
                compromisso: "",
                rubrica: "PM",
                saldo_abertura: 0,
                data_registo: "",
                data_registo_timestamp: "",
            })
            setSubmitAddNE(false)
        }
    },[isFetching])

    if(isFetching)return <CircularProgress/>
    
    return (
        <div>
            
        </div>
    )
}
export default AddNE