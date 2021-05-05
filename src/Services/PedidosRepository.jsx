
export default class PedidosRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }

   
    getNumPedidos = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `getNumPedidos`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        
        })
        return response.then(res =>res.json())
    }

    queryPedidos = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `queryPedidos`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        
        })
        return response.then(res =>res.json())
    }

    getPedidosNaoEncomendados = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidosNaoEncomendados`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        
        })
        return response.then(res =>res.json())
    } 
    
    getPedidosAtrasados = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidosAtrasados`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        
        })
        return response.then(res =>res.json())
    }
    
    getPedidosAnual = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidosAnual`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        })
        return response.then(res =>res.json())
    }

    getPedidos = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidos`
        const response =  fetch(url,{
            method: "GET", 
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}`: ""
            }
        
        })
        return response.then(res =>res.json())
    }
    
    downloadPfd = (accessToken) =>{
        let url = this.apiBaseUrl().toString()
        url += `downloadPfd`
        const response =  fetch(url,{
            method: "GET", 
            headers:{
                Authorization: accessToken ? `Bearer ${accessToken}`: "",
                "Accept": "application/pdf", 
            },
        })
        return response.then(res =>res.json())
    }

    searchPedidos = (accessToken,word, field) =>{
        let url = this.apiBaseUrl().toString()
        url += `searchPedidos`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({word,field}),
            json: true
        })
        return response.then(res =>res.json())
    }

    sendPedidos = (accessToken,pedido) =>{
        let url = this.apiBaseUrl().toString()
        url += `novo_pedido`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({pedido}),
            json: true
        })
        return response.then(res =>res.json())
    }

    getPedidoById = (accessToken,id) =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidoById`
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

    editPedido = (accessToken,data, id) =>{
        let url = this.apiBaseUrl().toString()
        url += `editPedido`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({id, data}),
            json: true
        })
        return response.then(res =>res.json())
    }
    
    deletePedido = (accessToken,id) =>{
        let url = this.apiBaseUrl().toString()
        url += `deletePedido`
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
    
    downloadPDF = (accessToken, pedidoID) =>{
        let url = this.apiBaseUrl().toString()
        url += `downloadPDF`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "content-type": "application/json", 
            },
            body: JSON.stringify({ pedidoID}),
            json: true
        })
        return response.then(res =>res.blob())
    }
    
}
