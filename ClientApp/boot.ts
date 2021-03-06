import "isomorphic-fetch";
import { Aurelia, PLATFORM } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "font-awesome/css/font-awesome.css";
import "toastr/build/toastr.css";

declare const IS_DEV_BUILD: boolean; // The value is supplied by Webpack during the build

export function configure(aurelia: Aurelia) {
	aurelia.use.standardConfiguration()
		.plugin(PLATFORM.moduleName("aurelia-toolbelt"))
	;

	if (IS_DEV_BUILD) {
		aurelia.use.developmentLogging();
	}

	new HttpClient().configure(config => {
		const baseUrl = document.getElementsByTagName("base")[0].href;
		config.withBaseUrl(baseUrl);
	});

	aurelia.start().then(() => aurelia.setRoot("app/components/app/app"));
}
