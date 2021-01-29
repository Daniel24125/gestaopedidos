import React from 'react'
import {useParams} from "react-router-dom"
import FormComponent from "../../Components/FormComponent"
import {List , ListItem,Button,ListItemText,ListItemSecondaryAction, TextField,  Typography, IconButton,  Popover, ListItemIcon} from "@material-ui/core"
import Loading from "../../Components/Loading"
import DeleteIcon from '@material-ui/icons/Delete';
import SubmitForm from "./SubmitForm"
import {useNovoGrupo, useGetGrupoByID, useEditGrupo} from "../../Domain/useCases"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ColorPicker, { useColor } from "react-color-palette";
import ColorLensIcon from '@material-ui/icons/ColorLens';

const AddGroup = () => {
    let { id } = useParams();
    
    const {
        data: grupo, 
        isFetching
    } = useGetGrupoByID(id)

    const [color, setColor] = useColor("hex", "#121212");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [submitForm, setSubmitForm] = React.useState(false);
    const [tempMembro, setTempMembro] = React.useState("");
    const [submitData, setSubmitData] = React.useState({
        name: "",
        abrv: "", 
        color: "", 
        membros: []
    })
    const [error, setError] = React.useState({
        name: false,
        abrv: false, 
        color: false, 
        membros: false
    })
    
    const onChangeInput = (e)=>{
        setSubmitData({
            ...submitData,
            [e.target.id]: e.target.value
        })
        setError({
            ...error, 
            [e.target.id]: false
        })
    }
    const onSubmitForm = ()=>{
        let tempError = {}
        Object.keys(error).forEach(key=>{
            if(key!== "membros" && submitData[key] === ""){
                tempError={
                    ...tempError,
                    [key]: true
                }
            }
            else if (key === "membros" && submitData.membros.length === 0){
                tempError={
                    ...tempError,
                    [key]: true
                }
            }            
        })
        setError({
            ...error, 
            ...tempError
        })
        if(Object.values(tempError).length === 0){
            setSubmitForm(true)
        }
    }

    React.useEffect(()=>{
        if(!isFetching ){
            if(id){
                setSubmitData({
                    name: grupo.data.name,
                    abrv: grupo.data.abrv, 
                    color: grupo.data.color, 
                    membros: grupo.data.membros
                })
            }
        }
    }, [isFetching])



    if(isFetching) return <Loading msg="A carregar dados do grupo" />
    if(submitForm)  return <SubmitForm data={submitData}  id={id} submitFunction={id? useEditGrupo: useNovoGrupo}/>
    return (
        <FormComponent title={id? `Editar o Grupo ${grupo.data.name}`: "Registo de Novo Grupo"}>
            <TextField
                error={error.name}
                required
                id="name"
                label="Nome do Grupo"
                value={submitData.name}
                onChange={onChangeInput}
                variant="filled"
            />
           
            <div style={{
                width: "100%",
                display: "flex",
                alignItems: "center"
            }}>
                <IconButton style={{
                    marginRight: 10,
                    marginBottom: 20
                }} onClick={(e)=>{
                    setAnchorEl(e.target)
                }}>
                    <ColorLensIcon style={{color: submitData.color}}/>
                </IconButton>
                <TextField
                    fullWidth
                    required
                    error={error.abrv}
                    id="abrv"
                    label="Abreviatura"
                    value={submitData.abrv}
                    onChange={onChangeInput}
                    variant="filled"
                />
                
            </div>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={()=>setAnchorEl(null)}
                 anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
            >
                <ColorPicker width={200} height={100} color={color} onChange={(c)=>{
                    setSubmitData({
                        ...submitData,
                        color: c.hex
                    })
                    setColor(c)
                    }} dark />

            </Popover>
            
            <div className="formTitleContainer">
                <Typography color="primary" >Adicionar Membro</Typography>
            </div>
            <TextField
                id="name"
                label="Nome"
                onKeyDown={(e)=>{
                    if(e.key=== "Enter"){
                        let tmpM = submitData.membros
                        tmpM.push(tempMembro)
                        setSubmitData({
                            ...submitData,
                            membros: tmpM
                        })
                        setTempMembro("")
                    }
                }}
                value={tempMembro}
                onChange={(e)=>{setTempMembro(e.target.value)}}
                variant="filled"
            />
           
            <Button
                variant="contained"
                disabled={tempMembro === ""}
                onClick={()=>{
                    let tmpM = submitData.membros
                    tmpM.push(tempMembro)
                    setSubmitData({
                        ...submitData,
                        membros: tmpM
                    })
                    setTempMembro("")
                }}
            >
                adicionar membro
            </Button>
            <List>
                {
                    submitData.membros.map((m, index)=>{
                        return (
                            <ListItem style={{
                                background: "#ecf0f1"
                            }} key={"membro_" + index}>
                                <ListItemIcon>
                                    <AccountCircleIcon color="primary" />
                                </ListItemIcon>
                                    <ListItemText primary={m} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={()=>{
                                                let tempM = submitData.membros
                                                tempM.splice(index,1)
                                                setSubmitData({
                                                    ...submitData,
                                                    membros: tempM
                                                })
                                        }} style={{color: "#e74c3c"}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })
                }
            </List>

            <Button
                variant="contained"
                color="primary"
                style={{
                    marginTop: 30
                }}
                onClick={()=>onSubmitForm()}
            >
                Submeter
            </Button>
        </FormComponent>

    )
}
export default AddGroup