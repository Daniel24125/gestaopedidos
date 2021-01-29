import React from 'react'
import {useGetArtigos} from "../../Domain/useCases"
import Loading from "../../Components/Loading"
import {List, Paper,Button, IconButton,InputBase,ListItem, Avatar,ListItemAvatar,ListItemText, ListItemSecondaryAction, Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField} from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchArticle from "../PedidosFormPage/SearchArticle"
import CloseIcon from '@material-ui/icons/Close';
import AddArtigo from "../PedidosFormPage/AddArtigo"
import DeleteArtigo from "./DeleteArtigo"


const ArtigosComponent = () => {
    const [searchTerm, setSearchData] = React.useState("")
    const [performSearch, setPerfomSearch] = React.useState("")
    const [articlesList, setArticlesList] = React.useState([])
    const [error, setError] = React.useState(false)
    const [searchPerformed, setSearchPerformed] = React.useState(false)
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteArtigo, setDeleteArtigo] = React.useState(false);
    const [selectedArtigo, setSelectedArtigo] = React.useState(false);

    const [addArtigoToDB, setAddArtigoToDB] = React.useState(false)
    const [showAddArtigoForm, setShowAddArtigoForm] = React.useState(false)
    const [tempArticle, setTempArticle] = React.useState({
        name: "", 
        code: ""
    })
    
    const {
        data: artigos, 
        isFetching,
        refetch
    } = useGetArtigos()


    React.useEffect(()=>{
        if(!isFetching){
            setArticlesList(artigos.data)
            setSearchData("")
            setSearchPerformed(false)
        }
    },[isFetching])

    if(isFetching) return <Loading msg="A carregar artigos..." />
    return (
        <div className="artigosContainer">
            <Dialog onClose={()=>{
                setOpenDelete(false)
            }} aria-labelledby="simple-dialog-title" open={openDelete}>
            <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar o artigo?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        O artigo será apagado permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deleteArtigo && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeleteArtigo(true)}}>
                        apagar
                    </Button>}
                    {deleteArtigo && <DeleteArtigo
                        id={selectedArtigo} 
                        setOpenDelete={setOpenDelete}
                        setDeleteArtigo={setDeleteArtigo}
                        refetch={refetch}
                        />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
            <Dialog open={showAddArtigoForm} onClose={()=>{
                setShowAddArtigoForm(false)
            }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Adicionar Artigo</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Preencha o formulário para adicionar o artigo na base de dados
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="Artigo"
                    fullWidth
                    value={tempArticle.name}
                    onChange={(e)=>{
                        setTempArticle({
                            ...tempArticle, 
                            name: e.target.value
                        })
                    }}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    id="code"
                    label="Código do artigo"
                    fullWidth
                    value={tempArticle.code}
                    onChange={(e)=>{
                        setTempArticle({
                            ...tempArticle, 
                            code: e.target.value
                        })
                    }}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        setShowAddArtigoForm(false)
                    }}>
                        Cancel
                    </Button>
                    {!addArtigoToDB && <Button 
                    disabled={tempArticle.name=== "" || tempArticle.code === ""}
                    onClick={()=>{
                        setShowAddArtigoForm(false)
                        setAddArtigoToDB(true)
                    }} color="primary">
                        adicionar
                    </Button>}
                    {addArtigoToDB && <AddArtigo 
                        setAddArtigoToDB={setAddArtigoToDB}
                        setTempArticle={setTempArticle}
                        setShowAddArtigoForm={setShowAddArtigoForm}
                        tempArticle={null}
                        artigo={tempArticle}
                        articlesMainPage={true} 
                        refetch={refetch}
                    />}
                </DialogActions>
            </Dialog>



            {performSearch && <SearchArticle
                 term={searchTerm}
                 setArticlesResult={setArticlesList}
                 performSearch={false}
                 setPerformSearch={setPerfomSearch}
            />}
             <div className="artigosHeader">
                <Button  onClick={()=>setShowAddArtigoForm(true)} style={{backgroundColor: "#2ecc71"}} variant="contained">adicionar artigo</Button>
                <Paper className="searchContainer">
                <form action="" onSubmit={(e)=>e.preventDefault()}>
                    <InputBase style={{
                        marginRight: 10
                    }}
                    error={error}
                    onKeyDown={e=>{
                        if(e.key === "Enter" && searchTerm !== ""){
                            setPerfomSearch(true)
                            setSearchPerformed(true)
                        }else{
                            setError(true)
                        }
                    }}
                    fullWidth id="term" placeholder="Pesquisar código do artigo" value={searchTerm} 
                    onChange={(e)=>{
                        setSearchData(e.target.value)
                        setError(false)
                    }} />
                        {!searchPerformed && <IconButton onClick={()=>{
                            if(searchTerm !== ""){
                                setPerfomSearch(true)
                                setSearchPerformed(true)
                            }else{
                                setError(true)
                            }
                        }}>
                            <SearchIcon />
                        </IconButton>}
                        {searchPerformed && <IconButton onClick={()=>{
                            refetch()
                            setSearchData("")
                            setSearchPerformed(false)
                        }}>
                            <CloseIcon />    
                        </IconButton>}
                    </form>
                </Paper>
            </div>
            <Paper className="artigosListContainer">
               {articlesList.length > 0 && <List dense={true}>
                    {articlesList.sort((a,b)=>{
                        return a.name > b.name? 1 : a.name < b.name ? -1: 0
                    }).map(a=>{
                        return  (
                            <ListItem key={a.id}>
                                <ListItemAvatar>
                                    <Avatar style={{backgroundColor: "#2ecc71"}}>
                                        {a.name[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={a.name}
                                    secondary={a.code}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={()=>{
                                        setSelectedArtigo(a.id)
                                        setOpenDelete(true)
                                    }}edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })}
                  
                </List>}
                {articlesList.length === 0 && <Typography>
                    Sem artigos para apresentar    
                </Typography>}
            </Paper>
        </div>
    )
}
export default ArtigosComponent