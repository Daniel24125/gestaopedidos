import React from 'react'
import {IconButton} from "@material-ui/core"
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';


const RubricasComponent = ({
    submitData,
    setSubmitData,
    empresas,
    setSelectedRubrica,
    refetch
}) => {

    const changeRubrica = (rubrica)=>{
            setSelectedRubrica(rubrica.code)
            refetch()
            setSubmitData({
                ...submitData, 
                empresa: empresas.length > 0?empresas[0].empresa : "",
                rubrica
            })
    }
    return (
        <div className="rubricasContainer">
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
                    <GestureIcon style={{fontSize: 50,color: submitData.rubrica.code=== "SEQ"?"#9b59b6": "#bdc3c7" }} />
                </IconButton>
        
        </div>
    )
}


export default RubricasComponent