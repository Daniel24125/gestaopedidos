
export default class FornecedoresRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }
  
    getFornecedores = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getFornecedores`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }
  

    getFornecedoresStats = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getFornecedoresStats`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }

    getRubricasByEmpresa = empresa =>{
        let url = this.apiBaseUrl().toString()
        url += `getRubricasByEmpresa`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({empresa}),
                json: true
            })
            return response.then(res =>res.json())
    }
    getFaturasByEmpresa = empresa =>{
        let url = this.apiBaseUrl().toString()
        url += `getFaturasByEmpresa`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({empresa}),
                json: true
            })
            return response.then(res =>res.json())
    }

    getFaturasByPedido = pedidoID =>{
        let url = this.apiBaseUrl().toString()
        url += `getFaturasByPedido`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({pedidoID}),
                json: true
            })
            return response.then(res =>res.json())
    }

    addFatura = fatura =>{
        let url = this.apiBaseUrl().toString()
        url += `addFatura`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({fatura}),
                json: true
            })
            return response.then(res =>res.json())
    }

    deleteFatura = id =>{
        let url = this.apiBaseUrl().toString()
        url += `deleteFatura`
        const response =  fetch(url,{
            method: "DELETE", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({id}),
                json: true
            })
            return response.then(res =>res.json())
    }

    getEmpresasByRubrica = rubrica =>{
        let url = this.apiBaseUrl().toString()
        url += `getEmpresasByRubrica`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({rubrica}),
                json: true
            })
            return response.then(res =>res.json())
    }

    addEmpresa = empresa =>{
        let url = this.apiBaseUrl().toString()
        url += `nova_empresa`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({empresa}),
                json: true
            })
        return response.then(res =>res.json())
    }

    editEmpresa = (data, id, nesIDs) =>{
        let url = this.apiBaseUrl().toString()
        url += `editEmpresa`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({data, id, nesIDs}),
                json: true
            })
        return response.then(res =>res.json())
    }

    deleteEmpresa = (id) =>{
        let url = this.apiBaseUrl().toString()
        url += `deleteEmpresa`
        const response =  fetch(url,{
            method: "DELETE", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({id}),
                json: true
            })
        return response.then(res =>res.json())
    }

    getEmpresaById = (id) =>{
        let url = this.apiBaseUrl().toString()
        url += `getEmpresaById`
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

    addNE = (ne) =>{
        let url = this.apiBaseUrl().toString()
        url += `addNE`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({ne}),
                json: true
            })
        return response.then(res =>res.json())
    }

    deleteNE = (neID) =>{
        let url = this.apiBaseUrl().toString()
        url += `deleteNE`
        const response =  fetch(url,{
            method: "DELETE", 
            headers:{
                "content-type": "application/json", 
                },
                body: JSON.stringify({neID}),
                json: true
            })
        return response.then(res =>res.json())
    }
}
