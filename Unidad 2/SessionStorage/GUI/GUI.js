function GUI_crearCuenta(model) {
	const username = prompt("Ingrese nombre de usuario:");
	const password = prompt("Ingrese contraseña:");

	const result = model.usuarios.crearCuenta(username, password);

	switch (result.status) {
		case "OK":
			alert("Cuenta creada exitosamente");
			break;
		case "USER_EXISTS":
			alert("El usuario ya existe");
			break;
		case "WEAK_PASSWORD":
			alert("Contraseña no válida. Debe tener:\n8-16 caracteres, al menos 1 mayúscula y 2 símbolos especiales.");
			break;
		case "INVALID_INPUT":
			alert("Nombre de usuario y contraseña son obligatorios");
			break;
		default:
			alert("Error desconocido al crear cuenta");
	}
}

function GUI_login(model) {
	let username = prompt("Ingrese su nombre de usuario:");
	let password = prompt("Ingrese contraseña:");

	let api_return = model.usuarios.authenticate(username, password);

	if (api_return.status) {
		alert(`¡Bienvenido/a ${username}!`);
		return api_return.result;
	} else {
		switch (api_return.result) {
			case 'BLOCKED_USER':
				alert('Usuario bloqueado. Contacte al administrador');
				break;
			case 'USER_PASSWORD_FAILED':
				alert('Usuario y/o contraseña incorrecta');
				break;
			default:
				alert('Error desconocido');
				break;
		}
		return null;
	}
}

function GUI_gestionUsuarios(model) {
	let salir = false;

	while (!salir) {
		const opcion = prompt(
			"Gestión de Usuarios (ADMIN):\n1. Crear cuenta\n2. Editar cuenta\n3. Eliminar cuenta\n4. Listar cuentas\n5. Volver"
		);

		switch (opcion) {
			case "1":
				GUI_crearCuenta(model);
				break;

			case "2": {
				const usuarioEditar = prompt("Ingrese el nombre de usuario a editar:");
				if (model.usuarios.hasUser(usuarioEditar)) {
					let newPassword = prompt("Nueva contraseña:");
					if (model.usuarios.isStrongPassword(newPassword)) {
						model.usuarios.updatePassword(usuarioEditar, newPassword);
						alert("Contraseña actualizada.");
					} else {
						alert("Contraseña no válida.");
					}
				} else {
					alert("Usuario no encontrado.");
				}
				break;
			}

			case "3": {
				const usuarioEliminar = prompt("Ingrese el nombre de usuario a eliminar:");
				if (model.usuarios.hasUser(usuarioEliminar)) {
					model.usuarios.deleteUser(usuarioEliminar);
					alert("Usuario eliminado.");
				} else {
					alert("Usuario no encontrado.");
				}
				break;
			}

			case "4": {
				const listado = model.usuarios.listUsers();
				alert(listado);
				break;
			}

			case "5":
				salir = true;
				break;

			default:
				alert("Opción inválida.");
		}
	}
}

function GUI_gestionArticulos(adminProductos, rol, rolesController) {
	let salir = false;

	while (!salir) {
		let menu = "Gestión de Artículos:\n";
		let opciones = [];

		if (rolesController.tienePermiso(rol, "listar")) {
			menu += "1. Listar artículos\n";
			opciones.push("1");
		}
		if (rolesController.tienePermiso(rol, "agregar")) {
			menu += "2. Nuevo artículo\n";
			opciones.push("2");
		}
		if (rolesController.tienePermiso(rol, "editar")) {
			menu += "3. Editar artículo\n";
			opciones.push("3");
		}
		if (rolesController.tienePermiso(rol, "eliminar")) {
			menu += "4. Eliminar artículo\n";
			opciones.push("4");
		}
		if (rolesController.tienePermiso(rol, "comprar")) {
			menu += "5. Comprar artículo\n";
			opciones.push("5");
		}

		menu += "6. Volver al menú anterior";

		let opcion = prompt(menu);

		switch (opcion) {
			case "1":
				alert(
					adminProductos.listar()
						.map(
							([id, prod]) => `ID: ${id}, ${prod.nombre} - $${prod.precio} - Stock: ${prod.stock}`
						)
						.join("\n") || "No hay productos."
				);
				break;

			case "2": {
				const nombre = prompt("Nombre del producto:");
				const precio = parseFloat(prompt("Precio:"));
				const stock = parseInt(prompt("Stock:"), 10);
				adminProductos.agregar(nombre, precio, stock);
				alert("Producto agregado.");
				break;
			}

			case "3": {
				const idEditar = parseInt(prompt("ID del producto a editar:"), 10);
				const nuevoNombre = prompt("Nuevo nombre:");
				const nuevoPrecio = parseFloat(prompt("Nuevo precio:"));
				const nuevoStock = parseInt(prompt("Nuevo stock:"), 10);
				try {
					adminProductos.editar(idEditar, nuevoNombre, nuevoPrecio, nuevoStock);
					alert("Producto editado.");
				} catch {
					alert("Producto no encontrado.");
				}
				break;
			}

			case "4": {
				const idEliminar = parseInt(prompt("ID del producto a eliminar:"), 10);
				try {
					adminProductos.eliminar(idEliminar);
					alert("Producto eliminado.");
				} catch {
					alert("Producto no encontrado.");
				}
				break;
			}

			case "5": {
				const idComprar = parseInt(prompt("ID del producto a comprar:"), 10);
				const cantidad = parseInt(prompt("Cantidad a comprar:"), 10);
				try {
					adminProductos.comprar(idComprar, cantidad);
					alert("Compra realizada.");
				} catch (err) {
					if (err.message === "NOT_FOUND") {
						alert("Producto no encontrado.");
					} else if (err.message === "INSUFFICIENT_STOCK") {
						alert("Stock insuficiente.");
					} else {
						alert("Error en la compra.");
					}
				}
				break;
			}

			case "6":
				salir = true;
				break;

			default:
				alert("Opción inválida.");
		}
	}
}

function showUserMenu(username, rol, adminProductos, rolesController, model) {
	let option;
	let repeat = true;

	while (repeat) {
		let menu = `[${rol}] Seleccione una opción:\n1. Cambiar contraseña\n2. Menú de artículos\n`;

		if (rolesController.tienePermiso(rol, "comprar")) {
			menu += "3. Comprar artículo\n";
		}

		if (rol === "ADMIN") {
			menu += "4. Gestión de usuarios\n";
		}

		menu += "5. Salir";

		option = prompt(menu);

		switch (option) {
			case '1': {
				let newPassword = prompt("Ingrese nueva contraseña:");
				if (model.usuarios.isStrongPassword(newPassword)) {
					model.usuarios.updatePassword(username, newPassword);
					alert("Contraseña actualizada correctamente.");
				} else {
					alert("Contraseña no cumple los requisitos.");
				}
				break;
			}

			case '2':
				GUI_gestionArticulos(adminProductos, rol, rolesController);
				break;

			case '3':
				if (rolesController.tienePermiso(rol, "comprar")) {
					GUI_gestionArticulos(adminProductos, rol, rolesController);
				} else {
					alert("No tiene permiso.");
				}
				break;

			case '4':
				if (rol === "ADMIN") {
					GUI_gestionUsuarios(model);
				} else {
					alert("Acceso denegado.");
				}
				break;

			case '5':
				alert("Saliendo...");
				repeat = false;
				break;

			default:
				alert("Opción inválida.");
		}
	}
}

class ApplicationUI {
	constructor(model) {
		this.model = model;
	}

	run() {
		const admin = this.model.adminProductos;
		const rolesController = this.model.rolesController;

		let exit = false;

		while (!exit) {
			const option = prompt("Seleccione una opción:\n1. Iniciar sesión\n2. Salir");

			switch (option?.toUpperCase()) {
				case "1": {
					let loginResult = GUI_login(this.model);
					if (loginResult) {
						showUserMenu(loginResult.username, loginResult.rol, admin, rolesController, this.model);
					}
					break;
				}

				case "2":
					alert("Gracias por usar el sistema.");
					exit = true;
					break;

				default:
					alert("Opción no válida.");
			}
		}
	}
}

export { ApplicationUI };