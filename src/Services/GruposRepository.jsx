
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

    novoGrupo = (grupo) =>{
        let url = this.apiBaseUrl().toString()
        url += `novo_grupo`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({grupo}),
            json: true
        })
        return response.then(res =>res.json())
    }

    
    getGrupoById = (id) =>{
        let url = this.apiBaseUrl().toString()
        url += `getGrupoById`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({id}),
            json: true
        })
        return response.then(res =>res.json())
    }

    getGrupoMembros = (id) =>{
        let url = this.apiBaseUrl().toString()
        url += `getGrupoMembros`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({id}),
            json: true
        })
        return response.then(res =>res.json())
    }
    
    editGrupo = (data, id) =>{
        let url = this.apiBaseUrl().toString()
        url += `editGrupo`
        const response =  fetch(url,{
            method: "PATCH", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({data, id}),
            json: true
        })
        return response.then(res =>res.json())
    }
    
    deleteGrupo = (id,selectedDistID) =>{
        let url = this.apiBaseUrl().toString()
        url += `deleteGrupo`
        const response =  fetch(url,{
            method: "DELETE", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({id,selectedDistID}),
            json: true
        })
        return response.then(res =>res.json())
    }

    getDistAnual = (year) =>{
        let url = this.apiBaseUrl().toString()
        url += `getDistAnual`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({year}),
            json: true
        })
        return response.then(res =>res.json())
    }
}
