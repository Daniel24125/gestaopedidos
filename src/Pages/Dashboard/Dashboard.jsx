import React from 'react'
import StatsComponent from "./StatsComponent"
import AnualRequestesComponent from "./AnualRequestesComponent"
import EmpresasComponent from "./EmpresasComponent"

const Dashboard = () => {
    return (
        <div className="dashboardContainer" >
            <StatsComponent/>
            <AnualRequestesComponent/>
            <EmpresasComponent/>
        </div>
    )
}
export default Dashboard
