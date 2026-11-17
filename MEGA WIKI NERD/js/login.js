const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const btnVoltarLogin = document.getElementById("voltar-login");
const btnAbrirCadastro = document.getElementById("abrir-cadastro");

function mostrarCadastro(){
    formLogin.style.display = "none";
    btnAbrirCadastro.style.display = "none";
    formCadastro.style.display = "flex";
    btnVoltarLogin.style.display = "block";
}

function mostrarLogin(){
    formCadastro.style.display = "none";
    btnVoltarLogin.style.display = "none";
    formLogin.style.display = "flex";
    btnAbrirCadastro.style.display = "block";
}

btnAbrirCadastro.addEventListener("click", mostrarCadastro);
btnVoltarLogin.addEventListener("click", mostrarLogin);
mostrarLogin();

const inputNome = document.getElementById("cadastro-nome");
const inputUsuario = document.getElementById("cadastro-usuario");
const inputSenha = document.getElementById("cadastro-senha");
const inputSenha2 = document.getElementById("cadastro-senha2");
console.log(inputNome);
console.log(inputUsuario);
console.log(inputSenha);
console.log(inputSenha2);

function cadastrarUsuario (event){
    event.preventDefault();

    const nome = inputNome.value.trim();
    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value.trim();
    const senha2 = inputSenha2.value.trim();

    if (!nome || !usuario || !senha){
        alert("Preencha todos os campos!");
        return
    }

    if (senha !== senha2){
        alert("Senha incorreta!");
        return
    }

    const novoUsuario = {
        nome: nome,
        login: usuario,
        senha: senha,
        adm: false,
        favoritos: [],
        assistidos: [],
        avaliacoes: [],
        lista: []
    };

    fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(res => res.json())
    .then(data => {
        alert("Usuário criado com sucesso!");
        mostrarLogin();

        formCadastro.reset();
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao cadastrar usuário");
    });
}

formCadastro.addEventListener("submit", cadastrarUsuario)

const loginUsuario = document.getElementById("login");
const loginSenha = document.getElementById("senha");

function fazerLogin(event){
    event.preventDefault();

    const usuario_inserido = loginUsuario.value.trim();
    const senha_inserida = loginSenha.value.trim();

    fetch("http://localhost:3000/usuarios")
    .then(res => res.json())
    .then(usuarios => {
            const usuarioEncontrado = usuarios.find(u =>
        u.login === usuario_inserido &&
        u.senha === senha_inserida
    );

    if(usuarioEncontrado){
        alert("Login Realizado!")
        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioEncontrado)
        );
        window.location.href = "../index.html";
    }else{
        alert("Usuário não encontrado!")
    }
    })
}

formLogin.addEventListener("submit", fazerLogin);