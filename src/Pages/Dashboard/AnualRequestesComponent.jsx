import React from 'react'
import {useGetPedidosAnual} from "../../Domain/useCases"
import {Bar} from "react-chartjs-2"
import Skeleton from '@material-ui/lab/Skeleton'
import { Typography, Paper} from '@material-ui/core'

const AnualRequestesComponent = () => {
    const [datasets, setDatasets] = React.useState(null)
    const {
        data: pedidosAnual, 
        isFetching: fetchingPedidosAnual
    } = useGetPedidosAnual()
   
  
    React.useEffect(()=>{
        let tempDatasets=[]
        if(!fetchingPedidosAnual){
            Object.keys(pedidosAnual).forEach(group=>{
                tempDatasets.push( {
                    label: group, 
                    data:  Object.values(pedidosAnual[group].data), 
                    backgroundColor: pedidosAnual[group].color,
                    fill: true,
                    borderColor: pedidosAnual[group].color
                })
            })
            setDatasets(tempDatasets)
        }
    }, [fetchingPedidosAnual])
    return (
        <>
            {fetchingPedidosAnual && <LoadingComponent/>}
            {!fetchingPedidosAnual && <Paper style={{
                width: "100%", 
                background: "white", 
                padding: 20
            }}>
                {Object.keys(pedidosAnual).length === 0 && <Typography>Dados não disponíveis. Ainda não foi registado nenhum pedido.</Typography>   }
                {Object.keys(pedidosAnual).length > 0 && <Bar
                    width={100}
                    height={25}
                    data={{
                        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], 
                        datasets: datasets
                    }}
                    options={{
                        tooltips:{
                            enabled: true
                        },
                        elements: {
                            point:{
                                radius: 0
                            }
                        },
                        responsive: true, 
                        
                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        }, 
                        maintainAspectRatio: true,
                        legend:{
                            display: false, 
                            position: "top",
                            align:"center",
                            labels: {
                                fontColor: "white",
                            }
                            
                        },
                       
                        scales:{
                            xAxes: [{
                                display: true,
                                gridLines: {
                                    display: true,
                                    color: "#ecf0f1"
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: `Ano de ${new Date().getFullYear()}`, 
                                    fontColor: "#666"
                                },
                                stacked: true,
                                ticks:{
                                    fontColor: "#666"
                                }
                            }],
                            yAxes: [{
                                display: true,
                                gridLines: {
                                    display: true,
                                    color: "#ecf0f1"
                                },
                                stacked: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Nº de Pedidos', 
                                    fontColor: "#666"
                                },
                                ticks:{
                                    fontColor: "#666"
                                } 
                            }]
                        }
                    }}
                />}
                
            </Paper>}
        </>
    )
}
export default AnualRequestesComponent

const LoadingComponent = ()=>{
    return  <Skeleton variant="rect" width="100%" height={300} />
           
}