const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}

const params = new URLSearchParams(window.location.search);
const idFrq = params.get("id");
const obras = document.getElementById("obras-relacionadas");

fetch("db/db.json")
.then(response => response.json())
.then(dados => {
    let frq;
    frq = dados.franquias.find(f => f.id === idFrq);
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

    const nomeFrq = document.getElementById("nome-frq");
    nomeFrq.textContent = frq.nome;

    const qntObras = document.getElementById("qnt-obras-frq");
    qntObras.textContent = `${frq.titulos.length} obras relacionadas`;

    const img = document.getElementById("img-banner-frq");
    img.src = frq.imagem;
    img.alt = frq.nome;

    const descricao = document.getElementById("descricao");
    descricao.textContent = frq.descricao;

    const listaObras = [];
    frq.titulos.forEach(titulo => {
        const idTitulo = titulo;
        const relacionada = catalogo.find(o => o.id === idTitulo)
        listaObras.push(relacionada);
    });

    function renderizarCard(obras, secao){
        secao.innerHTML = ""
        if (obras.length === 0) {
            secao.textContent = `NADA POR AQUI AINDA...`
        }
        obras.forEach(obra => {
            const container = document.createElement("div");
            container.classList.add("col-md-2", "col-sm-12", "col-12")

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
            imagem.classList.add("img-fluid", "mb-2", "card-img-top", "imagem-card-fav");

            const estreia = document.createElement("p");
            estreia.textContent = obra.estreia;

            card.appendChild(nome);
            card.appendChild(imagem);
            card.appendChild(estreia);
            container.appendChild(card);

            secao.appendChild(container);
        });
    }

    renderizarCard(listaObras, obras)

    function filtrarObras(){
        const termoPesquisa = search.value.toLowerCase().trim();
        const obrasFiltradas = listaObras.filter(obra => {
            return obra.titulo.toLowerCase().includes(termoPesquisa);
        });
        if (obrasFiltradas.length === 0){
            cardObra.innerHTML = "<p class='text-center text-white mt-4'>Nenhuma obra encontrada.</p>";
        } else {
            renderizarCard(obrasFiltradas, obras);
        }
    }
    search.addEventListener("input", () => {
        if (search.value === ""){
            renderizarCard(listaObras, obras);
        } else {
            filtrarObras();
        }
    })
    renderizarCard(listaObras, obras);
    
    const ordenar = document.getElementById("ordenar");
    ordenar.addEventListener("change", () => {
        const seletorEscolhido = ordenar.value;
        const listaOrdenada = [...listaObras];
        if (seletorEscolhido === "maiorNota"){
            listaOrdenada.sort((a, b) => b.avaliacao - a.avaliacao);
        } else if (seletorEscolhido === "menorNota"){
            listaOrdenada.sort((a, b) => a.avaliacao - b.avaliacao);
        } else if (seletorEscolhido === "az"){
            listaOrdenada.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (seletorEscolhido === "za"){
            listaOrdenada.sort((a, b) => b.titulo.localeCompare(a.titulo));
        } else if (seletorEscolhido === "maisRecente"){
            listaOrdenada.sort((a, b) => b.ano - a.ano);
        } else if (seletorEscolhido === "maisAntigo"){
            listaOrdenada.sort((a, b) => a.ano - b.ano);
        }
        renderizarCard(listaOrdenada, obras);
    })
})