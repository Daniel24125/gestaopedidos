import { useQuery} from 'react-query'
import { Container } from 'typedi'
import Pedidos from "../Services/PedidosRepository"
import Fornecedores from "../Services/FornecedoresRepository"
import Grupos from "../Services/GruposRepository"
import Artigos from "../Services/ArtigosRepository"
import Configs from "../Services/ConfigsRepository"

let accessToken 

export const useSetAccessToken =  at => accessToken = at


export const getPedidoTemplate = (pedido, empresa) =>{ 
    return `
<!doctype html>
 <html>

 <head>
   <title>Pedido ${pedido.id}</title>
   <style>
     .wrapper {
       max-width: 800px;
       background: white;
       min-height: 900px;
       font-size: 12px;
       padding: 20px;

     }

     .wrapper .rowContainer {
       width: 95%;
       position: relative;
       min-height: 150px
     }

     .wrapper .rowContainer .noteContainer {
       width: 100%;
       text-align: center;

     }

     .wrapper .rowContainer .noteContainer .note {
       width: 50%;
       font-weight: bold;
       margin: 30px auto
     }

     .wrapper .rowContainer table {
       width: 100%;
       border-collapse: collapse;
       margin-top: 50px;
     }

     .wrapper .rowContainer table th {
       text-align: left !important;
       padding: 15px 10px;
     }

     .wrapper .rowContainer table td {
       padding: 10px;
     }

     .wrapper .rowContainer .propostasContainer {
       width: 70%;
       display: inline-block;
       position: absolute;
       left: 0
     }

     .wrapper .rowContainer .propostasContainer span {
       padding: 5px 20px 5px 10px;
       font-weight: bold;
       text-decoration: underline;
       background: #d9d9d9;
       position: absolute;

     }

     .wrapper .rowContainer .propostasContainer .propostasList {
       padding: 5px 20px 5px 10px;
       display: inline-block;
       position: absolute;
       left: 80px
     }

     .wrapper .rowContainer .totalContainer {
       width: 25%;
       position: absolute;
       right: 0
     }

     .wrapper .rowContainer .totalContainer .totalRow {
       font-weight: bold;
     }


     .wrapper .rowContainer .column {
       width: 48%;
       display: inline-block
     }

     .wrapper .rowContainer .column .empresaInfoContainer {
       width: 100%;
       border: 1px solid black;
       margin-left: -20px;
     }

     .wrapper .rowContainer .column .empresaInfoContainer p {
       padding-left: 20px;
     }

     .wrapper .rowContainer .column p {
       color: #848484;
     }

     .wrapper .rowContainer .column p strong {
       color: black;
     }

     .wrapper .rowContainer img {
       width: auto;
       height: 100px;
       margin-left: 10px;

     }

     .wrapper .rowContainer .infoContainer {
       width: 45%;
       border: 1px solid black;
       height: 120px;
       margin-right: 20px;
       position: absolute;
       right: 0%;
       top: 0;
       font-size: 12px
     }

     .wrapper .rowContainer .infoContainer .infoRow {
       width: 100%;
       height: 25%;
       padding-left: 20px;
     }

     .wrapper .rowContainer .infoContainer .infoRow .infoCol {
       width: 49%;
       display: inline-block;
       padding-top: 15px
     }
   </style>
 </head>

 <body>
   <div class="wrapper">
     <div class="rowContainer">
       <img src="https://www.eng.uminho.pt/SiteAssets/Logo.PNG" alt="">
       <img style="height: 50px" src="https://www.ceb.uminho.pt/Content/images/logoceb.png" alt="">
       <div class="infoContainer">
         <div class="infoRow">
           <div class="infoCol"> <strong>ID PEDIDO</strong></div>
           <div class="infoCol">${pedido.id}</div>
         </div>
         <div class="infoRow">
           <div class="infoCol"> <strong>Nº CABIMENTO</strong></div>
           <div class="infoCol"> ${pedido.cabimento}</div>
         </div>
         <div class="infoRow">
           <div class="infoCol"> <strong>NE</strong></div>
           <div class="infoCol"> ${pedido.ne}</div>
         </div>

       </div>
     </div>
     <div class="rowContainer">

       <div style="padding: 20px 0 20px 10px" class="column">
         <p>Departamento de Engenharia Biológica</p>
         <p>Campus de Gualtar</p>
         <p>4710-057 Braga – P</p>
         <p>tel: 253 604 400 </p>
         <p><strong>NIF: 502 011 378</strong></p>
       </div>
       <div class="column">
         <p><strong>Requisita-se à entidade:</strong></p>
         <div class="empresaInfoContainer">
           <p><strong>${pedido.empresa}</strong></p>
           <p><strong>${empresa.morada?empresa.morada: "ND"}</strong></p>
           <p><strong>${empresa.cp?empresa.cp: "ND"} - ${empresa.localidade}, ${pedido.distrito?pedido.distrito: "ND"}</strong></p>
           <p><strong>NIF: ${empresa.nif?empresa.nif: "ND"}</strong></p>
         </div>
       </div>
     </div>
     <div class="rowContainer">
       <table>
         <tr style="background: #d9d9d9">
           <th>Referência</th>
           <th style="min-width: 300px">Artigo</th>
           <th>Qt</th>
           <th>Preço Unitário</th>
           <th>Total</th>
         </tr>
         ${pedido.artigos.map(a=>{
             return (
                 `<tr>
                 <td>${a.referencia_artigo}</td>
                 <td>${a.artigo}</td>
                 <td>${a.quantidade}</td>
                 <td>${a.preco}</td>
                 <td>${a.quantidade*a.preco}</td>
               </tr>`
             )
         })}

       </table>
     </div>
     <div class="rowContainer">
       <div class="propostasContainer">
           <span>Propostas</span>
         <div class="propostasList">
           <div class="proposta">
             ${pedido.proposta}
           </div>
         </div>
       </div>
       <div class="totalContainer">
         <div class="totalRow">
           <span>Total</span>
           <span>${Number(pedido.valor_total).toFixed(2)} €</span>
         </div>
         <div class="totalRow">
           <span>IVA</span>
           <span>23%</span>
           <span>${(Number(pedido.valor_total)*0.23).toFixed(2)} €</span>

         </div>
         <div class="totalRow">
           <span>Total fatura</span>
           <span>${(Number(pedido.valor_total)*1.23).toFixed(2)} €</span>
         </div>
       </div>
     </div>
     <div class="rowContainer">
       <div class="noteContainer">
         <p class="note">As faturas devem mencionar o número de cabimento e de NE.</p>

       </div>
     </div>
   </div>
 </body>

 </html>
 `
}

export const useGetNumPedidos = () =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['get_num_pedidos'],
        queryFn: async () => {
            const info =  await pedidos.getNumPedidos(accessToken )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}


export const useQueryPedidos = () =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['query_pedidos'],
        queryFn: async () => {
            const info =  await pedidos.queryPedidos(accessToken)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}
export const useGetPedidosAnual = () =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['get_pedidos_anual'],
        queryFn: async () => {
            const info =  await pedidos.getPedidosAnual(accessToken)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}
export const useGetPedidosNaoEncomendados = () =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['get_pedidos_nao_encomendados'],
        queryFn: async () => {
            const info =  await pedidos.getPedidosNaoEncomendados(accessToken)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}
export const useGetPedidosAtrasados = () =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['get_pedidos_atrasados'],
        queryFn: async () => {
            const info =  await pedidos.getPedidosAtrasados(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetFornecedoresStats = () =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_fornecedores_stats'],
        queryFn: async () => {
            const info =  await fornecedores.getFornecedoresStats(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}


export const useGetPedidos = () =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['get_pedidos'],
        queryFn: async () => {
            const info =  await pedidos.getPedidos(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetGrupos = () =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['get_grupos'],
        queryFn: async () => {
            const info =  await grupos.getGrupos(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetFornecedores = () =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_fornecedores'],
        queryFn: async () => {
            const info =  await fornecedores.getFornecedores(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetArticle = term =>{
    const artigos = Container.get(Artigos)
    return useQuery({
        queryKey: ['get_article'],
        queryFn: async () => {
            const info =  await artigos.getArticle(accessToken, term)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useSendPedidos = data =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['send_pedido'],
        queryFn: async () => {
            const info =  await pedidos.sendPedidos(accessToken, data)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetDist = () =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['get_dist'],
        queryFn: async () => {
            const info =  await grupos.getDist(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetRubricasByEmppresa = (empresa) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_rub_by_empresa'],
        queryFn: async () => {
            const info =  await fornecedores.getRubricasByEmpresa(accessToken, empresa)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useGetEmpresasByRubrica = (rubrica) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_emp_by_rub'],
        queryFn: async () => {
            const info =  await fornecedores.getEmpresasByRubrica(accessToken, rubrica)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useGetFaturasByPedido = (pedidoID) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_fat_by_pedido'],
        queryFn: async () => {
            const info =  await fornecedores.getFaturasByPedido(accessToken, pedidoID)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useAddFatura = (fatura) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['add_fatura'],
        queryFn: async () => {
            const info =  await fornecedores.addFatura(accessToken, fatura)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useDeleteFatura = (id) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['delete_fatura'],
        queryFn: async () => {
            const info =  await fornecedores.deleteFatura(accessToken, id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetFaturasByEmppresa = (empresa) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_fat_by_empresa'],
        queryFn: async () => {
            const info =  await fornecedores.getFaturasByEmpresa(accessToken, empresa)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useGetArtigos = () =>{
    const artigos = Container.get(Artigos)
    return useQuery({
        queryKey: ['get_articles'],
        queryFn: async () => {
            const info =  await artigos.fetchArticles(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}

export const useSearchPedidos = (word, field) =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['search_pedidos'],
        queryFn: async () => {
            const info =  await pedidos.searchPedidos(accessToken, word, field)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useGetPedidoByID = (id) =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['get_pedido_by_id'],
        queryFn: async () => {
            const info =  await pedidos.getPedidoById(accessToken, id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useEditPedido = (data, id) =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['edit_pedido'],
        queryFn: async () => {
            const info =  await pedidos.editPedido(accessToken, data, id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useDeletePedido = (id) =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['delete_pedido'],
        queryFn: async () => {
            const info =  await pedidos.deletePedido(accessToken, id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useNovoGrupo = (grupo) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['novo_grupo'],
        queryFn: async () => {
            const info =  await grupos.novoGrupo(accessToken, grupo)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useGetGrupoByID = (id) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['grupo_by_id'],
        queryFn: async () => {
            const info =  await grupos.getGrupoById(accessToken, id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useEditGrupo = (data, id) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['edit_grupo'],
        queryFn: async () => {
            const info =  await grupos.editGrupo(accessToken, data, id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useDeleteGrupo = (id,selectedDistID) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['delete_grupo'],
        queryFn: async () => {
            const info =  await grupos.deleteGrupo(accessToken,id,selectedDistID)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useGetGrupoMembros = (id) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['get_grupo_membros'],
        queryFn: async () => {
            const info =  await grupos.getGrupoMembros(accessToken,id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useGetDistAnual = (year) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['get_dist_anual'],
        queryFn: async () => {
            const info =  await grupos.getDistAnual(accessToken,year)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}


export const useAddEmpresa = (empresa) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['add_empresa'],
        queryFn: async () => {
            const info =  await fornecedores.addEmpresa(accessToken,empresa)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}


export const useEditEmpresa = (data, id, nesIDs) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['edit_empresa'],
        queryFn: async () => {
            const info =  await fornecedores.editEmpresa(accessToken,data, id, nesIDs)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}


export const useDeleteEmpresa = (id) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['delete_empresa'],
        queryFn: async () => {
            const info =  await fornecedores.deleteEmpresa(accessToken,id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}


export const useGetEmpresaById = (id) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_empresa_by_id'],
        queryFn: async () => {
            const info =  await fornecedores.getEmpresaById(accessToken,id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useAddNE = (ne) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['add_ne'],
        queryFn: async () => {
            const info =  await fornecedores.addNE(accessToken,ne)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useDeleteNES = (id) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['delete_ne'],
        queryFn: async () => {
            const info =  await fornecedores.deleteNE(accessToken,id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useDownloadPDF = (template, pedidoID) =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['delete_ne'],
        queryFn: async () => {
            const info =  await pedidos.downloadPDF(accessToken, template,pedidoID)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useSetArtigoState = (pedidoID, index, chegada_data) =>{
    const artigos = Container.get(Artigos)
    return useQuery({
        queryKey: ['set_artigo_state'],
        queryFn: async () => {
            const info =  await artigos.setArticleStatus(accessToken, pedidoID, index, chegada_data)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useSetArtigoFaturado = (pedidoID, index, faturado) =>{
    const artigos = Container.get(Artigos)
    return useQuery({
        queryKey: ['set_artigo_faturado'],
        queryFn: async () => {
            const info =  await artigos.setArtigoFaturado(accessToken, pedidoID, index, faturado)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useAddArtigoToDB = (artigo) =>{
    const artigos = Container.get(Artigos)
    return useQuery({
        queryKey: ['add_artigo'],
        queryFn: async () => {
            const info =  await artigos.addArtigoToDB(accessToken, artigo)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useDeleteArtigo = (id) =>{
    const artigos = Container.get(Artigos)
    return useQuery({
        queryKey: ['delete_artigo'],
        queryFn: async () => {
            const info =  await artigos.deleteArtigo(accessToken, id)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}


export const useGetConfigs = () =>{
    const configs = Container.get(Configs)
    return useQuery({
        queryKey: ['get_config'],
        queryFn: async () => {
            const info =  await configs.getConfig(accessToken, )
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
        }
    })
}


export const useSaveConfig = (configsData) =>{
    const configs = Container.get(Configs)
    return useQuery({
        queryKey: ['save_configs'],
        queryFn: async () => {
            const info =  await configs.saveConfig(accessToken, configsData)
            return info
        },
        config: { 
          refetchOnWindowFocus: false,
          refetchInterval: false,
          refetchIntervalInBackground: false,
          cacheTime: 0
        }
    })
}

export const useDownloadDistCum = () =>{
  const grupos = Container.get(Grupos)
  return useQuery({
      queryKey: ['download_dist_cum'],
      queryFn: async () => {
          const info =  await grupos.downloadDistCum(accessToken)
          return info
      },
      config: { 
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        cacheTime: 0
      }
  })
}


export const useDownloadDistCumGrupo = (grupoID) =>{
  const grupos = Container.get(Grupos)
  return useQuery({
      queryKey: ['download_dist_cum_grupo'],
      queryFn: async () => {
          const info =  await grupos.downloadDistCumGrupo(accessToken,grupoID)
          return info
      },
      config: { 
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        cacheTime: 0
      }
  })
}