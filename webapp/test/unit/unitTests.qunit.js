/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"kiruthika/banksearch/com/BankSearch/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});