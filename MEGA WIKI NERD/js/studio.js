const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const btnUsuario = document.getElementById("btn-usuario");
if(usuarioLogado){
    btnUsuario.textContent = "Logout";
}
else{
    btnUsuario.textContent = "Login";
}

const search = document.getElementById("search");
const seletorCategoria = document.getElementById("qual-obra");
const secaoPersonagens = document.getElementById("banco-personagens");
const caixaMontagem = document.getElementById("caixa-montagem");
const limpar = document.getElementById("limpar-caixa");
limpar.addEventListener("click", () => {
    const todosOsCards = document.querySelectorAll(".item-montagem-div");
    todosOsCards.forEach(card => card.remove());
});
let modoGrade = false;
const btnModoGrade = document.getElementById("ativar-grade");
btnModoGrade.addEventListener("click", () => {
    modoGrade = !modoGrade;
    if (modoGrade) {
        btnModoGrade.textContent = "DESATIVAR GRADE";
        caixaMontagem.classList.add("grade-visivel");
    } else {
        btnModoGrade.textContent = "ATIVAR GRADE";
        caixaMontagem.classList.remove("grade-visivel")
    }
})
let modoTierList = false;
const blocosTier = document.getElementById("tier")
const btnModoTier = document.getElementById("ativar-tier");
btnModoTier.addEventListener("click", () => {
    modoTierList = !modoTierList;
    if (modoTierList) {
        blocosTier.style.display = "block";
        btnModoTier.textContent = "DESATIVAR TIER";
    } else {
        blocosTier.style.display = "none";
        btnModoTier.textContent = "ATIVAR TIER";
    }
});

function encaixarNaGrade(valor, tamanhoCelula) {
    return Math.round(valor / tamanhoCelula) * tamanhoCelula;
}

fetch("db/db.json")
.then(response => response.json())
.then(dados => {
    const listaPersonagens = dados.personagens;
    function embaralhar(lista) {
        for (let i = lista.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [lista[i], lista[j]] = [lista[j], lista[i]];
        }
    }

    const catalogoEmbaralhado = [...listaPersonagens];
    embaralhar(catalogoEmbaralhado);

        function renderizarBanco(catalogoEmbaralhado) {
        secaoPersonagens.innerHTML = "";
        catalogoEmbaralhado.forEach(personagem => {
            const imagem = document.createElement("img");
            imagem.src = personagem.icone;
            imagem.alt = personagem.nome;
            imagem.dataset.id = personagem.id;
            imagem.draggable = false;
            imagem.classList.add("icone-personagem-studio");
            imagem.addEventListener("pointerdown", (evento) => {
                const quadrado = document.createElement("img");
                quadrado.src = personagem.icone;
                quadrado.classList.add("clone-arraste")
                quadrado.draggable = false;
                document.body.appendChild(quadrado);
                quadrado.style.top = evento.clientY - 70 + "px";
                quadrado.style.left = evento.clientX - 70 + "px";

                function moverClone(eventoDoMovimento) {
                    quadrado.style.left = eventoDoMovimento.clientX - 70 + "px";
                    quadrado.style.top = eventoDoMovimento.clientY - 70 + "px";
                }

                window.addEventListener("pointermove", moverClone);

                function soltarClone(eventoDeSoltar) {
                    window.removeEventListener("pointermove", moverClone);

                    
                    const caixa = caixaMontagem.getBoundingClientRect();

                    const dentrodaCaixa = (eventoDeSoltar.clientX >= caixa.left && eventoDeSoltar.clientX <= caixa.right) && (eventoDeSoltar.clientY >= caixa.top && eventoDeSoltar.clientY <= caixa.bottom);
                    const xDentroDaCaixa = eventoDeSoltar.clientX - caixa.left - 70;
                    const yDentroDaCaixa = eventoDeSoltar.clientY - caixa.top - 70;
                    if (dentrodaCaixa) {
                        const item = document.createElement("div");
                        item.classList.add("item-montagem-div");

                        const larguraProibida = modoTierList ? blocosTier.getBoundingClientRect().width : 0;
                        const quadradoDefinitivo  = document.createElement("img");
                        quadradoDefinitivo.src = personagem.icone;
                        quadradoDefinitivo.draggable = false;
                        quadradoDefinitivo.classList.add("item-montagem");
                        let xDef = Math.min((Math.max(xDentroDaCaixa, larguraProibida)), caixaMontagem.clientWidth - 140);
                        let yDef = Math.min(Math.max(yDentroDaCaixa, 0), caixaMontagem.clientHeight - 140);
                        if (modoGrade) {
                            const xGrade = encaixarNaGrade(xDef, 140);
                            const yGrade = encaixarNaGrade(yDef, 140);
                            xDef = Math.min((Math.max(xGrade, 0)), caixaMontagem.clientWidth - 140);
                            yDef = Math.min(Math.max(yGrade, 0), caixaMontagem.clientHeight - 140);
                        }
                        item.style.top = yDef + "px";
                        item.style.left = xDef + "px";

                        const botaoRemover = document.createElement("button");
                        botaoRemover.textContent = "x";
                        botaoRemover.classList.add("btn-remover-item");
                        botaoRemover.addEventListener("click", (eventoDoClique) => {
                            eventoDoClique.stopPropagation();
                            item.remove();
                        });

                        item.appendChild(quadradoDefinitivo);
                        item.appendChild(botaoRemover);
                        caixaMontagem.appendChild(item);

                        item.addEventListener("pointerdown", (eventoDeInicio) => {
                            const dimensaoFoto = quadradoDefinitivo.getBoundingClientRect();
                            const offsetX = eventoDeInicio.clientX - dimensaoFoto.left;
                            const offsetY = eventoDeInicio.clientY - dimensaoFoto.top;

                            function moverItem(eventoDeMovimento) {
                                const larguraProibida = modoTierList ? blocosTier.getBoundingClientRect().width : 0;
                                const caixa = caixaMontagem.getBoundingClientRect();
                                const novoX = eventoDeMovimento.clientX - caixa.left - offsetX;
                                const novoY = eventoDeMovimento.clientY - caixa.top - offsetY;
                                const resultadoX = Math.min(Math.max(novoX, larguraProibida), caixaMontagem.clientWidth - 140);
                                const resultadoY = Math.min(Math.max(novoY, 0), caixaMontagem.clientHeight -140);
                                item.style.left = resultadoX + "px";
                                item.style.top = resultadoY + "px";
                            }

                            window.addEventListener("pointermove", moverItem);

                            function soltarItem() {
                                let xAtual = parseFloat(item.style.left);
                                let yAtual = parseFloat(item.style.top);
                                if (modoGrade) {
                                    const larguraProibida = modoTierList ? blocosTier.getBoundingClientRect().width : 0;
                                    xAtual = encaixarNaGrade(xAtual, 140);
                                    yAtual = encaixarNaGrade(yAtual, 140);
                                    xAtual = Math.min(Math.max(xAtual, larguraProibida), caixaMontagem.clientWidth - 140);
                                    yAtual = Math.min(Math.max(yAtual, 0), caixaMontagem.clientHeight - 140);
                                }
                                item.style.left = xAtual + "px";
                                item.style.top = yAtual + "px";

                                window.removeEventListener("pointermove", moverItem);
                                window.removeEventListener("pointerup", soltarItem);
                            }
                            window.addEventListener("pointerup", soltarItem);
                        });
                    }

                    quadrado.remove();
                    window.removeEventListener("pointerup", soltarClone);
                }

                window.addEventListener("pointerup", soltarClone);
            });

            secaoPersonagens.appendChild(imagem);
        });
    }

    renderizarBanco(catalogoEmbaralhado);

    function filtrarPersonagens(){
        const termoPesquisa = search.value.toLowerCase().trim();
        const personagensFiltrados = catalogoEmbaralhado.filter(personagem => {
            return personagem.nome.toLowerCase().includes(termoPesquisa);
        });
        if (personagensFiltrados.length === 0){
            secaoPersonagens.innerHTML = "<p class='text-center text-black mt-4'>Nenhum personagem encontrado.</p>";
        } else {
            renderizarBanco(personagensFiltrados);
        }
    }
    search.addEventListener("input", () => {
        if (search.value === ""){
            renderizarBanco(catalogoEmbaralhado);
        } else {
            filtrarPersonagens();
        }
    })

    function aplicarFiltro(){
        const categoriaSelecionada = seletorCategoria.value;

        const personagensSelecionados = listaPersonagens.filter(personagem => {
            const bateCategoria = categoriaSelecionada === "Todos" || personagem.obra.some(idObra => idObra.charAt(0) === categoriaSelecionada);

            return bateCategoria;
        });
        if (personagensSelecionados.length === 0) {
        secaoPersonagens.innerHTML = "<p class='text-center text-black mt-4'>Nenhum personagem encontrado com esses filtros.</p>";
        } else {
            renderizarBanco(personagensSelecionados);
        }
    }
    seletorCategoria.addEventListener("change", aplicarFiltro);

});
