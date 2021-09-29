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
    DialogContentText, 
    Toolbar,
    TextField,
    Checkbox ,
    CircularProgress
} from '@material-ui/core'
import {
    useGetPedidos,
    useGetFornecedores
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
import GetFaturasPedido from "./GetFaturasPedido"
import DownloadPDF from "./DownloadPDF"
import ChangeArtigosState from "./ChangeArtigosStatus"
import FaturarArtigos from "./FaturarArtigos"
import BuildIcon from '@material-ui/icons/Build';
import GetAppIcon from '@material-ui/icons/GetApp';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';

const PedidosPage = () => {
    const [pedidosList, setPedidosList] = React.useState(null);
    const [anchorPedidos, setAnchorPedidos] = React.useState(null);
    const [anchorFaturacao, setAnchorFaturacao] = React.useState(null);
    const [selectedPedido, setSelectedPedido] = React.useState(null);
    const [selectedPedidoData, setSelectedPedidoData] = React.useState(null);
    const [openCollapsePedido, setOpenCollapsePedido] = React.useState(null);
    const [showComment, setShowComment] = React.useState(null)
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deletePedido, setDeletePedido] = React.useState(false);
    const [fazerPedido, setFazerPedido] = React.useState(false)
    const [isRefetch, setIsRefetch] = React.useState(false)
    const [tempChegadaData, setTempChegadaData] = React.useState({
        guia: "",
        quantidade: 0
    })
    const [openArtigoChegadaForm, setOpenArtigoChegadaForm] = React.useState(false)
    const [chegadaArtigosState, setChegadaArtigosState] = React.useState(false)
    const [selectedArtigoIndex, setSelectedArtigoIndex] = React.useState(0)
    const [maxArtigo, setMaxArtigo] = React.useState(0)
    const [changeArtigoFaturado, setChangeArtigoFaturado] = React.useState(false)
    const [artigoFaturado, setArtigoFaturado] = React.useState(false)
    const [showExport, setShowExport] = React.useState(false)
    const [selectedPedidos, setSelectedPedidos] = React.useState({})
    const [selectedExportMethod, setSelectedExportMethod] = React.useState(null)
    const [anchorOptions, setAnchorOptions] = React.useState(null)


    const Rubricas = {
        "gestures": ()=> <GestureIcon style={{color: "#9b59b6"}}/>, 
        "whatshot":()=>  <WhatshotIcon style={{color: "#e74c3c"}}/>,
        "widget": ()=> <WidgetsIcon style={{color: "#3498db"}}/>,
        "build": ()=> <BuildIcon style={{color: "#f39c12"}}/>,
    }

    const {
        data: pedidos, 
        isFetching: fetchingPedidos, 
        refetch
    } = useGetPedidos()


    const {
        data: empresas, 
        isFetching: fetchingEmpresas, 
    } = useGetFornecedores()

    React.useEffect(()=>{
        if(!fetchingPedidos && !fetchingEmpresas){
            setIsRefetch(false)
            setPedidosList(pedidos)
        }
    }, [fetchingPedidos,fetchingEmpresas])

    if((fetchingPedidos || !pedidosList) && !isRefetch) return <Loading msg="A carregar os pedidos" />

    return (
        <>
        {changeArtigoFaturado  && <FaturarArtigos
            pedidoID={selectedPedido}
            index={selectedArtigoIndex}
            faturado={artigoFaturado}
            setChangeArtigoFaturado={setChangeArtigoFaturado}
        />}

        {chegadaArtigosState && <ChangeArtigosState
            pedidoID={selectedPedido}
            index={selectedArtigoIndex}
            chegada_data={tempChegadaData}
            refetch={refetch}
            setChegadaArtigosState={setChegadaArtigosState}
            openArtigoChegadaForm={setOpenArtigoChegadaForm}
            setRefetch={setIsRefetch}
        />}
        {pedidosList.data.length === 0 && <Paper style={{
            padding: "10px 20px",
            width: "calc(100% - 300px)",
            marginTop: 50
        }}>
            <Typography>Sem pedidos para apresentar. <Button component={Link} to="/pedidos/registo" color="primary">registar pedido</Button></Typography>    
        </Paper>}
       {pedidosList.data.length > 0 && <div className="pedidosContainer">
            
            
            <Dialog open={openArtigoChegadaForm} onClose={()=>setOpenArtigoChegadaForm(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Chegada de artigo</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Preencha todos os campos para notificar a chegada do artigo
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="normal"
                    id="guia"
                    label="Guia de Remessa"
                    fullWidth
                    value={tempChegadaData.guia}
                    onChange={(e)=>{
                        setTempChegadaData({
                            ...tempChegadaData,
                            guia: e.target.value
                        })
                    }}
                />
                 <TextField
                    autoFocus
                    margin="normal"
                    id="quantidade"
                    label="Quantidade"
                    type="number"
                    inputProps={{ min: "0", max: maxArtigo}}
                    fullWidth
                    onBlur={(e)=>{
                        if(e.target.value > maxArtigo) setTempChegadaData({...tempChegadaData, quantidade: maxArtigo})
                    }}
                    value={tempChegadaData.quantidade}
                    helperText={`Chegaram: ${tempChegadaData.quantidade}/${maxArtigo}`}
                    onChange={(e)=>{
                        setTempChegadaData({
                            ...tempChegadaData,
                            quantidade: Number(e.target.value)
                        })
                    }}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>setOpenArtigoChegadaForm(false)}>
                    Cancel
                </Button>
                
               {!chegadaArtigosState &&  <Button disabled={tempChegadaData.guia === ""|| tempChegadaData.quantidade===0} onClick={()=>{
                    if(tempChegadaData.guia !== "" &&  tempChegadaData.quantidade > 0){
                        setChegadaArtigosState(true)
                        setOpenArtigoChegadaForm(false)
                    }
                }} color="primary">
                    submeter
                </Button>}
                </DialogActions>
            </Dialog> 
            <Dialog open={openDelete}  onClose={()=>{
                setOpenDelete(false)
            }} aria-labelledby="simple-dialog-title">
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
                        id={selectedPedido} 
                        setOpenDelete={setOpenDelete}
                        setDeletePedido={setDeletePedido}
                        refetch={refetch}
                        />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
            <Paper className="pedidosHeader">
                <div className="searchContainer">
                    <SearchComponent setPedidosList={setPedidosList} refetch={refetch}/>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    {Object.keys(selectedPedidos).filter(p=>selectedPedidos[p]).length > 0&&<>
                        
                        {fazerPedido && <DownloadPDF
                            type={selectedExportMethod}
                            setFazerPedido={setFazerPedido}
                            refecth={refetch}
                            setIsRefetch={setIsRefetch}
                            pedidoID={Object.keys(selectedPedidos).filter(p=>selectedPedidos[p])}
                        /> }
                     { !fazerPedido &&  <Tooltip title="Download">
                            <IconButton onClick={()=>setFazerPedido(true)}>
                                <GetAppIcon/>
                            </IconButton>
                        </Tooltip>}
                        <Typography color="primary">{Object.keys(selectedPedidos).filter(p=>selectedPedidos[p]).length} pedidos selecionados </Typography>
                        <Tooltip title="Remover todos">
                            <IconButton  onClick={()=>setSelectedPedidos({})}>
                                <IndeterminateCheckBoxIcon/>
                            </IconButton>
                        </Tooltip>
                        
                    </>}
                  
                   {Object.keys(selectedPedidos).filter(p=>selectedPedidos[p]).length === 0&& <Button component={Link} to="/pedidos/registo" color="primary" variant="contained">registar pedido</Button>}
                  {!showExport &&  <IconButton onClick={(e)=>{
                       setAnchorOptions(e.target)
                    }}>
                        <MoreVertIcon />
                    </IconButton>}
                    {showExport && <Tooltip title="Cancelar">
                            <IconButton  onClick={()=>{
                                setSelectedPedidos({})
                                setShowExport(false)
                            }}>
                                <CancelIcon/>
                            </IconButton>
                        </Tooltip>}
                </div>
            </Paper>
            <TableContainer style={{paddingTop: "20px"}} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow >
                            {/* {showSelectPedidos && <TableCell ></TableCell>} */}
                            <TableCell ></TableCell>
                            <TableCell ></TableCell>
                            <TableCell style={{color: "#878787"}} >ID Pedido</TableCell>
                            <TableCell style={{color: "#878787"}} >Data Pedido</TableCell>
                            <TableCell align="center" style={{color: "#878787"}} >Rúbrica</TableCell>
                            {/* <TableCell style={{color: "#878787"}} >Remetente</TableCell> */}
                            <TableCell style={{color: "#878787"}} >Grupo</TableCell>
                            <TableCell style={{color: "#878787"}} >Empresa</TableCell>
                            <TableCell style={{color: "#878787"}} >Valor Total s/ IVA</TableCell>
                            <TableCell style={{color: "#878787"}} >Fatura</TableCell>
                            <TableCell ></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidosList.data.sort((a,b)=>b.data_pedido-a.data_pedido).map((p,i)=>{
                            return (
                                <>
                                    <TableRow key={`pedido_${i}`}>
                                        <TableCell padding="checkbox">
                                           {showExport &&  <Checkbox
                                                color="primary"
                                                checked={Boolean(selectedPedidos[p.id])}
                                                onChange={(e)=>{
                                                    setSelectedPedidos({
                                                        ...selectedPedidos, 
                                                        [p.id]: e.target.checked
                                                    })                                                    
                                                }}
                                            />}
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            {!fazerPedido && <Tooltip title={ p.pedido_feito? `Pedido feito em ${p.pedido_feito_formated_date.substring(0,10)}`: "Este pedido ainda não foi realizado"}>
                                                <StarIcon style={{
                                                    color: p.pedido_feito? "#f1c40f": "#DCDCDC",
                                                    fontSize: 30
                                                }}/>
                                            </Tooltip>}
                                            {fazerPedido && selectedPedido === p.id && <CircularProgress size={30} />}
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            {p.pedido_id}
                                        </TableCell>      
                                        <TableCell  component="th" scope="row">
                                            {String(p.day).length > 1?p.day: `0${p.day}` }/{String(p.mounth).length > 1?p.mounth: `0${p.mounth}` }/{p.year}
                                        </TableCell>
                                        <TableCell align="center" component="th" scope="row">
                                            <Tooltip title={p.rubrica.name}>
                                                {Rubricas[p.rubrica.icon]()}
                                            </Tooltip>
                                        </TableCell>
                                        {/* <TableCell  component="th" scope="row">
                                            {p.remetente}
                                        </TableCell> */}
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
                                            {Number(p.valor_total).toFixed(2)} €
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            <Tooltip title="Ver faturas">
                                                <IconButton onClick={(e)=>{
                                                    setAnchorFaturacao(e.target)
                                                    setSelectedPedido(p.id)
                                                }}style={{color: "#2ecc71"}}>
                                                    <FileCopyIcon />
                                                </IconButton> 
                                            </Tooltip> 
                                        </TableCell>
                                        <TableCell  component="th" scope="row">
                                            <IconButton onClick={(e)=>{
                                                setSelectedPedido(p.id)
                                                setAnchorPedidos(e.target)
                                                setSelectedPedidoData(p)
                                            }}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key={`Collapse_${i}`}>
                                        <TableCell style={{padding:0 }} colSpan={12}>
                                            <Collapse style={{backgroundColor: "#2d3436", padding: "0 30px"}} in={openCollapsePedido === p.id} timeout="auto" unmountOnExit>
                                                <div style={{
                                                    display: "flex",
                                                    width: "100%",
                                                    justifyContent: "flex-end"
                                                }}>
                                                <IconButton style={{color: "white"}} onClick={()=>{
                                                    setOpenCollapsePedido(null)
                                                }}>
                                                    <CloseIcon />
                                                </IconButton>
                                                </div>
                                                
                                                <Toolbar style={{color: "white"}}>
                                                    <Typography variant="h5">Lista Completa de Artigos</Typography>
                                                </Toolbar>
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
                                                           
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {p.artigos.map((a,index_artigos)=>{
                                                            return ( <TableRow key={`artigo_${a.referencia_artigo}`}>
                                                             <TableCell style={{borderColor: "#232323"}} align="right" component="th" scope="row">
                                                                 {a.entrega.chegada && Number(a.quantidade) === Number(a.entrega.quantidade)  && <CheckIcon style={{
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
                                                                {Number(a.preco).toFixed(2)} €
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                 {Number(a.preco * a.quantidade).toFixed(2)} €
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323"}}  align="center" component="th" scope="row">
                                                                {!chegadaArtigosState && !a.entrega.chegada && <Tooltip title="Chegada de artigo">
                                                                    <IconButton onClick={()=>{
                                                                        setSelectedArtigoIndex(index_artigos)
                                                                        setSelectedPedido(p.id)
                                                                        setOpenArtigoChegadaForm(true)
                                                                        setMaxArtigo(a.quantidade)
                                                                    }}>
                                                                        <VerifiedUserIcon style={{color: "#bdc3c7"}}/>
                                                                    </IconButton>
                                                                 </Tooltip>}
                                                                 {a.entrega.chegada && Number(a.quantidade) === Number(a.entrega.quantidade) &&
                                                                 <Tooltip title="Chegaram todos os artigos">
                                                                     <VerifiedUserIcon style={{color: "#2980b9"}}/>
                                                                 </Tooltip>
                                                                 }
                                                                 {!chegadaArtigosState && Number(a.entrega.quantidade) > 0 && Number(a.entrega.quantidade) < a.quantidade && <Tooltip title={`Chegaram ${a.entrega.quantidade}/${a.quantidade}`}>
                                                                    <IconButton onClick={()=>{
                                                                        setSelectedArtigoIndex(index_artigos)
                                                                        setSelectedPedido(p.id)
                                                                        setOpenArtigoChegadaForm(true)
                                                                        setMaxArtigo(a.quantidade)
                                                                    }}>
                                                                        <VerifiedUserIcon style={{color: "#e67e22"}}/>
                                                                    </IconButton>
                                                                 </Tooltip>}
                                                                 {chegadaArtigosState && <CircularProgress size={30} />}    
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                {a.entrega.chegada? a.entrega.guia: "ND"}
                                                             </TableCell>
                                                             <TableCell style={{borderColor: "#232323"}} align="center" component="th" scope="row">
                                                                <IconButton className={ a.faturado? "faturado": "naoFaturado"} onClick={(e)=>{

                                                                    setArtigoFaturado(!a.faturado)
                                                                    setChangeArtigoFaturado(true)
                                                                    setSelectedArtigoIndex(index_artigos)
                                                                    setSelectedPedido(p.id)
                                                                    let tempPedidos = pedidosList.data
                                                                    tempPedidos[i].artigos[index_artigos].faturado = !a.faturado
                                                                    setPedidosList({data: tempPedidos})
                                                                }} >
                                                                    <DescriptionIcon />
                                                                </IconButton>
                                                             </TableCell>
                                                         </TableRow>)
                                                        })}
                                                    </TableBody>
                                                </Table>
                                                <Toolbar  style={{color: "white"}}>
                                                    <Typography variant="h5">Lista de Remetentes</Typography>
                                                </Toolbar>
                                                {Object.keys(p.remetentes).map(r=>{
                                                    return (<>
                                                        <Toolbar style={{color: "white"}}>
                                                            <Typography>{r} {p.remetentes[r].proposta? ` - Proposta: ${p.remetentes[r].proposta}`: ""}</Typography>
                                                        </Toolbar>
                                                        <Table key={r} size="small">
                                                        <TableHead>
                                                            <TableRow >
                                                                <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Referência</TableCell>
                                                                <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Artigo</TableCell>
                                                                <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Quantidade</TableCell>
                                                                <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Preço Unitário</TableCell>
                                                                <TableCell style={{borderColor: "#232323",color: "#3498db"}} align="right">Preço Total</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {p.remetentes[r].artigos.map((a,index_artigos)=>{
                                                                return ( <TableRow key={`artigo_${a.referencia_artigo}`}>
                                                                
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
                                                                    {Number(a.preco).toFixed(2)} €
                                                                </TableCell>
                                                                <TableCell style={{borderColor: "#232323",color: "white"}}  align="right" component="th" scope="row">
                                                                    {Number(a.preco * a.quantidade).toFixed(2)} €
                                                                </TableCell>
                                                                
                                                            </TableRow>)
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </>)
                                                })}
                                                <div className="artigoInfoContainer">
                                                    {p.proposta && <Typography> <strong style={{color: "#3498db"}}>Proposta:</strong> {p.proposta}</Typography>}
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
                <GetFaturasPedido 
                    pedidoID={selectedPedido}
                />
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
               
                <MenuItem component={Link} to={`/pedidos/edit/${selectedPedido}`} onClick={()=>setAnchorPedidos(null)}>EDITAR</MenuItem>
                <MenuItem onClick={()=>{
                    setAnchorPedidos(null)
                    setOpenDelete(true)
                }}>ELIMINAR</MenuItem>
            </Menu>
            <Menu
                id="options"
                anchorEl={anchorOptions}
                keepMounted
                open={Boolean(anchorOptions)}
                onClose={()=>setAnchorOptions(null)}
            >
                <MenuItem onClick={()=>{
                    setSelectedExportMethod("excel")
                    setAnchorOptions(null)
                    setShowExport(true)
                }}>EXPORTAR DADOS PARA EXCEL</MenuItem>
                <MenuItem onClick={()=>{
                    setSelectedExportMethod("pdf")
                    setAnchorOptions(null)
                    setShowExport(true)
                }}>FAZER PEDIDO</MenuItem>
            </Menu>
        </div>}
        </>
    )
}
export default  PedidosPage

