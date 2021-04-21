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
        isFetching: formFetching
    } = submitFunction(data, id)
    if(formFetching) return <Loading msg="A submeter dados do formulário..." />
    return (
        <div className="formSubmitedContainer">
            <LibraryAddCheckIcon style={{fontSize: 200, color: "#2ecc71"}} />
            <Typography variant="h4">A operação foi realizada com sucesso</Typography>
            <Button variant="contained"component={Link} to="/gerirGrupos" color="primary">Ver lista de grupo</Button>
        </div>
    )
}

export default SubmitForm