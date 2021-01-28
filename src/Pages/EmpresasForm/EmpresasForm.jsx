import React from 'react'
import {useParams, Link} from "react-router-dom"
import FormComponent from "../../Components/FormComponent"
import {List ,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions, ListItem, Button,ListItemText,ListItemSecondaryAction, TextField,  Typography, IconButton,  Popover, ListItemIcon, MenuItem} from "@material-ui/core"
import Loading from "../../Components/Loading"
import DeleteIcon from '@material-ui/icons/Delete';
import SubmitForm from "./SubmitForm"
import {useAddEmpresa, useGetEmpresaById, useEditEmpresa, useGetRubricasByEmppresa} from "../../Domain/useCases"
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';


const EmpresasForm = () => {
    let { id } = useParams();

    const {
        data: empresa, 
        isFetching
    } = useGetEmpresaById(id)
    
    const {
        data: nes, 
        isFetching: fetchingNES
    } = useGetRubricasByEmppresa(id)

    const [submitForm, setSubmitForm] = React.useState(false);
    const [addNE, setAddNe] = React.useState(false);
    
    const [tempNE, setTempNE] = React.useState({
        ne: "",
        cabimento: "",
        compromisso: "",
        rubrica: "PM",
        saldo_abertura: 0,
        data_registo: "",
        data_registo_timestamp: "",
    });
    const [submitData, setSubmitData] = React.useState({
        empresa: "",
        nif: "",
        morada: "",
        cp: "", 
        localidade: "",
        distrito: "",
        nes: []
    })
    const [error, setError] = React.useState(false)

    const onChangeInput = (e)=>{
        setSubmitData({
            ...submitData,
            [e.target.id]: e.target.value
        })
    }

    const onChangeInputNE = (e)=>{
        setTempNE({
            ...tempNE,
            [e.target.id]: e.target.value
        })
    }

    
    React.useEffect(()=>{
        if(!isFetching  && !fetchingNES){
            if(id){
                setSubmitData({
                    ...submitData, 
                    ...empresa.data,
                    nes: nes.data
                })
            }
        }
    }, [isFetching, fetchingNES])

    if(isFetching) return <Loading msg="A carregar dados da empresa" />
    if(submitForm)  return <SubmitForm data={submitData}  id={id} submitFunction={id? useEditEmpresa: useAddEmpresa}/>
    return (
        <FormComponent title={id? `Editar a empresa ${empresa.data.empresa}`: "Registo de Novo Fornecedor"}>
            {id && <Dialog open={addNE} onClose={()=>setAddNe(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Adicionar Nota de Encomenda</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor preencha todos os dados para adicionar uma nova nota de encomenda associada a esta empresa
                    </DialogContentText>
                        <TextField
                            margin="normal"
                            autoFocus
                            variant="filled"
                            id="ne"
                            label="Nota de Encomenda"
                            fullWidth
                            onChange={onChangeInputNE}
                            value={tempNE.ne}
                        />
                        <TextField
                            margin="normal"
                            variant="filled"
                            id="cabimento"
                            label="Cabimento"
                            fullWidth
                            onChange={onChangeInputNE}
                            value={tempNE.cabimento}
                        />
                         <TextField
                            margin="normal"
                            variant="filled"
                            id="compromisso"
                            label="Comprimisso"
                            fullWidth
                            onChange={onChangeInputNE}
                            value={tempNE.compromisso}
                        />
                        <TextField
                            margin="normal"
                            variant="filled"
                            id="rubrica"
                            fullWidth
                            required
                            select
                            label="Rúbrica"
                            value={tempNE.rubrica}
                            onChange={(e)=>{
                                setTempNE({
                                    ...tempNE, 
                                    rubrica: e.target.value,
                                })
                            }}
                        >
                            <MenuItem value="PM">
                               <WidgetsIcon style={{color: "#3498db", marginRight: 10}} /> Materiais
                            </MenuItem>
                            <MenuItem value="PR">
                               <WhatshotIcon style={{color: "#e74c3c", marginRight: 10}}/> Reagentes
                            </MenuItem>
                            <MenuItem value="SEQ">
                               <GestureIcon style={{color: "#9b59b6", marginRight: 10}}/> Sequenciação
                            </MenuItem>
                        </TextField>
                         <TextField
                            margin="normal"
                            variant="filled"
                            id="saldo_abertura"
                            label="Montante"
                            fullWidth
                            onChange={onChangeInputNE}
                            type="number"
                            value={tempNE.saldo_abertura}
                        />
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setAddNe(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={()=>{
                            if(tempNE.ne !== ""){
                                let addData = tempNE
                                addData["data_registo"] = new Date().toJSON()
                                addData["data_registo_timestamp"] = Date.now()
                                addData["saldo_disponível"] = tempNE.saldo_abertura
                                setSubmitData({
                                    ...submitData,
                                    nes: [...submitData.nes, tempNE]
                                })
                                setTempNE({
                                    ne: "",
                                    cabimento: "",
                                    compromisso: "",
                                    rubrica: "PM",
                                    saldo_abertura: 0,
                                    data_registo: "",
                                    data_registo_timestamp: "",
                                })
                                setAddNe(false)
                            }
                        }} color="primary">
                            Adicionar
                        </Button>
                </DialogActions>
            </Dialog>}
            <TextField
                error={error}
                required
                id="empresa"
                label="Empresa"
                value={submitData.empresa}
                onChange={onChangeInput}
                variant="filled"
            />
           
           <TextField
                id="nif"
                label="NIF"
                value={submitData.nif}
                onChange={onChangeInput}
                variant="filled"
            />
             <TextField
                id="morada"
                label="Morada"
                value={submitData.morada}
                onChange={onChangeInput}
                variant="filled"
            />
             <TextField
                id="cp"
                label="Código Postal"
                value={submitData.cp}
                onChange={onChangeInput}
                variant="filled"
            />
             <TextField
                id="localidade"
                label="Localidade"
                value={submitData.localidade}
                onChange={onChangeInput}
                variant="filled"
            />
            <TextField
                id="distrito"
                label="Distrito"
                value={submitData.distrito}
                onChange={onChangeInput}
                variant="filled"
            />

           {id && <Button onClick={()=>{
                setAddNe(true)
            }} color="primary" >adicionar nota de encomenda</Button>}

            {id && <List dense={true}>
                {
                    submitData.nes.map((n, index)=>{
                        return (
                            <ListItem style={{
                                background: "#D1E9FF"
                            }} key={"ne_" + n.id}>
                                <ListItemIcon>
                                    {n.rubrica === "PM" && <WidgetsIcon style={{color: "#3498db"}} />}
                                    {n.rubrica === "PR" && <WhatshotIcon style={{color: "#e74c3c"}}/>}
                                    {n.rubrica === "SEQ" && <GestureIcon style={{color: "#9b59b6"}}/>}
                                </ListItemIcon>
                                <ListItemText primary={`${n.ne}`} secondary={`Saldo de abertura: ${n.saldo_abertura}`} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={()=>{
                                            let tempNES = submitData.nes
                                            tempNES.splice(index,1)
                                            setSubmitData({
                                                ...submitData,
                                                nes: tempNES,
                                            })
                                    }} style={{color: "#e74c3c"}}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })
                }
            </List>}
            <Button
                variant="contained"
                color="primary"
                style={{
                    marginTop: 30
                }}
                onClick={()=>{
                    if(submitData.empresa !== "" ){
                        setSubmitForm(true)
                    }else setError(true)
                }}
            >
                Submeter
            </Button>
        </FormComponent>
    )
}
export default EmpresasForm