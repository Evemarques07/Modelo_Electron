document.addEventListener("DOMContentLoaded", () => {
  const clientsTableBody = document.getElementById("clientsTableBody");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const itemsPerPageSelect = document.getElementById("itemsPerPage");
  const pageInfoSpan = document.getElementById("pageInfo");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const errorMessageDiv = document.getElementById("errorMessage");
  const searchInput = document.getElementById("searchClient");

  let currentPage = 1;
  let currentLimit = parseInt(itemsPerPageSelect.value, 10);
  let totalPages = 1;
  let totalItems = 0;

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Erro ao formatar data:", dateString, error);
      return "Erro na data";
    }
  }

  function getStatusBadge(status, pendencia) {
    if (pendencia) {
      return `<span class="status-badge status-pending">Pendente</span>`;
    }
    switch (status) {
      case 1:
        return `<span class="status-badge status-active">Ativo</span>`;
      case 0:
        return `<span class="status-badge status-inactive">Inativo</span>`;
      default:
        return `<span class="status-badge">Desconhecido</span>`;
    }
  }

  async function fetchClients(page, limit, searchTerm = "") {
    loadingIndicator.style.display = "flex";
    errorMessageDiv.style.display = "none";
    clientsTableBody.innerHTML = "";

    try {
      const result = await window.api.listClients(page, limit);

      if (result && result.data) {
        clientsTableBody.innerHTML = "";
        if (result.data.length === 0) {
          clientsTableBody.innerHTML =
            '<tr><td colspan="8" style="text-align:center;">Nenhum cliente encontrado.</td></tr>';
        } else {
          result.data.forEach((client) => {
            const row = clientsTableBody.insertRow();
            row.innerHTML = `
                            <td>${client.id}</td>
                            <td>${client.nomeCliente || "N/A"}</td>
                            <td>${client.cpf || "N/A"}</td>
                            <td>${client.cidade || "N/A"} / ${
              client.estado || "N/A"
            }</td>
                            <td>${client.telefone || "N/A"}</td>
                            <td>${getStatusBadge(
                              client.status,
                              client.pendencia
                            )}</td>
                            <td>${formatDate(client.data_cadastro)}</td>
                            <td class="action-buttons">
                                <button title="Editar Cliente" data-id="${
                                  client.id
                                }" class="edit-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
                                </button>
                                <button title="Excluir Cliente" data-id="${
                                  client.id
                                }" class="delete-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                </button>
                            </td>
                        `;
          });
        }

        currentPage = result.page;
        currentLimit = result.limit;
        totalPages = result.totalPages;
        totalItems = result.total;

        updatePaginationControls();
      } else {
        throw new Error("Resposta da API inválida ou sem dados.");
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      errorMessageDiv.textContent = `Erro ao carregar clientes: ${error.message}`;
      errorMessageDiv.style.display = "block";
      clientsTableBody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;">Falha ao carregar dados.</td></tr>';
    } finally {
      loadingIndicator.style.display = "none";
    }
  }

  function updatePaginationControls() {
    pageInfoSpan.textContent = `Página ${currentPage} de ${totalPages} (Total: ${totalItems} itens)`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      fetchClients(currentPage - 1, currentLimit);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      fetchClients(currentPage + 1, currentLimit);
    }
  });

  itemsPerPageSelect.addEventListener("change", (event) => {
    currentLimit = parseInt(event.target.value, 10);
    currentPage = 1;
    fetchClients(currentPage, currentLimit);
  });

  clientsTableBody.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;

    const clientId = target.dataset.id;
    if (target.classList.contains("edit-btn")) {
      console.log(`Editar cliente ID: ${clientId}`);
      alert(
        `Funcionalidade "Editar Cliente ${clientId}" ainda não implementada.`
      );
    } else if (target.classList.contains("delete-btn")) {
      console.log(`Excluir cliente ID: ${clientId}`);
      if (confirm(`Tem certeza que deseja excluir o cliente ID ${clientId}?`)) {
        alert(
          `Funcionalidade "Excluir Cliente ${clientId}" ainda não implementada.`
        );
      }
    }
  });

  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.trim();
      currentPage = 1;
      console.log("Buscando por:", searchTerm);
      fetchClients(currentPage, currentLimit);
    }, 500);
  });

  fetchClients(currentPage, currentLimit);
});
