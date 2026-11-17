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

const cardObra = document.getElementById("nerd-cards");
const search = document.getElementById("search");
const filtroStreaming = document.getElementById("seletor-streaming");
const filtroGenero = document.getElementById("seletor-genero");
const filtroNota = document.getElementById("seletor-nota");
const filtroObra = document.getElementById("seletor-obra");
const filtroTipo = document.getElementById("seletor-tipo");
const cardFranquia = document.getElementById("card-franquias");
const divFrq = document.getElementById("div-frq");
const btnFrq = document.getElementById("ativar-frq");

let verFrq = false;
btnFrq.addEventListener("click", () => {
    verFrq = !verFrq;
    if (verFrq) {
        divFrq.style.display = "block";
        btnFrq.textContent = "ESCONDER FRANQUIAS"
    } else {
        divFrq.style.display = "none";
        btnFrq.textContent = "VER FRANQUIAS"
    }
})

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

const blocosFranquias = dados.franquias;
blocosFranquias.forEach(bloco => {
    const cont = document.createElement("div");
    cont.classList.add("col-md-3", "col-sm-12", "col-12");
    cont.style.cursor = "pointer";
    cont.addEventListener("click", () => {
    window.location.href = `franquias.html?id=${bloco.id}`;
    })

    const bloc = document.createElement("div");
    bloc.classList.add("componente-bloco-frq");

    const banner = document.createElement("img");
    banner.classList.add("banner-frq")
    banner.src = bloco.imagem;
    banner.alt = bloco.nome

    bloc.appendChild(banner);
    cont.appendChild(bloc);
    cardFranquia.appendChild(cont)
})

    function embaralhar(lista) {
        for (let i = lista.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [lista[i], lista[j]] = [lista[j], lista[i]];
        }
    }

    const catalogoEmbaralhado = [...catalogo];
    embaralhar(catalogoEmbaralhado);

    function renderizarCard(catalogo){
        cardObra.innerHTML = ""
        catalogo.forEach(obra => {
            const container = document.createElement("div");
            container.classList.add("col-md-3", "col-sm-12", "col-12")

            container.style.cursor = "pointer";
            container.addEventListener("click", () => {
            window.location.href = `detalhesobras.html?id=${obra.id}`;
            })

            const card = document.createElement("div");
            card.classList.add("componente-card-series");

            const nome = document.createElement("h2");
            nome.textContent = obra.titulo;

            const imagem = document.createElement("img");
            imagem.src = obra.imagem;
            imagem.alt = obra.titulo;
            imagem.classList.add("img-fluid", "mb-2", "card-img-top", "imagem-card");

            const estreia = document.createElement("p");
            estreia.textContent = obra.estreia

            card.appendChild(nome)
            card.appendChild(imagem)
            card.appendChild(estreia)
            container.appendChild(card)

            cardObra.appendChild(container)
        });
    }

    renderizarCard(catalogoEmbaralhado);

    function filtrarObras(){
    const termoPesquisa = search.value.toLowerCase().trim();
    const obrasFiltradas = catalogo.filter(obra => {
        return obra.titulo.toLowerCase().includes(termoPesquisa);
    });
    if (obrasFiltradas.length === 0){
        cardObra.innerHTML = "<p class='text-center text-white mt-4'>Nenhuma obra encontrada.</p>";
    } else {
        renderizarCard(obrasFiltradas);
    }
}
search.addEventListener("input", () => {
    if (search.value === ""){
        renderizarCard(catalogoEmbaralhado);
    } else {
        filtrarObras();
    }
})
renderizarCard(catalogoEmbaralhado);

    function aplicarFiltro(){
        const streamingSelecionado = filtroStreaming.value;
        const generoSelecionado = filtroGenero.value;
        const notaSelecionada = filtroNota.value;
        const obraSelecionada = filtroObra.value;
        const tipoSelecionado = filtroTipo.value;

        const obrasSelecionadas = catalogo.filter(obra => {
            const bateStreaming = streamingSelecionado === "Todos" || streamingSelecionado === "" || obra.streaming.toLowerCase().includes(streamingSelecionado.toLowerCase());

            const bateGenero = generoSelecionado === "Todos" || generoSelecionado ==="" || obra.genero.some(g => g.trim().toLowerCase() === generoSelecionado.toLowerCase());

            const bateNota = notaSelecionada === "Todas" || notaSelecionada === "" || Number(obra.avaliacao) >= Number(notaSelecionada);

            const bateObra = obraSelecionada === "Todas" || obraSelecionada === "" || obra.categoria === obraSelecionada.toLowerCase();

            const bateTipo = tipoSelecionado === "Todos" || tipoSelecionado === "" || obra.tipo.toLowerCase().includes(tipoSelecionado.toLowerCase());

            return bateGenero && bateStreaming && bateNota && bateObra && bateTipo;
        });
        if (obrasSelecionadas.length === 0) {
        cardObra.innerHTML = "<p class='text-center text-white mt-4'>Nenhuma série encontrada com esses filtros.</p>";
        } else {
            renderizarCard(obrasSelecionadas);
        }
    }
    filtroStreaming.addEventListener("change", aplicarFiltro);
    filtroGenero.addEventListener("change", aplicarFiltro);
    filtroNota.addEventListener("change", aplicarFiltro);
    filtroObra.addEventListener("change", aplicarFiltro);
    filtroTipo.addEventListener("change", aplicarFiltro);

    const ordenar = document.getElementById("ordenar");
    ordenar.addEventListener("change", () => {
        const seletorEscolhido = ordenar.value;
        const listaOrdenada = [...catalogoEmbaralhado];
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
        renderizarCard(listaOrdenada);
    })

})
.catch(erro => console.error("Erro:", erro));