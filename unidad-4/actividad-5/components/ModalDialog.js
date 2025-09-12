class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .w3-modal { display: none; }
        .modal-content {
          max-width: 600px;
        }
      </style>
      <div class="w3-modal" id="modal">
        <div class="w3-modal-content w3-card-4 modal-content">
          <header class="w3-container w3-blue">
            <span id="closeBtn" class="w3-button w3-display-topright">&times;</span>
            <h2 id="modalTitle">Detalles</h2>
          </header>
          <div class="w3-container" id="modalBody"></div>
          <footer class="w3-container w3-light-grey">
            <p>Datos obtenidos desde la API</p>
          </footer>
        </div>
      </div>
    `;
  }

  addEventListeners() {
    this.shadowRoot.querySelector("#closeBtn").addEventListener("click", () => this.hide());
  }

  show(title, contentHtml) {
    this.shadowRoot.querySelector("#modalTitle").textContent = title;
    this.shadowRoot.querySelector("#modalBody").innerHTML = contentHtml;
    this.shadowRoot.querySelector("#modal").style.display = "block";
  }

  hide() {
    this.shadowRoot.querySelector("#modal").style.display = "none";
  }
}

customElements.define("modal-dialog", ModalDialog);
