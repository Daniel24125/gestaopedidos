
export default class ArtigosRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }
  
      getConfig = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `getConfig`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        })
        return response.then(res =>res.json())
    }
  
    saveConfig = (accessToken,configs) =>{
        let url = this.apiBaseUrl().toString()
        url += `saveConfig`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "content-type": "application/json", 
                },
                body: JSON.stringify({configs}),
                json: true
            })
            return response.then(res =>res.json())
    }
    
   
    
}
