import { ApplicationModel } from "./Model/Model.js";
import { ApplicationUI } from "./GUI/GUI.js"; // Asumiendo que tu GUI está ahí

async function main() {
	const model = new ApplicationModel();
	await model.init();

	const ui = new ApplicationUI(model);
	ui.run();
}

main();
