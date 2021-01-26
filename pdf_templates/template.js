module.exports = (data)=>{
  let artigos_list = ""
  let propostas = "";
  data.artigos.map(a=>{
    artigos_list += `
    <tr>
      <td>${a.referencia_artigo}</td>
      <td>${a.artigo}</td>
      <td>${a.quantidade}</td>
      <td>${a.preco}</td>
      <td>${a.quantidade*a.preco}</td>
    </tr>
    `
  })
  data.propostas.map(p=>{
    propostas+=`
      <div>${p}</div>
    `
  })
  return `
  <!doctype html>
 <html>

 <head>
   <title>Pedido ${data.codigo}</title>
   <style>
     .wrapper {
       max-width: 800px;
       background: white;
       min-height: 900px;
       font-size: 12px;
       padding: 20px 0;

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
       height: 60px;
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
           <div class="infoCol"> <strong>REQUISIÇÃO</strong></div>
           <div class="infoCol">${data.codigo}</div>
         </div>
         <div class="infoRow">
           <div class="infoCol"> <strong>Nº CABIMENTO</strong></div>
           <div class="infoCol"> ${data.cabimento}</div>
         </div>
         <div class="infoRow">
           <div class="infoCol"> <strong>NOTA DE ENCOMENDA Nº</strong></div>
           <div class="infoCol"> ${data.ne}</div>
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
           <p><strong>${data.empresa_nome}</strong></p>
           <p><strong>${data.empresa_morada}</strong></p>
           <p><strong>${data.empresa_cp} - ${data.empresa_localidade}, ${data.empresa_distrito}</strong></p>
           <p><strong>NIF: ${data.empresa_nif}</strong></p>


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
         ${artigos_list}

       </table>
     </div>
     <div class="rowContainer">
       <div class="propostasContainer">
           <span>Propostas</span>
         <div class="propostasList">
           <div class="proposta">
             ${propostas}
           </div>
         </div>
       </div>
       <div class="totalContainer">
         <div class="totalRow">
           <span>Total</span>
           <span>${data.total.toFixed(2)} €</span>
         </div>
         <div class="totalRow">
           <span>IVA</span>
           <span>23%</span>
           <span>${(data.total*0.23).toFixed(2)} €</span>

         </div>
         <div class="totalRow">
           <span>Total fatura</span>
           <span>${(data.total*1.23).toFixed(2)} €</span>
         </div>
       </div>
     </div>
     <div class="rowContainer">
       <div class="noteContainer">
         <p class="note">As faturas devem mencionar o número e data de compromisso e o número da nota de encomenda.</p>

       </div>
     </div>
   </div>
 </body>

 </html>
  `
}