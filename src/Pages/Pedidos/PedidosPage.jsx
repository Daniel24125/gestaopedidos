import React from 'react'
import Loading from "../../Components/Loading"
import {Link} from "react-router-dom"
import { Paper,
    Button,
    Typography,
    TableContainer,
    Menu, 
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tooltip, 
    Popover, 
    IconButton, 
    Collapse,
    DialogTitle,
    Dialog,
    DialogActions, 
    DialogContent,
    DialogContentText 

} from '@material-ui/core'
import {
    useGetPedidos
} from "../../Domain/useCases"
import SearchComponent from "./SearchPedidosComponent"

import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckIcon from '@material-ui/icons/Check';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CloseIcon from '@material-ui/icons/Close';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import DescriptionIcon from '@material-ui/icons/Description';
import CommentIcon from '@material-ui/icons/Comment';
import DeletePedido from "./DeletePedidoComponent"

const PedidosPage = () => {
    const [pedidosList, setPedidosList] = React.useState(null);
    const [anchorPedidos, setAnchorPedidos] = React.useState(null);
    const [anchorFaturacao, setAnchorFaturacao] = React.useState(null);
    const [selectedPedido, setSelectedPedido] = React.useState(null);
    const [openCollapsePedido, setOpenCollapsePedido] = React.useState(null);
    const [faturacaoData, setFaturacaoData] = React.useState(null)
    const [showComment, setShowComment] = React.useState(null)
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deletePedido, setDeletePedido] = React.useState(false);

    const Rubricas = {
        "gestures": ()=> <GestureIcon style={{color: "#9b59b6"}}/>, 
        "whatshot":()=>  <WhatshotIcon style={{color: "#e74c3c"}}/>,
        "widget": ()=> <WidgetsIcon style={{color: "#3498db"}}/>,
    }

    const {
        data: pedidos, 
        isFetching: fetchingPedidos, 
        refetch
    } = useGetPedidos()

    React.useEffect(()=>{
        if(!fetchingPedidos){
            setPedidosList(pedidos)
        }
    }, [fetchingPedidos])

    if(fetchingPedidos || !pedidosList) return <Loading msg="A carregar os pedidos" />
    return (
        <>
        {pedidosList.data.length === 0 && <Paper style={{
            padding: "10px 20px",
            width: "calc(100% - 300px)",
            marginTop: 50
        }}>
            <Typography>Sem pedidos para apresentar. <Button component={Link} to="/pedidos/registo" color="primary">registar pedido</Button></Typography>    
        </Paper>}
       {pedidosList.data.length > 0&& <div className="pedidosContainer">
                
            <Dialog onClose={()=>setOpenDelete(false)} aria-labelledby="simple-dialog-title" open={openDelete}>
            <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar o pedido"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    O pedido será apagado permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deletePedido && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeletePedido(true)}}>
                        apagar
                    </Button>}
                    {deletePedido && <DeletePedido
                        refetch={refetch}
                        id={selectedPedido} />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
            <div className="pedidosHeader">
                <Button component={Link} to="/pedidos/registo" color="primary" variant="contained">registar pedido</Button>
                <Paper className="searchContainer">
                    <SearchComponent setPedidosList={setPedidosList} refetch={refetch}/>
                </Paper>
            </div>
            <TableContainer style={{paddingTop: "20px"}} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow >
                            <TableCell ></TableCell>
                            <TableCell style={{color: "#878787"}} >Data Pedido</TableCell>
                            <TableCell style={{color: "#878787"}} >Rúbrica</TableCell>
                            <TableCell style={{color: "#878787"}} >Remetente</TableCell>
                            <TableCell style={{color: "#878787"}} >Grupo</TableCell>
                            <TableCell style={{color: "#878787"}} >Empresa</TableCell>
                            <TableCell style={{color: "#878787"}} >Valor Total</TableCell>
                            <TableCell style={{color: "#878787"}} >Fatura</TableCell>
                            <TableCell ></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidosList.data.map((p,i)=>{
                            return (
                                <>
                                    <TableRow key={`pedido_${i}`}>
                                        <TableCell  component="th" scope="row">
                                            <Tooltip title={ p.pedido_feito? `Pedido feito em ${p.pedido.pedido_feito_formated_date}`: "Este pedido ainda não foi realizado"}>
                                                <StarIcon style={{
                                                    color: p.pedido_feito? "#f1c40f": "#DCDCDC",
                                                    fontSize: 30
                                                }}/>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            {String(p.day).length > 1?p.day: `0${p.day}` }/{String(p.mounth).length > 1?p.mounth: `0${p.mounth}` }/{p.year}
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
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
                                        <TableCell  component="th" scope="row">
                                            {p.fatura.length > 0 && <>
                                                <Tooltip title="Mais informação">
                                                    <IconButton onClick={(e)=>{
                                                        setFaturacaoData(p.fatura)
                                                        setAnchorFaturacao(e.target)
                                                    }}style={{color: "#2ecc71"}}>
                                                        <FileCopyIcon />
                                                    </IconButton> 
                                                </Tooltip> 
                                            </>}
                                            {p.fatura.length === 0 && <>
                                                <Tooltip title="Fatura não entregue">
                                                    <IconButton disabled={true}>
                                                        <FileCopyIcon style={{color: "#dcdcdc"}} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>}
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            <IconButton onClick={(e)=>{
                                                setSelectedPedido(p.id)
                                                setAnchorPedidos(e.target)
                                            }}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key={`Collapse_${i}`}>
                                        <TableCell style={{padding:0 }} colSpan={9}>
                                            <Collapse style={{backgroundColor: "#2d3436"}} in={openCollapsePedido === p.id} timeout="auto" unmountOnExit>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow >
                                                            <TableCell style={{borderColor: "#232323"}}></TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Referência</TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Artigo</TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Quantidade</TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Preço Unitário</TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Preço Total</TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="center">Chegada</TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Guia</TableCell>
                                                            <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="center">Faturado</TableCell>
                                                            <TableCell style={{borderColor: "#232323"}} align="center">
                                                                <IconButton style={{color: "white"}} onClick={()=>{
                                                                    setOpenCollapsePedido(null)
                                                                }}>
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {p.artigos.map(a=>{
                                                            return ( <TableRow key={`artigo_${a.referencia_artigo}`}>
                                                             <TableCell style={{borderColor: "#232323"}} align="right" component="th" scope="row">
                                                                 {a.entrega.chegada && <CheckIcon style={{
                                                                     color: "#2ecc71",
                                                                     fontSize: 20
                                                                 }}/>}
                                                                  {!a.entrega.chegada && <ScheduleIcon style={{
                                                                     color: "#f1c40f",
                                                                     fontSize: 20
                                                                 }}/>}
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                 {a.referencia_artigo}
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                 {a.artigo}
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                 {a.quantidade}
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                {a.preco} €
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                 {a.preco * a.quantidade} €
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323"}}  align="center" component="th" scope="row">
                                                                 <VerifiedUserIcon style={{color: a.entrega.chegada? "#3498db": "#bdc3c7"}}/>
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                {a.entrega.chegada? a.entrega.guia: "ND"}
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323"}} align="center" component="th" scope="row">
                                                                <IconButton style={{color: a.faturado? "#2ecc71" : "#bdc3c7"}}>
                                                                    <DescriptionIcon/>
                                                                </IconButton>
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323"}} align="center" component="th" scope="row"></TableCell>
                                                         </TableRow>)
                                                        })}
                                                    </TableBody>
                                                </Table>
                                                <div className="artigoInfoContainer">
                                                    <Typography> <strong style={{color: "#3498db"}}>Proposta:</strong> {p.proposta}</Typography>
                                                    <Typography> <strong style={{color: "#3498db"}}>NE:</strong> {p.ne}</Typography>
                                                    <Typography> <strong style={{color: "#3498db"}}>Cabimento:</strong> {p.cabimento}</Typography>
                                                    {p.notas !== "" && <Tooltip title="Comentários">
                                                            <IconButton onClick={(e)=>{
                                                                setShowComment(p.id)
                                                            }} color="primary">
                                                                <CommentIcon/>
                                                            </IconButton>
                                                        </Tooltip>}
                                                </div>
                                                <Collapse  in={showComment === p.id} timeout="auto" unmountOnExit>
                                                    <div className="commentContainer">
                                                        {p.notas}
                                                        <Button style={{color: "white"}} onClick={(e)=>{
                                                            setShowComment(false)
                                                        }} >
                                                            fechar
                                                        </Button>
                                                    </div>
                                                </Collapse>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
           
            <Popover 
                open={Boolean(anchorFaturacao)}
                onClose={()=>setAnchorFaturacao(null)}
                anchorEl={anchorFaturacao}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {faturacaoData &&  <>
                    {faturacaoData.length > 0 &&<Table size="small">
                        <TableHead>
                            <TableRow >
                                <TableCell align="right">Data de Emissão</TableCell>
                                <TableCell align="right">Códido</TableCell>
                                <TableCell align="right">Valor</TableCell>
                                <TableCell align="right">Notas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {faturacaoData.map((f,i)=>{
                                return (
                                    <TableRow key={`fatura_${i}`}>
                                            <TableCell align="right">{f.data_emissao}</TableCell>
                                            <TableCell align="right">{f.name}</TableCell>
                                            <TableCell align="right">{f.valor_fatura} €</TableCell>
                                            <TableCell align="right">{f.notas}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>}
                    {faturacaoData.length === 0 && <Typography>Não foram emitidas faturas</Typography>}
                </>}
            </Popover>
            <Menu
                id="pedidos_menu"
                anchorEl={anchorPedidos}
                keepMounted
                open={Boolean(anchorPedidos)}
                onClose={()=>setAnchorPedidos(null)}
            >
                <MenuItem onClick={()=>{
                    setOpenCollapsePedido(selectedPedido)
                    setAnchorPedidos(null)
                }}>MAIS DETALHES</MenuItem>
                <MenuItem onClick={()=>setAnchorPedidos(null)}>FAZER PEDIDO</MenuItem>
                <MenuItem component={Link} to={`/pedidos/edit/${selectedPedido}`} onClick={()=>setAnchorPedidos(null)}>EDITAR</MenuItem>
                <MenuItem onClick={()=>{
                    setAnchorPedidos(null)
                    setOpenDelete(true)
                }}>ELIMINAR</MenuItem>
            </Menu>
        </div>}
        </>
    )
}
export default  PedidosPage

