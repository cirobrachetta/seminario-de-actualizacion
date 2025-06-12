// PersistenceManager.js

export class PersistenceManager {
	constructor(dbName = 'AppDB', storeName = 'usuarios') {
		this.dbName = dbName;
		this.storeName = storeName; // "usuarios" o "productos"
	}

	openDB() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 6); // versión 2 para forzar upgrade

			request.onupgradeneeded = (e) => {
				const db = e.target.result;

				if (db.objectStoreNames.contains('usuarios')) {
					db.deleteObjectStore('usuarios');
					console.log('Store "usuarios" eliminada.');
				}
				db.createObjectStore('usuarios');
				console.log('Store "usuarios" creada.');

				if (db.objectStoreNames.contains('productos')) {
					db.deleteObjectStore('productos');
					console.log('Store "productos" eliminada.');
				}
				db.createObjectStore('productos');
				console.log('Store "productos" creada.');
			};

			request.onsuccess = () => {
				console.log(`Base de datos abierta: ${this.dbName}, Store: ${this.storeName}`);
				resolve(request.result);
			};

			request.onerror = () => {
				console.error("Error abriendo la base de datos:", request.error);
				reject(request.error);
			};
		});
	}

	async save(key, data) {
		const db = await this.openDB();
		const tx = db.transaction(this.storeName, "readwrite");
		const store = tx.objectStore(this.storeName);

		if (store.keyPath) {
			store.put(data);
		} else {
			store.put(data, key);
		}

		return new Promise((resolve, reject) => {
			tx.oncomplete = () => {
			db.close();
			resolve();
			};
			tx.onerror = () => {
			console.error("Error guardando datos:", tx.error);
			db.close();
			reject(tx.error);
			};
		});
	}

	async load(key) {
		const db = await this.openDB();
		const tx = db.transaction(this.storeName, "readonly");
		const store = tx.objectStore(this.storeName);
		const request = store.get(key);

		return new Promise((resolve) => {
			request.onsuccess = () => {
				db.close();
				resolve(request.result ?? null);
			};
			request.onerror = () => {
				console.error("Error cargando datos:", request.error);
				db.close();
				resolve(null);
			};
		});
	}
}
