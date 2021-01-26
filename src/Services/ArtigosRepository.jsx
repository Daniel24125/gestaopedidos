
export default class ArtigosRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }
  
    fetchArticles = () =>{
        let url = this.apiBaseUrl().toString()
        url += `fetchArticles`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }
  
    getArticle = term =>{
        let url = this.apiBaseUrl().toString()
        url += `getArticle`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({term}),
                json: true
            })
            return response.then(res =>res.json())
    }
    

    
}
