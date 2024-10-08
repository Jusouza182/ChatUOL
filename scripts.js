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
      alert(`Bem vindo ${nome}`);
      receberMensagens(); // carrega as mensagens ao iniciar conexão
      setInterval(receberMensagens, 3000); // atualiza as mensagens a cada 3seg
      setInterval(manterPresenca, 5000); // atualiza a presença a cada seg, para não "quicar" a pessoa da sala
    })
    .catch((error) => {
      alert("Nome já está em uso");
      solicitarNome(); // solicita o nome da pessoa novamente caso já esteja em uso
    });
}

// Função para fazer as mensagens

function enviarMensagem() {
  const text = document.querySelector(".text").value;
  const from = nome;
  const type = obterTipoVisibilidadeSelecionado();
  const to = obterDestinatarioSelecionado();

  console.log("Mensagem capturada:", text);

  if (!text) {
    alert("Não é possível enviar uma mensagem vazia.");
    return;
  }

  axios
    .post(
      "https://mock-api.driven.com.br/api/v6/uol/messages/df10e74f-e839-4a24-8fd0-08cc129c0608",
      {
        from: from,
        to: to,
        text: text,
        type: type,
      }
    )
    .then((response) => {
      console.log("Mensagem enviada com sucesso!", response.data);
      document.querySelector(".text").value = "";
      receberMensagens();
      obterTipoVisibilidadeSelecionado()
    })
    .catch((error) => {
      console.error(
        "Erro ao enviar mensagem:",
        error.response ? error.response.data : error.message
      );
    });
}

// Função para receber as mensagens

function receberMensagens() {
  axios
    .get(
      "https://mock-api.driven.com.br/api/v6/uol/messages/df10e74f-e839-4a24-8fd0-08cc129c0608"
    )
    .then((response) => {
      console.log("Dados da resposta", response.data);
      mostrarMensagens(response.data);
    })
    .catch((error) => {
      console.error(
        "Erro ao receber mensagem:",
        error.response ? error.response.data : error.message
      );
    });
}

// Função mostrar mensagens
function mostrarMensagens(mensagens) {
  const telaMensagens = document.querySelector(".telaMensagens");
  telaMensagens.innerHTML = "";

  mensagens.forEach((mensagem) => {
    if (
      mensagem.type === "status" ||
      (mensagem.type === "private_message" &&
        (mensagem.from === nome || mensagem.to === nome)) ||
      mensagem.type === "message"
    ) {
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
  axios
    .post(
      "https://mock-api.driven.com.br/api/v6/uol/status/df10e74f-e839-4a24-8fd0-08cc129c0608",
      { name: nome }
    )
    .then((response) => {
      console.log("Presença confirmada:", response.data);
    })
    .catch((error) => {
      console.error(
        "Erro ao manter presença:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 400) {
        alert("Você não está mais na sala. Recarregando a página...");
        location.reload();
      }
    });
}

// Função obter a lista de participantes

function obterParticipantes() {
  axios
    .get(
      "https://mock-api.driven.com.br/api/v6/uol/participants/df10e74f-e839-4a24-8fd0-08cc129c0608"
    )
    .then((response) => {
      console.log("cheguei aqui", response.data);
      atualizarListaParticipantes(response.data);
    })
    .catch((error) => {
      console.error(
        "Erro ao obter participantes:",
        error.response ? error.response.data : error.message
      );
    });
}

// função para atualizar a lista no sidebar

function atualizarListaParticipantes(participantes) {
  const listaParticipantes = document.querySelector('.lista-participantes');
  const itemFixo = listaParticipantes.querySelector('.item-fixo');
  
  const itens = Array.from(listaParticipantes.querySelectorAll('li:not(.item-fixo)'));
  itens.forEach(item => item.remove());


  participantes.forEach(participante => {
    const item = document.createElement('li');

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'person');
    icon.style.fontSize = '24px';
    icon.style.marginRight = '10px';

    const name = document.createElement('span');
    name.textContent = participante.name || 'Nome não disponível';

    item.appendChild(icon);
    item.appendChild(name);

    item.addEventListener('click', selecionarParticipante);

    listaParticipantes.appendChild(item);
  });

  itemFixo.addEventListener('click', selecionarParticipante);
}


function selecionarOpcao(event) {
  const options = document.querySelectorAll('.visibility-options li');
  options.forEach(option => option.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  atualizarFraseDestinatario();
}

function selecionarParticipante(event) {
  const participantes = document.querySelectorAll('.lista-participantes li');
  participantes.forEach(participante => participante.classList.remove('selected'));
  event.currentTarget.classList.add('selected');


  console.log("Participante selecionado:", event.currentTarget.querySelector('span').textContent);

  atualizarFraseDestinatario();
}


function atualizarFraseDestinatario() {
  const participanteSelecionado = document.querySelector('.lista-participantes li.selected span');
  const opcaoSelecionada = document.querySelector('.visibility-options li.selected span');

  let destinatario = 'Todos participantes';
  if (participanteSelecionado) {
    destinatario = participanteSelecionado.textContent;
  }

  let visibilidade = 'público'; 
  if (opcaoSelecionada) {
    visibilidade = opcaoSelecionada.textContent.toLowerCase();
    visibilidade = visibilidade === 'reservadamente' ? 'privado' : 'público';
  }

  const destinatarioElement = document.getElementById('destinatario');
  destinatarioElement.textContent = `Enviado para ${destinatario} (${visibilidade})`;

  console.log("Frase do destinatário:", destinatarioElement.textContent);
  
  if (visibilidade === 'message') {
    destinatarioElement.classList.add('private-message');
  } else {
    destinatarioElement.classList.remove('private-message');
  }
}

  function obterDestinatarioSelecionado() {
    const participanteSelecionado = document.querySelector('.lista-participantes li.selected span');
    const destinatario = participanteSelecionado ? participanteSelecionado.textContent : 'Todos';
    
    console.log("Destinatário selecionado:", destinatario);
  
    return destinatario;
  }
  

  function obterTipoVisibilidadeSelecionado() {
    const opcaoSelecionada = document.querySelector('.visibility-options li.selected span');
    let tipoVisibilidade = 'message';
  
    if (opcaoSelecionada) {
      const visibilidade = opcaoSelecionada.textContent.toLowerCase();
  
    
      tipoVisibilidade = visibilidade === 'reservadamente' ? 'private_message' : 'message';
    }
  
   
    console.log("Tipo de visibilidade selecionado:", tipoVisibilidade);
  
    return tipoVisibilidade;
  }
  

document.querySelectorAll('.visibility-options li').forEach(item => {
  item.addEventListener('click', selecionarOpcao);
});

document.querySelectorAll('.lista-participantes li').forEach(item => {
  item.addEventListener('click', selecionarParticipante);
});

obterParticipantes();
setInterval(obterParticipantes, 10000);
solicitarNome();
