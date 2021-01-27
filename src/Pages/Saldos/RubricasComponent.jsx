import React from 'react'
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';
import {useGetRubricasByEmppresa} from "../../Domain/useCases"
import {CircularProgress ,Table, TableHead, TableRow, TableBody, TableCell, Avatar, Typography, Tooltip, IconButton} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';

 const RubricasComponent = ({empresa}) => {  
    const {
        data: ne, 
        isFetching
    } = useGetRubricasByEmppresa(empresa)

    
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
    }

    console.log(ne)
    return (
        <div className="optionsContainer">
            {isFetching && <CircularProgress size={60} color="primary" />}
            {!isFetching && <>
                {ne.data.length === 0 && <Typography style={{marginBottom: 20}}>Não se encontra registada nenhuma nota de encomenda para esta empresa</Typography>}
                {ne.data.length > 0 && <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell >
                            Rúbrica
                            </TableCell>
                            <TableCell >Nota de Encomenda</TableCell>
                            <TableCell >Cabimento</TableCell>
                            <TableCell >Compromnisso</TableCell>
                            <TableCell >Saldo</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ne.data.map(n => {
                            return (
                            <TableRow>
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
                                        <div style={{
                                            width: (n.saldo_disponivel/n.saldo_abertura)*100+"%",
                                            backgroundColor: RubricasIcons[n.rubrica].color, 
                                        }} className="saldoDisponivelContainer"></div>
                                        <Typography>{n.saldo_disponivel}€/{n.saldo_abertura}€</Typography>
                                    </div>
                                </TableCell>
                            <TableCell>
                                <Tooltip title="Apagar Nota de Encomenda">
                                    <IconButton style={{color: "#e74c3c"}}>
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