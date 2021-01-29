import React from 'react'
import {Button,
    Paper,
    Popover,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tooltip, } from "@material-ui/core"
import Skeleton from '@material-ui/lab/Skeleton'
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PauseIcon from '@material-ui/icons/Pause';
import DescriptionIcon from '@material-ui/icons/Description';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';
import StarIcon from '@material-ui/icons/Star';

import {useGetNumPedidos,
    useQueryPedidos,
    useGetPedidosNaoEncomendados, 
    useGetPedidosAtrasados, 
} from "../../Domain/useCases"
import { Link } from 'react-router-dom';

const StatsComponent = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [displayData, setDisplayData] = React.useState([]);

    
    const Rubricas = {
        "gestures": ()=> <GestureIcon style={{color: "#9b59b6"}}/>, 
        "whatshot":()=>  <WhatshotIcon style={{color: "#e74c3c"}}/>,
        "widget": ()=> <WidgetsIcon style={{color: "#3498db"}}/>,
    }
    const {
        data: numPedidos, 
        isFetching: fetchingNumPedidos
    } = useGetNumPedidos()
    const {
        data: queryPedidos, 
        isFetching: fetchingQueryPedidos
    } = useQueryPedidos()
    const {
        data: pedidosNaoEncomendados, 
        isFetching: fetchingPedidosNaoEncomendados
    } = useGetPedidosNaoEncomendados()
    const {
        data: pedidosAtrasados, 
        isFetching: fetchingPedidosAtrasados
    } = useGetPedidosAtrasados()

    const isLoading = React.useMemo(() => {
        return  fetchingNumPedidos 
            || fetchingQueryPedidos
            || fetchingPedidosNaoEncomendados
            || fetchingPedidosAtrasados
    }, [fetchingNumPedidos, 
        fetchingQueryPedidos,
        fetchingPedidosNaoEncomendados,
        fetchingPedidosAtrasados,
    ])

    return (
        <div className="statCardsContainer" >
            {isLoading && <LoadingComponent/>}
            {!isLoading && <>
                <Paper className="cardContainer">
                    <div style={{
                        display: "flex", 
                        flexDirection: "column", 
                        width: "40%"
                    }}>
                        <Typography>Total de Pedidos</Typography>
                        <Typography variant="h2">{numPedidos.num}</Typography>
                    </div>
                    <div style={{
                        width: "60%",
                        color: "#FFAA00", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end"
                    }}>
                        <LocalShippingIcon />
                        {numPedidos.num > 0&& <Button component={Link} to="/pedidos" color="primary" >mais detalhes</Button>}
                    </div>
                </Paper>
                <Paper className="cardContainer">
                    <div style={{
                        display: "flex", 
                        flexDirection: "column", 
                        width: "40%"
                    }}>
                        <Typography>Pedidos Incompletos</Typography>
                        <Typography variant="h2">{queryPedidos.data_incompletos.length}</Typography>
                    </div>
                    <div style={{
                        width: "60%",
                        color: "#0011FF", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end"
                    }}>
                        <PauseIcon />
                        {queryPedidos.data_incompletos.length > 0&& <Button onClick={(e)=>{
                            setAnchorEl(e.target)
                            setDisplayData(queryPedidos.data_incompletos)
                        }} color="primary" >mais detalhes</Button>}
                    </div>
                </Paper>
                <Paper className="cardContainer">
                    <div style={{
                        display: "flex", 
                        flexDirection: "column", 
                        width: "40%"
                    }}>
                        <Typography>Faturas em Falta</Typography>
                        <Typography variant="h2">{queryPedidos.data_faturas.length}</Typography>
                    </div>
                    <div style={{
                        width: "60%",
                        color: "#00FF55", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end"
                    }}>
                        <DescriptionIcon />
                       {queryPedidos.data_faturas.length > 0 &&  <Button onClick={(e)=>{
                            setAnchorEl(e.target)
                            setDisplayData(queryPedidos.data_faturas)
                        }} color="primary" >mais detalhes</Button>}
                    </div>
                </Paper>
                <Paper className="cardContainer">
                    <div style={{
                        display: "flex", 
                        flexDirection: "column", 
                        width: "40%"
                    }}>
                        <Typography>Pedidos não Encomendados</Typography>
                        <Typography variant="h2">{pedidosNaoEncomendados.data.length}</Typography>
                    </div>
                    <div style={{
                        width: "60%",
                        color: "#8E44AD", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end"
                    }}>
                        <NotificationsOffIcon />
                        {pedidosNaoEncomendados.data.length  > 0 && <Button onClick={(e)=>{
                            setAnchorEl(e.target)
                            setDisplayData(pedidosNaoEncomendados.data)
                        }} color="primary" >mais detalhes</Button>}
                    </div>
                </Paper>
                <Paper className="cardContainer">
                    <div style={{
                        display: "flex", 
                        flexDirection: "column", 
                        width: "40%"
                    }}>
                        <Typography>Pedidos Atrasados</Typography>
                        <Typography variant="h2">{pedidosAtrasados.data.length}</Typography>
                    </div>
                    <div style={{
                        width: "60%",
                        color: "#A7BF00", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end"
                    }}>
                        <WatchLaterIcon />
                       {pedidosAtrasados.data.length > 0&&  <Button onClick={(e)=>{
                            setAnchorEl(e.target)
                            setDisplayData(pedidosAtrasados.data)
                        }} color="primary" >mais detalhes</Button>}
                    </div>
                </Paper>
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={()=>setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <Table size="small">
                    <TableHead>
                        <TableRow >
                            <TableCell ></TableCell>
                            <TableCell style={{color: "#878787"}} >Data Pedido</TableCell>
                            <TableCell align="center" style={{color: "#878787"}} >Rúbrica</TableCell>
                            <TableCell style={{color: "#878787"}} >Remetente</TableCell>
                            <TableCell style={{color: "#878787"}} >Grupo</TableCell>
                            <TableCell style={{color: "#878787"}} >Empresa</TableCell>
                            <TableCell style={{color: "#878787"}} >Valor Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayData.map((p,i)=>{
                            return (
                                <>
                                    <TableRow key={`pedido_${i}`}>
                                        <TableCell  component="th" scope="row">
                                            <Tooltip title={ p.pedido_feito? `Pedido feito em ${p.pedido_feito_formated_date.substring(0,10)}`: "Este pedido ainda não foi realizado"}>
                                                <StarIcon style={{
                                                    color: p.pedido_feito? "#f1c40f": "#DCDCDC",
                                                    fontSize: 30
                                                }}/>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            {String(p.day).length > 1?p.day: `0${p.day}` }/{String(p.mounth).length > 1?p.mounth: `0${p.mounth}` }/{p.year}
                                        </TableCell>
                                        <TableCell align="center" component="th" scope="row">
                                            <Tooltip title={p.rubrica.name}>
                                                {Rubricas[p.rubrica.icon]()}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            {p.remetente}
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            <Tooltip title={p.grupo.length < 30? "":p.grupo}>
                                                <Typography>
                                                    {p.grupo.length > 30? `${p.grupo.substring(0,30)}...`: p.grupo}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            <Tooltip title={p.empresa.length < 30? "":p.empresa}>
                                                <Typography>
                                                    {p.empresa.length > 30? `${p.empresa.substring(0,30)}...`: p.empresa}
                                                </Typography>
                                            </Tooltip>

                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            {p.valor_total} €
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                        })}
                    </TableBody>
                </Table>
                    
                </Popover>
            </>}
        </div>
    )
}
export default StatsComponent

const LoadingComponent = ()=>{
    return (
       <>
            <Skeleton variant="rect" width={210} height={118} />
            <Skeleton variant="rect" width={210} height={118} />
            <Skeleton variant="rect" width={210} height={118} />
            <Skeleton variant="rect" width={210} height={118} />
            <Skeleton variant="rect" width={210} height={118} />
       </>
    )
}
