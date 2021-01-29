import React from 'react'
import {useParams} from "react-router-dom"
import FormComponent from "../../Components/FormComponent"
import {List,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions, ListItem,FormHelperText, CircularProgress,Button,ListItemText,ListItemSecondaryAction, TextField,  MenuItem, Typography, InputAdornment , IconButton,InputLabel, Input, FormControl, Popover, Collapse, Divider} from "@material-ui/core"
import RubricasComponent from "./RubricasComponent"
import Loading from "../../Components/Loading"
import {useGetGrupos, useGetEmpresasByRubrica} from "../../Domain/useCases"
import SearchArticle from "./SearchArticle"
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import SubmitForm from "./SubmitForm"
import {useSendPedidos, useGetPedidoByID, useEditPedido,useGetFaturasByPedido} from "../../Domain/useCases"
import ErrorIcon from '@material-ui/icons/Error';
import SubmitFatura from "./SubmitFatura"
import DeleteFatura from "./DeleteFatura"
import AddArtigo from "./AddArtigo"


const getFormatedNumber = (number)=> String(number).length === 1 ? `0${number}`: number 

const PedidosForm = () => {
    let { id } = useParams();
    const [selectedRubrica, setSelectedRubrica] = React.useState("PM")
    const [fetchEmpresas, setFetchEmpresas] = React.useState(true)
    const [empresasList, setEmpresasList] = React.useState([])

    const {
        data: grupos, 
        isFetching: fetchingGrupos
    } = useGetGrupos()

    const {
        data: faturas, 
        isFetching: fetchingFaturas,
        refetch: refetchFaturas
    } = useGetFaturasByPedido(id)

    const {
        data: pedido, 
        isFetching: fetchingPedido
    } = useGetPedidoByID(id)

    const date = new Date()
    const today = `${date.getFullYear()}-${getFormatedNumber(date.getMonth()+1)}-${getFormatedNumber(date.getDate())}`
    const [articlesResult, setArticlesResult] = React.useState([])
    const [addArtigo, setAddArtigo] = React.useState(false);
    const [addFat, setAddFat] = React.useState(false);
    const [submitFatura, setSubmitFatura] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteFatura, setDeleteFatura] = React.useState(false);
    const [deleteResult, setDeleteResult] = React.useState(null);
    const [selectedFaturaID, setSelectedFaturaID] = React.useState(null);
    const [articleSearchTerm, setArticlesSearchTerm] = React.useState("")
    const [performSearch, setPerformSearch] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [submitForm, setSubmitForm] = React.useState(false);
    const [showAddArtigoForm, setShowAddArtigoForm] = React.useState(false);
    const [addArtigoToDB, setAddArtigoToDB] = React.useState(false);
    
    const [tempArticle, setTempArticle] = React.useState({
        artigo: "", 
        preco: 0, 
        quantidade: 0, 
        referencia_artigo: "", 
        faturado: false,
        entrega: {
            chegada: false, 
            data_chegada: "", 
            guia: "", 
            quantidade: 0
        }
    });
    const [tempFatura, setTempFatura] = React.useState({
        name: "", 
        data_emissao: today, 
        notas: "", 
        valor_fatura: 0, 
       
    });
    const [submitData, setSubmitData] = React.useState({})
    
    const [error, setError] = React.useState({
        data_pedido: false, 
        remetente: false,
        empresa: false,
        ne: false,
        proposta: false,
        artigos: false,
    })
    
    const onChangeInput = (e)=>{
        setSubmitData({
            ...submitData,
            [e.target.id]: e.target.value
        })
        setError({
            ...error, 
            [e.target.id]: false
        })
    }

    const onChangeInputArticle = e=>{
        setTempArticle({
            ...tempArticle,
            [e.target.id]: e.target.value
        })
        setError({
            ...error, 
            artigos: false
        })
    }

    const onChangeInputFatura = e=>{
        setTempFatura({
            ...tempFatura,
            [e.target.id]: e.target.value
        })
    }

    const onSubmitForm = ()=>{
        let tempError = {}
        Object.keys(error).forEach(key=>{
            if(key!== "artigos" && submitData[key] === ""){
                tempError={
                    ...tempError,
                    [key]: true
                }
            }
            else if (key === "artigos" && submitData.artigos.length === 0){
                tempError={
                    ...tempError,
                    [key]: true
                }
            }            
        })
        setError({
            ...error, 
            ...tempError
        })
        if(Object.values(tempError).length === 0){
            setSubmitForm(true)
        }
        
    }

    const isLoading = React.useMemo(() => {
        return  fetchingGrupos 
            || fetchingPedido
            ||fetchingFaturas
    }, [fetchingGrupos, 
        fetchingPedido,
        fetchingFaturas
    ])

    React.useEffect(()=>{
        if(!isLoading){
                setSubmitData({
                    rubrica:id?  pedido.data.rubrica: {
                            code: "PM", 
                            icon: "widget",
                            name: "Materiais"
                    },
                    data_pedido:id?  pedido.data.data_pedido : Date.now(),
                    data_pedido_formated:id?  pedido.data.data_pedido_formated: today,
                    day:id?  pedido.data.day :  date.getDate(),
                    mounth:id?  pedido.data.mounth: date.getMonth()+1,
                    year:id?  pedido.data.year : date.getFullYear(),
                    remetente: id? pedido.data.remetente : "",
                    grupo:id?  pedido.data.grupo : grupos.data[0].name,
                    grupo_abrv:id?  pedido.data.grupo_abrv : grupos.data[0].abrv,
                    grupo_id :id?  pedido.data.grupo_id : grupos.data[0].id,
                    responsavel:id?  pedido.data.responsavel :  grupos.data[0].membros[0],
                    proposta:id?  pedido.data.proposta : "",
                    notas:id?  pedido.data.notas: "",
                    valor_total: id?  pedido.data.valor_total: "",
                    artigos: id?  pedido.data.artigos : [],
                })
                if(id){
                    setSelectedRubrica(pedido.data.rubrica.code)
                }
            }
        }, [isLoading])
        

    if((isLoading || Object.keys(submitData).length=== 0)) return <Loading msg="A carregar dados necessários..." />
    if(submitForm)  return <SubmitForm data={submitData}  id={id} submitFunction={id? useEditPedido: useSendPedidos}/>
    return (
        <FormComponent title={id? "Editar Pedido": "Registo de Novo Pedido"}>
            <Dialog open={addArtigo} onClose={()=>setAddArtigo(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Adicionar Artigo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor preencha todos os dados para adicionar um novo artigo a este pedido
                    </DialogContentText>
                    <FormControl 
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={error.artigos}
                        style={{
                            marginBottom: 20
                        }}
                    > 
                        <InputLabel htmlFor="standard-adornment-password">Pesquisar referência do artigo</InputLabel>
                        <Input
                            id="articleSearch"
                            value={articleSearchTerm}
                            onChange={(e)=>{
                                setArticlesSearchTerm(e.target.value)
                            }}
                            style={{padding: "0px 0px 0px 15px"}}
                            onKeyDown={(e)=>{
                                if(e.key === "Enter"){
                                    if(articleSearchTerm !== "" ) {
                                        setPerformSearch(true)
                                        setAnchorEl(e.target)
                                    }
                                }
                            }}
                            endAdornment={
                            <InputAdornment position="end">
                                <SearchArticle 
                                    term={articleSearchTerm}
                                    setArticlesResult={setArticlesResult}
                                    performSearch={performSearch}
                                    setPerformSearch={setPerformSearch}
                                />
                            <IconButton disabled={performSearch} onClick={(e)=>{
                                    if(articleSearchTerm !== "" ) {
                                        setPerformSearch(true)
                                        setAnchorEl(e.target)
                                    }
                                }
                            } color="primary">
                                <SearchIcon/>
                                </IconButton>
                            </InputAdornment>
                            }
                            />
                            {tempArticle.artigo!== "" && <FormHelperText>Artigo: {tempArticle.artigo}</FormHelperText>}
                        </FormControl>
                        <Popover 
                            id={id}
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={()=>setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <div className="formSearchResultContainer">
                                {performSearch && <CircularProgress />}
                                {!performSearch&& articlesResult.length > 0 &&  <List dense={true}>
                                    {articlesResult.map(a=>{
                                        return (
                                            <ListItem button key={a.id} onClick={()=>{
                                                setAnchorEl(null)
                                                setArticlesSearchTerm(a.code)
                                                setTempArticle({
                                                    ...tempArticle,
                                                    artigo: a.name,
                                                    referencia_artigo: a.code, 
                                                })
                                                
                                            }}>
                                                <ListItemText primary={a.name} secondary={a.code} />
                                            </ListItem>
                                        )
                                    })}
                                    
                                    </List>
                                }
                                {!performSearch&& articlesResult.length === 0 && <Typography style={{
                                    padding: 20
                                }}>
                                    O artigo não se encontra na base de dados. <Button onClick={()=>{
                                        setShowAddArtigoForm(true)
                                        setAnchorEl(null)
                                    }} color="primary">adicionar artigo</Button>    
                                </Typography>}
                            </div>
                        </Popover>
                        
                        <Collapse in={showAddArtigoForm} timeout="auto" unmountOnExit > 
                            <TextField
                                id="artigo"
                                label="Artigo"
                                value={tempArticle.artigo}
                                onChange={onChangeInputArticle}
                                variant="filled"
                                fullWidth
                                margin="normal"
                            />
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end"
                                }}
                            >
                            
                                {!addArtigoToDB && <Button disabled={tempArticle.artigo === "" || articleSearchTerm=== ""} onClick={()=>{
                                    setAddArtigoToDB(true)
                                }} color="primary">guardar</Button>}
                                {addArtigoToDB && <AddArtigo
                                    setAddArtigoToDB={setAddArtigoToDB}
                                    setTempArticle={setTempArticle}
                                    setShowAddArtigoForm={setShowAddArtigoForm}
                                    tempArticle={tempArticle}
                                    artigo={{
                                        code: articleSearchTerm,
                                        name: tempArticle.artigo
                                    }}
                                />}
                            </div>

                        </Collapse>


                <TextField
                    id="quantidade"
                    label="Quantidade"
                    value={tempArticle.quantidade}
                    onChange={onChangeInputArticle}
                    variant="filled"
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    id="preco"
                    label="Preço"
                    type="number"
                    value={tempArticle.preco}
                    onChange={onChangeInputArticle}
                    variant="filled"
                    fullWidth
                    margin="normal"
                />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setAddArtigo(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button disabled={tempArticle.artigo === "" || tempArticle.quantidade === 0 || tempArticle.preco === 0} onClick={()=>{
                            if(tempArticle.quantidade !== 0 && tempArticle.preco !== 0){
                                let tempArtigo = submitData.artigos
                                tempArtigo.push(tempArticle)
                                setSubmitData({
                                    ...submitData,
                                    artigos: tempArtigo,
                                    valor_total: Number(submitData.valor_total) + Number(tempArticle.quantidade * tempArticle.preco)
                                })
                                setTempArticle({
                                    artigo: "", 
                                    preco: 0, 
                                    quantidade: 0, 
                                    referencia_artigo: "", 
                                    faturado: false,
                                    entrega: {
                                        chegada: false, 
                                        data_chegada: "", 
                                        guia: "", 
                                        quantidade: 0
                                    }
                                })
                                setArticlesSearchTerm("")
                                setAddArtigo(false)
                            }
                        }} >adicionar</Button>
                                
                </DialogActions>
            </Dialog>
            
           {id && <Dialog open={addFat} onClose={()=>setAddFat(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Adicionar Fatura</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor preencha todos os dados para adicionar uma nova fatura
                    </DialogContentText>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="name"
                        label="Código da Fatura"
                        value={tempFatura.name}
                        onChange={onChangeInputFatura}
                        variant="filled"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="data_emissao"
                        label="Data de Emissão"
                        value={tempFatura.data_emissao.substring(0,10)}
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e)=>{
                            const selectedDate = new Date(e.target.value)
                            setTempFatura({
                                ...tempFatura, 
                                data_emissao: selectedDate.toJSON(),
                                data_emissao_timestamp: selectedDate.getTime()
                            })
                        }}
                        variant="filled"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="valor_fatura"
                        label="Valor"
                        type="number"
                        value={tempFatura.valor_fatura}
                        onChange={onChangeInputFatura}
                        variant="filled"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="notas"
                        multiline
                        rows={4}
                        label="Notas"
                        value={tempFatura.notas}
                        onChange={onChangeInputFatura}
                        variant="filled"
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setAddFat(false)} color="primary">
                            Cancelar
                        </Button>
                       {submitFatura&& <SubmitFatura
                            fatura={{
                                ...tempFatura,
                                pedido: id
                            }}
                            setSubmitFatura={setSubmitFatura}
                            refetchFaturas={refetchFaturas}
                            setAddFat={setAddFat}
                            setTempFatura={setTempFatura}
                        />}
                        {!submitFatura && <Button
                            disabled={tempFatura.name==="" ||tempFatura.data_emissao=== "" || tempFatura.valor_fatura === 0 }
                            onClick={()=>{
                                setSubmitFatura(true)
                            }}
                        >
                            adicionar fatura
                        </Button>}
                                
                </DialogActions>
            </Dialog>}

            <Dialog onClose={()=>{
                setOpenDelete(false)
                setDeleteResult(null)
            }} aria-labelledby="simple-dialog-title" open={openDelete}>
                <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar a fatura"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        A fatura será apagada permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deleteFatura && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeleteFatura(true)}}>
                        apagar
                    </Button>}
                    {deleteFatura && <DeleteFatura
                        id={selectedFaturaID} 
                        setDeleteResult={setDeleteResult}
                        setOpenDelete={setOpenDelete}
                        refetch={refetchFaturas}
                        setDeleteFatura={setDeleteFatura}
                        />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
            
            <div style={{display: "flex"}}>
                <RubricasComponent 
                        submitData={submitData}
                        setSubmitData={setSubmitData}
                        setSelectedRubrica={setSelectedRubrica}
                        setFetchEmpresas={setFetchEmpresas}
                    />

                    {fetchEmpresas && <FetchEmpresasByRubrica 
                        setFetchEmpresas={setFetchEmpresas}
                        setSubmitData={setSubmitData}
                        submitData={submitData}
                        selectedRubrica={selectedRubrica}
                        setEmpresasList={setEmpresasList}
                        id={id}
                        pedido={pedido}
                    />}
            </div>
            {empresasList.length === 0 && <Typography style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 30
                }} color="error">
                    <ErrorIcon/>
                    Não existem notas de encomenda para a rúbirca selecionada    
                </Typography>}
            
           <TextField
                id="data_pedido"
                label="Data do Pedido"
                type="date"
                error={error.data_pedido}
                required
                variant="filled"
                InputLabelProps={{
                    shrink: true,
                }}
                value={submitData.data_pedido_formated}
                onChange={(e)=>{
                    const selectedDate = new Date(e.target.value)
                    setSubmitData({
                        ...submitData,
                        data_pedido_formated: e.target.value,
                        data_pedido: selectedDate.getTime(), 
                        day: selectedDate.getDate(), 
                        mounth: selectedDate.getMonth()+1,
                        year: selectedDate.getFullYear(),
                    })
                }}
            />

            <TextField
                error={error.remetente}
                required
                id="remetente"
                label="Remetente"
                value={submitData.remetente}
                onChange={onChangeInput}
                variant="filled"
            />
            <TextField
                id="grupo"
                variant="filled"
                select
                label="Grupo"
                value={submitData.grupo}
                onChange={(e)=>{
                    setSubmitData({
                        ...submitData, 
                        grupo: e.target.value,
                        grupo_abrv: grupos.data.filter(g=>g.name===e.target.value)[0].abrv,
                        grupo_id: grupos.data.filter(g=>g.name===e.target.value)[0].id,
                        responsavel: grupos.data.filter(g=>g.name===e.target.value)[0].membros[0],
                    })
                }}
            >
                {grupos.data.map(g=>{
                    return (
                        <MenuItem  key={g.name} value={g.name}>
                            {g.name}
                        </MenuItem>
                    )
                })}
            </TextField>
            
            {submitData.grupo && <TextField
                id="responsavel"
                variant="filled"
                select
                label="Responsável"
                value={submitData.responsavel}
                onChange={(e)=>{
                    setSubmitData({
                        ...submitData, 
                        responsavel: e.target.value
                    })
                }}
            >
                {grupos.data.filter(g=>g.name===submitData.grupo)[0].membros.map(m=>{
                    return (
                        <MenuItem key={m} value={m}>
                            {m}
                        </MenuItem>
                    )
                })}
            </TextField>}
            
           {submitData.empresa && <TextField
                variant="filled"
                id="empresa"
                required
                error={error.empresa}
                select
                disabled={empresasList.length === 0}
                label="Empresa"
                value={submitData.empresa}
                onChange={(e)=>{
                    setSubmitData({
                        ...submitData, 
                        empresa: e.target.value, 
                        empresa_id:  empresasList.filter(n=>n.empresa===e.target.value)[0].id,
                        ne: empresasList.filter(n=>n.empresa===e.target.value)[0].ne,
                        ne_id: empresasList.filter(n=>n.empresa===e.target.value)[0].id,
                        cabimento: empresasList.filter(n=>n.empresa===e.target.value)[0].cabimento
                    })
                }}
            >
                {[...new Set(empresasList.map(e=>e.empresa))].map(e=>{
                    return (
                        <MenuItem key={e} value={e}>
                            {e}
                        </MenuItem>
                    )
                })}
            </TextField>}
           
             {submitData.ne && <TextField
                variant="filled"
                id="ne"
                required
                disabled={empresasList.length === 0}
                select
                label="Nota de Encomenda"
                value={submitData.ne}
                helperText={submitData.ne !== "" && empresasList.length > 0 ? `Saldo disponível: ${empresasList.filter(e=> e.ne === submitData.ne)[0].saldo_disponivel}€`: ""}
                onChange={(evt, name)=>{
                    setSubmitData({
                        ...submitData, 
                        ne: evt.target.value,
                        cabimento: name.props.name,
                        ne_id: name.key.substring(2,name.key.length)
                    })
                }}
            >
                {empresasList.filter(n=>n.empresa===submitData.empresa).map(n =>{
                    
                    return (
                        <MenuItem id={n.id} name={n.cabimento} key={n.id} value={n.ne}>
                            {n.ne}
                        </MenuItem>
                    )
                })}
            </TextField>}

            <TextField
                required
                error={error.proposta}
                id="proposta"
                label="Proposta"
                value={submitData.proposta}
                onChange={onChangeInput}
                variant="filled"
            />
            
            <TextField
                id="notas"
                label="Notas"
                value={submitData.notas}
                onChange={onChangeInput}
                multiline
                rows={4}
                variant="filled"
            />

            <Button onClick={()=>setAddArtigo(true)}>adicionar artigo</Button>
            
            <List dense={true}>
                {
                    submitData.artigos.map((a, index)=>{
                        return (
                            <ListItem style={{
                                background: "#D1E9FF"
                            }} key={"artigo_" + a.id}>
                                    <ListItemText primary={`${a.quantidade} unidade(s) de ${a.artigo}`} secondary={`${a.referencia_artigo} -  ${a.preco*a.quantidade} €`} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={()=>{
                                                let tempArtigo = submitData.artigos
                                                tempArtigo.splice(index,1)
                                                setSubmitData({
                                   
                                                    ...submitData,
                                                    artigos: tempArtigo,
                                                    valor_total: submitData.valor_total - (a.preco*a.quantidade)
                                                })
                                        }} style={{color: "#e74c3c"}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })
                }
            </List>
            
           {id && <Button color="error" onClick={()=>setAddFat(true)}>adicionar fatura</Button>}

           {id && <List dense={true}>
                {
                    faturas.data.map((f, index)=>{
                        return (
                            <ListItem style={{
                                background: "#f8e6ff"
                            }} key={"fatura_" + f.id}>
                                    <ListItemText primary={`${f.name} com o valor de ${f.valor_fatura}€`} secondary={`Emitida a ${f.data_emissao.substring(0,10)}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={()=>{
                                                setOpenDelete(true)
                                                setSelectedFaturaID(f.id) 
                                        }} style={{color: "#e74c3c"}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })
                }
            </List>}

            {empresasList.length > 0 && !id &&<>
                {Number(empresasList.filter(e=> e.ne === submitData.ne)[0].saldo_disponivel) < submitData.valor_total && <Typography color="error">
                    A nota de encomenda selecionada não tem saldo suficiente
                </Typography>}
            </>}

            

            <Button
                variant="contained"
                color="primary"
                style={{
                    marginTop: 30
                }}
                onClick={()=>onSubmitForm()}
                disabled={
                    !id? empresasList.length > 0? Number(empresasList.filter(e=> e.ne === submitData.ne)[0].saldo_disponivel) < Number(submitData.valor_total) : true: false
                }
            >
                Submeter
            </Button>
        </FormComponent>

       
        
    )
}

const FetchEmpresasByRubrica = ({
    setFetchEmpresas,
    setSubmitData,
    submitData,
    selectedRubrica,
    setEmpresasList,
    id,
    pedido
})=>{
    const {
        data: empresas, 
        isFetching: fetchingEmpresas, 
    } = useGetEmpresasByRubrica(selectedRubrica)
 
    React.useEffect(()=>{
        if(!fetchingEmpresas){    
            setSubmitData({
                ...submitData, 
                empresa: id? pedido.data.empresa :empresas.data.length > 0?empresas.data[0].empresa : "",
                ne: id? pedido.data.ne :empresas.data.length > 0? empresas.data[0].ne: "",
                cabimento: id? pedido.data.cabimento :empresas.data.length > 0? empresas.data[0].cabimento: "",
                ne_id: id? pedido.data.ne_id :empresas.data.length > 0? empresas.data[0].id: ""
            })
            setEmpresasList(empresas.data)
            setFetchEmpresas(false)
        }
    },[fetchingEmpresas])
    return <CircularProgress color="primary" />
}

export default  PedidosForm

