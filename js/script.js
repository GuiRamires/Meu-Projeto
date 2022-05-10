function carregardados(){

    fetch("http://localhost:3104/api/cliente/listar")
    .then((resultado) => resultado.json())
    .then((dados) =>{
        dados.output.map((item)=>{
            var div = `<div id=item>
            <h2>${item.nome}</h2>
            <h3>${item.email}</h3>
            <h3>${item.telefone}</h3>
            <h3>${item.cidades}</h3>
            </div>`;

            document.getElementsByTagName("main")[0].innerHTML += div;
        })
    })

}

function cadastrar(){

    let nome = document.getElementsByTagName("input")[0];
    let email = document.getElementsByTagName("input")[1];
    let telefone = document.getElementsByTagName("input")[2];
    let cidades = document.getElementsByTagName("input")[3];
    fetch("http://localhost:3104/api/cliente/cadastrar", {
        method: "POST", 
        headers: {
            accept: "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            nome:nome.value,
            email:email.value,
            telefone:telefone.value,
            cidades:cidades.value,
        })
    })
    .then((resultado) => resultado.json())
    .then((dados) => {
        alert(`${dados.output}\n${dados.payload}`)
        // limpar o formulario
        nome.value = "";
        email.value = "";
        telefone.value = "";
        cidades.value = ""
    })
    .catch((err) => console.error(err));
    window.location.reload();
}

function telacadastro(){
    document.getElementsByTagName("section")[0].style.marginTop = "0px";
    document.getElementsByTagName("section")[0].style.boxShadow = "0px 0px 0px 100vw rgba(0,0,0,0.6)"
}



// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////// //





// importação do modulo express
const express = require('express');

// importação do modulo do mongoose
const mongoose = require('mongoose');

// criação do app referente ao express
const app = express();

// preparar o servidor para receber json
app.use(express.json());

/*
    Caminho do banco de dados mongodb
    mongodb+srv://guiramires:<password>@bdd-do-rs.q4zaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
*/

const urldb = "mongodb+srv://guiramires:Rl31072004@bdd-do-rs.q4zaa.mongodb.net/BDDdoRs?retryWrites=true&w=majority"
mongoose.connect(urldb,{useNewUrlParser:true,useUnifiedTopology:true});

/*
    Definição do esquema de dados da tabela
    Schema
*/

const tabela = mongoose.Schema({
    nomedoproduto:{type:String,require},
    descricao:{type:String,require},
    categoria:{type:String,require},
    quantidade:{type:String,require},
    preco:{type:String,require}
});

const Produtos = mongoose.model("tbprodutos",tabela);

// definição de uma rota padrão
const default_route = "/api/produto";

// rota para listar os produtos com endpoint listar
app.get(`${default_route}/listar`,(req,res)=>{

    Produtos.find().then((dados)=>{

        res.status(200).send({output:dados});
    })

    .catch((erro) => res
        .status(500)
        .send({output:`Erro interno ao processar a consulta -> ${erro}`}));

});

// rota para cadastrar os produtos com endpoint cadastrar
app.post(`${default_route}/cadastrar`,(req,res)=>{

    const prod = new Produtos(req.body);
    prod.save().then((dados)=>{
        res.status(201).send({output:`Produto cadastrado com sucesso! <3`,payload:dados})
    }).catch((erro)=> console.error(`Erro ao tentar cadastrar o produto </3 ${erro}`));

});

// rota para atualizar os produtos com endpoint atualizar
// passagem de argumentos pela url com id do produto
app.put(`${default_route}/atualizar/:id`,(req,res)=>{

    Produtos.findByIdAndUpdate(req.params.id,req.body,
        {new:true},(erro,dados)=>{
        if(erro){
            return res.status(500).
            send({output:`Não atualizou -> ${erro}`})
        }
        res.status(200).send({output:`Produto(s) atualizado(s)`})
    })

});

// rota para apagar o produto com endpoint deletar
app.delete(`${default_route}/apagar/:id`,(req,res)=>{

    Produtos.findByIdAndDelete(req.params.id, (erro,dados)=> {
        if(erro){
            return res.
            status(500).
            send({output:`Erro ao tentar apagar o produto -> ${erro}`})
        }
        res.status(204).send({output:`Produto apagado com sucesso`});
    });
});

// definição a porta de comunicação do servidor
app.listen(5000,
    ()=>console.log("Servidor on-line em http://localhost:5000"));