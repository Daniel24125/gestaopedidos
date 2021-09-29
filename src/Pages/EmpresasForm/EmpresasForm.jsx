import React from 'react'
import {useParams} from "react-router-dom"
import FormComponent from "../../Components/FormComponent"
import {List ,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions, ListItem, Button,ListItemText,ListItemSecondaryAction, TextField,   IconButton,   ListItemIcon, MenuItem, Menu} from "@material-ui/core"
import Loading from "../../Components/Loading"
import SubmitForm from "./SubmitForm"
import {useAddEmpresa, useGetEmpresaById, useEditEmpresa, useGetRubricasByEmppresa} from "../../Domain/useCases"
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';
import AddNE from "./AddNE"
import DeleteNES from "./DeleteNES"
import BuildIcon from '@material-ui/icons/Build';
import MoreVertIcon from '@material-ui/icons/MoreVert';


const EmpresasForm = () => {
    let { id } = useParams();

    const {
        data: empresa, 
        isFetching: empresaFetching
    } = useGetEmpresaById(id)
    
    const {
        data: nes, 
        isFetching: fetchingNES,
        refetch
    } = useGetRubricasByEmppresa(id)

    const [submitForm, setSubmitForm] = React.useState(false);
    const [addNE, setAddNe] = React.useState(false);
    const [submitAddNE, setSubmitAddNE] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteNE, setDeleteNE] = React.useState(false);
    const [selectedNEID, setSelectedNEID] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);

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
        email: "",
        cp: "", 
        localidade: "",
        distrito: "",
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

    const closeMenu = ()=>{
        setAnchorEl(null)
        setSelectedNEID(null)
    }
    const closeTempNEDialog = ()=>{
        setAddNe(false)
        setSelectedNEID(null)
        setTempNE({
            ne: "",
            cabimento: "",
            compromisso: "",
            rubrica: "PM",
            saldo_abertura: 0,
            data_registo: "",
            data_registo_timestamp: "",
        })
    }
    React.useEffect(()=>{
        if(!empresaFetching  && !fetchingNES){
            if(id){
                setSubmitData({
                    ...submitData, 
                    ...empresa.data,
                })
            }
        }
    }, [empresaFetching, fetchingNES])



    if(empresaFetching || fetchingNES) return <Loading msg="A carregar dados da empresa" />
    if(submitForm)  return <SubmitForm data={submitData} nesIDs={nes.data? nes.data.map(n=>n.id): null} id={id} submitFunction={id? useEditEmpresa: useAddEmpresa}/>
    return (
        <FormComponent title={id? `Editar a empresa ${empresa.data.empresa}`: "Registo de Novo Fornecedor"}>
            {id && <Dialog open={addNE} onClose={closeTempNEDialog} aria-labelledby="form-dialog-title">
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
                            label="Compromisso"
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
                            <MenuItem value="REP">
                               <BuildIcon style={{color: "#f39c12", marginRight: 10}}/> Reparações
                            </MenuItem>
                        </TextField>
                         <TextField
                            margin="normal"
                            variant="filled"
                            id="saldo_abertura"
                            label="Saldo de Abertura"
                            fullWidth
                            onChange={onChangeInputNE}
                            type="number"
                            value={tempNE.saldo_abertura}
                        />
                        <TextField
                            margin="normal"
                            variant="filled"
                            id="saldo_disponivel"
                            label="Saldo Disponível"
                            fullWidth
                            onChange={onChangeInputNE}
                            type="number"
                            value={tempNE.saldo_disponivel}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeTempNEDialog} color="primary">
                            Cancelar
                        </Button>
                        {submitAddNE && <AddNE 
                            ne={tempNE}
                            empresa={submitData.empresa}
                            empresaID={id}
                            refetch={refetch}
                            setAddNe={setAddNe}
                            setSubmitAddNE={setSubmitAddNE}
                            setTempNE={setTempNE}
                        />}
                        {!submitAddNE && <Button onClick={()=>{
                            if(tempNE.ne !== ""){
                               setSubmitAddNE(true)
                            }
                        }} color="primary">
                            {Boolean(selectedNEID) ? "Guardar": "Adicionar"}
                        </Button>}
                </DialogActions>
            </Dialog>}
            <Dialog onClose={()=>{
                setOpenDelete(false)
            }} aria-labelledby="simple-dialog-title" open={openDelete}>
                <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar a nota de encomenda"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        A nota de encomenda será apagada permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deleteNE && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeleteNE(true)}}>
                        apagar
                    </Button>}
                    {deleteNE && <DeleteNES
                        id={selectedNEID} 
                        setOpenDelete={setOpenDelete}
                        refetch={refetch}
                        setDeleteNE={setDeleteNE}
                        />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
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
                id="email"
                label="Email"
                value={submitData.email}
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
                {nes.data.map((n, index)=>{
                        return (
                            <ListItem style={{
                                background: "#D1E9FF"
                            }} key={"ne_" + n.id}>
                                <ListItemIcon>
                                    {n.rubrica === "PM" && <WidgetsIcon style={{color: "#3498db"}} />}
                                    {n.rubrica === "PR" && <WhatshotIcon style={{color: "#e74c3c"}}/>}
                                    {n.rubrica === "SEQ" && <GestureIcon style={{color: "#9b59b6"}}/>}
                                    {n.rubrica === "REP" && <BuildIcon style={{color: "#f39c12"}}/>}
                                </ListItemIcon>
                                <ListItemText primary={`${n.ne}`} secondary={`Saldo de abertura: ${n.saldo_abertura}`} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={(e)=>{
                                            setAnchorEl(e.target)
                                           setSelectedNEID(n.id)
                                    }}>
                                        <MoreVertIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })}
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
      
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
            >
                <MenuItem onClick={()=>{
                    setTempNE(nes.data.filter(n=>n.id===selectedNEID)[0])
                    setAddNe(true)
                    setAnchorEl(null)
                }}>EDITAR</MenuItem>
                <MenuItem onClick={()=>{
                    setOpenDelete(true)
                    setAnchorEl(null)
                }}>ELIMINAR</MenuItem>
            </Menu>
        </FormComponent>
    )
}
export default EmpresasForm