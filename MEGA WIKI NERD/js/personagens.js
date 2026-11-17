const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}

const secaoPersonagens = document.getElementById("secao-personagens");
const search = document.getElementById("search");

fetch("db/db.json")
.then(response => response.json())
.then(dados => {
    const catalogoPersonagens = dados.personagens;

    function embaralhar(lista) {
        for (let i = lista.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [lista[i], lista[j]] = [lista[j], lista[i]];
        }
    }

    const catalogoEmbaralhado = [...catalogoPersonagens];
    embaralhar(catalogoEmbaralhado);

    function renderizarCard(catalogoEmbaralhado) {
        secaoPersonagens.innerHTML = "";
        catalogoEmbaralhado.forEach(personagem => {
            const container = document.createElement("div");
            container.classList.add("col-md-2", "col-sm-6", "col-6");
            container.style.cursor = "pointer";
            container.addEventListener("click", () => {
                window.location.href = `detalhespersonagens.html?id=${personagem.id}`
            });

            const card = document.createElement("div");
            card.classList.add("componente-card-personagens", "h-100", "d-flex", "flex-column");

            const nome = document.createElement("h2");
            nome.textContent = personagem.nome;
            nome.classList.add("fs-5", "text-center", "p-3", "m-0");
            nome.style.flexGrow = "1";

            const imagem = document.createElement("img");
            imagem.src = personagem.icone;
            imagem.alt = personagem.nome;
            imagem.classList.add("img-fluid", "card-img-top", "imagem-icone-personagem", "w-100");

            card.appendChild(nome);
            card.appendChild(imagem);
            container.appendChild(card)
            secaoPersonagens.appendChild(container);
        });
    }

    renderizarCard(catalogoEmbaralhado);

    function filtrarPersonagens(){
    const termoPesquisa = search.value.toLowerCase().trim();
    const personagensFiltrados = catalogoEmbaralhado.filter(personagem => {
        return personagem.nome.toLowerCase().includes(termoPesquisa);
    });
    if (personagensFiltrados.length === 0){
        secaoPersonagens.innerHTML = "<p class='text-center text-black mt-4'>Nenhum personagem encontrado.</p>";
    } else {
        renderizarCard(personagensFiltrados);
    }
}
search.addEventListener("input", () => {
    if (search.value === ""){
        renderizarCard(catalogoEmbaralhado);
    } else {
        filtrarPersonagens();
    }
})
})