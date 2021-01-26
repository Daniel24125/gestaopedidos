import React from 'react'
import {Typography, CircularProgress } from "@material-ui/core"

 const Loading = props => {
    return (
        <div className="loadingContainer">
            <CircularProgress size={100} color="secondary" />
            <Typography className="loadingText">
                {props.msg}
            </Typography>
           
        </div>
    )
}
export default Loading