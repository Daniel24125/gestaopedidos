
export default class GruposRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }
  
    getGrupos = (accessToken,) =>{
        let url = this.apiBaseUrl().toString()
        url += `getGrupos`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        })
        return response.then(res =>res.json())
    }

    getDist = (accessToken,)=>{
        let url = this.apiBaseUrl().toString()
        url += `getDist`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        })
        return response.then(res =>res.json())
    }

    novoGrupo = (accessToken,grupo) =>{
        let url = this.apiBaseUrl().toString()
        url += `novo_grupo`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "content-type": "application/json", 
            },
            body: JSON.stringify({grupo}),
            json: true
        })
        return response.then(res =>res.json())
    }

    
    getGrupoById = (accessToken,id) =>{
        let url = this.apiBaseUrl().toString()
        url += `getGrupoById`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({id}),
            json: true
        })
        return response.then(res =>res.json())
    }

    getGrupoMembros = (accessToken,id) =>{
        let url = this.apiBaseUrl().toString()
        url += `getGrupoMembros`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({id}),
            json: true
        })
        return response.then(res =>res.json())
    }
    
    editGrupo = (accessToken,data, id) =>{
        let url = this.apiBaseUrl().toString()
        url += `editGrupo`
        const response =  fetch(url,{
            method: "PATCH", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({data, id}),
            json: true
        })
        return response.then(res =>res.json())
    }
    
    deleteGrupo = (accessToken,id,selectedDistID) =>{
        let url = this.apiBaseUrl().toString()
        url += `deleteGrupo`
        const response =  fetch(url,{
            method: "DELETE", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({id,selectedDistID}),
            json: true
        })
        return response.then(res =>res.json())
    }

    getDistAnual = (accessToken,year) =>{
        let url = this.apiBaseUrl().toString()
        url += `getDistAnual`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({year}),
            json: true
        })
        return response.then(res =>res.json())
    }
}
