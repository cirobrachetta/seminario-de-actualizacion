export default class ApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async fetchData(callbackSuccess, callbackError) {
    try {
      const response = await fetch(this.endpoint);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      callbackSuccess(data);
    } catch (error) {
      callbackError(error.message);
    }
  }
}
