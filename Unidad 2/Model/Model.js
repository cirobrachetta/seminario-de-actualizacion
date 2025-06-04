// Model.js

export class ControladorUsuarios {
	constructor() {
		this.usuarios = new Map();
		this.maxLoginFailedAttempts = 3;
		this.initDefaultUsers();
	}

	initDefaultUsers() {
		this.usuarios.set("ciro", { password: "dsaewq321", failedLoginCounter: 0, isLocked: false, rol: "ADMIN" });
		this.usuarios.set("clienteUser", { password: "987654", failedLoginCounter: 0, isLocked: false, rol: "CLIENTE" });
		this.usuarios.set("vendedorUser", { password: "vent123!!", failedLoginCounter: 0, isLocked: false, rol: "VENDEDOR" });
		this.usuarios.set("depositoUser", { password: "deposito##", failedLoginCounter: 0, isLocked: false, rol: "DEPOSITO" });
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

		return result;
	}

	crearCuenta(username, password) {
		if (!username || !password) return { status: "INVALID_INPUT" };
		if (this.usuarios.has(username)) return { status: "USER_EXISTS" };
		if (!this.isStrongPassword(password)) return { status: "WEAK_PASSWORD" };

		this.usuarios.set(username, { password, failedLoginCounter: 0, isLocked: false });
		return { status: "OK" };
	}

	actualizarPassword(username, password) {
		let user = this.usuarios.get(username);
		if (user) user.password = password;
	}

	hasUser(username) {
		return this.usuarios.has(username);
	}

	updatePassword(username, newPassword) {
		if (this.usuarios.has(username)) {
			this.usuarios.get(username).password = newPassword;
			return true;
		}
		return false;
	}

	deleteUser(username) {
		return this.usuarios.delete(username);
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

export class AdministradorProductos {
	constructor(productos) {
		this.productos = productos;
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
		return id;
	}

	comprar(id, cantidad) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");

		let producto = this.productos.get(id);
		if (producto.stock < cantidad) throw new Error("INSUFFICIENT_STOCK");

		producto.stock -= cantidad;
		this.productos.set(id, producto);
		return producto;
	}

	editar(id, nombre, precio, stock) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		this.productos.set(id, { nombre, precio, stock });
	}

	eliminar(id) {
		if (!this.productos.has(id)) throw new Error("NOT_FOUND");
		this.productos.delete(id);
	}

	mostrar() {
		let salida = "Lista de productos:\n";
		for (let [id, prod] of this.productos.entries()) {
			salida += `ID: ${id} | ${prod.nombre} - $${prod.precio} - Stock: ${prod.stock}\n`;
		}
		alert(salida);
	}

	nuevoArticulo() {
		const nombre = prompt("Nombre del producto:");
		const precio = parseFloat(prompt("Precio:"));
		const stock = parseInt(prompt("Stock inicial:"));

		if (nombre && !isNaN(precio) && !isNaN(stock)) {
			this.agregar(nombre, precio, stock);
			alert("Producto agregado con éxito.");
		} else {
			alert("Datos inválidos.");
		}
	}

	editarArticulo() {
		const id = parseInt(prompt("ID del producto a editar:"));
		if (!this.productos.has(id)) return alert("Producto no encontrado.");

		const nombre = prompt("Nuevo nombre:");
		const precio = parseFloat(prompt("Nuevo precio:"));
		const stock = parseInt(prompt("Nuevo stock:"));

		if (!nombre || isNaN(precio) || isNaN(stock)) {
			alert("Datos inválidos.");
			return;
		}

		this.editar(id, nombre, precio, stock);
		alert("Producto actualizado.");
	}

	eliminarArticulo() {
		const id = parseInt(prompt("ID del producto a eliminar:"));
		if (this.productos.has(id)) {
			this.eliminar(id);
			alert("Producto eliminado.");
		} else {
			alert("Producto no encontrado.");
		}
	}

	comprarArticulo() {
		const id = parseInt(prompt("ID del producto a comprar:"));
		const cantidad = parseInt(prompt("Cantidad:"));

		try {
			const producto = this.comprar(id, cantidad);
			alert(`Compra realizada. Quedan ${producto.stock} unidades de ${producto.nombre}`);
		} catch (err) {
			alert(err.message === "INSUFFICIENT_STOCK" ? "Stock insuficiente" : "Producto no encontrado");
		}
	}
}

export class ControladorDeRoles {
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

class ApplicationModel {
	constructor() {
		this.usuarios = new ControladorUsuarios();
		this.roles = new ControladorDeRoles();
		this.productos = new Map([
			[1, { nombre: "Lavandina x 1L", precio: 875.25, stock: 3000 }],
			[4, { nombre: "Detergente x 500mL", precio: 1102.45, stock: 2010 }],
			[22, { nombre: "Jabón en polvo x 250g", precio: 650.22, stock: 407 }],
		]);
		this.adminProductos = new AdministradorProductos(this.productos);
	}

	createProductoController() {
		return this.adminProductos;
	}

	get rolesController() {
		return this.roles;
	}
}

// API para GUI.js
function isStrongPassword(password, model) {
	return model.usuarios.isStrongPassword(password);
}

function authenticateUser(username, password, model) {
	return model.usuarios.authenticate(username, password);
}

function api_crearCuenta(username, password, model) {
	return model.usuarios.crearCuenta(username, password);
}

export {
	ApplicationModel,
	isStrongPassword,
	authenticateUser,
	api_crearCuenta
};
