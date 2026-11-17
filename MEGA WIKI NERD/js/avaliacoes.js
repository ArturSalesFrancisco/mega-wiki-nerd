const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}

fetch("../db/db.json")
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

const avaliados = document.getElementById("secao-avaliados");
const search = document.getElementById("search");
const obrasAvaliadas = usuarioLogado.avaliacoes.map(avaliacao => {
    const obra = catalogo.find(obra => obra.id === avaliacao.idObra);
    return {
        ...obra,
        nota: avaliacao.nota
    }
});

    function renderizarAvaliados(obrasAvaliadas){
        avaliados.innerHTML = "";
        obrasAvaliadas.forEach(obra => {
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
            
            const nota = document.createElement("p");
            nota.textContent = `Sua nota: ${obra.nota}/10`;

            card.appendChild(nome);
            card.appendChild(imagem);
            card.appendChild(nota);
            container.appendChild(card)
            avaliados.appendChild(container);
        });
    }

    renderizarAvaliados(obrasAvaliadas);

    function filtrarAvaliados(){
    const termoPesquisa = search.value.toLowerCase().trim();
    const avaliadosFiltrados = obrasAvaliadas.filter(obra => {
        return obra.titulo.toLowerCase().includes(termoPesquisa);
    });
    if (avaliadosFiltrados.length === 0){
        avaliados.innerHTML = "<p class='text-center text-white mt-4'>Nenhuma obra encontrada.</p>";
    } else {
        renderizarAvaliados(avaliadosFiltrados);
    }
}
search.addEventListener("input", () => {
    if (search.value === ""){
        renderizarAvaliados(obrasAvaliadas);
    } else {
        filtrarAvaliados();
    }
})

    const ordenar = document.getElementById("ordenar");
    ordenar.addEventListener("change", () => {
        const seletorEscolhido = ordenar.value;
        const listaOrdenada = [...obrasAvaliadas];
        if (seletorEscolhido === "maiorNota"){
            listaOrdenada.sort((a, b) => b.nota - a.nota);
        } else if (seletorEscolhido === "menorNota"){
            listaOrdenada.sort((a, b) => a.nota - b.nota);
        } else if (seletorEscolhido === "az"){
            listaOrdenada.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (seletorEscolhido === "za"){
            listaOrdenada.sort((a, b) => b.titulo.localeCompare(a.titulo));
        } else if (seletorEscolhido === "maisRecente"){
            listaOrdenada.sort((a, b) => b.ano - a.ano);
        } else if (seletorEscolhido === "maisAntigo"){
            listaOrdenada.sort((a, b) => a.ano - b.ano);
        }
        renderizarAvaliados(listaOrdenada);
    })

})