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
          background-color: #2196F3; /* Azul */
          color: white;
          border-radius: 8px;
          padding: 2px 6px;
          font-size: 0.9em;
        }
        .table-container {
          margin-top: 12px;
        }
      </style>
      <button id="btnRequest" class="w3-button w3-blue w3-round">Efectuar Solicitud</button>
      <div id="tableContainer" class="table-container"></div>
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
    // Crear tabla con estilo de tarjeta y hover
    const table = document.createElement("table");
    table.className = "w3-table-all w3-card-4 w3-hoverable";

    // Encabezado
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    const headers = ["ID", "Usuario", "Nombre", "Correo", "Web", "Celular"];

    headers.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      th.className = "w3-blue"; // Encabezado con color
      headerRow.appendChild(th);
    });

    // Cuerpo
    const tbody = table.createTBody();
    data.forEach(user => {
      const row = tbody.insertRow();

      // ID
      row.insertCell().textContent = user.id;

      // Usuario
      row.insertCell().textContent = user.username;

      // Nombre
      row.insertCell().textContent = user.name;

      // Correo (como tag)
      const emailCell = row.insertCell();
      const emailTag = document.createElement("span");
      emailTag.className = "w3-tag";
      emailTag.textContent = user.email;
      emailCell.appendChild(emailTag);

      // Web
      row.insertCell().textContent = user.website;

      // Celular
      row.insertCell().textContent = user.phone;
    });

    return table;
  }
}

customElements.define("request-users-component", RequestUsersComponent);
