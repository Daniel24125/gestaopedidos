const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');
const admin = require('firebase-admin');
const pdf = require("html-pdf")
const xl = require('excel4node');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const port = process.env.PORT || 8000;

require('dotenv').config()
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.CREDENTIALS))
});


app.use(cors({
  origin: [
      "http://localhost:3000", 
      // "http://192.168.2.18"
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

// app.use(jwtCheck);



app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

const artigosRef = admin.firestore().collection("artigos")
const pedidos_ref = admin.firestore().collection("pedidos")
const pedido_codigos_ref = admin.firestore().collection("codigo_pedidos")
const empresas_ref = admin.firestore().collection("fornecedores")
const grupos_ref = admin.firestore().collection("grupos")
const configRef = admin.firestore().collection("utils")
const notasEncomendaRef = admin.firestore().collection("notasEncomenda")
const faturasRef = admin.firestore().collection("faturas")
const distAnualRef = admin.firestore().collection("distAnual")


// app.post("/api/exportExcelData",  (req, res) => {
//   var wb = new xl.Workbook();
//   var ws = wb.addWorksheet('Distribuição Mensal');
//   var titles = ["Grupo", "Responsável", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Total"]
//   var style = wb.createStyle({
//     fill: {
//       type: 'pattern',
//       patternType: 'solid',
//       bgColor: '#FFFFFF',
//       // fgColor: '#FFFF00',
//     },
//     font: {
//       color: '#000000',
//       size: 11,
//     }, 
    
//   });
//   var titleStyle = wb.createStyle({
//     fill: {
//       type: 'pattern',
//       patternType: 'solid',
//       bgColor: "#000000"
//     },
//     font: {
//       color: '#ffffff',
//       size: 12,
//     },
//     alignment: {
//       horizontal: "center"
//     }
//   });

//   var selectedYear = req.body.year

//   ws.cell(1, 1, 1, titles.length, true)
//     .string("Valores Mensais (S/IVA)")
//     .style(titleStyle);

//   for (var i = 0; i < titles.length; i++) {
//     ws.cell(2, i + 1)
//       .string(titles[i])
//       .style(titleStyle)
//   }

//   distRef.child(selectedYear).once("value")
//     .then(dist => {
//       dist = dist.val()
//       let row_number = 3;
//       let promises_array = []
//       Object.keys(dist).map(g => {
//         let current_promise = grupos_ref.orderByChild("abrv").equalTo(g).once("value")
//           .then(result => {
//             let g_color = result.val()[Object.keys(result.val())[0]].color
//             let members = Object.keys(dist[g]["members"]);
//             let start_row = row_number;
//             members.map((m) => {
//               ws.cell(row_number, 1).string(g).style(style)
//                 .style({
//                   fill: {
//                     type: 'pattern',
//                     patternType: 'solid',
//                     "bgColor": g_color,
//                     fgColor: g_color
//                   }, 
//                   border: {
//                     top: {
//                       style:"thin", 
//                       color: "#000000"
//                     }, 
//                     bottom: {
//                       style:"thin", 
//                       color: "#000000"
//                     }
//                   }
//                 })
//               ws.cell(row_number, 2).string(m).style(style)
//                 .style({
//                   fill: {
//                     type: 'pattern',
//                     patternType: 'solid',
//                     "bgColor": g_color,
//                     fgColor: g_color
//                   }, 
//                   border: {
//                     top: {
//                       style:"thin", 
//                       color: "#000000"
//                     }, 
//                     bottom: {
//                       style:"thin", 
//                       color: "#000000"
//                     }
//                   }
//                 })

//               for (var j = 1; j <= 12; j++) {
//                 ws.cell(row_number, 2 + j).number(parseInt(dist[g]["members"][m][`m${j}`])).style(style)
//                   .style({
//                     alignment: {
//                       horizontal: "center"
//                     },
//                     fill: {
//                       type: 'pattern',
//                       patternType: 'solid',
//                       "bgColor": "#ffffff",
//                       fgColor: "#ffffff"
//                     }
//                   })
//               }

//               row_number++
//             })

//             let end_row = members.length > 1 ? start_row + members.length-1 : start_row
//             ws.cell(start_row, 15,end_row, 15, true)
//             .number(parseInt(dist[g]["total"])).style(style)
//             .style({
//               alignment: {
//                 horizontal: "center",
//                 vertical: "center"
//               },
//               fill: {
//                 type: 'pattern',
//                 patternType: 'solid',
//                 "bgColor": g_color,
//                 fgColor: g_color
//               }
//             })
//           })
//         promises_array.push(current_promise)
//       })

//       Promise.all(promises_array)
//         .then(_ => {
//           res.setHeader('Content-Type', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ");
//           wb.write(`distribuição_${selectedYear}.xlsx`, res)
//         })
//     })
// })

// GET REQUESTS 
app.get("/api/getNumPedidos",  async (req, res) => {
  const pedidos = await pedidos_ref.get().then(res=>res).catch(err => res.send(err))
  res.send({
    "num": pedidos.size
  })
});

app.get("/api/getCodigoPedidos", (req, res) => {
  pedido_codigos_ref.once("value")
    .then(codigos => {
      res.send(codigos)
    });
});

app.get("/api/getConfig",  (req, res) => {
  configRef.once("value")
    .then(configs => {
      res.send(configs.val())
    })
});

app.get("/api/queryPedidos", (req, res) => {
  let pedidos_selected = [];
  let pedidos_fatura = []
  pedidos_ref.get()
  .then(pedidos=>{
    pedidos.forEach(p=>{
      if (p.data()["fatura"] === undefined) {
        pedidos_fatura.push(p.id)
      }
      if(p.data()["artigos"].filter(art => art["quantidade_chegada"] < art["quantidade"]).length !== 0){
        pedidos_selected.push(p.id)
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
       return{ [doc.id]: doc.data()}
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
    "data": pedidos.docs.map(doc=> doc.id)
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
  
  const fornecedores = await empresas_ref.get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })
  
  const saldo_th = configs.data()["saldo_th"]
  let materiais = fornecedores.docs.map(doc=>doc.data()).filter(f=>"materiais" in f).length > 0 ? fornecedores.docs.map(doc=>doc.data()).filter(f=>"materiais" in f).filter(f=> f["materiais"]["saldo_disponivel"].slice(-1)[0] < saldo_th): []
  let reagentes = fornecedores.docs.map(doc=>doc.data()).filter(f=>"reagentes" in f).length > 0 ? fornecedores.docs.map(doc=>doc.data()).filter(f=>"reagentes" in f).filter(f=> f["reagentes"]["saldo_disponivel"].slice(-1)[0] < saldo_th): []
  let seq = fornecedores.docs.map(doc=>doc.data()).filter(f=>"sequenciacao" in f).length > 0 ? fornecedores.docs.map(doc=>doc.data()).filter(f=>"sequenciacao" in f).filter(f=>  f["sequenciacao"]["saldo_disponivel"].slice(-1)[0] < saldo_th): []
  res.json({
    num: materiais.length + reagentes.length + seq.length,
    materiais: materiais,
    reagentes: reagentes,
    seq: seq,
  })
});

// ["SANTA CRUZ BIOTECHNOLOGY", 
// "STAB VIDA - INVESTIG. E SERV. CIÊNCIAS BIOL., LDA",
// "ENZYMATIC, S.A.",
// "Waters",
// "VWR",
// "DIAS DE SOUSA - INST.ANAL.CIENTIFICA",
// "BIORAD LABORATÓRIOS, LDA",
// "Manuel Guerra, Testes Equip. Veterinários, LDA.",
// "BIOPORTUGAL QUIMICO FARMACEUTICA, LDA",
// "JOSE MANUEL GOMES DOS SANTOS, LDA",
// "ILC",
// "IZASA II SCIENTIFIC, UNIP. LDA",
// "SARSTEDT - TECNOLOGIA DE LABORATORIO, S.A."
// ].forEach((e,index)=>{
//   faturasRef.add({
//     empresa: e,
//     data_emissao_timestamp: Date.now(),
//     data_emissao: new Date().toJSON(),
//     codigo_fatura: "FT.2021.195955",
//     valor: 1000,
//     pedido: "7wXaeOmNyU3DpZlsmQAP",
//     notas: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus, nibh a faucibus dapibus, diam dolor blandit quam, sit amet dictum est nisi accumsan ligula. Sed vel porttitor nulla. Aenean mollis ullamcorper auctor. Curabitur vitae nisi posuere, cursus lorem ac, vestibulum neque. Nulla tempus imperdiet rhoncus. Integer laoreet dui sapien, ut sollicitudin sem congue eget. Etiam fermentum luctus ultricies."
//   })
// })

// ["SANTA CRUZ BIOTECHNOLOGY", 
// "STAB VIDA - INVESTIG. E SERV. CIÊNCIAS BIOL., LDA",
// "ENZYMATIC, S.A.",
// "Waters",
// "VWR",
// "DIAS DE SOUSA - INST.ANAL.CIENTIFICA",
// "BIORAD LABORATÓRIOS, LDA",
// "Manuel Guerra, Testes Equip. Veterinários, LDA.",
// "BIOPORTUGAL QUIMICO FARMACEUTICA, LDA",
// "JOSE MANUEL GOMES DOS SANTOS, LDA",
// "ILC",
// "IZASA II SCIENTIFIC, UNIP. LDA",
// "SARSTEDT - TECNOLOGIA DE LABORATORIO, S.A."
// ].forEach((e,index)=>{
//   notasEncomendaRef.add({
//     empresa: e,
//     cabimento: "2021.85796",
//     comprimisso: "5465156410",
//     data_registo: new Date().toJSON(), 
//     data_registo_timestamp: Date.now(), 
//     ne: "NE.9519.7169851985.7481"+index,
//     rubrica: "PR",
//     saldo_abertura: 15522,
//     saldo_disponível: 5456
//   })
// })


// for(let i in [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1]){

// pedidos_ref.add({
//   "artigos" : [ {
//     "artigo" : "AMYLOSE FROM POTATO, USED AS AMYLASE SU&",
//     "entrega" : {
//       "chegada" : true,
//       "data_chegada" : "23/01/2020",
//       "guia" : "sdfwsdfwef",
//       "quantidade_chegada" : "2"
//     },
//     "faturado" : false,
//     "preco" : "12",
//     "quantidade" : "2",
//     "referencia_artigo" : "A0512-1G"
//   } ],
//   "cabimento" : "2019.7093",
//   "codigo" : "SEQ_4",
//   "data_pedido" : 1611402411985,
//   "day" : 23,
//   "empresa" : "STAB VIDA - INVESTIG. E SERV. CIÊNCIAS BIOL., LDA",
//   "fatura" : [ {
//     "data_emissao" : "21/02/2021",
//     "name" : "FT.95549841.91981",
//     "notas" : "Uma fatura",
//     "valor_fatura" : "24"
//   } ],
//   "grupo" : "AMG",
//   "mounth" : 1,
//   "ne" : "NE.001.2019.0005718",
//   "notas" : "23er23er23",
//   "pedido_done" : true,
//   "pedido_feito" : true,
//   "pedido_feito_formated_date" : "23/ 0/2021",
//   "proposta" : "UM.156465.54968498",
//   "remetente" : "Daniel Madalena",
//   "responsavel" : "Nelson Lima",
//   "rubrica" : {
//     "code" : "SEQ",
//     "icon" : "gestures",
//     "name" : "Sequenciação"
//   },
//   "valor_total" : 24,
//   "year" : 2021
// })
// }


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

app.post("/api/saveConfig", (req, res) => {
  configRef.set(req.body)
  res.send({
    "msg": "success"
  })
});

app.post('/api/searchCP', (req, res) => {
  pedidos_ref.orderByChild("codigo").equalTo(req.body.search).once("value", sanpshot => {
    res.send({
      "result": sanpshot.val()
    })
  })
})

var pdf_template = require("./pdf_templates/template");

app.post("/api/createPdf", (req, res) => {
  let config = {
    "format": "A4",
    "directory": "./tmp",
  }
  pdf.create(pdf_template(req.body), config).toFile("./tmp/" + req.body.codigo + ".pdf", (err) => {
    if (err) {
      res.send({
        "error": err
      })
    } else {
      res.send({
        "error": false
      })
    }
  })

})

app.get("/api/getPdf", (req, res) => {
  fs.readdir(__dirname + "/tmp", (err, files) => {
    files.forEach(file_name => {
      try {
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(__dirname + "/tmp/" + file_name, () => {
          fs.unlink("./tmp/" + file_name, err => console.log(err))
          pedidos_ref.orderByChild("codigo").equalTo(file_name.split(".")[0]).once("value")
            .then(snap => {
              let time = new Date()
              let today = `${time.getDate()}/ ${time.getMonth()}/${time.getFullYear()}`;
              Object.keys(snap.val()).forEach(key => {
                pedidos_ref.child(key).child("pedido_feito_timestamp").set(time.getTime())
                pedidos_ref.child(key).child("pedido_feito_formated_date").set(today)
                pedidos_ref.child(key).child("pedido_feito").set(true)
              })
            })
        })
      } catch (error) {
        res.send({
          "error": "Houve um problema com o Download"
        })
      }


    });
  })
  // res.send({err:false})
})

app.post("/api/getEmpresaInfo", (req, res) => {
  empresas_ref.orderByChild("empresa").equalTo(req.body.empresa).once("value")
    .then(data => {
      res.send(data.val())
    });
})

app.post("/api/getDistAnual", async (req, res) => {
  const year = req.body.year
  console.log(year)
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

  const novo_pedido = await pedidos_ref
  .add(pedido)
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  if(pedido.faturas.length > 0){
    pedido.faturas.forEach( async (f, i)=>{
      await faturasRef.add({
        ...f,
        pedido: novo_pedido.id
      })
      .catch(err => {
        res.json({
          error: true,
          msg: String(err)
        })
      })
    })
  }
  
  await updateGrupoDist(Number(pedido.valor_total), pedido, res)

  res.json({
    error: false
  })

});

app.post("/api/addArticleToDb", (req, res) => {
  artigosRef.push(req.body.data, () => {
    res.send({
      "msg": `O artigo com a referência ${req.body.data.code} foi adicionado à base de dados`
    })
  })
});

app.post("/api/artigo_faturado", (req, res) => {
  let artigo_status = req.body;
  pedidos_ref.child(artigo_status.id).child("artigos").child(artigo_status.index).child("faturado").set(artigo_status.status)
  res.send({
    "msg": "Status updated"
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
  const notasEncomenda = empresa.nes
  delete empresa.nes
  const added_empresa = await empresas_ref.add(empresa)
  .catch(err => {
    res.json({
        error: true,
        msg: String(err)
    })
  })
  notasEncomenda.forEach(async (n)=>{
    await notasEncomendaRef.add({
      ...n,
      "empresa": empresa.empresa,
      "empresa_id": added_empresa.id
    })
  })
  
  res.json({
    error: false
  })

});


app.post("/api/getRubricasByEmpresa", async (req, res) => {
  let e = req.body.empresa;
  const notasEncomenda = await notasEncomendaRef
    .where("empresa", "==", e)
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

app.post("/api/editEmpresa",  (req, res) => {
  let id = req.body.id;
  empresas_ref.child(id).set(req.body.data, () => {
    res.send({
      "msg": "Success"
    })
  })
});

app.post("/api/deleteEmpresa",  (req, res) => {
  let id = req.body.id;
  empresas_ref.child(id).remove()
  empresas_ref.once('value', (empresas) => {
    res.send({
      "new_data": empresas.val()
    })
  });

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

  if(pedido_data.faturas.length !== 0){
    const faturas = await faturasRef.where("pedido", "==", pedido_data.id).get()
    .catch(err => {
      res.json({
          error: true,
          msg: String(err)
      })
    })

    faturas.forEach(async (doc)=>{
      await faturasRef.doc(doc.id).delete()
    })
  
  }

  await updateGrupoDist(Number(pedido_data.valor_total)*-1, pedido_data, res)
 
  await pedidos_ref.doc(id).delete()
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

app.listen(port, () => {
  console.log("App is listenning o port " + port);
});