
export default class PedidosRepository  {
    apiBaseUrl(){
        const url = new URL(process.env.REACT_APP_API_BASE)
        if (!url.pathname.endsWith('/')) url.pathname += '/'
        return url
      }

   
    getNumPedidos = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getNumPedidos`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }

    queryPedidos = () =>{
        let url = this.apiBaseUrl().toString()
        url += `queryPedidos`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }

    getPedidosNaoEncomendados = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidosNaoEncomendados`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    } 
    
    getPedidosAtrasados = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidosAtrasados`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }
    
    getPedidosAnual = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidosAnual`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }

    getPedidos = () =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidos`
        const response =  fetch(url,{
            method: "GET", 
        })
        return response.then(res =>res.json())
    }
    
    // getCodigoPedidos = () =>{
    //     let url = this.apiBaseUrl().toString()
    //     url += `getCodigoPedidos`
    //     const response =  fetch(url,{
    //         method: "GET", 
    //     })
    //     return response.then(res =>res.json())
    // }  
    
    downloadPfd = () =>{
        let url = this.apiBaseUrl().toString()
        url += `downloadPfd`
        const response =  fetch(url,{
            method: "GET", 
            headers:{
                "Accept": "application/pdf", 
                },
        })
        return response.then(res =>res.json())
    }

    searchPedidos = (word, field) =>{
        console.log(word, field)
        let url = this.apiBaseUrl().toString()
        url += `searchPedidos`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({word,field}),
            json: true
        })
        return response.then(res =>res.json())
    }

    sendPedidos = (pedido) =>{
        let url = this.apiBaseUrl().toString()
        url += `novo_pedido`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({pedido}),
            json: true
        })
        return response.then(res =>res.json())
    }

    getPedidoById = (id) =>{
        let url = this.apiBaseUrl().toString()
        url += `getPedidoById`
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

    editPedido = (data, id) =>{
        let url = this.apiBaseUrl().toString()
        url += `editPedido`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({id, data}),
            json: true
        })
        return response.then(res =>res.json())
    }
    
    deletePedido = (id) =>{
        let url = this.apiBaseUrl().toString()
        url += `deletePedido`
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
    
    createPdf = (data) =>{
        let url = this.apiBaseUrl().toString()
        url += `createPdf`
        const response =  fetch(url,{
            method: "POST", 
            headers:{
            "content-type": "application/json", 
            },
            body: JSON.stringify({data}),
            json: true
        })
        return response.then(res =>res.json())
    }
    
}
