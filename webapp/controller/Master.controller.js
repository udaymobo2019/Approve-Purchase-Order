sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"../model/formatter"
], function (BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
	"use strict";

	return BaseController.extend("zee.POGrunt.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function () {
			this.getOwnerComponent().getModel("oGlobalModel").setProperty("/delay", true);
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRouteMatched(this.handleRouteMatched, this);

			var that = this;
			var oModel1 = new sap.ui.model.json.JSONModel();
			/* Assign the model to the view */
			this.getView().setModel(oModel1);
			/* Load the data */
			oModel1.loadData("/services/userapi/currentUser");
			/* Add a completion handler to log the json and any errors*/
			oModel1.attachRequestCompleted(function onCompleted(oEvent) {
				this.suser = oModel1.oData.name;
				console.log("this.suser", this.suser);

				if (this.suser === "undefined") {

				} else {
					that.Suserid = this.suser;
					that.useracess();
				}
			});

		},
		useracess: function () {
			var filters = [];
			var that = this;
			var oModel = this.getOwnerComponent().getModel("useraccess");
			filters.push(new sap.ui.model.Filter("UserName", sap.ui.model.FilterOperator.EQ, "")); //user1
			filters.push(new sap.ui.model.Filter("SUserId", sap.ui.model.FilterOperator.EQ, that.Suserid)); //this.logid1
			filters.push(new sap.ui.model.Filter("ApplicationName", sap.ui.model.FilterOperator.EQ, "POAPPROVAL"));
			var sService = "/User_AccessSet";

			oModel.read(sService, {
				filters: filters,
				success: function (oData, oResponse) {
					console.log(oData);
					that.Designation = oData.results[0].UserName;
					console.log(that.Designation);
					that.appliName = oData.results[0].ApplicationName;
					console.log(that.appliName);
					that.getView().getModel("oGlobalModel").setProperty("/username", that.Designation); //Added code
					that.getView().getModel("oGlobalModel").setProperty("/appliname", that.appliName); //Added code
					if (oData.results[0].Authorization === "X") {
						that.list();
						this.getView().getModel("oGlobalModel").setProperty("/logid", that.Designation);
					} else {
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.error(
							"You Are Not Authorised to Access this application", {
								icon: sap.m.MessageBox.Icon.ERROR,
								actions: [sap.m.MessageBox.Action.CLOSE],
								onClose: function (oAction) {
									var navUrl =
										"https://dashboarddesigngrunt-ba293bd41.dispatcher.us1.hana.ondemand.com/index.html?hc_reset#/PM"
									sap.m.URLHelper.redirect(navUrl, false);
								}
							});
					}
				}.bind(this)
			});

		},
		list: function () {
			var that = this;
			var oModel1 = this.getOwnerComponent().getModel("user");
			var servicePath = "/POListSet";
			///this.getOwnerComponent().getModel("oGlobalModel").setProperty("/delay", true);
			this.logid = this.getOwnerComponent().getModel("oGlobalModel").getProperty("/access");
			oModel1.read(servicePath, {
				filters: [new sap.ui.model.Filter("ImApprover", sap.ui.model.FilterOperator.EQ, that.Designation),
					new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'OPEN')
				],
				success: function (oData, oResponse) {
					this.getOwnerComponent().getModel("oGlobalModel").setProperty("/delay", false);
					this.getOwnerComponent().getModel("oGlobalModel").setProperty("/POListSet", oData.results);

				}.bind(this)
			});
		},
		approval: function () {
			var that = this;
			var oModel = this.getView().getModel("user");
			var servicePath = "/POListSet";
			this.getView().getModel("oGlobalModel").setProperty("/delay", true);
			this.logid = this.getView().getModel("oGlobalModel").getProperty("/access");
			oModel.read(servicePath, {
				filters: [new sap.ui.model.Filter("ImApprover", sap.ui.model.FilterOperator.EQ, that.Designation),
					new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'APPROVED')
				],
				success: function (oData, oResponse) {
					this.getView().getModel("oGlobalModel").setProperty("/delay", false);
					this.getView().getModel("oGlobalModel").setProperty("/POListSet", oData.results);
				}.bind(this)
			});
		},
		open: function () {
			var that = this;
			var oModel = this.getView().getModel("user");
			var servicePath = "/POListSet";
			this.getView().getModel("oGlobalModel").setProperty("/delay", true);
			this.logid = this.getView().getModel("oGlobalModel").getProperty("/access");
			oModel.read(servicePath, {
				filters: [new sap.ui.model.Filter("ImApprover", sap.ui.model.FilterOperator.EQ, that.Designation),
					new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'OPEN')
				],
				success: function (oData, oResponse) {
					this.getView().getModel("oGlobalModel").setProperty("/delay", false);
					this.getView().getModel("oGlobalModel").setProperty("/POListSet", oData.results);
				}.bind(this)
			});
		},
		_onObjectListItemPress: function (oEvent) {
			this.doc = oEvent.getParameter("listItem").getBindingContext("oGlobalModel").getObject().PONumber;
			this.getView().getModel("oGlobalModel").setProperty("/doc", this.doc);
			//	alert(this.doc);
			this.oRouter.navTo("object", {
				mes: this.doc
			});

		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		backtodash: function () {
			window.location.replace(
				"https://dashboarddesigngrunt-ba293bd41.dispatcher.us1.hana.ondemand.com/index.html?hc_reset#/PM"
			);
		},
		onUpdateFinished: function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		search: function (oEvent) {
			var SamTbl = oEvent.getParameter("newValue");
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("PONumber", sap.ui.model.FilterOperator.Contains, SamTbl),
					new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.Contains, SamTbl),
					new sap.ui.model.Filter("Company_Name", sap.ui.model.FilterOperator.Contains, SamTbl)
				],
				false);
			filters = (oFilter);
			var listItem = this.getView().byId("List");
			var binding = listItem.getBinding("items");
			binding.filter(filters);
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the filter, sort and group buttons to open the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onOpenViewSettings: function (oEvent) {
			var sDialogTab = "filter";
			if (oEvent.getSource() instanceof sap.m.Button) {
				var sButtonId = oEvent.getSource().getId();
				if (sButtonId.match("sort")) {
					sDialogTab = "sort";
				} else if (sButtonId.match("group")) {
					sDialogTab = "group";
				}
			}
			// load asynchronous XML fragment
			if (!this.byId("viewSettingsDialog")) {
				Fragment.load({
					id: this.getView().getId(),
					name: "zee.POGrunt.view.ViewSettingsDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					this.getView().addDependent(oDialog);
					oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					oDialog.open(sDialogTab);
				}.bind(this));
			} else {
				this.byId("viewSettingsDialog").open(sDialogTab);
			}
		},

		/**
		 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
		 * has been closed with 'OK'. In the case, the currently chosen filters, sorters or groupers
		 * are applied to the master list, which can also mean that they
		 * are removed from the master list, in case they are
		 * removed in the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @public
		 */
		onConfirmViewSettingsDialog: function (oEvent) {

			this._applySortGroup(oEvent);
		},

		/**
		 * Apply the chosen sorter and grouper to the master list
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @private
		 */
		_applySortGroup: function (oEvent) {
			var mParams = oEvent.getParameters(),
				sPath,
				bDescending,
				aSorters = [];
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function () {
			this._oList.removeSelections(true);
		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Notification",
				groupBy: "None"
			});
		},

		_onMasterMatched: function () {
			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			// set the layout property of FCL control to show two columns
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Notification")
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {integer} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});

});