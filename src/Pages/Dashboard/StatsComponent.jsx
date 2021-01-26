import React from 'react'
import {Button, Paper, Typography} from "@material-ui/core"
import Skeleton from '@material-ui/lab/Skeleton'
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PauseIcon from '@material-ui/icons/Pause';
import DescriptionIcon from '@material-ui/icons/Description';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import WatchLaterIcon from '@material-ui/icons/WatchLater';

import {useGetNumPedidos,
    useQueryPedidos,
    useGetPedidosNaoEncomendados, 
    useGetPedidosAtrasados, 
} from "../../Domain/useCases"

const StatsComponent = () => {
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
                        <Button color="primary" >mais detalhes</Button>
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
                        <Button color="primary" >mais detalhes</Button>
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
                        <Button color="primary" >mais detalhes</Button>
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
                        <Button color="primary" >mais detalhes</Button>
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
                        <Button color="primary" >mais detalhes</Button>
                    </div>
                </Paper>
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
