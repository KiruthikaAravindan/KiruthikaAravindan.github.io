sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("kiruthika.banksearch.com.BankSearch.controller.main", {
		onInit: function () {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			var oAppModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oAppModel, "oAppModel");
			var initCity = "MUMBAI";
			oAppModel.setProperty("selectedCity", initCity);
			oAppModel.setProperty("/pageSize", 10);
			oAppModel.setProperty("/favorites", (localStorage["favorites"] && JSON.parse(localStorage["favorites"])) || []);
			// this.getView().byId("idBankList").setBusy(true);
			this.getBanks(initCity);
		},

		getBanks: function (city) {
			var oAppModel = this.getView().getModel("oAppModel");
			var oModel = new sap.ui.model.json.JSONModel();
			var url = "https://vast-shore-74260.herokuapp.com/banks?city=" + city;
			// var cacheName = 'bank-details-cache';
			// if ('caches' in window) {
			// 	// The Cache API is supported
			// 	var cacheName = 'bank-details-cache';
			// 	caches.open(cacheName).then(cache => {
			// 		// you can start using the cache
			// 		var url = "https://vast-shore-74260.herokuapp.com/banks?city=" + city;
			// 		cache.match(url).then(item => {
			// 				debugger;
			// 				console.log(item)
			// 					// fetch(item)
			// 					// 	.then(response => response.json())
			// 					// 	.then(data => {
			// 					// 		console.log(data) // Prints result from `response.json()` in getRequest
			// 					// 	})
			// 					// 	.catch(error => console.error(error))
			// 			})
			// 			// cache.add(url).then(() => {
			// 			// 	debugger;
			// 			// 	//done!
			// 			// })
			// 	})
			// }

			// var cachedResponse = caches.match(url).catch(function () {
			// 	debugger;
			// 	return fetch(url);
			// }).then(function (response) {
			// 	caches.open(cacheName).then(function (cache) {
			// 		debugger;
			// 		cache.put(url, response);
			// 	});
			// 	return response.clone();
			// }).catch(function () {
			// 	debugger;
			// 	return caches.match(url);
			// });
			// debugger;
			// console.log(cachedResponse);
			if (!localStorage[url]) {
				oModel.loadData(url);
				oModel.attachRequestCompleted(function (oEvent) {
					this.setListData(oEvent.getSource().getData(), url);
					localStorage[url] = JSON.stringify(oEvent.getSource().getData());
				}.bind(this));
			} else {
				this.setListData(JSON.parse(localStorage[url]), url);
			}
		},

		setListData: function (listData, url) {
			var oAppModel = this.getView().getModel("oAppModel");
			var listSize = listData.length;
			oAppModel.setProperty("/currPage", 1);
			oAppModel.setSizeLimit(listSize);
			oAppModel.setProperty("/listSize", listSize);
			oAppModel.setProperty("/bankList", listData);
			oAppModel.setProperty("/prevUrl", url);
			this.refreshPagination();
			// this.getView().byId("idBankList").setBusy(false);
		},

		changeCity: function (oEvent) {
			var oAppModel = this.getView().getModel("oAppModel");
			oAppModel.setProperty("/searchValue", "");
			oAppModel.setProperty("/currPage", 1);
			this.getView().byId("idBankList").setBusy(true);
			var city = oEvent.getSource().getSelectedKey();
			this.getBanks(city);
		},

		filterBanks: function (oEvent) {
			// var sQuery = oEvent.getSource().getValue();
			// var aFilters = [];
			// var filterArray = [];
			// var metaModel = ["bank_id", "branch", "ifsc", "address", "city", "district", "state", "bank_name"];
			// if (sQuery && sQuery.length > 0) {
			// 	for (var i = 0; i < metaModel.length; i++) {
			// 		var bindingName = metaModel[i];
			// 		if (metaModel[i] !== "bank_id") // For Strings
			// 			filterArray.push(new sap.ui.model.Filter(bindingName, sap.ui.model.FilterOperator.Contains, sQuery));
			// 		else //For Number
			// 			filterArray.push(new sap.ui.model.Filter(bindingName, sap.ui.model.FilterOperator.EQ, sQuery));
			// 	}
			// 	var filter = new sap.ui.model.Filter(filterArray, false);
			// 	aFilters.push(filter);
			// }
			// var bankList = this.getView().byId("idBankList");
			// var binding = bankList.getBinding("items");
			// binding.filter(aFilters, "Application");
			var oAppModel = this.getView().getModel("oAppModel");
			var bankList = oAppModel.getProperty("/bankList");
			var newList = bankList.filter(function (data) {
				var flag = false;
				Object.values(data).every(function (value) {
					if (value.toString().toLowerCase().includes(oEvent.getSource().getValue().toLowerCase())) {
						flag = true;
						return false;
					}
					return true;
				});
				return flag;
			});
			oAppModel.setProperty("/searchList", newList);
			oAppModel.setProperty("/currPage", 1);
			this.refreshPagination();
			// console.log(newList);
		},

		refreshPagination: function () {
			var oAppModel = this.getView().getModel("oAppModel");
			var bankList = oAppModel.getProperty("/searchValue") ? oAppModel.getProperty("/searchList") : oAppModel.getProperty("/bankList");
			var pageSize = oAppModel.getProperty("/pageSize");
			var currPage = oAppModel.getProperty("/currPage");
			oAppModel.setProperty("/totalPages", Math.ceil(bankList.length / pageSize));
			oAppModel.setProperty("/goToPage", currPage);
			oAppModel.setProperty("/currentList", bankList.slice((currPage - 1) * pageSize, currPage * pageSize));
		},

		onChangePage: function () {
			var oAppModel = this.getView().getModel("oAppModel");
			var goToPage = oAppModel.getProperty("/goToPage");
			if (goToPage == parseInt(goToPage) && (goToPage > 0 && goToPage <= oAppModel.getProperty("/totalPages"))) {
				oAppModel.setProperty("/currPage", goToPage);
				this.refreshPagination();
			} else {
				sap.m.MessageToast.show("Enter a valid Page");
				// oAppModel.getProperty("/goToPage")
			}
		},

		onClickPrev: function () {
			var oAppModel = this.getView().getModel("oAppModel");
			var currPage = oAppModel.getProperty("/currPage");
			oAppModel.setProperty("/currPage", currPage - 1);
			this.refreshPagination();
		},

		onClickNext: function () {
			var oAppModel = this.getView().getModel("oAppModel");
			var currPage = oAppModel.getProperty("/currPage");
			oAppModel.setProperty("/currPage", currPage + 1);
			this.refreshPagination();
		},

		onPressFavorite: function (oEvent) {
			var oAppModel = this.getView().getModel("oAppModel");
			var currPage = oAppModel.getProperty("/currPage");
			var pageSize = oAppModel.getProperty("/pageSize");
			var bankList = oAppModel.getProperty("/bankList");
			var favorites = oAppModel.getProperty("/favorites");
			var currContext = oEvent.getSource().getBindingContext("oAppModel");
			var currIndex = currContext.getPath().split("/").pop();
			var currObject = currContext.getObject();
			var newState = !(currObject.isFav || false);
			currObject.isFav = newState;
			// bankList[((currPage - 1) * pageSize) + Number(currIndex)].isFav = newState;
			var list = bankList;
			var ObjectUrl = currObject.url || oAppModel.getProperty("/prevUrl");
			if (currContext.getPath().includes("favorites")) {
				list = JSON.parse(localStorage[ObjectUrl]);
			}
			for (var i = 0; i < list.length; i++) {
				if (list[i].ifsc === currObject.ifsc) {
					list[i].isFav = newState;
				}
			}
			localStorage[ObjectUrl] = JSON.stringify(list) || "";
			
			if (newState) {
				currObject.url = oAppModel.getProperty("/prevUrl");
				favorites.push(currObject);
			} else {
				favorites = favorites.filter(obj => (obj.ifsc !== currObject.ifsc));
			}
			oAppModel.setProperty("/favorites", favorites);
			oAppModel.refresh();
			localStorage["favorites"] = JSON.stringify(oAppModel.getProperty("/favorites"));
		},

		onViewFavs: function () {
			var oAppModel = this.getView().getModel("oAppModel");
			if (!this._favBanksDialog) {
				this._favBanksDialog = sap.ui.xmlfragment("kiruthika.banksearch.com.BankSearch.view.favoriteBankList", this);
				this.getView().addDependent(this._favBanksDialog);
			}
			this._favBanksDialog.open();
			this._favBanksDialog.setModel(oAppModel, "oAppModel");
		},

		onCloseFavs: function () {
			this._favBanksDialog.close();
		},

		onClickBank: function (oEvent) {
			var bankNo = oEvent.getSource().getBindingContext("oAppModel").getObject().bank_id;
			this.getOwnerComponent().getModel("bankDetailModel").setProperty("/bankDetails", oEvent.getSource().getBindingContext("oAppModel").getObject());
			this._router.navTo("bankDetail", {
				ContextPath: bankNo
			});
		},
		
		onChangePageSize: function(oEvent) {
			var oAppModel = this.getView().getModel("oAppModel");
			var PageSize = oEvent.getSource().getValue();
			if (PageSize == parseInt(PageSize) && (PageSize > 0)) {
				this.refreshPagination();
			} else {
				sap.m.MessageToast.show("Enter a valid Number");
			}
		}

	});
});