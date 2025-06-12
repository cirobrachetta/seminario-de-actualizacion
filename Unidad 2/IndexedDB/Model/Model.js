import { PersistenceManager } from "./PersistenceManager.js";

const persistence = new PersistenceManager();

export class UserABMmodel {
	constructor(persistCallback) {
		this.usuarios = new Map();
		this.maxLoginFailedAttempts = 3;
		this.persist = persistCallback;
	}

	async init() {
		const data = await persistence.load("usuarios");
		if (data) {
			this.usuarios = new Map(JSON.parse(data));
		} else {
			this.initDefaultUsers();
			this.persist();
		}
	}

	initDefaultUsers() {
		this.usuarios.set("ciro", { password: "dsaewq321", failedLoginCounter: 0, isLocked: false, rol: "ADMIN" });
		this.usuarios.set("clienteUser", { password: "987654", failedLoginCounter: 0, isLocked: false, rol: "CLIENTE" });
		this.usuarios.set("vendedorUser", { password: "vent123!!", failedLoginCounter: 0, isLocked: false, rol: "VENDEDOR" });
		this.usuarios.set("depositoUser", { password: "deposito##", failedLoginCounter: 0, isLocked: false, rol: "DEPOSITO" });
	}

	// Ya no es necesario para persistencia, pero la dejo si la querés para debug
	toJSON() {
		return [...this.usuarios.entries()];
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
		if (!username || !password) return { result: "USER_PASSWORD_FAILED" };
		const user = this.usuarios.get(username);
		if (!user) return { result: "USER_PASSWORD_FAILED" };
		if (user.isLocked) return { result: "BLOCKED_USER" };

		if (user.password === password) {
			user.failedLoginCounter = 0;
			this.usuarios.set(username, user);
			result.status = true;
			result.result = { username, rol: user.rol };
		} else {
			user.failedLoginCounter++;
			if (user.failedLoginCounter >= this.maxLoginFailedAttempts) {
				user.isLocked = true;
				result.result = "BLOCKED_USER";
			} else {
				result.result = "USER_PASSWORD_FAILED";
			}
			this.usuarios.set(username, user);
		}

		this.persist();
		return result;
	}

	crearCuenta(username, password) {
		if (!username || !password) return { status: "INVALID_INPUT" };
		if (this.usuarios.has(username)) return { status: "USER_EXISTS" };
		if (!this.isStrongPassword(password)) return { status: "WEAK_PASSWORD" };

		this.usuarios.set(username, { password, failedLoginCounter: 0, isLocked: false, rol: "CLIENTE" });
		this.persist();
		return { status: "OK" };
	}

	updatePassword(username, newPassword) {
		if (!this.usuarios.has(username)) return false;
		if (!this.isStrongPassword(newPassword)) return false;

		const user = this.usuarios.get(username);
		user.password = newPassword;
		this.usuarios.set(username, user);
		this.persist();
		return true;
	}

	deleteUser(username) {
		const result = this.usuarios.delete(username);
		this.persist();
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
	constructor(productos, persistCallback) {
		this.productos = productos;
		this.persist = persistCallback;
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
		this.persist();
		return id;
	}

	comprar(id, cantidad) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		let producto = this.productos.get(id);
		if (producto.stock < cantidad) throw new Error("INSUFFICIENT_STOCK");
		producto.stock -= cantidad;
		this.productos.set(id, producto);
		this.persist();
		return producto;
	}

	editar(id, nombre, precio, stock) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		this.productos.set(id, { nombre, precio, stock });
		this.persist();
	}

	eliminar(id) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		this.productos.delete(id);
		this.persist();
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
		this.productos = new Map();
		this.roles = new RolABMmodel();

		this.usuarios = new UserABMmodel(() => {
			return persistence.save("usuarios", JSON.stringify([...this.usuarios.usuarios.entries()]));
		});

		this.adminProductos = new ProductABMmodel(this.productos, () => {
			return persistence.save("productos", JSON.stringify([...this.productos.entries()]));
		});
	}

	async init() {
		await this.usuarios.init();

		const productos = await persistence.load("productos");
		if (productos) {
			this.productos = new Map(JSON.parse(productos));
			this.adminProductos.productos = this.productos;
		} else {
			this.loadDefaultProducts();
			this.adminProductos.persist();
		}
	}

	loadDefaultProducts() {
		this.productos.set(1, { nombre: "Lavandina x 1L", precio: 875.25, stock: 3000 });
		this.productos.set(4, { nombre: "Detergente x 500mL", precio: 1102.45, stock: 2010 });
		this.productos.set(22, { nombre: "Jabón en polvo x 250g", precio: 650.22, stock: 407 });
	}

	createProductoController() {
		return this.adminProductos;
	}

	get rolesController() {
		return this.roles;
	}
}
