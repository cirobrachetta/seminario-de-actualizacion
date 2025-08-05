class WCModalDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button.cancel {
          background-color: #ccc;
        }

        button.accept {
          background-color: #007bff;
          color: white;
        }
      </style>

      <div class="modal">
        <slot></slot>
        <div class="actions">
          <button class="cancel">Cancelar</button>
          <button class="accept">Aceptar</button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.cancel').addEventListener('click', () => this._handleCancel());
    this.shadowRoot.querySelector('.accept').addEventListener('click', () => this._handleAccept());
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('.cancel').removeEventListener('click', this._handleCancel);
    this.shadowRoot.querySelector('.accept').removeEventListener('click', this._handleAccept);
  }

  open() {
    this.style.display = 'flex';
  }

  close() {
    this.style.display = 'none';
  }

  _handleCancel() {
    this.close();
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  _handleAccept() {
    this.close();
    this.dispatchEvent(new CustomEvent('accept'));
  }
}

customElements.define('wc-modal-dialog', WCModalDialog);
