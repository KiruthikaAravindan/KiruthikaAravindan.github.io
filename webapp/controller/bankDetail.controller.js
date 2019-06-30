sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("kiruthika.banksearch.com.BankSearch.controller.bankDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf kiruthika.banksearch.com.BankSearch.view.bankDetail
		 */
		onInit: function () {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
		},
		
		onPressBack: function() {
			this._router.navTo("Routemain",{});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf kiruthika.banksearch.com.BankSearch.view.bankDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf kiruthika.banksearch.com.BankSearch.view.bankDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf kiruthika.banksearch.com.BankSearch.view.bankDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});