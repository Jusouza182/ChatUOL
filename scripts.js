
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
  let nome = prompt("Digite seu nome:");

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




solicitarNome();
