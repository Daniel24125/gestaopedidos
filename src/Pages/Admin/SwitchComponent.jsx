import React from 'react'
import { MountTransition } from '../../Components/MountTransition';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import loadable from '@loadable/component'



const SwitchComponent = ()=>{
    const location = useLocation()
    const Dashboard = loadable(() => import('../Dashboard/Dashboard'))
    const Pedidos = loadable(() => import('../Pedidos/PedidosPage'))
    const PedidosForm = loadable(() => import('../PedidosFormPage/PedidosForm'))
    const Dist = loadable(() => import('../Dist/DistPage'))
    const Saldos = loadable(() => import('../Saldos/SaldosPage'))
    const Artigos = loadable(() => import('../ArtigosPage/ArtigosComponent'))
    const GerirGrupos = loadable(() => import('../GerirGrupos/GerirGruposPage'))
    
    return <Switch location={location} key={location.pathname}>
        <Route path="/dashboard" exact render={
          ()=>{
            return <MountTransition>
              <Dashboard />
            </MountTransition>
          }} />
       
        <Route path="/pedidos" exact render={
          ()=>{
            return <MountTransition>
              <Pedidos />
            </MountTransition>
          }} />

          <Route path="/pedidos/registo" exact render={
          ()=>{
            return <MountTransition>
              <PedidosForm />
            </MountTransition>
          }} />
       
       <Route path="/pedidos/edit/:id" exact render={
          ()=>{
            return <MountTransition>
              <PedidosForm />
            </MountTransition>
          }} />
       
        <Route path="/dist" exact render={
          ()=>{
            return <MountTransition>
              <Dist />
            </MountTransition>
          }} />
       
        <Route path="/saldo" exact render={
          ()=>{
            return <MountTransition>
              <Saldos />
            </MountTransition>
          }} />

        <Route path="/artigos" exact render={
          ()=>{
            return <MountTransition>
              <Artigos />
            </MountTransition>
          }} />
       
       <Route path="/gerirGrupos" exact render={
          ()=>{
            return <MountTransition>
              <GerirGrupos />
            </MountTransition>
          }} />

        <Route path="/*" render={() => <Redirect to="/dashboard" />} />
      </Switch>
  }
  export default  SwitchComponent