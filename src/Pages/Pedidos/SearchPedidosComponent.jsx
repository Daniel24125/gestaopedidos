import React from 'react'
import {TextField,InputBase, IconButton, MenuItem} from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search';
import PerformSearch from "./PerformSearch"

const SearchPedidosComponent = ({
    setPedidosList, 
    refetch,
}) => {
    const [searchData, setSearchData] = React.useState({
        term: "", 
        field: "artigo"
    })
    const [error, setError] = React.useState(false)
    const [submitSearch, setSubmitSearch] = React.useState(false)
    
    const submitSearchResult = ()=>{
        if(searchData.term === ""){
            setError(true)
        }else{
            setSubmitSearch(true)
        }
    }

    return (
        <form action="" onSubmit={(e)=>e.preventDefault()}>
           <InputBase
                disabled={submitSearch}
                onFocus={()=>setError(false)} 
                error={error} style={{
                    marginRight: 10,
                    borderBottom: error? "1px solid #e74c3c": "",
                    color: error? "red": ""
                }} 
                onKeyDown={(e)=>{
                    if (e.key === 'Enter') {
                        submitSearchResult()
                      }
                }}
                fullWidth 
                id="term" 
                placeholder="Pesquisar" 
                value={searchData.term} 
                onChange={(e)=>{
                    setSearchData({
                        ...searchData, 
                        term: e.target.value
                    })
                }} />
           <TextField
                style={{
                  width: 200  
                }}
                id="standard-select-currency"
                select
                value={searchData.field}
                onChange={(e)=>{
                    setSearchData({
                        ...searchData, 
                        field: e.target.value
                    })
                }}
            >
                 <MenuItem  value="artigo">
                    Artigo
                </MenuItem>
                <MenuItem  value="remetente">
                    Remetente
                </MenuItem>
                <MenuItem  value="empresa">
                    Empresa
                </MenuItem>
                <MenuItem  value="grupo">
                    Grupo
                </MenuItem>
                <MenuItem  value="cabimento">
                    Cabimento
                </MenuItem>
                <MenuItem  value="ne">
                    Nota de Encomenda
                </MenuItem>
                <MenuItem  value="compromisso">
                    Compromisso
                </MenuItem>
                <MenuItem  value="responsável">
                    Responsável
                </MenuItem>
            </TextField>
            {!submitSearch && <IconButton onClick={()=>submitSearchResult()}>
                <SearchIcon />
            </IconButton>}
            {submitSearch && <PerformSearch 
                word={searchData.term}
                field={searchData.field}
                setSubmitSearch={setSubmitSearch}
                setPedidosList={setPedidosList}
                refetch={refetch}
            />}
            
        </form>
    )
}
export default SearchPedidosComponent