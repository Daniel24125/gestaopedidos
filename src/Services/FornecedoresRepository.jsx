
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
  
    getEmpresaById = id =>{
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
}