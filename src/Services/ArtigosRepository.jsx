
export default class ArtigosRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }
  
    fetchArticles = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `fetchArticles`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        })
        return response.then(res =>res.json())
    }
  
    getArticle = (accessToken,term) =>{
        let url = this.apiBaseUrl().toString()
        url += `getArticle`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "content-type": "application/json", 
                },
                body: JSON.stringify({term}),
                json: true
            })
            return response.then(res =>res.json())
    }
    
    setArticleStatus = (accessToken,pedidoID, index, chegada_data) =>{
        let url = this.apiBaseUrl().toString()
        url += `setArticleStatus`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "content-type": "application/json", 
                },
                body: JSON.stringify({pedidoID, index, chegada_data}),
                json: true
            })
            return response.then(res =>res.json())
    }

    setArtigoFaturado = (accessToken,pedidoID, index, faturado) =>{
        let url = this.apiBaseUrl().toString()
        url += `setArtigoFaturado`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "content-type": "application/json", 
                },
                body: JSON.stringify({pedidoID, index, faturado}),
                json: true
            })
            return response.then(res =>res.json())
    }

    addArtigoToDB = (accessToken,artigo) =>{
        let url = this.apiBaseUrl().toString()
        url += `addArtigoToDB`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "content-type": "application/json", 
                },
                body: JSON.stringify({artigo}),
                json: true
            })
            return response.then(res =>res.json())
    }
    
    deleteArtigo = (accessToken,id) =>{
        let url = this.apiBaseUrl().toString()
        url += `deleteArtigo`
        const response =  fetch(url,{
            method: "DELETE", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "content-type": "application/json", 
            },
            body: JSON.stringify({id}),
            json: true
            })
        return response.then(res =>res.json())
    }
    
}
