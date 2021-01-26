import React from 'react'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

 const ErrorMessage = (props) => {
    return (
        <div className="errorContainer">
                <Alert variant="standard" severity="error">
                <AlertTitle>{props.title}</AlertTitle>
                <span>{props.msg}</span>
                </Alert>
      </div>
    )
}
export default ErrorMessage