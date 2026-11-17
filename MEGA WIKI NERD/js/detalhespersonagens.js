const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}

const params = new URLSearchParams(window.location.search);
const idPersonagem = params.get("id");

const btnVoltar = document.getElementById("btn-voltar-obra");

fetch("db/db.json")
.then(response => response.json())
.then(dados => {
    const catalogoPersonagens = dados.personagens
    const personagem = dados.personagens.find(
        p => p.id === idPersonagem
    );

    btnVoltar.addEventListener("click", () => {
        window.location.href = `detalhesobras.html?id=${personagem.obra[0]}`;
    });

    const imagem = document.getElementById("imagem");
    imagem.src = personagem.imagem;
    imagem.alt = personagem.nome;
    imagem.classList.add("img-fluid", "mb-2", "card-img-top", "main-imagem-perso");

    const idade = document.getElementById("idade");
    idade.textContent = personagem.idade;
    
    const especie = document.getElementById("especie");
    especie.textContent = personagem.especie;

    const status = document.getElementById("status");
    status.textContent = personagem.status;

    const genero = document.getElementById("genero");
    genero.textContent = personagem.genero;

    const ocupacoes = document.getElementById("ocupacoes");
    ocupacoes.textContent = personagem.ocupacao;

    const nome = document.getElementById("nome");
    nome.textContent = personagem.nome;

    const descricao = document.getElementById("descricao");
    descricao.textContent = personagem.descricao;

    const firstap = document.getElementById("1ap");
    firstap.textContent = `Primeira aparição: "${personagem.primeiraap}"`

    const aparicoes = document.getElementById("aparicoes");
    aparicoes.textContent = `Aparições: ${personagem.aparicoes}`

    //GERAR GALERIA
    const galeria = document.getElementById("galeria");
    const btnGaleria = document.getElementById("btn-galeria");
    const gradiente = document.getElementById("gradiente");
    personagem.galeria.forEach(caminho => {
        const img = document.createElement("img");
        img.src = caminho;
        img.classList.add("imagem-galeria");

        galeria.appendChild(img);
    });

    btnGaleria.addEventListener("click", () => {
        galeria.classList.toggle("aberta");
        if (galeria.classList.contains("aberta")) {
            btnGaleria.textContent = "Ver menos ▲";
            gradiente.style.display = "none"
        } else {
            btnGaleria.textContent = "Ver mais ▼";
            gradiente.style.display = "flex"
        }
    });
    
    //GERAR HABILIDADES
    const habilidades = document.getElementById("habilidades");
    personagem.habilidades.forEach(poder => {
        const hab = document.createElement("p");
        hab.textContent = poder;

        habilidades.appendChild(hab);
    })

    //GERAR RELACIONADOS
    const secaoRelacoes = document.getElementById("relacoes");
    const personagensRelacionados = personagem.relacoes.map(id => {
        return catalogoPersonagens.find(p => p.id === id);
    });

    personagensRelacionados.forEach(personagem => {
        const container = document.createElement("div");
        container.classList.add("col-md-2", "col-sm-4", "col-12");
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
        secaoRelacoes.appendChild(container);

    });
        
    //GERAR CURIOSIDADES
    const curiosidades = document.getElementById("curiosidades");
    personagem.curiosidades.forEach(curiosidade => {
        const curio = document.createElement("li");
        curio.textContent = curiosidade;

        curiosidades.appendChild(curio);
    })
});
