import ApiService from "../services/ApiService.js";

class RequestComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.apiService = new ApiService("https://jsonplaceholder.typicode.com/posts/1");
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
          margin-bottom: 8px;
          cursor: pointer;
        }
        textarea {
          width: 100%;
          height: 150px;
          resize: none;
        }
      </style>
      <button id="btnRequest">Efectuar Solicitud</button>
      <textarea id="responseArea" readonly></textarea>
    `;
  }

  addEventListeners() {
    const button = this.shadowRoot.querySelector("#btnRequest");
    const textArea = this.shadowRoot.querySelector("#responseArea");

    button.addEventListener("click", () => {
      this.apiService.fetchData(
        (data) => {
          textArea.value = JSON.stringify(data, null, 2);
        },
        (errorMsg) => {
          textArea.value = errorMsg;
        }
      );
    });
  }
}

customElements.define("request-component", RequestComponent);
