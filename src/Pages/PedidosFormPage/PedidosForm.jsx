import React from 'react'
import {useParams, Link} from "react-router-dom"
import FormComponent from "../../Components/FormComponent"
import {List , ListItem,FormHelperText, CircularProgress,Button,ListItemText,ListItemSecondaryAction, TextField,  MenuItem, Typography, InputAdornment , IconButton,InputLabel, Input, FormControl, Popover} from "@material-ui/core"
import RubricasComponent from "./RubricasComponent"
import Loading from "../../Components/Loading"
import {useGetGrupos, useGetEmpresasByRubrica} from "../../Domain/useCases"
import SearchArticle from "./SearchArticle"
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import SubmitForm from "./SubmitForm"
import {useSendPedidos, useGetPedidoByID, useEditPedido, useGetRubricasByEmppresa} from "../../Domain/useCases"

const getFormatedNumber = (number)=> String(number).length === 1 ? `0${number}`: number 

const PedidosForm = () => {
    let { id } = useParams();
    const [selectedRubrica, setSelectedRubrica] = React.useState("PM")
    const {
        data: grupos, 
        isFetching: fetchingGrupos
    } = useGetGrupos()
    

    const {
        data: empresas, 
        isFetching: fetchingFornecedores, 
        refetch: refetchRub
    } = useGetEmpresasByRubrica(selectedRubrica)

  

    const {
        data: pedido, 
        isFetching: fetchingPedido
    } = useGetPedidoByID(id)

    const date = new Date()
    const today = `${date.getFullYear()}-${getFormatedNumber(date.getMonth()+1)}-${getFormatedNumber(date.getDate())}`
    const [articlesResult, setArticlesResult] = React.useState([])
    const [articleSearchTerm, setArticlesSearchTerm] = React.useState([])
    const [performSearch, setPerformSearch] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [submitForm, setSubmitForm] = React.useState(false);
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
            quantidade_chegada: 0
        }
    });
    const [tempFatura, setTempFatura] = React.useState({
        name: "", 
        data_emissao: today, 
        notas: 0, 
        valor_fatura: 0, 
       
    });

   
    const [submitData, setSubmitData] = React.useState({})
    
    const [error, setError] = React.useState({
        data_pedido: false, 
        remetente: false,
        empresa: false,
        ne: false,
        proposta: false,
        artigos: false
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
            || fetchingFornecedores
            || fetchingPedido
    }, [fetchingGrupos, 
        fetchingFornecedores,
        fetchingPedido,
    ])
    console.log(empresas)
    React.useEffect(()=>{
        if(!isLoading ){
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
                responsavel:id?  pedido.data.responsavel :  grupos.data[0].membros[0],
                empresa: id? pedido.data.empresa : empresas.data.length > 0? empresas.data[0] : "",
                ne:id?  pedido.data.ne :  "",
                proposta:id?  pedido.data.proposta : "",
                notas:id?  pedido.data.notas: "",
                valor_total:id?  pedido.data.valor_total: "",
                artigos:id?  pedido.data.artigos : [],
                fatura:id?  pedido.data.fatura : [],
                cabimento: id? pedido.data.cabimento : "",
            })
            if(id){
                setSelectedRubrica(pedido.data.rubrica.code)
                refetchRub()
            }
        }
    }, [isLoading, id])
    

  

    if(isLoading || Object.keys(submitData).length=== 0) return <Loading msg="A carregar dados necessários..." />
    if(submitForm)  return <SubmitForm data={submitData}  id={id} submitFunction={id? useEditPedido: useSendPedidos}/>
    return (
        <FormComponent title={id? "Editar Pedido": "Registo de Novo Pedido"}>
           <RubricasComponent 
                submitData={submitData}
                setSubmitData={setSubmitData}
                setSelectedRubrica={setSelectedRubrica}
                refetch={refetchRub}
                empresas={empresas.data}
            />
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
                        responsavel: grupos.data.filter(g=>g.name===e.target.value)[0].membros[0]
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
            
            <TextField
                variant="filled"
                id="empresa"
                required
                error={error.empresa}
                select
                disabled={empresas.data.length === 0 }
                label="Empresa"
                value={submitData.empresa}
                onChange={(e)=>{
                    // if(fetchNE)fetchNE()
                    setSubmitData({
                        ...submitData, 
                        empresa: e.target.value
                    })

                }}
            >
                {empresas.data.map(e=>{
                    return (
                        <MenuItem key={e} value={e}>
                            {e}
                        </MenuItem>
                    )
                    
                })}
            </TextField>
           
            <GetRubricas 
                empresa={submitData.empresa}
                setSubmitData={setSubmitData}
                submitData={submitData}
            />
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

            <div className="formTitleContainer">
                <Typography color="primary" >Adicionar Artigos</Typography>
            </div>

            <FormControl 
                variant="outlined"
                error={error.artigos}
                style={{
                    marginBottom: 40
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
                            O artigo não se encontra na base de dados. <Button color="primary">adicionar artigo</Button>    
                        </Typography>}
                    </div>
                </Popover>
                
                <TextField
                    id="quantidade"
                    label="Quantidade"
                    value={tempArticle.quantidade}
                    onChange={onChangeInputArticle}
                    variant="filled"
                    type="number"
                />
                <TextField
                    id="preco"
                    label="Preço"
                    type="number"
                    value={tempArticle.preco}
                    onChange={onChangeInputArticle}
                    variant="filled"
                />
                <Button disabled={tempArticle.artigo === "" || tempArticle.quantidade === 0 || tempArticle.preco === 0} onClick={()=>{
                    if(tempArticle.quantidade !== 0 && tempArticle.preco !== 0){
                        let tempArtigo = submitData.artigos
                        tempArtigo.push(tempArticle)
                        setSubmitData({
                            ...submitData,
                            artigos: tempArtigo,
                            valor_total: submitData.valor_total + (tempArticle.quantidade * tempArticle.preco)
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
                                quantidade_chegada: 0
                            }
                        })
                        setArticlesSearchTerm("")

                    }
                }} variant="contained" fullWidth>adicionar artigo</Button>
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
            <div className="formTitleContainer">
                <Typography color="primary" >Adicionar Faturas</Typography>
            </div>
            <TextField
                id="name"
                label="Código da Fatura"
                value={tempFatura.name}
                onChange={onChangeInputFatura}
                variant="filled"
            />
            <TextField
                id="data_emissao"
                label="Data de Emissão"
                value={tempFatura.data_emissao}
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={onChangeInputFatura}
                variant="filled"
            />
            <TextField
                id="valor_fatura"
                label="Valor"
                type="number"
                value={tempFatura.valor_fatura}
                onChange={onChangeInputFatura}
                variant="filled"
            />
            <TextField
                id="notas"
                multiline
                rows={4}
                label="Notas"
                value={tempFatura.notas}
                onChange={onChangeInputFatura}
                variant="filled"
            />
            <Button
                variant="contained"
                disabled={tempFatura.name==="" ||tempFatura.data_emissao=== "" || tempFatura.valor_fatura === 0 }
                onClick={()=>{
                    let tempFat = submitData.fatura
                    tempFat.push(tempFatura)
                    setSubmitData({
                        ...submitData,
                        fatura: tempFat
                    })
                    setTempFatura({
                        name: "", 
                        data_emissao: "", 
                        valor_fatura: 0, 
                        notas: "", 
                    })
                }}
            >
                adicionar fatura
            </Button>
            <List dense={true}>
                {
                    submitData.fatura.map((f, index)=>{
                        return (
                            <ListItem style={{
                                background: "#f8e6ff"
                            }} key={"fatura_" + index}>
                                    <ListItemText primary={`${f.name} com o valor de ${f.valor_fatura}€`} secondary={`Emitida a ${f.data_emissao}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={()=>{
                                                let tempFat = submitData.fatura
                                                tempFat.splice(index,1)
                                                setSubmitData({
                                                    ...submitData,
                                                    fatura: tempFat
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

            <Button
                variant="contained"
                color="primary"
                style={{
                    marginTop: 30
                }}
                onClick={()=>onSubmitForm()}
            >
                registar pedido
            </Button>
        </FormComponent>

       
        
    )
}

const GetRubricas = ({
    setSubmitData,
    submitData,
}) =>{
    const {
        data: ne, 
        isFetching: fetchingNE,
        refetch
    } = useGetRubricasByEmppresa(submitData.empresa)

  
    if(fetchingNE) return ""
    return (
        <TextField
            variant="filled"
            id="ne"
            required
            select
            label="Nota de Encomenda"
            value={submitData.ne}
            // helperText={submitData.ne!== "" && ne.data.length > 0 ? `Cabimento: ${empresas.data[submitData.emppresa].cabimento}`: ""}
            onChange={(e)=>{
                setSubmitData({
                    ...submitData, 
                    ne: e.target.value,
                    cabimento: e.target.name
                })
            }}
        >
            {ne.data.filter(nota=>nota.rubrica===submitData.rubrica.code).map(n =>{
                return (
                    <MenuItem name={n.cabimento} key={n.id} value={n.ne}>
                        {n.ne}
                    </MenuItem>
                )
            })}
    </TextField>
    )     
}


export default  PedidosForm

