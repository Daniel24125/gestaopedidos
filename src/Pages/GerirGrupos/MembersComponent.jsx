import React from 'react'
import {useGetGrupoMembros} from "../../Domain/useCases"
import {Typography, IconButton,CircularProgress, List, ListItem,ListItemText, ListItemIcon} from "@material-ui/core"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloseIcon from '@material-ui/icons/Close';
import {Bar} from "react-chartjs-2"
import RandomColor from "randomcolor"

const MembersComponent = ({
    id,
    setCollapse,
    selectedYear
}) => {
    const [membersDatasets, setMemberDataset] = React.useState([])
    const {
        data: membros, 
        isFetching: grupoMembrosFetching
    } = useGetGrupoMembros(id)

    console.log(selectedYear)

    React.useEffect(()=>{
        let tempMembersDatasets=[]
            if(!grupoMembrosFetching){
            membros.data.forEach(m=>{
                const orderedDataMembers = []
                const rc = RandomColor()
                // const currentMembroDist = m.dist.filter(d=>d.year=== selectedYear)[0]

                for (let j = 1; j< 13; j++){
                    orderedDataMembers.push(Number(m[selectedYear][`m${j}`]))
                }
                tempMembersDatasets.push({
                    label: m.name, 
                    data: orderedDataMembers, 
                    backgroundColor: rc,
                    fill: true,
                    borderColor: rc
                })
            })
            
            setMemberDataset(tempMembersDatasets)
        }
    }, [grupoMembrosFetching, selectedYear])

    if (grupoMembrosFetching) 
    return <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "20px"
    }}>
        <CircularProgress />
    </div>

    return (
         <div className="groupDetailsContainer">
            <div className="titleContainer">
                <Typography >Distribuição Monetária Anual</Typography>
                <IconButton onClick={()=>setCollapse(null)}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className="graphContainer">
                <Bar
                    width={80}
                    height={25}
                    data={{
                        labels: ["Jan", "Fev", "Março", "Abril", "Maio", "Junho", "Julho", "Ag", "Set", "Out", "Nov", "Dez"], 
                        datasets: membersDatasets? membersDatasets: []
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
            <div className="titleContainer">
                <Typography color="primary">Membros do Grupo</Typography>
            </div>
            <List style={{paddingLeft: 20}} component="div" >
                {membros.data.map(m=>{
                    return (
                        <ListItem key={m.id}>
                            <ListItemIcon >
                                <AccountCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={m.name} />
                        </ListItem>
                    )
                })}
            </List>
        </div>
    )
}
export default MembersComponent