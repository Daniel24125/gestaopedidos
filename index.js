const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require('firebase-admin');
const app = express();
const jwt = require('express-jwt');
const puppeteer = require('puppeteer');
const jwks = require('jwks-rsa');
const port = process.env.PORT || 8000;
const path = require("path");

require('dotenv').config()
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.CREDENTIALS))
});


app.use(cors({
  origin: [
      // "http://localhost:3000", 
      "https://gestaopedidos.herokuapp.com"
  ],
  methods: "GET,PATCH,POST,DELETE",
  allowedHeaders: [
      "Content-Type,authorization",
       "Content-Type,X-Requested-With", 
       "responseType, arraybuffer"
      ]
}))

app.options('*', cors()) // include before other routes

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.JWT_JWKSURI
    }),
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  algorithms: ['RS256']
});

app.use(jwtCheck);


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

const artigosRef = admin.firestore().collection("artigos")
const pedidos_ref = admin.firestore().collection("pedidos")
const empresas_ref = admin.firestore().collection("fornecedores")
const grupos_ref = admin.firestore().collection("grupos")
const configRef = admin.firestore().collection("utils")
const notasEncomendaRef = admin.firestore().collection("notasEncomenda")
const faturasRef = admin.firestore().collection("faturas")
const distAnualRef = admin.firestore().collection("distAnual")


// GET REQUESTS 
app.get("/api/getNumPedidos",  async (req, res) => {
  const pedidos = await pedidos_ref.get().then(res=>res).catch(err => res.send(err))
  res.send({
    "num": pedidos.size
  })
});



app.get("/api/getConfig", async  (req, res) => {
  const configs = await configRef.doc("config").get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  res.json({
    data: configs.data()
  })
});

app.get("/api/queryPedidos", (req, res) => {
  let pedidos_selected = [];
  let pedidos_fatura = []
  pedidos_ref.get()
  .then(pedidos=>{
    pedidos.forEach(p=>{
      if (p.data()["fatura"] === undefined) {
        pedidos_fatura.push({
          ...p.data(),
          id: p.id
        })
      }
      if(p.data()["artigos"].filter(art => art.entrega.quantidade < art["quantidade"]).length !== 0){
        pedidos_selected.push({
          ...p.data(),
          id: p.id
        })
      }    
    })
    res.json({
      "data_incompletos": pedidos_selected,
      "data_faturas": pedidos_fatura
    })  
  })
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
});

app.get("/api/getPedidosAnual", async (req, res) => {
  let send_data = {};
  const pedidos = await pedidos_ref.where("year", "==", new Date().getFullYear())
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  let groups = await grupos_ref
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    // groups = groups.docs.map(doc=>{
    //   return{[doc.data().abrv]: doc.data().color}
    // })
  let groupColor = {}
    for (let i in groups.docs){
      groupColor[groups.docs[i].data().abrv] = groups.docs[i].data().color
    }
  if(pedidos.docs.length > 0){
    pedidos.forEach(p=>{
      const pedido = p.data()
      if (send_data[pedido["grupo"]] === undefined) {
        send_data[pedido["grupo"]] = {
          color: groupColor[pedido["grupo"]],
          data: {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0
          }
          
        }
      }
      send_data[pedido["grupo"]].data[pedido["mounth"]]++;
    })
  }
  res.json(send_data)
});

app.get("/api/getPedidosNaoEncomendados", async (req, res) => {
  const pedidos = await pedidos_ref.where("pedido_feito", "==", false)
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    res.json({
      "data": pedidos.docs.map(doc=> {
       return{ 
         ...doc.data(),
         id: doc.id
        }
      })
    })
});


app.get("/api/getPedidosAtrasados", async (req, res) => {
  const configs = await configRef.doc("config")
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  const time_th = configs.data()["pedido_acabado"]
  const th = Date.now() - time_th
  const pedidos = await pedidos_ref
    .where("pedido_feito", "==", true)
    .where("data_pedido", "<", th )
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  res.send({
    "data": pedidos.docs.map(doc=>{
      return {
        ...doc.data(), 
        id: doc.id
      }
    })
  });
});


app.get("/api/getFornecedoresStats", async  (req, res) => {
  const configs = await configRef.doc("config")
  .get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  const saldo_th = configs.data()["saldo_th"]
  
  const notasEncomenda = await notasEncomendaRef.where("saldo_disponivel", "<",saldo_th ).get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  
  res.json({
    nes: notasEncomenda.docs.map(doc=>doc.data())
  })
});


app.get('/api/getPedidos',  async (req, res)=> {
  const pedidos = await pedidos_ref
  .get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  res.json({
    data: pedidos.docs.map(doc=>{
      return {
        id: doc.id,
        ...doc.data()
      }
    })
  })
});

app.post('/api/getGrupoMembros', async  (req, res) =>{
    const id = req.body.id
    const membersDist = await grupos_ref.doc(id).collection("membros").get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    res.json({
      data: membersDist.docs.map(doc=>{
        return {
          ...doc.data(), 
          id: doc.id,
        }
      })
    })
});

app.get('/api/getGrupos', async  (req, res) =>{
  const grupos = await grupos_ref
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })    
    res.json({
      data: grupos.docs.map(doc=>{
        return {
          ...doc.data(), 
          id: doc.id,
        }
      })
    })
 
});

app.get('/api/getFornecedores', async (req, res) =>{
  const formecedores = await empresas_ref
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    res.json({
      data: formecedores.docs.map(doc=>{
        return {
          ...doc.data(), 
          id: doc.id
        }
      })
    })
});

app.get("/api/fetchArticles",  async (req, res) => {
  const artigos = await artigosRef
  .get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  res.json({
    data: artigos.docs.map(doc =>(
      {
        id: doc.id,
        ...doc.data()
      }
    ))
  })
})

// POST REQUESTS 

app.post('/api/getArticle', async (req, res) => {
  const result = await artigosRef.where("code", ">=", req.body.term)
    .where("code", "<", req.body.term+ "\uf8ff")
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    res.json({
      data: result.docs.map(doc=>{
        return{
          ...doc.data(), 
          id: doc.id
        }
      }) 
    })
})

app.post('/api/searchPedidos', async  (req, res) => {
  const word = req.body.word 
  const field = req.body.field 
  const pedidos = await pedidos_ref.where(field, ">=", word)
  .where(field, "<",word+ "\uf8ff")
  .get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    data: pedidos.docs.map(doc=>{
      return {
        id: doc.id,
        ...doc.data()
      }
    })
  })
})

app.post("/api/saveConfig", async (req, res) => {
    const configData = req.body.configs
    await configRef.doc("config").set(configData, {merge: true})
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  
    res.json({
      error: false
    })
});


app.post("/api/downloadPDF",async (req, res)=>{
  const template = req.body.template; 
  const pedidoID = req.body.pedidoID

  const browser = await puppeteer.launch({ args: ['--no-sandbox'],headless: true })
  .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
  }) 
  
  const page = await browser.newPage()
  .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
  }) 
  await page.setContent(template, {waitUntil: 'load'})
  .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
  }) 

  const pdf = await page.pdf({
      format: "A4", 
      // preferCSSPageSize: true
  }).catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
  }) 


  const file =  `Content-Disposition': 'attachment; filename=pedido_${pedidoID}.pdf`
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    file
  });

  await pedidos_ref.doc(pedidoID).set({
    pedido_feito: true,
    pedido_feito_formated_date: new Date().toJSON(),
    pedido_feito_timestamp: Date.now()
  }, {merge: true})
  res.end(pdf, err=> {
      if (err) {
          console.log("Error");
          console.log(err);
      }   
  });
  await browser.close()
  
})


app.post("/api/getEmpresaInfo", (req, res) => {
  empresas_ref.orderByChild("empresa").equalTo(req.body.empresa).once("value")
    .then(data => {
      res.send(data.val())
    });
})

app.post("/api/getDistAnual", async (req, res) => {
  const year = req.body.year
  const distAnual = await  distAnualRef.where("year", "==", year)
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  res.json({
    data: distAnual.docs.map(doc=>{
      return {
        ...doc.data(),
       id: doc.id
      }
    })
  })
})

const updateGrupoDist = async (valor_total, pedido, res)=>{
  const dist_data = await distAnualRef
    .where("grupo", "==", pedido.grupo_abrv)
    .where("year", "==", pedido.year)
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  const dist_data_membros = await grupos_ref.doc(pedido.grupo_id).collection("membros")
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  let current_dist = dist_data.docs.map(doc=>{
    return {
      ...doc.data(),
      id: doc.id
    }
  }).filter(d=>d.year=== pedido.year)[0]
  
  const dist_membro = dist_data_membros.docs.map(doc=>{
    return {
      ...doc.data(),
      id: doc.id
    }
  }).filter(d=>d.name=== pedido.responsavel)[0]

  let current_dist_membro = dist_membro.dist.filter(d=>d.year === pedido.year)[0]
  
  current_dist.anual[`m${pedido.mounth}`] = Number(current_dist.anual[`m${pedido.mounth}`]) + valor_total
  current_dist.total = Number(current_dist.total ) + valor_total
  
  current_dist_membro[`m${pedido.mounth}`]= Number(current_dist_membro[`m${pedido.mounth}`])+ valor_total
  current_dist_membro.total = Number(current_dist_membro.total) + valor_total
  
  const yearIndex = dist_membro.dist.findIndex(d=>d.year===pedido.year)
  dist_membro.dist[yearIndex] = current_dist_membro
  await distAnualRef.doc(current_dist.id).set(current_dist, {merge: true})
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  await grupos_ref.doc(pedido.grupo_id).collection("membros").doc(dist_membro.id).set(dist_membro, {merge: true})
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
}

app.post("/api/novo_pedido", async (req, res) => {
  let pedido = req.body.pedido;
  pedido["pedido_feito"] = false;
  pedido["pedido_done"] = false;
  pedido["pedido_feito_timestamp"] = "";
  pedido["pedido_feito_formated_date"] = "";

  await pedidos_ref
  .add(pedido)
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  
  await updateGrupoDist(Number(pedido.valor_total), pedido, res)

  const notaE = await notasEncomendaRef.doc(pedido.ne_id).get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  await notasEncomendaRef.doc(pedido.ne_id).set({
    saldo_disponivel: notaE.data().saldo_disponivel - pedido.valor_total
  }, {merge: true})

  res.json({
    error: false
  })

});

app.post("/api/addArtigoToDB", async (req, res) => {
  const artigo = req.body.artigo
  await artigosRef.add(artigo)
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    error: false
  })
});

app.delete("/api/deleteArtigo", async (req, res) => {
  const id = req.body.id
  await artigosRef.doc(id).delete()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    error: false
  })
});

app.post("/api/setArticleStatus", async (req, res) => {
  const index = req.body.index 
  const pedidoID = req.body.pedidoID
  const chegada_data = req.body.chegada_data
  const pedido = await pedidos_ref.doc(pedidoID).get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  let artigos = pedido.data().artigos
  artigos[index].entrega = {
    ...chegada_data,
    chegada: true, 
    data_chegada: new Date().toJSON(),
    data_chegada_timestamp: Date.now()
  }

  pedidos_ref.doc(pedidoID).set({
    artigos, 
    pedido_done: !Boolean(artigos.filter(a=>a.quantidade > a.entrega.quantidade).length)
  }, {merge: true})
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    error: false
  })
})

app.post("/api/setArtigoFaturado", async (req, res) => {
  const index = req.body.index 
  const pedidoID = req.body.pedidoID
  const faturado = req.body.faturado
  const pedido = await pedidos_ref.doc(pedidoID).get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  let artigos = pedido.data().artigos
  artigos[index].faturado=faturado
  pedidos_ref.doc(pedidoID).set({
    artigos, 
  }, {merge: true})
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    error: false
  })
})




app.post("/api/novo_grupo", async (req, res) => {
  let grupo = req.body.grupo;
  const year = new Date().getFullYear()

  const dist = await distAnualRef.add({
    grupo: grupo.abrv,
    year,
    anual: {
      "m1": 0,
      "m2": 0,
      "m3": 0,
      "m4": 0,
      "m5": 0,
      "m6": 0,
      "m7": 0,
      "m8": 0,
      "m9": 0,
      "m10": 0,
      "m11": 0,
      "m12": 0,
    },
    total: 0
  })

  const new_group = await grupos_ref.add({
    ...grupo, 
    dist: dist.id
  })
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  grupo.membros.forEach(async m=>{
    await grupos_ref.doc(new_group.id).collection("membros").add({
      name: m,
      dist: [{
        "m1": 0,
        "m2": 0,
        "m3": 0,
        "m4": 0,
        "m5": 0,
        "m6": 0,
        "m7": 0,
        "m8": 0,
        "m9": 0,
        "m10": 0,
        "m11": 0,
        "m12": 0,
        total: 0,
        year
      }]
    })
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  })
  res.json({
    error: false
  })
});

app.post("/api/nova_empresa", async (req, res) => {
  const empresa = req.body.empresa;
  await empresas_ref.add(empresa)
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  
  res.json({
    error: false
  })

});

app.post("/api/addNE", async (req, res) => {
  const ne = req.body.ne;

  await notasEncomendaRef.add(ne)
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    error: false
  })

});

app.delete("/api/deleteNE", async (req, res) => {
  const neID = req.body.neID;
  
  await notasEncomendaRef.doc(neID).delete()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  res.json({
    error: false
  })
});

app.post("/api/getRubricasByEmpresa", async (req, res) => {
  let e = req.body.empresa;
  if(e){
    const notasEncomenda = await notasEncomendaRef
      .where("empresa_id", "==", e)
      .get()
      .catch(err => {
        res.json({
            error: true,
            msg: String(err)
        })
      })

      res.json({
        data: notasEncomenda.docs.map(doc=>{
          return {
            ...doc.data(),
            id: doc.id
          }
        })
      })
  }else{
    res.json({
      data: null
    })
  }

});

app.post("/api/getFaturasByPedido", async (req, res) => {
  let pedidoID = req.body.pedidoID;
  if(pedidoID){
    const faturas = await faturasRef
      .where("pedido", "==", pedidoID)
      .get()
      .catch(err => {
        res.json({
            error: true,
            msg: String(err)
        })
      })
     
      res.json({
        data: faturas.docs.map(doc=>{
          return {
            ...doc.data(),
            id: doc.id
          }
        })
      })
  }else{
    res.json({
      data: null
    })
  }

});

app.post("/api/getFaturasByEmpresa", async (req, res) => {
  let e = req.body.empresa;
  const faturas = await faturasRef
    .where("empresa", "==", e)
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    
    res.json({
      data: faturas.docs.map(doc=>{
        return {
          ...doc.data(),
          id: doc.id
        }
      })
    })

});

app.post("/api/addFatura", async (req, res) => {
  let data = req.body.fatura;
  await faturasRef.add(data)
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })

    res.json({
      error: false
    })

});

app.delete("/api/deleteFatura", async (req, res) => {
  let id = req.body.id;
  await faturasRef.doc(id).delete()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })

    res.json({
      error: false
    })

});

app.post("/api/getEmpresasByRubrica", async (req, res) => {
  let r = req.body.rubrica;
  const empresas = await notasEncomendaRef
    .where("rubrica", "==", r)
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    res.json({
      data: empresas.docs.map(doc=>{
        return {
          ...doc.data(),
          id: doc.id
        }
      })
    })

});

app.post("/api/getEmpresaById", async (req, res) => {
  let id = req.body.id;
  if(id){
    const result = await empresas_ref.doc(id).get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
    res.json({
      data: result.data()
    })
  }else{
    res.json({
      data: null
    })
  }
 
});

app.post("/api/editEmpresa", async  (req, res) => {
  let id_empresa = req.body.id;
  const nesIDs = req.body.nesIDs
  const empresa = req.body.data
  nesIDs.forEach(async (id)=>{
    await notasEncomendaRef.doc(id).set({
      empresa: empresa.empresa
    }, {merge: true})
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  })
  await empresas_ref.doc(id_empresa).set(empresa, {merge: true})
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  
  res.json({
    error: false
  })

});

app.delete("/api/deleteEmpresa",  async (req, res) => {
  let id = req.body.id;
  const fetchNES = await notasEncomendaRef.where("empresa_id", "==", id)
  .get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  fetchNES.forEach(async (doc)=>{
     await notasEncomendaRef.doc(doc.id).delete()
     .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    }) 
  })
  await empresas_ref.doc(id).delete()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    error: false
  })
});

app.post("/api/getEmpresaStats",  (req, res) => {
  let stats = {
    "materiais": {},
    "reagentes": {},
    "sequenciacao": {}
  };
  let promises = []
  let pedidos_id;
  let pedido
  pedidos_ref.orderByChild("empresa").equalTo(req.body.name).once("value")
    .then( (snap) => {
      if (snap.val() != null) {
        pedidos_id = Object.keys(snap.val())
        pedido = snap.val();
        pedidos_id.forEach(id => {
          promises.push(grupos_ref.child(pedido[id].grupo).child("abrv").once("value"))
        })
        return Promise.all(promises)
      } else {
        stats["error"] = true
      }
    })
    .then( (grupos) => {
      grupos.forEach( (grupo, index)=> {
        let id = pedidos_id[index]
        let rubrica = pedido[id]["rubrica"]["name"].toLowerCase();
        if (stats[rubrica][grupo.val()] != undefined) {
          stats[rubrica][grupo.val()] += pedido[id]["valor_total"]
        } else {
          stats[rubrica][grupo.val()] = pedido[id]["valor_total"]
        }
      })
      res.send(stats)
    }).catch(err => res.send(err))
});

app.delete("/api/deletePedido", async (req, res) => {
  let id = req.body.id;
  const pedido_doc = await pedidos_ref.doc(id)
  .get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  const pedido_data = {
    ...pedido_doc.data(),
    id
  }

  const faturas = await faturasRef.where("pedido", "==", id).get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  faturas.forEach(async (doc)=>{
    await faturasRef.doc(doc.id).delete()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  })
  await updateGrupoDist(Number(pedido_data.valor_total)*-1, pedido_data, res)
 
  await pedidos_ref.doc(id).delete()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  const notaE = await notasEncomendaRef.doc(pedido_data.ne_id).get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  await notasEncomendaRef.doc(pedido_data.ne_id).set({
    saldo_disponivel: notaE.data().saldo_disponivel + pedido_data.valor_total
  }, {merge: true})

  res.json({
    error: false
  })

});

app.delete("/api/deleteGrupo", async (req, res) => {
  const id = req.body.id;  
  const distID = req.body.selectedDistID
  const members = await grupos_ref.doc(id).collection("membros").get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  members.forEach(async (m)=>{
    await grupos_ref.doc(id).collection("membros").doc(m.id).delete()
  })

  await grupos_ref.doc(id).delete()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  await distAnualRef.doc(distID).delete()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  res.json({
    error: false
  })

  
});

app.patch("/api/editGrupo", async (req, res) => {
  const id = req.body.id;
  const data = req.body.data
  const old_data = await grupos_ref.doc(id).get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  const old_grupo_data_membros = await grupos_ref.doc(id).collection("membros").get()
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  const membros_names = old_grupo_data_membros.docs.map(doc=>doc.data().name)
  const diff = data.membros.filter(m=>!membros_names.includes(m)).concat(membros_names.filter(x => !data.membros.includes(x)))
  if(diff.length > 0){
    diff.forEach(async (dif_m) =>{
      if(membros_names.includes(dif_m)){
        const m_id = old_grupo_data_membros.docs.filter(doc=>doc.data().name=== dif_m)[0].id
        await grupos_ref.doc(id).collection("membros").doc(m_id).delete()
        .catch(err => {
          res.json({
              error: true,
              msg: String(err)
          })
        })
      }else{
        await grupos_ref.doc(id).collection("membros").add({
          name: dif_m,
          dist: [{
            "m1": 0,
            "m2": 0,
            "m3": 0,
            "m4": 0,
            "m5": 0,
            "m6": 0,
            "m7": 0,
            "m8": 0,
            "m9": 0,
            "m10": 0,
            "m11": 0,
            "m12": 0,
            total: 0,
            year: new Date().getFullYear()
          }]
        }).catch(err => {
          res.json({
              error: true,
              msg: String(err)
          })
        })

      }
    })
  }

 await grupos_ref.doc(id).set(data, {merge: true})
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })

  if(data.abrv !== old_data.data().abrv){
    await distAnualRef.doc(old_data.data().dist).set({
      grupo: data.abrv
    }, {merge: true})
  }
  
  res.json({
    error: false
  })
});

app.post("/api/getGrupoById", async (req, res) => {
  let id = req.body.id;
  if(id){
    const grupo = await grupos_ref.doc(id)
      .get()
      .catch(err => {
        res.json({
            error: true,
            msg: String(err)
        })
      })
      res.json({
        data: grupo.data()
      })
  }else{
    res.json({
      data: null
    })
  }
});

app.post("/api/getPedidoById", async (req, res) => {
  let id = req.body.id;
  if(!id){
    res.json({
      data: null
    })
  }else{
    const pedido = await pedidos_ref.doc(id)
    .get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  
    res.json({
      data: pedido.data()
    })
  }
});

app.post("/api/editPedido", async (req, res) => {
    let pedido = req.body.data;
    const id = req.body.id
    const old_pedido = await pedidos_ref.doc(id)
      .get()
      .catch(err => {
        res.json({
            error: true,
            msg: String(err)
        })
      })
    let valor_atualizar = Number(pedido.valor_total - old_pedido.data().valor_total)
    if(Boolean(valor_atualizar)){
      updateGrupoDist(valor_atualizar, pedido, res)
      const notaE = await notasEncomendaRef.doc(pedido.ne_id).get()
        .catch(err => {
          res.json({
              error: true,
              msg: String(err)
          })
        })
        await notasEncomendaRef.doc(pedido.ne_id).set({
          saldo_disponivel: notaE.data().saldo_disponivel + (valor_atualizar*-1)
        })
    }
    await pedidos_ref.doc(id)
      .set(pedido, {merge: true})
      .catch(err => {
        res.json({
            error: true,
            msg: String(err)
        })
      })
    res.json({
      error: false
    })
});


app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, "build/index.html"))     
});

app.listen(port, () => {
  console.log("App is listenning o port " + port);
});