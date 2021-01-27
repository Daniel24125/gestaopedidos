import { useQuery} from 'react-query'
import { Container } from 'typedi'
import Pedidos from "../Services/PedidosRepository"
import Fornecedores from "../Services/FornecedoresRepository"
import Grupos from "../Services/GruposRepository"
import Artigos from "../Services/ArtigosRepository"

let accessToken 

export const useSetAccessToken =  at => accessToken = at

export const useGetNumPedidos = () =>{
    const pedidos = Container.get(Pedidos)
    return useQuery({
        queryKey: ['get_num_pedidos'],
        queryFn: async () => {
            const info =  await pedidos.getNumPedidos()
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
            const info =  await pedidos.queryPedidos()
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
            const info =  await pedidos.getPedidosAnual()
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
            const info =  await pedidos.getPedidosNaoEncomendados()
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
            const info =  await pedidos.getPedidosAtrasados()
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
            const info =  await fornecedores.getFornecedoresStats()
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
            const info =  await pedidos.getPedidos()
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
            const info =  await grupos.getGrupos()
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
            const info =  await fornecedores.getFornecedores()
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
            const info =  await artigos.getArticle(term)
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
            const info =  await pedidos.sendPedidos(data)
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
            const info =  await grupos.getDist()
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
            const info =  await fornecedores.getRubricasByEmpresa(empresa)
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
            const info =  await fornecedores.getEmpresasByRubrica(rubrica)
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

export const useGetFaturasByEmppresa = (empresa) =>{
    const fornecedores = Container.get(Fornecedores)
    return useQuery({
        queryKey: ['get_fat_by_empresa'],
        queryFn: async () => {
            const info =  await fornecedores.getFaturasByEmpresa(empresa)
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
            const info =  await artigos.fetchArticles()
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
            const info =  await pedidos.searchPedidos(word, field)
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
            const info =  await pedidos.getPedidoById(id)
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
            const info =  await pedidos.editPedido(data, id)
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
            const info =  await pedidos.deletePedido(id)
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
            const info =  await grupos.novoGrupo(grupo)
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
            const info =  await grupos.getGrupoById(id)
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

export const useEditGrupo = (id) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['edit_grupo'],
        queryFn: async () => {
            const info =  await grupos.editGrupo(id)
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

export const useDeleteGrupo = (id) =>{
    const grupos = Container.get(Grupos)
    return useQuery({
        queryKey: ['delete_grupo'],
        queryFn: async () => {
            const info =  await grupos.deleteGrupo(id)
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
            const info =  await grupos.getGrupoMembros(id)
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
            const info =  await grupos.getDistAnual(year)
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