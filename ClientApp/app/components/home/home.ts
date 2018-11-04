import { autoinject } from "aurelia-framework";
import { DialogService } from "aurelia-dialog";
import { WelcomeDialog } from "./../dialogs/welcome-dialog";
import { ToastrService } from "aurelia-toolbelt";

@autoinject()
export class Home {

	constructor(private ts: ToastrService, private ds: DialogService) {
	}

	private showDialog() {
		this.ds.open({
			viewModel: WelcomeDialog
		}).whenClosed(res => {
			// tslint:disable-next-line:no-console
			console.log("Dialog Closed");
			this.ts.info("Hi there, thanks for using Aurelia-Toolbelt");
		});
	}

}
