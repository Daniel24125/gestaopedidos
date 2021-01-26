import React from 'react'
import {Typography, Paper} from "@material-ui/core"

const FormComponent = ({children, title}) =>  {
    return (
        <div className="formWrapper">
            <Paper className="formContainer">
                <Typography className="title" >{title}</Typography>
                <form onSubmit={e=>e.preventDefault()} noValidate >
                    {children}
                </form>
            </Paper>
        </div>
    )
}
export default FormComponent