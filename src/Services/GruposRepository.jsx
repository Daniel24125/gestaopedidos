
export default class GruposRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }
  
    getGrupos = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getGrupos`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }

    getDist = ()=>{
        let url = this.apiBaseUrl().toString()
        url += `getDist`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }
    
}
