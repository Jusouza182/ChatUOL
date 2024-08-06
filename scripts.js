let nome = prompt("Digite seu nome:");


// Função para esconder e mostrar o sidebar
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector(".toggle-sidebar");
  const background = document.querySelector(".background");

  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("esconder");
  });

  background.addEventListener("click", (event) => {
    if (event.target === background) {
      sidebar.classList.add("esconder");
    }
  });
});

// Função para pedir o nome do usuário ao entrar na sala
function solicitarNome() {

  const promessa = axios
    .post(
      "https://mock-api.driven.com.br/api/v6/uol/participants/df10e74f-e839-4a24-8fd0-08cc129c0608",
      { name: nome }
    )
    .then((a) => {
        alert(`Bem vindo ${nome}`)
    })
    .catch((error) => {
      alert("Nome já está em uso");
      solicitarNome();
    });
}

// Função para fazer as mensagens 

function enviarMensagem(){
  const text = document.querySelector(".mensagem").value;
  const from = nome;
  const type = "message";
  const to = "Todos";


  const requesicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/df10e74f-e839-4a24-8fd0-08cc129c0608", {
    from: from,
		to: to,
		text: text,
		type: type
  })
  .then(response => {
    console.log("Mensagem enviada com sucesso!", response.data);
    document.querySelector(".mensagem").value = "";
    receberMensagens();

  })
  .catch(error => {
    console.error("Erro ao enviar mensagem:", error.response ? error.response.data : error.message);
  });
}

// Função para receber as mensagens 

function receberMensagens(){
  axios.get("https://mock-api.driven.com.br/api/v6/uol/messages/df10e74f-e839-4a24-8fd0-08cc129c0608")
  .then(response => {
    console.log("Dados da resposta", response.data);
    mostrarMensagens(response.data);
  })
  .catch(error => {
    console.error("Erro ao receber mensagem:", error.response ? error.response.data : error.message);
  });
}


// Função mostrar mensagens 
function mostrarMensagens(mensagens) {
  const telaMensagens = document.querySelector(".telaMensagens");
  telaMensagens.innerHTML = "";

  mensagens.forEach(mensagem => {
    const mensagemElement = document.createElement("div");
    mensagemElement.classList.add("mensagem");

    mensagemElement.textContent = `${mensagem.from} para ${mensagem.to}: ${mensagem.text}`;

    telaMensagens.appendChild(mensagemElement);
  });
}


solicitarNome();
