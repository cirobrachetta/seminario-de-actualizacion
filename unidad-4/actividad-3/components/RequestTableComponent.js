import ApiService from "../services/ApiService.js";
import TableComponent from "./TableComponent.js";

class RequestTableComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.apiService = new ApiService("https://jsonplaceholder.typicode.com/posts");
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          padding: 8px 12px;
          margin-bottom: 12px;
          cursor: pointer;
        }
        table, th, td {
          border: 1px solid black;
        }
        th {
          text-align: left;
        }
      </style>
      <button id="btnRequest">Efectuar Solicitud</button>
      <div id="tableContainer"></div>
    `;
  }

  addEventListeners() {
    const button = this.shadowRoot.querySelector("#btnRequest");
    const container = this.shadowRoot.querySelector("#tableContainer");

    button.addEventListener("click", () => {
      this.apiService.fetchData(
        (data) => {
          container.innerHTML = ""; // limpiar
          const table = new TableComponent(data).buildTable();
          container.appendChild(table);
        },
        (errorMsg) => {
          container.innerHTML = `<p style="color:red;">${errorMsg}</p>`;
        }
      );
    });
  }
}

customElements.define("request-table-component", RequestTableComponent);
