const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}

const nomeUsuario = document.getElementById("nome-usuario");
nomeUsuario.textContent = `NOME: ${usuarioLogado.nome}`

const loginUsuario = document.getElementById("login-usuario");
loginUsuario.textContent = `LOGIN: ${usuarioLogado.login}`

const qntFavoritos = document.getElementById("qnt-favoritos");
qntFavoritos.textContent = `${usuarioLogado.favoritos.length} OBRAS FAVORITADAS`

const qntAssistidos = document.getElementById("qnt-assistidos");
qntAssistidos.textContent = `${usuarioLogado.assistidos.length} OBRAS ASSISTIDAS`

const qntAvaliados = document.getElementById("qnt-avaliados");
qntAvaliados.textContent = `${usuarioLogado.avaliacoes.length} OBRAS AVALIADAS`

const secaoFavoritos = document.getElementById("cards-favoritos");
const secaoMinhaLista = document.getElementById("cards-minha-lista");
const secaoRecomendacao = document.getElementById("cards-recomendacao");

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
    const obrasFavoritas = catalogo.filter(obra => usuarioLogado.favoritos.includes(obra.id));
    const obrasLista = catalogo.filter(obra => usuarioLogado.lista.includes(obra.id));
    let soma = 0;
    let maiorNota = 0;
    let melhorObra = null;
    let estatisticasGenero = {};
    usuarioLogado.avaliacoes.forEach(avaliacao => {
        soma += avaliacao.nota;
        if (avaliacao.nota > maiorNota) {
            maiorNota = avaliacao.nota;
            melhorObra = catalogo.find(obra => obra.id === avaliacao.idObra);
        }
        const qualObra = catalogo.find(obra => obra.id === avaliacao.idObra);
        qualObra.genero.forEach(gen => {
            if (!(estatisticasGenero[gen])) {
                estatisticasGenero[gen] = {
                    somaNota: 0,
                    quantidade: 0
                }
            }
            estatisticasGenero[gen].somaNota += avaliacao.nota;
            estatisticasGenero[gen].quantidade++;
        })
    });
    let rankingGeneros = [];
    Object.keys(estatisticasGenero).forEach(gen => {
        const media = estatisticasGenero[gen].somaNota/estatisticasGenero[gen].quantidade;
        const afinidade = media * Math.log2(estatisticasGenero[gen].quantidade + 1);
        rankingGeneros.push({
            genero: gen,
            afinidade: afinidade
        });
    });
    rankingGeneros.sort((a, b) => b.afinidade - a.afinidade);
    const top3 = rankingGeneros.slice(0,3);
    const generosFavoritos = top3.map(item => {
        return item.genero;
    });

    const recomendacoes = catalogo.filter(obra => {
        const jaAvaliada = usuarioLogado.avaliacoes.some(avaliacao => {
            return avaliacao.idObra === obra.id;
        });
        const possuiGeneroFavorito = obra.genero.some(gen => {
            return generosFavoritos.includes(gen);
        });

        return !jaAvaliada && possuiGeneroFavorito;
    })
    
    recomendacoes.sort((a, b) => b.avaliacao - a.avaliacao);
    const finalRecomendacoes = recomendacoes.slice(0, 6);

    const mediaAvaliacoes = soma/(usuarioLogado.avaliacoes.length);

    const valorAvaliacoes = document.getElementById("media-avaliacoes");
    valorAvaliacoes.textContent = `Média de notas: ${mediaAvaliacoes.toFixed(1)}`

    const maiorAvaliacao = document.getElementById("maior-nota");
    maiorAvaliacao.textContent = `VOCÊ DEU A NOTA ${maiorNota}/10 PARA "${melhorObra.titulo}"`

    let minutosAssistidos = 0;
    usuarioLogado.assistidos.forEach(ob => {
        const obraAssistida = catalogo.find(obra => obra.id === ob);
        if (obraAssistida.id.startsWith("S")){
            const tempoDeObra = obraAssistida.episodios * obraAssistida.duracaoep;
            minutosAssistidos += tempoDeObra;
        } else if (obraAssistida.id.startsWith("F")) {
            const duracaoFilme = parseFloat(obraAssistida.duracao);
            minutosAssistidos += duracaoFilme;
        }
    });

    const tempoAssistido = document.getElementById("minutos-assistidos");
    tempoAssistido.textContent = `${minutosAssistidos} MINUTOS ASSISTIDOS`

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

    const botoesTema = document.querySelectorAll(".tema");

    botoesTema.forEach(botao => {

    botao.addEventListener("click", async () => {

        const tema = botao.dataset.tema;

        aplicarTema(tema);

        usuarioLogado.tema = tema;

        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioLogado)
        );

        await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tema: tema
            })
        });

    });

});

    renderizarCard(obrasFavoritas, secaoFavoritos);
    renderizarCard(obrasLista, secaoMinhaLista);
    renderizarCard(finalRecomendacoes, secaoRecomendacao);
});

