import { ApplicationUI } from "./GUI.js";
import { ApplicationModel } from "./Model.js";

function main() {
	const model = new ApplicationModel(); // Usa la clase que encapsula todos los controladores
	const app = new ApplicationUI(model);
	app.run();
}

main();
