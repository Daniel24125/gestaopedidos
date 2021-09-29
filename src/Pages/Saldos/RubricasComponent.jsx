import React from 'react'
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';
import {useGetRubricasByEmppresa} from "../../Domain/useCases"
import {CircularProgress ,Table, Button, Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions, TableHead, TableRow, TableBody, TableCell, Avatar, Typography, Tooltip, IconButton} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteNES from "../EmpresasForm/DeleteNES"
import BuildIcon from '@material-ui/icons/Build';
 const RubricasComponent = ({empresa}) => {  
    const {
        data: ne, 
        isFetching: rubricasFetching,
        refetch
    } = useGetRubricasByEmppresa(empresa)

    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteNE, setDeleteNE] = React.useState(false);
    const [selectedNEID, setSelectedNEID] = React.useState(null);
    
    const RubricasIcons = {
        "SEQ": {
           component: ()=> <GestureIcon />,
           color: "#9b59b6"
        }, 
        "PR":{
           component: ()=>  <WhatshotIcon />,
           color: "#e74c3c"
        },
        "PM": {
           component: ()=> <WidgetsIcon />,
           color: "#3498db"
        },
        "REP": {
            component: ()=> <BuildIcon/>,
            color: "#f39c12"
        }
    }

    return (
        <div className="optionsContainer">
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
            {rubricasFetching && <CircularProgress size={60} color="primary" />}
            {!rubricasFetching && <>
                {ne.data.length === 0 && <Typography style={{marginBottom: 20}}>Não se encontra registada nenhuma nota de encomenda para esta empresa</Typography>}
                {ne.data.length > 0 && <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell >
                            Rúbrica
                            </TableCell>
                            <TableCell >Nota de Encomenda</TableCell>
                            <TableCell >Cabimento</TableCell>
                            <TableCell >Compromisso</TableCell>
                            <TableCell >Saldo</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ne.data.map(n => {
                            return (
                            <TableRow key={n.id}>
                                <TableCell>
                                    <Tooltip title={n.rubrica === "PR"? "Reagentes": n.rubrica=== "PM"? "Materiais": "Sequenciação"}>
                                        <Avatar style={{
                                            backgroundColor: RubricasIcons[n.rubrica].color,
                                        }}>
                                            {RubricasIcons[n.rubrica].component()}
                                        </Avatar>
                                    </Tooltip>
                                </TableCell>
                                <TableCell >{n.ne}</TableCell>
                                <TableCell >{n.cabimento}</TableCell>
                                <TableCell >{n.compromisso}</TableCell>
                                <TableCell>
                                    <div className="saldoContainer">
                                        <Tooltip title="Saldo Disponível">
                                            <div style={{
                                                width: (n.saldo_disponivel/n.saldo_abertura)*100+"%",
                                                backgroundColor: RubricasIcons[n.rubrica].color, 
                                            }} className="saldoDisponivelContainer"></div>
                                        </Tooltip>

                                        <Typography>{Number(n.saldo_disponivel).toFixed(2)}€/{Number(n.saldo_abertura).toFixed(2)}€</Typography>
                                    </div>
                                </TableCell>
                            <TableCell>
                                <Tooltip title="Apagar Nota de Encomenda">
                                    <IconButton onClick={()=> {
                                        setSelectedNEID(n.id)
                                        setOpenDelete(true)
                                    }}style={{color: "#e74c3c"}}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                        )})}
                    </TableBody>
                </Table>}
            </>}
        </div>
    )
}
export default RubricasComponent