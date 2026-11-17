const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}

btnUsuario.addEventListener("click", () => {

    if(usuarioLogado){

        sessionStorage.removeItem("usuarioLogado");

        window.location.reload();

    }else{

        window.location.href = "../login/login.html";

    }

});

const params = new URLSearchParams(window.location.search);
const idAtor = params.get("id");

fetch("db/db.json")
.then(response => response.json())
.then(dados => {

    const catalogo = [
    ...dados.series.map(obra => ({
        ...obra,
        categoria: "serie"
    })),

    ...dados.filmes.map(obra => ({
        ...obra,
        categoria: "filme"
    })),

    ...dados.quadrinhos.map(obra => ({
        ...obra,
        categoria: "quadrinho"
    })),
    
    ...dados.jogos.map(obra => ({
       ...obra,
       categoria: "jogo" 
    }))
];
    
    const catalogoAtores = dados.atores
    const ator = dados.atores.find(
        p => p.id === idAtor
    );

    const imagem = document.getElementById("icn-ator");
    imagem.src = ator.icone;
    imagem.alt = ator.nome;
    imagem.classList.add("img-fluid", "mb-2", "card-img-top");

    const nome = document.getElementById("nome");
    nome.textContent = ator.nome;

    const nacionalidade = document.getElementById("nacionalidade");
    nacionalidade.textContent = ator.nacionalidade;

    const dataNascimento = document.getElementById("nascimento");
    dataNascimento.textContent = ator.nascimento;

    const qntObras = document.getElementById("qnt-obras");
    qntObras.textContent = `${ator.titulos.length} OBRAS REGISTRADA(S)`

    const obrasFeitas = document.getElementById("obras-feitas");
    const listaObras = [];
    ator.titulos.forEach(t => {
        const idObra = t.idObra;
        const relacionada = catalogo.find(o => o.id === idObra)
        listaObras.push(relacionada);
    });

    function renderizarCard(obras, secao){
        secao.innerHTML = ""
        if (obras.length === 0) {
            secao.textContent = `NADA POR AQUI AINDA...`
        }
        obras.forEach(obra => {
            const container = document.createElement("div");
            container.classList.add("col-md-3", "col-sm-12", "col-12")

            container.style.cursor = "pointer";
            container.addEventListener("click", () => {
            window.location.href = `detalhesobras.html?id=${obra.id}`;
            })

            const card = document.createElement("div");
            card.classList.add("componente-card-series");

            const nome = document.createElement("p");
            nome.textContent = obra.titulo;
            nome.classList.add("nome-serie-fav", "text-white");

            const imagem = document.createElement("img");
            imagem.src = obra.imagem;
            imagem.alt = obra.titulo;
            imagem.classList.add("img-fluid", "mb-2", "card-img-top", "imagem-card-ob-ator");

            const estreia = document.createElement("p");
            estreia.textContent = obra.estreia;

            card.appendChild(nome);
            card.appendChild(imagem);
            card.appendChild(estreia);
            container.appendChild(card);

            secao.appendChild(container);
        });
    }

    renderizarCard(listaObras, obrasFeitas)

})