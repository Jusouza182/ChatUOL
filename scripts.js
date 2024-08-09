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
        receberMensagens(); // carrega as mensagens ao iniciar conexão
        setInterval(receberMensagens, 3000); // atualiza as mensagens a cada 3seg
        setInterval(manterPresenca, 5000); // atualiza a presença a cada seg, para não "quicar" a pessoa da sala
        
    })
    .catch((error) => {
      alert("Nome já está em uso");
      solicitarNome();  // solicita o nome da pessoa novamente caso já esteja em uso
    });
}

// Função para fazer as mensagens 

function enviarMensagem() {
  const text = document.querySelector(".text").value;
  const from = nome;
  const type = "message";
  const to = "Todos";

  console.log("Mensagem capturada:", text);

  if (!text) {
    alert("Não é possível enviar uma mensagem vazia.");
    return;
  }

  axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/df10e74f-e839-4a24-8fd0-08cc129c0608", {
    from: from,
    to: to,
    text: text,
    type: type
  })
  .then(response => {
    console.log("Mensagem enviada com sucesso!", response.data);
    document.querySelector(".text").value = ""; 
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
    if (mensagem.type === "status" || (mensagem.type === "private_message" && (mensagem.from === nome || mensagem.to === nome)) || mensagem.type === "message") {
      const mensagemElement = document.createElement("div");
      mensagemElement.classList.add("mensagem");

      switch (mensagem.type) {
        case "status":
          mensagemElement.classList.add("status-message");
          break;
        case "private_message":
          mensagemElement.classList.add("private-message");
          break;
        case "message":
          mensagemElement.classList.add("normal-message");
          break;
      }

      mensagemElement.textContent = `${mensagem.from} para ${mensagem.to}: ${mensagem.text}`;

      telaMensagens.appendChild(mensagemElement);
    }
  });

  telaMensagens.scrollTop = telaMensagens.scrollHeight;
}

// Função para manter presença 
function manterPresenca() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status/df10e74f-e839-4a24-8fd0-08cc129c0608", { name: nome })
    .then(response => {
      console.log("Presença confirmada:", response.data);
    })
    .catch(error => {
      console.error("Erro ao manter presença:", error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400) {
        alert("Você não está mais na sala. Recarregando a página...");
        location.reload();
      }
    });
}


// Função obter a lista de participantes 

function obterParticipantes(){
  axios.get("https://mock-api.driven.com.br/api/v6/uol/participants/df10e74f-e839-4a24-8fd0-08cc129c0608")
  .then( response => {
    console.log("cheguei aqui", response.data);
    atualizarListaParticipantes(response.data)
  })
  .catch(error => {
    console.error("Erro ao obter participantes:", error.response ? error.response.data : error.message);
  })
}

/* for(let i=0; participantes.length; i++){
  const listaParticipantes = document.querySelector(".lista-participantes");

}*/

// função para atualizar a lista no sidebar 

function atualizarListaParticipantes(participantes) {
  const listaParticipantes = document.querySelector('.lista-participantes');
  listaParticipantes.innerHTML = '';


  participantes.forEach(participante => {
    console.log("Participante:", participante); 


    const item = document.createElement('li');

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'person');

  
    icon.style.fontSize = '24px';
    icon.style.marginRight = '10px';

  
    const name = document.createElement('span');
    name.textContent = participante.name || 'Nome não disponível';
    console.log("Nome do participante:", name.textContent);

    item.appendChild(icon);
    item.appendChild(name);

    listaParticipantes.appendChild(item);
  });
}

obterParticipantes();
solicitarNome();
