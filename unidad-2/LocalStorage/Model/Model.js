// Model.js

export class UserABMmodel {
	constructor() {
		this.usuarios = new Map();
		this.maxLoginFailedAttempts = 3;
		this.loadFromStorage();
	}

	initDefaultUsers() {
		this.usuarios.set("ciro", { password: "dsaewq321", failedLoginCounter: 0, isLocked: false, rol: "ADMIN" });
		this.usuarios.set("clienteUser", { password: "987654", failedLoginCounter: 0, isLocked: false, rol: "CLIENTE" });
		this.usuarios.set("vendedorUser", { password: "vent123!!", failedLoginCounter: 0, isLocked: false, rol: "VENDEDOR" });
		this.usuarios.set("depositoUser", { password: "deposito##", failedLoginCounter: 0, isLocked: false, rol: "DEPOSITO" });
	}

	saveToStorage() {
		const usuariosObj = Object.fromEntries(this.usuarios);
		localStorage.setItem('usuarios', JSON.stringify(usuariosObj));
	}

	loadFromStorage() {
		const data = localStorage.getItem('usuarios');
		if (data) {
			this.usuarios = new Map(Object.entries(JSON.parse(data)));
		} else {
			this.initDefaultUsers();
			this.saveToStorage();
		}
	}

	isStrongPassword(password) {
		const specialChars = /[^A-Za-z0-9]/g;
		const uppercase = /[A-Z]/;
		const lengthValid = password.length >= 8 && password.length <= 16;
		const hasUppercase = uppercase.test(password);
		const specialMatches = password.match(specialChars);
		const hasTwoSpecials = specialMatches && specialMatches.length >= 2;
		return lengthValid && hasUppercase && hasTwoSpecials;
	}

	authenticate(username, password) {
		let result = { status: false, result: null };

		if (!username || !password) {
			result.result = "USER_PASSWORD_FAILED";
			return result;
		}

		const user = this.usuarios.get(username);
		if (!user) {
			result.result = "USER_PASSWORD_FAILED";
			return result;
		}

		if (user.isLocked) {
			result.result = "BLOCKED_USER";
			return result;
		}

		if (user.password === password) {
			result.status = true;
			result.result = { username, rol: user.rol };
			user.failedLoginCounter = 0;
		} else {
			user.failedLoginCounter++;
			if (user.failedLoginCounter >= this.maxLoginFailedAttempts) {
				user.isLocked = true;
				result.result = "BLOCKED_USER";
			} else {
				result.result = "USER_PASSWORD_FAILED";
			}
		}

		this.saveToStorage();
		return result;
	}

	crearCuenta(username, password) {
		if (!username || !password) return { status: "INVALID_INPUT" };
		if (this.usuarios.has(username)) return { status: "USER_EXISTS" };
		if (!this.isStrongPassword(password)) return { status: "WEAK_PASSWORD" };

		this.usuarios.set(username, { password, failedLoginCounter: 0, isLocked: false, rol: "CLIENTE" });
		this.saveToStorage();
		return { status: "OK" };
	}

	hasUser(username) {
		return this.usuarios.has(username);
	}

	updatePassword(username, newPassword) {
		if (!this.usuarios.has(username)) return false;
		if (!this.isStrongPassword(newPassword)) return false;
		this.usuarios.get(username).password = newPassword;
		this.saveToStorage();
		return true;
	}

	deleteUser(username) {
		const result = this.usuarios.delete(username);
		this.saveToStorage();
		return result;
	}

	listUsers() {
		if (this.usuarios.size === 0) return "No hay usuarios registrados.";
		let result = "Usuarios:\n";
		for (let [key, val] of this.usuarios.entries()) {
			result += `• ${key} - Rol: ${val.rol} - Estado: ${val.isLocked ? 'Bloqueado' : 'Activo'}\n`;
		}
		return result;
	}
}

export class ProductABMmodel {
	constructor(productos) {
		this.productos = productos;
		this.loadFromStorage();
	}

	saveToStorage() {
		const productosObj = Object.fromEntries(this.productos);
		localStorage.setItem('productos', JSON.stringify(productosObj));
	}

	loadFromStorage() {
		const data = localStorage.getItem('productos');
		if (data) {
			this.productos = new Map(Object.entries(JSON.parse(data)).map(([id, val]) => [parseInt(id), val]));
		}
	}

	listar() {
		return [...this.productos.entries()];
	}

	getNextId() {
		if (this.productos.size === 0) return 1;
		return Math.max(...this.productos.keys()) + 1;
	}

	agregar(nombre, precio, stock) {
		const id = this.getNextId();
		this.productos.set(id, { nombre, precio, stock });
		this.saveToStorage();
		return id;
	}

	comprar(id, cantidad) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		let producto = this.productos.get(id);
		if (producto.stock < cantidad) throw new Error("INSUFFICIENT_STOCK");
		producto.stock -= cantidad;
		this.productos.set(id, producto);
		this.saveToStorage();
		return producto;
	}

	editar(id, nombre, precio, stock) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		this.productos.set(id, { nombre, precio, stock });
		this.saveToStorage();
	}

	eliminar(id) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		this.productos.delete(id);
		this.saveToStorage();
	}
}

export class RolABMmodel {
	constructor() {
		this.permisos = {
			ADMIN: ["listar", "agregar", "editar", "eliminar", "comprar"],
			VENDEDOR: ["listar", "agregar", "editar"],
			CLIENTE: ["listar", "comprar"],
			DEPOSITO: ["listar"]
		};
	}

	tienePermiso(rol, accion) {
		return this.permisos[rol]?.includes(accion);
	}

	getAccionesDisponibles(rol) {
		return this.permisos[rol] || [];
	}
}

export class ApplicationModel {
	constructor() {
		this.usuarios = new UserABMmodel();
		this.roles = new RolABMmodel();
		this.productos = new Map([
			[1, { nombre: "Lavandina x 1L", precio: 875.25, stock: 3000 }],
			[4, { nombre: "Detergente x 500mL", precio: 1102.45, stock: 2010 }],
			[22, { nombre: "Jabón en polvo x 250g", precio: 650.22, stock: 407 }],
		]);
		this.adminProductos = new ProductABMmodel(this.productos);
	}

	createProductoController() {
		return this.adminProductos;
	}

	get rolesController() {
		return this.roles;
	}
}
