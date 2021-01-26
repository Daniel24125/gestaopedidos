import React from 'react'
import Loading from "../../Components/Loading"
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
const SubmitForm = ({
    data,
    id,
    submitFunction
}) => {
    const {
        data: response, 
        isFetching
    } = submitFunction(data, id)
    console.log(response)
    if(isFetching) return <Loading msg="A registar pedido..." />
    return (
        <div className="formSubmitedContainer">
            <LibraryAddCheckIcon style={{fontSize: 200, color: "#2ecc71"}} />
            <Typography variant="h4">A operação foi realizada com sucesso</Typography>
            <Button variant="contained"component={Link} to="/pedidos" color="primary">Ver lista de pedidos</Button>
        </div>
    )
}

export default SubmitForm