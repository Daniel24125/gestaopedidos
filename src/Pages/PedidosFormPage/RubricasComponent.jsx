import React from 'react'
import {IconButton, Tooltip} from "@material-ui/core"
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';


const RubricasComponent = ({
    submitData,
    setSubmitData,
    setSelectedRubrica,
    setFetchEmpresas
}) => {

    const changeRubrica = (rubrica)=>{
            setSelectedRubrica(rubrica.code)
            setSubmitData({
                ...submitData, 
                rubrica
            })
            setFetchEmpresas(true)
    }
    return (
        <div className="rubricasContainer">
                    <Tooltip title="Materiais">
                        <IconButton onClick={()=>{
                        if(Object.keys(submitData).length > 0){
                            if(submitData.rubrica.code !== "PM"){
                                changeRubrica({
                                    code: "PM", 
                                    icon: "widget",
                                    name: "Materiais"
                                })
                            }
                        }
                    }}>
                        <WidgetsIcon style={{fontSize: 50,color: submitData.rubrica.code=== "PM"?"#3498db": "#bdc3c7" }} />
                    </IconButton>
                </Tooltip>
                    <Tooltip title="Reagentes">
                        <IconButton onClick={()=>{
                        if(Object.keys(submitData).length > 0){
                            if(submitData.rubrica.code !== "PR"){
                                changeRubrica({
                                    code: "PR", 
                                    icon: "whatshot",
                                    name: "Reagentes"
                                })
                            }
                        }
                    }}>
                        <WhatshotIcon style={{fontSize: 50,color: submitData.rubrica.code=== "PR"?"#e74c3c": "#bdc3c7" }} />
                    </IconButton>
                </Tooltip>
                    <Tooltip title="Sequenciação">
                        <IconButton onClick={()=>{
                        if(Object.keys(submitData).length > 0){
                            if(submitData.rubrica.code !== "SEQ"){
                                changeRubrica({
                                    code: "SEQ", 
                                    icon: "gestures",
                                    name: "Sequenciação"
                                })
                            }
                        } 
                    }}>
                        <GestureIcon style={{fontSize: 50,color: submitData.rubrica.code=== "SEQ" ?"#9b59b6": "#bdc3c7" }} />
                    </IconButton>
                </Tooltip>
        
        </div>
    )
}


export default RubricasComponent