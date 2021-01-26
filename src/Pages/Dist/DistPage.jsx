import React from 'react'
import Loading from "../../Components/Loading"
import {useGetDist, useGetGrupos} from "../../Domain/useCases"
import {Bar} from "react-chartjs-2"
import { Typography, Paper, Button, Accordion , AccordionSummary, AccordionDetails, Avatar, IconButton, Tooltip} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Link} from "react-router-dom"
 const DistPage = () => {
    const [datasets, setDatasets] = React.useState(null)
    const [membersDatasets, setMembersDatasets] = React.useState(null)
    const {
        data: dist, 
        isFetching: fetchingDist
    } = useGetDist()

    const {
        data: grupos, 
        isFetching: fetchingGrupos
    } = useGetGrupos()

    const isLoading = React.useMemo(() => {
        return  fetchingGrupos || fetchingDist
    }, [fetchingGrupos,fetchingDist])


    React.useEffect(()=>{
        let tempAnualDatasets=[]
        let tempMembersDatasets = {}
        if(!isLoading){
            Object.keys(dist.data).forEach(group=>{
                let orderedDataAnual= []
                
                for (let i = 1; i< 13; i++){
                    orderedDataAnual.push(Number(dist.data[group].anual[`m${i}`]))
                }

                let groupColor= grupos.data.filter(g=>g.abrv=== group)[0].color
                tempMembersDatasets[group] = []
                tempAnualDatasets.push( {
                    label: group, 
                    data:  orderedDataAnual, 
                    backgroundColor: groupColor,
                    fill: true,
                    borderColor: groupColor
                })
                Object.keys(dist.data[group].members).forEach((m, index)=>{
                    let orderedDataMembers= []
                    for (let j = 1; j< 13; j++){
                    orderedDataMembers.push(Number(dist.data[group].members[m][`m${j}`]))
                    }
                    tempMembersDatasets[group].push({
                        label: m, 
                        data: orderedDataMembers, 
                        backgroundColor: groupColor,
                        fill: true,
                        borderColor: groupColor
                    })
                })
            })
            setDatasets(tempAnualDatasets)
            setMembersDatasets(tempMembersDatasets)
        }
    }, [isLoading])

    if(isLoading) return <Loading msg="A carregar dados de distribuição monetária..."/>
    return (
        <div className="distContainer">
            <div className="titleContainer">
                <Typography variant="h6" color="primary" >Distribuição Anual</Typography>
                <Button component={Link} to="/gerirGrupos" variant="contained" color="primary" >gerir grupos</Button>
            </div>
            <Paper className="dataContainer">
                <div className="exportContainer">
                    <Tooltip title="Export data to excel">
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <Bar
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
                                ticks:{
                                    fontColor: "#666"
                                },
                                // stacked: true,
                            }],
                            yAxes: [{
                                display: true,
                                gridLines: {
                                    display: true,
                                    color: "#ecf0f1"
                                },
                                
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Montante gasto (€)', 
                                    fontColor: "#666"
                                },
                                ticks:{
                                    fontColor: "#666"
                                } 
                            }]
                        }
                    }}
                />
            </Paper>
            <div className="titleContainer">
                <Typography variant="h6" color="primary" >Distribuição Anual por Membro</Typography>
            </div>
            {membersDatasets && <>
                {Object.keys(grupos.data).map(g=>{
                    return(<>
                         <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography style={{color: "#2c3e50"}} variant="h6">
                                    {grupos.data[g].abrv} ({Number(dist.data[grupos.data[g].abrv].total)}€)
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%"
                                }}>
                                    <div className="exportContainer">
                                        <Tooltip title="Export data to excel">
                                            <IconButton>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <Bar
                                        width={100}
                                        height={25}
                                        data={{
                                            labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], 
                                            datasets: membersDatasets[grupos.data[g].abrv]
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
                                                    ticks:{
                                                        fontColor: "#666"
                                                    },
                                                    stacked: true,
                                                }],
                                                yAxes: [{
                                                    display: true,
                                                    gridLines: {
                                                        display: true,
                                                        color: "#ecf0f1"
                                                    },
                                                    
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Montante gasto (€)', 
                                                        fontColor: "#666"
                                                    },
                                                    ticks:{
                                                        fontColor: "#666"
                                                    } 
                                                }]
                                            }
                                        }}
                                    />
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </>)
                })}
            </>
            }
        </div>
    )
}
export default DistPage