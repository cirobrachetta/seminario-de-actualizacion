export default class ApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  fetchData(callbackSuccess, callbackError) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this.endpoint, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            callbackSuccess(response);
          } catch (error) {
            callbackError("Error al parsear la respuesta");
          }
        } else {
          callbackError(`Error en la solicitud: ${xhr.status}`);
        }
      }
    };

    xhr.send();
  }
}
