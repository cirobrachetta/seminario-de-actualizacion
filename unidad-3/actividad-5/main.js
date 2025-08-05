import './WCComponents/WCModalDialog.js';
import './WCComponents/WCContactForm.js';

const contactButton = document.getElementById('contactButton');
const contactModal = document.getElementById('contactModal');

contactButton.addEventListener('click', () => {
  contactModal.open();
});

contactModal.addEventListener('cancel', () => {
  console.log('Formulario cancelado.');
});

contactModal.addEventListener('accept', () => {
  window.alert('Su consulta fue recibida. A la brevedad lo contactaremos. Gracias');
});
