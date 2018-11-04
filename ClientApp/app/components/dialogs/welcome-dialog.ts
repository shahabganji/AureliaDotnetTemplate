import { autoinject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";

@autoinject()
export class WelcomeDialog {

	constructor(private dc: DialogController) {
	}

}
