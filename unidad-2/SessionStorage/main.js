import { ApplicationUI } from "./GUI/GUI.js";
import { ApplicationModel } from "./Model/Model.js";

function main() {
	const model = new ApplicationModel(); // Usa la clase que encapsula todos los controladores
	const app = new ApplicationUI(model);
	app.run();
}

main();
