const temas = {
    magic: {
        banner: "#24062d",
        primeira: "#471754",
        segunda: "#991D5D",
        terceira: "#F2445E",
        quarta: "#F07951",
        quinta: "#DEC87A",
        sexta: "#ab9854"
    },

    marine: {
        banner: "#072836",
        primeira: "#176585",
        segunda: "#27b1bf",
        terceira: "#36cecc",
        quarta: "#c2e4cb",
        quinta: "#f7f3cf",
        sexta: "#bcb899"
    },

    leaf: {
        banner: "#00150c",
        primeira: "#00241e",
        segunda: "#02483e",
        terceira: "#057c46",
        quarta: "#9bb61b",
        quinta: "#f8be00",
        sexta: "#cd9e01"
    },

    magma: {
        banner: "#1f0501",
        primeira: "#330a04",
        segunda: "#6c1305",
        terceira: "#b32900",
        quarta: "#de8531",
        quinta: "#efac41",
        sexta: "#ae7c2b"
    },

    toxic: {
        banner: "#124649",
        primeira: "#1b676b",
        segunda: "#519548",
        terceira: "#88c425",
        quarta: "#bef202",
        quinta: "#eafde6",
        sexta: "#c4d5c1"
    },
}

function aplicarTema(nomeTema){

    const tema = temas[nomeTema];

    document.documentElement.style.setProperty("--cor-banner", tema.banner);
    document.documentElement.style.setProperty("--cor-1", tema.primeira);
    document.documentElement.style.setProperty("--cor-2", tema.segunda);
    document.documentElement.style.setProperty("--cor-3", tema.terceira);
    document.documentElement.style.setProperty("--cor-4", tema.quarta);
    document.documentElement.style.setProperty("--cor-5", tema.quinta);
    document.documentElement.style.setProperty("--cor-6", tema.sexta);
}

function carregarTema() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (usuarioLogado && usuarioLogado.tema) {
        aplicarTema(usuarioLogado.tema);
    }
}

carregarTema(); 