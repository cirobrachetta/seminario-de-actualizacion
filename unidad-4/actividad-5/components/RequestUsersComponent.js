import ApiService from "../services/ApiService.js";

class RequestUsersComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.apiService = new ApiService("https://jsonplaceholder.typicode.com/users");
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .w3-tag {
          background-color: #2196F3;
          color: white;
          border-radius: 8px;
          padding: 2px 6px;
          font-size: 0.9em;
        }
        .table-container {
          margin-top: 12px;
        }
        tr { cursor: pointer; }
      </style>
      <button id="btnRequest" class="w3-button w3-blue w3-round">Efectuar Solicitud</button>
      <div id="tableContainer" class="table-container"></div>
      <modal-dialog id="modal"></modal-dialog>
    `;
  }

  addEventListeners() {
    const button = this.shadowRoot.querySelector("#btnRequest");
    const container = this.shadowRoot.querySelector("#tableContainer");

    button.addEventListener("click", () => {
      this.apiService.fetchData(
        (data) => {
          container.innerHTML = "";
          const table = this.buildTable(data);
          container.appendChild(table);
        },
        (errorMsg) => {
          container.innerHTML = `<p class="w3-text-red">${errorMsg}</p>`;
        }
      );
    });
  }

  buildTable(data) {
    const table = document.createElement("table");
    table.className = "w3-table-all w3-card-4 w3-hoverable";

    // Encabezado
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    const headers = ["ID", "Usuario", "Nombre", "Correo", "Web", "Celular"];
    headers.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      th.className = "w3-blue";
      headerRow.appendChild(th);
    });

    // Cuerpo
    const tbody = table.createTBody();
    data.forEach(user => {
      const row = tbody.insertRow();

      row.insertCell().textContent = user.id;
      row.insertCell().textContent = user.username;
      row.insertCell().textContent = user.name;

      const emailCell = row.insertCell();
      const emailTag = document.createElement("span");
      emailTag.className = "w3-tag";
      emailTag.textContent = user.email;
      emailCell.appendChild(emailTag);

      row.insertCell().textContent = user.website;
      row.insertCell().textContent = user.phone;

      // Evento click en toda la fila
      row.addEventListener("click", () => this.showUserDetails(user.id));
    });

    return table;
  }

  showUserDetails(userId) {
    const modal = this.shadowRoot.querySelector("#modal");
    const userApi = new ApiService(`https://jsonplaceholder.typicode.com/users/${userId}`);

    userApi.fetchData(
      (user) => {
        const content = `
          <h3>Dirección</h3>
          <p><b>Calle:</b> ${user.address.street}</p>
          <p><b>Suite:</b> ${user.address.suite}</p>
          <p><b>Ciudad:</b> ${user.address.city}</p>
          <p><b>Código Postal:</b> ${user.address.zipcode}</p>
          <p><b>Geo:</b> ${user.address.geo.lat}, ${user.address.geo.lng}</p>
          <h3>Compañía</h3>
          <p><b>Nombre:</b> ${user.company.name}</p>
          <p><b>Eslogan:</b> ${user.company.catchPhrase}</p>
          <p><b>BS:</b> ${user.company.bs}</p>
        `;
        modal.show(`Detalles de ${user.username}`, content);
      },
      (errorMsg) => {
        modal.show("Error", `<p class="w3-text-red">${errorMsg}</p>`);
      }
    );
  }
}

customElements.define("request-users-component", RequestUsersComponent);
