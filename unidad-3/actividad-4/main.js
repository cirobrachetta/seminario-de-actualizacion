import './WCComponents/WCModalDialog.js';

const boton = document.getElementById('abrirModal');
const modal = document.getElementById('miModal');

boton.addEventListener('click', () => {
  modal.open();
});

modal.addEventListener('cancel', () => {
  console.log('Modal cancelado');
});

modal.addEventListener('accept', () => {
  console.log('Modal aceptado');
});
