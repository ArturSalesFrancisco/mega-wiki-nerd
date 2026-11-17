const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}
const params = new URLSearchParams(window.location.search);
const idObra = params.get("id");
const tipo = idObra[0];
const cardPersonagens = document.getElementById("cards-personagens");
const conteudoObra = document.getElementById("conteudo-serie");
const search = document.getElementById("search");
const iconeAssistido = document.getElementById("icone-assistido");
const iconeFavorito = document.getElementById("icone-favorito");
const iconeMinhalista = document.getElementById("icone-lista");
const btnAvaliar = document.getElementById("btn-avaliacao");
const avaliacao  = document.getElementById("avaliacao");
const reparticoes = document.getElementById("titulo-reparticoes");
const episodios = document.getElementById("episodios");
const secaoEpisodios = document.getElementById("componente-episodios-serie");
const calculadora = document.getElementById("calculadora");
const episodioDias = document.getElementById("episodios-dia");
const resultadoCalculadora = document.getElementById("resultado-calculadora");
const totalDias = document.getElementById("total-dias");
const tempoDeSerie = document.getElementById("tempo-total");
const tempoPorEpisodio = document.getElementById("tempo-por-episodio");
const btnMais = document.getElementById("btn-mais");
const btnMenos = document.getElementById("btn-menos");
const cardAtores = document.getElementById("cards-atores");
const divElenco = document.getElementById("elenco");
const cardsExplore = document.getElementById("explore-mais");
const exploreMais = document.getElementById("componente-explore-serie");

fetch("../db/db.json")
.then(response => response.json())
.then(dados => {
    let obra;
    if (tipo === "S") {
        obra = dados.series.find(o => o.id === idObra);
    } else if (tipo === "F") {
        obra = dados.filmes.find(o => o.id === idObra);
    } else if (tipo === "Q") {
        obra = dados.quadrinhos.find(o => o.id === idObra);
    } else if (tipo === "J") {
        obra = dados.jogos.find(o => o.id === idObra);
    }

    if(obra.tipo === "Live-action"){
        divElenco.style.display = "block"
    }

    const catalagoExplMais = dados.sessoes;

    const btnFavorito = document.getElementById("btn-favoritar");
    const btnAssistido = document.getElementById("btn-assistido");
    const btnMinhaLista = document.getElementById("btn-minhalista");
    const tempoTotal = obra.episodios * obra.duracaoep;
    const horas = Math.floor(tempoTotal / 60);
    const minutos = tempoTotal % 60;
    if (horas === 0) {
        tempoDeSerie.textContent = `TEMPO TOTAL DA SÉRIE: ${minutos} MINUTOS`;
    } else if (minutos === 0){
        tempoDeSerie.textContent = `TEMPO TOTAL DA SÉRIE: ${horas} HORAS`
    } else {
        tempoDeSerie.textContent = `TEMPO TOTAL DA SÉRIE: ${horas} HORAS e ${minutos} MINUTOS`;
    }
    //FUNÇÃO DE FAVORITAR E MARCAR ASSISTIDOS
    function atualizarIcone(lista, idObra, icone) {
        if (!usuarioLogado) {
            return;
        }
        if (usuarioLogado[lista].includes(idObra)) {
            if (lista === "favoritos") {
                icone.className = "bi bi-heart-fill";
            } else if (lista === "assistidos") {
                icone.className = "bi bi-eye-fill";
            } else if (lista === "lista") {
                icone.className = "bi bi-bookmark-fill";
            }
        } else {
            if (lista === "favoritos") {
                icone.className = "bi bi-heart";
            } else if (lista === "assistidos") {
                icone.className = "bi bi-eye";
            } else if (lista === "lista") {
                icone.className = "bi bi-bookmark";
            }
        }
    }
    async function alterarLista(lista, idObra, icone) {
        if (!usuarioLogado) {
            alert("Faça login para usar essa função");
            return;
        }
        if(usuarioLogado[lista].includes(idObra)) {
            const indice = usuarioLogado[lista].indexOf(idObra);
            usuarioLogado[lista].splice(indice, 1);
        } else {
            usuarioLogado[lista].push(idObra);
        }
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
                [lista]: usuarioLogado[lista]
            })
        });
        atualizarIcone(lista, idObra, icone);
    }
    //FUNÇÃO DE AVALIAR OBRA
    async function avaliarObra(nota){
        if (!usuarioLogado) {
            alert("Faça login para avaliar.");
            return;
        }
        if (!usuarioLogado.avaliacoes) {
            usuarioLogado.avaliacoes = [];
        }
        const avaliacaoExistente = usuarioLogado.avaliacoes.find(
            a => a.idObra === idObra
        );
        if (avaliacaoExistente) {
            avaliacaoExistente.nota = nota;
        } else {
            usuarioLogado.avaliacoes.push({
                idObra: idObra,
                nota: nota
            });
        }
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
                avaliacoes: usuarioLogado.avaliacoes
            })
        });
    }
    async function removerAvaliacao() {
        const indice = usuarioLogado.avaliacoes.findIndex(
            a => a.idObra === idObra
        );
        if (indice !== -1){
            usuarioLogado.avaliacoes.splice(indice, 1);
        }
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
                avaliacoes: usuarioLogado.avaliacoes
            })
            
        });
    }
    function criarEstrelas(){
        btnAvaliar.innerHTML = "";
        const listaEstrelas = [];
        function atualizarEstrela(nota){
            listaEstrelas.forEach((estrela, index) => {
                const numero = index + 1;
                if (numero <= nota) {
                    estrela.className = "bi bi-star-fill"
                } else if (numero - 0.5 === nota) {
                    estrela.className = "bi bi-star-half"
                } else {
                    estrela.className = "bi bi-star"
                }
            });
        }
        for(let i = 1; i <= 10; i++){
            const estrela = document.createElement("div");
            estrela.className = "estrela";
            const icone = document.createElement("i");
            icone.className = "bi bi-star";
            estrela.addEventListener("click", (evento) => {
                const numeroEstrela = i;
                const largura = evento.currentTarget.clientWidth;
                const clique = evento.offsetX;
                let valor;
                if (clique < largura/2){
                    valor = numeroEstrela - 0.5;
                } else {
                    valor = numeroEstrela;
                }
                atualizarEstrela(valor);
                avaliarObra(valor);
            })
            estrela.appendChild(icone);
            btnAvaliar.appendChild(estrela);
            listaEstrelas.push(icone)
        }
        return atualizarEstrela;
    }
    const atualizarEstrela = criarEstrelas();
    function carregarAvaliacao(){
        if (!usuarioLogado || !usuarioLogado.avaliacoes) {
            return;
        }
        const avaliacao = usuarioLogado.avaliacoes.find(
            a => a.idObra === idObra
        );
        if(avaliacao){
            atualizarEstrela(avaliacao.nota);
        }
    }
    carregarAvaliacao();
    const remover = document.getElementById("remover-avaliacao");
    remover.addEventListener("click", () => {
        removerAvaliacao();
        atualizarEstrela(0);
    })
    //CALCULADORA DE TEMPO
    function calcularTempo(){
        const valorDias = Number(episodioDias.value);
        if (valorDias === 0){
            resultadoCalculadora.style.display = "none";
            return;
        }
        resultadoCalculadora.style.display = "block";
        const dias = Math.ceil(obra.episodios / valorDias)
        totalDias.textContent = `VOCÊ TERMINARÁ EM APROXIMADAMENTE ${dias} DIAS!`
        const totalDiario = valorDias * obra.duracaoep;
        const horasDiarias = Math.floor(totalDiario / 60);
        const minutosDiarios = totalDiario % 60;
        if (horasDiarias === 0) {
            tempoPorEpisodio.textContent = `TEMPO DIÁRIO: ${minutosDiarios} MINUTOS`;
        } else if (minutosDiarios === 0){
            tempoPorEpisodio.textContent = `TEMPO DIÁRIO: ${horasDiarias} HORAS`
        } else {
            tempoPorEpisodio.textContent = `TEMPO DIÁRIO: ${horasDiarias} HORAS e ${minutosDiarios} MINUTOS`;
        }
    }
    episodioDias.addEventListener("input", calcularTempo);
    btnMais.addEventListener("click", () => {
        episodioDias.value++;
        calcularTempo();
    });
    btnMenos.addEventListener("click", () => {
        if (episodioDias.value > 1) {
            episodioDias.value--
            calcularTempo();
        }
    });
    //BOTÕES
    function configurarBotoes(){
    btnFavorito.addEventListener("click", () => {
        alterarLista("favoritos", idObra, iconeFavorito);
    });
    btnAssistido.addEventListener("click", () => {
        alterarLista("assistidos", idObra, iconeAssistido);
    });
    btnMinhaLista.addEventListener("click", () => {
        alterarLista("lista", idObra, iconeMinhalista);
    });
    }
    //GERAR A PÁGINA DE DADOS
    function renderizarDadosEspecificos(obra){  
        if (tipo === "S") {
            const temporadas = document.getElementById("tamanho");
            temporadas.textContent = `${obra.temporadas} temporadas - ${obra.episodios} episódios`;
            const streaming = document.getElementById("streaming");
            streaming.textContent = `ONDE ASSISTIR: ${obra.streaming}`;
            if (obra.listaepisodios.length > 0){
                const tituloRp = document.createElement("h2");
                tituloRp.textContent = "EPISÓDIOS";
                reparticoes.appendChild(tituloRp);
                secaoEpisodios.style.display = "flex";
            } else {
                secaoEpisodios.style.display = "none"
            }
            obra.listaepisodios.forEach(episodio => {
                const pEp = document.createElement("p");
                pEp.textContent = episodio;
                episodios.appendChild(pEp);
            calculadora.style.display = "block";
            })
        } else if (tipo === "Q") {
            const capitulos = document.getElementById("tamanho");
            capitulos.textContent = `${obra.volumes} volumes - ${obra.capitulos} capítulos`;
            const streaming = document.getElementById("streaming");
            streaming.textContent = `ONDE LER: ${obra.streaming}`;
            calculadora.style.display = "none";
            if (obra.listacapitulos.length > 0){
                const tituloRp = document.createElement("h2");
                tituloRp.textContent = "CAPÍTULOS";
                reparticoes.appendChild(tituloRp);
                secaoEpisodios.style.display = "flex";
                obra.listacapitulos.forEach(capitulo => {
                const pCp = document.createElement("p");
                pCp.textContent = capitulo;
                episodios.appendChild(pCp);
            })
            } else {
                secaoEpisodios.style.display = "none";
            }
        } else if (tipo === "F") {
            const duracao = document.getElementById("tamanho");
            duracao.textContent = obra.duracao;
            const streaming = document.getElementById("streaming");
            streaming.textContent = `ONDE ASSISTIR: ${obra.streaming}`;
            secaoEpisodios.style.display = "none";
            calculadora.style.display = "none";
        } else if (tipo === "J") {
            const streaming = document.getElementById("streaming");
            streaming.textContent = `ONDE JOGAR: ${obra.streaming}`;
            btnAssistido.style.display = "none"
            secaoEpisodios.style.display = "none";
            calculadora.style.display = "none";
        }
    }

    function renderizarCarrossel(obra){
    const imagemCarrossel1 = document.getElementById("carrossel-imagem-1");
    if (imagemCarrossel1){
        imagemCarrossel1.src = `${obra.carrossel1}`;
        imagemCarrossel1.alt = obra.titulo;
        imagemCarrossel1.classList.add("componente-imagem-carrossel-detalhe");
    }
    const imagemCarrossel2 = document.getElementById("carrossel-imagem-2");
    if (imagemCarrossel2) {
        imagemCarrossel2.src = `${obra.carrossel2}`;
        imagemCarrossel2.alt = obra.titulo;
        imagemCarrossel2.classList.add("componente-imagem-carrossel-detalhe");
    }
    const imagemCarrossel3 = document.getElementById("carrossel-imagem-3");
    if (imagemCarrossel3) {
        imagemCarrossel3.src = `${obra.carrossel3}`;
        imagemCarrossel3.alt = obra.titulo;
        imagemCarrossel3.classList.add("componente-imagem-carrossel-detalhe");
    }
    }

    function renderizarInformacoesObra(obra){
    const imagem = document.getElementById("imagem");
    imagem.src = `${obra.imagem}`;
    imagem.alt = obra.titulo
    const titulo = document.getElementById("titulo");
    titulo.textContent = obra.titulo;
    titulo.style.flexGrow = "1";
    renderizarDadosEspecificos(obra);
    renderizarCarrossel(obra);
    const avaliacaoObra = document.getElementById("avaliacao-obra");
    avaliacaoObra.textContent = `NOTA: ${obra.avaliacao}`;
    const dataLancamento = document.getElementById("estreia");
    dataLancamento.textContent = obra.estreia;
    const generos = document.getElementById("generos");
    generos.textContent = obra.genero
    const sinopse = document.getElementById("sinopse");
    sinopse.textContent = obra.sinopse;
    }
    // PERSONAGENS DA SERIE
    const listaPersonagens = dados.personagens.filter(personagem =>
        personagem.obra.includes(obra.id)
    );
    function renderizarPersonagens(listaPersonagens){
            if(!cardPersonagens)return;

                cardPersonagens.innerHTML = ""
                listaPersonagens.forEach(personagem => {
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

                    cardPersonagens.appendChild(container)
                });
    }
    function filtrarPersonagens(){
            const termoPesquisa = search.value.toLowerCase().trim();
            const personagensFiltrados = listaPersonagens.filter(personagem => {
                return personagem.nome.toLowerCase().includes(termoPesquisa);
            });
            if (personagensFiltrados.length === 0){
                cardPersonagens.innerHTML = "<p class='text-center text-black mt-4'>Nenhum personagem encontrado</p>";
            } else {
                renderizarPersonagens(personagensFiltrados);
            }
    }
    search.addEventListener("input", () => {
        if (search.value === ""){
            renderizarPersonagens(listaPersonagens);
            conteudoObra.style.display = "block";
            avaliacao.style.display = "block";
            calculadora.style.display = "flex";
        } else {
            filtrarPersonagens();
            conteudoObra.style.display = "none";
            avaliacao.style.display = "none";
            calculadora.style.display = "none";
        }
    })

    //ELENCO DA SÉRIE
    const listaAtores = dados.atores.filter(ator =>
        ator.titulos.some(titulo => titulo.idObra === obra.id)
    );

    function renderizarElenco(listaAtores){
        if(!cardPersonagens)return;
            cardPersonagens.innerHTML = ""
            listaAtores.forEach(ator => {
                const container = document.createElement("div");
                container.classList.add("col-md-4", "col-sm-6", "col-6");
                container.style.cursor = "pointer";
                container.addEventListener("click", () => {
                    window.location.href = `detalhesator.html?id=${ator.id}`
                });
                const card = document.createElement("div");
                card.classList.add("componente-card-atores", "h-100", "d-flex");

                const divImg = document.createElement("div");
                divImg.classList.add("div-ator");

                const imagem = document.createElement("img");
                imagem.src = ator.icone;
                imagem.alt = ator.nome;
                imagem.classList.add("img-fluid", "card-img-top", "imagem-icone-ator", "w-100");

                const divInfo = document.createElement("div");
                divInfo.classList.add("informacoes-atores");
                
                const nome = document.createElement("h2");
                nome.textContent = ator.nome;
                nome.classList.add("fs-5", "text-left");
                nome.style.flexGrow = "1";

                const participacao = ator.titulos.find(titulo =>
                    titulo.idObra === obra.id
                );

                const personagem = document.createElement("p");
                personagem.textContent = participacao.perso;
                personagem.classList.add("text-left");

                const nascimento = document.createElement("p");
                nascimento.textContent = ator.nascimento;
                nascimento.classList.add("text-left");
                
                divImg.appendChild(imagem);
                card.appendChild(divImg);
                divInfo.appendChild(nome);
                divInfo.appendChild(personagem)
                divInfo.appendChild(nascimento)
                card.appendChild(divInfo);
                container.appendChild(card)
                cardAtores.appendChild(container)
            });
    }

    renderizarElenco(listaAtores);

    //EXPLORE MAIS
    const listaExplMais = dados.sessoes.filter(s =>
        s.obras.includes(obra.id)
    );

    if (listaExplMais.length === 0){
        exploreMais.style.display = "none";
    } else {
        exploreMais.style.display = "block";
    }

    function renderizarExplMais(listaExplMais){
            cardsExplore.innerHTML = ""
            listaExplMais.forEach(sessao => {
                const container = document.createElement("div");
                container.classList.add("col-md-3", "col-sm-6", "col-6");
                container.style.cursor = "pointer";
                container.addEventListener("click", () => {
                    window.location.href = `detalhessessao.html?id=${sessao.id}`
                });
                const card = document.createElement("div");
                card.classList.add("componente-card-sessao", "h-100", "d-flex");

                const imagem = document.createElement("img");
                imagem.src = sessao.icone;
                imagem.alt = sessao.titulo;
                imagem.classList.add("img-fluid", "card-img-top", "imagem-icone-sessao", "w-100");

                const divT = document.createElement("div");
                divT.classList.add("titulo-sessao");
                
                const titulo = document.createElement("h2");
                titulo.textContent = sessao.titulo;
                titulo.classList.add("text-center");
                divT.style.flexGrow = "1";
                divT.appendChild(titulo);

                card.appendChild(imagem);              
                card.appendChild(divT);
                container.appendChild(card);
                cardsExplore.appendChild(container);
            });
    }

    renderizarExplMais(listaExplMais);


    configurarBotoes();
    renderizarInformacoesObra(obra)
    renderizarPersonagens(listaPersonagens);
    atualizarIcone("favoritos", idObra, iconeFavorito);
    atualizarIcone("assistidos", idObra, iconeAssistido);
    atualizarIcone("lista", idObra, iconeMinhalista);
})
.catch(erro => console.error("Erro:", erro));