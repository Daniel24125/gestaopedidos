import React from 'react'
import {useGetArtigos} from "../../Domain/useCases"
import Loading from "../../Components/Loading"
import {List, Paper,Button, IconButton,InputBase,ListItem, Avatar,ListItemAvatar,ListItemText, ListItemSecondaryAction } from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';

const ArtigosComponent = () => {
        const [searchTerm, setSearchData] = React.useState("")
    const {
        data: artigos, 
        isFetching
    } = useGetArtigos()

    if(isFetching) return <Loading msg="A carregar artigos..." />
    console.log(artigos)
    return (
        <div className="artigosContainer">
             <div className="artigosHeader">
                <Button  style={{backgroundColor: "#2ecc71"}} variant="contained">adicionar artigo</Button>
                <Paper className="searchContainer">
                <form action="" onSubmit={(e)=>e.preventDefault()}>
                    <InputBase style={{
                        marginRight: 10
                    }} fullWidth id="term" placeholder="Pesquisar código do artigo" value={searchTerm}  onChange={(e)=>setSearchData(e.target.value)} />
                   
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    </form>
                </Paper>
            </div>
            <Paper className="artigosListContainer">
                <List dense={true}>
                    {artigos.data.map(a=>{
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
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })}
                  
                </List>
            </Paper>
        </div>
    )
}
export default ArtigosComponent