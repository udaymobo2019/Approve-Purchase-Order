var sText;
sap.ui.define([
	"./BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"../model/formatter",
	"sap/ui/core/Fragment",
	"sap/m/library",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea",
	'sap/ui/layout/HorizontalLayout',
	'sap/ui/layout/VerticalLayout',
	'sap/ui/unified/DateRange'

], function (BaseController, Controller, ODataModel, utilities, History, MessageBox, formatter, Fragment, library, JSONModel, Button,
	Dialog, Label, MessageToast, Text, TextArea, HorizontalLayout, VerticalLayout, DateRange) {
	"use strict";

	/*// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;*/

	return BaseController.extend("zee.POGrunt.controller.Detail", {
		handleRouteMatched: function (oEvent) {

			this.logid = this.getView().getModel("oGlobalModel").getProperty("/logid");
			console.log("this.logid", this.logid);
			var oArgs = oEvent.getParameter("arguments");
			var Ponumber = this.getView().getModel("oGlobalModel").getProperty("/doc");
			//	alert(Ponumber);
			var oFilter = [new sap.ui.model.Filter("PONumber", sap.ui.model.FilterOperator.EQ, Ponumber)];
			var sPath = "/CreateHeaderSet";
			this.oModel_MM.read(sPath, {
				urlParameters: {
					"$expand": "HeaderToItem" // expand data for items
				},
				filters: oFilter, // passing the filter
				success: function (oData, oResponse) {

					console.log("Expand", oData)
					var CCode = oData.results[0].CCode;
					var Doc_Type = oData.results[0].Doc_Type;
					var Header_text = oData.results[0].Header_text;
					var PONumber = oData.results[0].PONumber;
					var Purch_group = oData.results[0].Purch_group;
					var Purch_org = oData.results[0].Purch_org;
					var Release_status = oData.results[0].Release_status;
					var Vendor = oData.results[0].Vendor;
					var username = oData.results[0].username;
					this.supervisorcmt = oData.results[0].Comment_l1;
					this.manager = oData.results[0].Comment_l2;
					this.director = oData.results[0].Comment_l3;
					this.getView().getModel("oGlobalModel").setProperty("/CCode", CCode);
					this.getView().getModel("oGlobalModel").setProperty("/Doc_Type", Doc_Type);
					this.getView().getModel("oGlobalModel").setProperty("/Header_text", Header_text);
					this.getView().getModel("oGlobalModel").setProperty("/PONumber", PONumber);
					this.getView().getModel("oGlobalModel").setProperty("/Purch_group", Purch_group);
					this.getView().getModel("oGlobalModel").setProperty("/Purch_org", Purch_org);
					this.getView().getModel("oGlobalModel").setProperty("/Release_status", Release_status);
					this.getView().getModel("oGlobalModel").setProperty("/Vendor", Vendor);
					this.getView().getModel("oGlobalModel").setProperty("/username", username);
					this.getView().getModel("oGlobalModel").setProperty("/Ponumber", Ponumber);
					var HeaderToItem = oData.results[0].HeaderToItem.results;
					this.getView().getModel("oGlobalModel").setProperty("/HeaderToItem", HeaderToItem);
					var tableM = this.byId("idTable");
					var tablelengthM = tableM.getItems().length;
					for (var j = 0; j < tablelengthM; j++) {
						var rowsM = tableM.getItems()[0];
						var PlantName = rowsM.getCells()[7].getValue();
						var street = rowsM.getCells()[8].getValue();
						var country = rowsM.getCells()[9].getValue();
						var Delivery_Date = rowsM.getCells()[10].getValue();
						var city = rowsM.getCells()[11].getValue();
						var postal_code = rowsM.getCells()[12].getValue();
						this.getView().getModel("oGlobalModel").setProperty("/PlantName", PlantName);
						this.getView().getModel("oGlobalModel").setProperty("/street", street);
						this.getView().getModel("oGlobalModel").setProperty("/country", country);
						this.getView().getModel("oGlobalModel").setProperty("/Delivery_Date", Delivery_Date);
						this.getView().getModel("oGlobalModel").setProperty("/city", city);
						this.getView().getModel("oGlobalModel").setProperty("/postal_code", postal_code);

						this.Releasestrategy();
						this.footerbutton();
					}
				}.bind(this)
			}); // operation table binding  
			this.show();
		},

		Releasestrategy: function () {

			var arrL = [];
			var spath = "/ReleaseStrategySet";
			var oModel = new ODataModel('/sap/opu/odata/sap/zpm_f4_srv', true);
			oModel.read(spath, {
				success: function (oData, oResponse) {

					var count = oData.results.length;
					for (var i = 0; i < count; i++) {

						var name = oData.results[i].OrganizationalManagement; ///// Release Name
						var desc = oData.results[i].ReleaseCodedes; ///////Release Desc
						var Release_status = this.getView().getModel("oGlobalModel").getProperty("/Release_status"); // getting Release_status

						var logid = this.getView().getModel("oGlobalModel").getProperty("/logid");
						var stat;
						var cmt;

						if (Release_status === "XXX" && logid === "SUPERVISOR1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Released";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Released";
								cmt = this.director;
							}
						} else if (Release_status === "XXX" && logid === "MANAGER1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Released";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Released";
								cmt = this.director;
							}
						} else if (Release_status === "XXX" && logid === "DIRECTOR1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Released";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Released";
								cmt = this.director;
							}
						} else if (Release_status === "" && logid === "SUPERVISOR1") {
							if (i === 0) {
								stat = "Open";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Open";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}
						} else if (Release_status === "" && logid === "MANAGER1") {
							if (i === 0) {
								stat = "Open";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Open";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}
						} else if (Release_status === "" && logid === "DIRECTOR1") {
                           	if (i === 0) {
								stat = "Open";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Open";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}
						} else if (Release_status === "XX" && logid === "SUPERVISOR1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Released";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}

						} else if (Release_status === "XX" && logid === "MANAGER1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Released";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}

						} else if (Release_status === "XX" && logid === "DIRECTOR1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Released";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}

						} else if (Release_status === "X" && logid === "SUPERVISOR1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Open";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}

						} else if (Release_status === "X" && logid === "MANAGER1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Open";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}

						} else if (Release_status === "X" && logid === "DIRECTOR1") {

							if (i === 0) {
								stat = "Released";
								cmt = this.supervisorcmt;
							} else if (i === 1) {
								stat = "Open";
								cmt = this.manager;
							} else if (i === 2) {
								stat = "Open";
								cmt = this.director;
							}

						}

						var obj = {

							OrganizationalManagement: name, //// Release Name
							ReleaseCodedes: desc, /////Release Desc
							ReleaseStatus: stat, ////Release Status1
							comment: cmt
						};
						console.log(obj);
						arrL.push(obj);
						console.log(arrL);

						var newArray = arrL.filter((elem, i, arr) => {
							if (arr.indexOf(elem) === i) {
								return elem
							}
						})

						console.log(newArray);
						this.getView().getModel("oGlobalModel").setProperty("/ReleaseStatus", newArray);
						// var array = [];
						// var processNames = {};
						// array = arrL.filter(function (currentObject) {
						// 	if (currentObject.Process.Value in processNames) {
						// 		return false;
						// 	} else {
						// 		processNames[currentObject.Process.Value] = true;
						// 		return true;
						// 	}
						// });
						// this.dataModel.setProperty("/ReleaseStatus", array);

					}
				}.bind(this)
			});

		},
		footerbutton: function () {

			var logid = this.getView().getModel("oGlobalModel").getProperty("/logid");
			var Release_status = this.getView().getModel("oGlobalModel").getProperty("/Release_status");
			if (logid === "SUPERVISOR1" & Release_status === "") {
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", true);
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", true);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "SUPERVISOR1" & Release_status === "X") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", true);
			} else if (logid === "SUPERVISOR1" & Release_status === "XX") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "SUPERVISOR1" & Release_status === "XXX") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "MANAGER1" & Release_status === "") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "MANAGER1" & Release_status === "X") {
		    	this.getView().getModel("Page1Model").setProperty("/supervisorreject", true);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", true);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "MANAGER1" & Release_status === "XX") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", true);
			} else if (logid === "MANAGER1" & Release_status === "XXX") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "DIRECTOR1" & Release_status === "") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "DIRECTOR1" & Release_status === "X") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "DIRECTOR1" & Release_status === "XX") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", true);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", true);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", false);
			} else if (logid === "DIRECTOR1" & Release_status === "XXX") {
				this.getView().getModel("Page1Model").setProperty("/supervisorreject", false);
				this.getView().getModel("Page1Model").setProperty("/Approvebutton", false);
				this.getView().getModel("Page1Model").setProperty("/Rejectbutton", true);
			}

		}, // footer button validation

		rowSelectionChanged: function (oEvent) {
			var PlantName = oEvent.getParameter("listItem").getBindingContext("oGlobalModel").getProperty("PlantName");
			var street = oEvent.getParameter("listItem").getBindingContext("oGlobalModel").getProperty("street");
			var country = oEvent.getParameter("listItem").getBindingContext("oGlobalModel").getProperty("country");
			var Delivery_Date = oEvent.getParameter("listItem").getBindingContext("oGlobalModel").getProperty("Delivery_Date");
			var city = oEvent.getParameter("listItem").getBindingContext("oGlobalModel").getProperty("city");
			var postal_code = oEvent.getParameter("listItem").getBindingContext("oGlobalModel").getProperty("postal_code");
			this.getView().getModel("oGlobalModel").setProperty("/PlantName", PlantName);
			this.getView().getModel("oGlobalModel").setProperty("/street", street);
			this.getView().getModel("oGlobalModel").setProperty("/country", country);
			this.getView().getModel("oGlobalModel").setProperty("/Delivery_Date", Delivery_Date);
			this.getView().getModel("oGlobalModel").setProperty("/city", city);
			this.getView().getModel("oGlobalModel").setProperty("/postal_code", postal_code);
		}, //  when you click on ITEM DETAILS row Delivery details will change

		qtychange: function (oEvent) {
			var index = oEvent.getSource().getParent().getBindingContext("oGlobalModel").sPath.split("/")[2];
			this.valueHelpIndex = index;
			var oTable = this.byId("idTable");
			var price = oTable.getItems()[this.valueHelpIndex].getCells()[2].getValue();
			var qty = oTable.getItems()[this.valueHelpIndex].getCells()[3].getValue();
			var mult = qty * price;
			mult = mult.toFixed(2);
			oTable.getItems()[this.valueHelpIndex].getCells()[6].setValue(mult);
		}, // table qty change calculation

		status: function (a) {
			if (a === 'Open') {
				return "Warning";
			} else if (a === 'Released') {
				return "Success";
			} else {
				return "Error";
			}
		},

		approvepo: function () {

			var oCont = this;
			var dialog = new Dialog({
				title: 'Confirmation',
				type: 'Message',
				content: [
					new HorizontalLayout({
						content: [
							new VerticalLayout({
								width: "100%",
								height: "100%",
								content: [
									new Label({
										text: 'Are you sure you want to Approve Purchase Order?',
										text1: " ",
										labelFor: 'submitDialogTextarea'
									}),
								]
							})
						]
					}),

					new TextArea('submitDialogTextarea', {

						liveChange: function (oEvent) {
							sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();
							//	alert(sText);
							parent.getBeginButton().setEnabled(sText);
						},
						maxLength: 50,
						width: '100%',
						placeholder: 'Add note'
					})

				],
				beginButton: new Button({
					text: 'Yes',
					enabled: true,
					press: function () {
						sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						oCont._approvalposting();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'No',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();
		},
		_approvalposting: function () {
			var ponumber = this.getView().byId("idponumber").getObjectTitle();
			var logid = this.getView().getModel("oGlobalModel").getProperty("/logid");
			var postdata = {
				"PONumber": ponumber,
				"CCode": "",
				"Doc_Type": "",
				"Vendor": "",
				"Purch_org": "",
				"Purch_group": "",
				"Release_status": "",
				"Header_text": "",
				"username": logid,
				"Text_Head": "",
				"ApproverComments": sText,
				"HeaderToRelease": {
					"Decision": "Approve"
				},
				"HeaderToReturn": [{
					"Type": "",
					"Message": ""
				}]
			};
			console.log("Postdata:", postdata);

			this.resulttab = sap.ui.core.Fragment.byId("resultfragment", "tab3"); ///// For Table Message
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMM_PO_APPROVAL_SRV/", true);
			var sPath = "/CreateHeaderSet";
			oModel.create(sPath, postdata, {
				success: function (oData, oResponse) {
					console.log("Odata", oData)
					console.log("oResponse", oResponse)

					var data = oData.HeaderToReturn.results.map(function (item) { /// code for looping array value to store in variable
						if (item.Type === "I") {

							item.TypeText = "Information";

						} else if (item.Type === "S") {

							item.TypeText = "Success";

						} else if (item.Type === "E") {

							item.TypeText = "Error";

						} else if (item.Type === "W") {

							item.TypeText = "Warning";

						}
						return item;
					});

					that.getView().getModel("oGlobalModel").setProperty("/result", data);
					that.result.open();

				}
			});

		},
		tableok: function () { //This function closes the message fragment and makes the display confirmation button visible

			var rowItems = sap.ui.core.Fragment.byId("results", "tab3").getItems();
			var tablength = rowItems.length;
			console.log("tablength", tablength);
			for (var i = 0; i < tablength; i++) {
				var item = rowItems[i];
				var Cells = item.getCells();
				var type = Cells[0].getText();
				if (type === "Success") {
					this.click();
					window.location.reload();

				} else if (type === "Error" || type === "Warning") {

				}
			}
			this.result.close();
		},

		rejectpo: function () {
			var oCont = this;
			var dialog = new Dialog({
				title: 'Confirmation',
				type: 'Message',
				content: [
					new HorizontalLayout({
						content: [
							new VerticalLayout({
								width: "100%",
								height: "100%",
								content: [
									new Label({
										text: 'Are you sure you want to Rejected Purchase Order?',
										text1: " ",
										labelFor: 'submitDialogTextarea'
									}),
								]
							})
						]
					}),

					new TextArea('submitDialogTextarea', {

						liveChange: function (oEvent) {
							sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();
							//	alert(sText);
							parent.getBeginButton().setEnabled(sText);
						},
						maxLength: 50,
						width: '100%',
						placeholder: 'Add note'

					})
					//	this.getView().getModel("oGlobalModel").setProperty("/textarea",sText); 
				],
				beginButton: new Button({
					text: 'Yes',
					enabled: true,
					press: function () {
						sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						oCont._rejectposting();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'No',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();
		},
		_rejectposting: function () {

			var ponumber = this.getView().byId("idponumber").getObjectTitle();
			var logid = this.getView().getModel("oGlobalModel").getProperty("/logid");
			var postdata = {
				"PONumber": ponumber,
				"CCode": "",
				"Doc_Type": "",
				"Vendor": "",
				"Purch_org": "",
				"Purch_group": "",
				"Release_status": "",
				"Header_text": "",
				"username": logid,
				"Text_Head": "",
				"ApproverComments": sText,
				"HeaderToRelease": {
					"Decision": "Release"
				},
				"HeaderToReturn": [{
					"Type": "",
					"Message": ""
				}]
			};
			console.log("Postdata:", postdata);

			this.resulttab = sap.ui.core.Fragment.byId("resultfragment", "tab3"); ///// For Table Message
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMM_PO_APPROVAL_SRV/", true);
			var sPath = "/CreateHeaderSet";
			oModel.create(sPath, postdata, {
				success: function (oData, oResponse) {
					console.log("Odata", oData)
					console.log("oResponse", oResponse)

					var data = oData.HeaderToReturn.results.map(function (item) { /// code for looping array value to store in variable
						if (item.Type === "I") {

							item.TypeText = "Information";

						} else if (item.Type === "S") {

							item.TypeText = "Success";

						} else if (item.Type === "E") {

							item.TypeText = "Error";

						} else if (item.Type === "W") {

							item.TypeText = "Warning";

						}
						return item;
					});

					that.getView().getModel("oGlobalModel").setProperty("/result", data);
					that.result.open();

				}
			});

		},
		supervisorreject:function(){
			var oCont = this;
			var dialog = new Dialog({
				title: 'Confirmation',
				type: 'Message',
				content: [
					new HorizontalLayout({
						content: [
							new VerticalLayout({
								width: "100%",
								height: "100%",
								content: [
									new Label({
										text: 'Are you sure you want to Rejected Purchase Order?',
										text1: " ",
										labelFor: 'submitDialogTextarea'
									}),
								]
							})
						]
					}),

					new TextArea('submitDialogTextarea', {

						liveChange: function (oEvent) {
							sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();
							//	alert(sText);
							parent.getBeginButton().setEnabled(sText);
						},
						maxLength: 50,
						width: '100%',
						placeholder: 'Add note'

					})
					//	this.getView().getModel("oGlobalModel").setProperty("/textarea",sText); 
				],
				beginButton: new Button({
					text: 'Yes',
					enabled: true,
					press: function () {
						sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						oCont._rejectsupervisor();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'No',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();
		
		},
		  _rejectsupervisor: function(){
		  	
			var ponumber = this.getView().byId("idponumber").getObjectTitle();
			var logid = this.getView().getModel("oGlobalModel").getProperty("/logid");
			var postdata = {
				"PONumber": ponumber,
				"CCode": "",
				"Doc_Type": "",
				"Vendor": "",
				"Purch_org": "",
				"Purch_group": "",
				"Release_status": "",
				"Header_text": "",
				"username": logid,
				"Text_Head": "",
				"ApproverComments": sText,
				"HeaderToRelease": {
					"Decision": "Reject"
				},
				"HeaderToReturn": [{
					"Type": "",
					"Message": ""
				}]
			};
			console.log("Postdata:", postdata);

			this.resulttab = sap.ui.core.Fragment.byId("resultfragment", "tab3"); ///// For Table Message
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMM_PO_APPROVAL_SRV/", true);
			var sPath = "/CreateHeaderSet";
			oModel.create(sPath, postdata, {
				success: function (oData, oResponse) {
					console.log("Odata", oData)
					console.log("oResponse", oResponse)

					var data = oData.HeaderToReturn.results.map(function (item) { /// code for looping array value to store in variable
						if (item.Type === "I") {

							item.TypeText = "Information";

						} else if (item.Type === "S") {

							item.TypeText = "Success";

						} else if (item.Type === "E") {

							item.TypeText = "Error";

						} else if (item.Type === "W") {

							item.TypeText = "Warning";

						}
						return item;
					});

					that.getView().getModel("oGlobalModel").setProperty("/result", data);
					that.result.open();

				}
			});

		
		  },
				show: function () {

			this.ci_att11 = [];
			var that = this;

			that.user = parent.sap.ushell.Container.getUser().getId();
			that.Prnumber = this.getOwnerComponent().getModel("oGlobalModel").getProperty("/doc");
			console.log("Documents Odata: ", that.user);
			console.log("Documents Odata: ", that.Prnumber);

			that.showatt = that.getView().byId("UploadCollection1");
			// var sPath = "/DMSListSet?$filter=ILoginUser eq '" + that.user + "' and IProcess eq 'CreateMP' and IMaintId eq '" + that.Prnumber +" '"; // " + that.measure + "  
			var sPath = "/DMSListSet?$filter=ILoginUser eq '" + that.user + "' and IProcess eq 'CREATE PO' and IMaintId eq '" + that.Prnumber +
				"'";

			var oModeli = new sap.ui.model.odata.ODataModel('/sap/opu/odata/sap/ZPRJ_PM_APPS_IH_SRV', true);
			//debugger;

			oModeli.read(sPath, {
				success: function (oData, oResponse) {
					var len1 = oData.results.length;
					console.log("Documents Odata: ", oData);
					for (var i = 0; i < len1; i++) {
						that.FileName = oData.results[i].FileName;
						that.FileExt = oData.results[i].FileExt;
						that.docnum = oData.results[i].DocNumber;

						that.ci_obj1 = {
							Name: that.FileName,
							Ext: that.FileExt,
							Doc: that.docnum
						};
						that.ci_att11.push(that.ci_obj1);

					}
					var oModel = new sap.ui.model.json.JSONModel(that.ci_att11);
					that.showatt.setModel(oModel); //For Loop End
					var oItems = new sap.m.ObjectListItem({
						icon: {
							path: "Ext",
							formatter: function (subject) {
								var lv = subject;
								if (lv === 'TXT') {
									return "sap-icon://document-text";
								} else if (lv === 'JPG' || lv === 'PNG' || lv === 'BMP') {
									return "sap-icon://attachment-photo";
								} else if (lv === 'PDF') {
									return "sap-icon://pdf-attachment";
								} else if (lv === 'DOC') {
									return "sap-icon://doc-attachment";
								} else if (lv === 'XLS') {
									return "sap-icon://excel-attachment";
								} else if (lv === 'MP3') {
									return "sap-icon://attachment-audio";
								} else if (lv === 'XLS') {
									return "sap-icon://excel-attachment";
								} else if (lv === 'PPT') {
									return "sap-icon://ppt-attachment";
								} else {
									return "sap-icon://document";
								}

							}
						},
						title: "{Name}.{Ext}",
						type: "Active"
					});
					// that.showatt.bindItems("/", oItems);
					// var aModel = new sap.ui.model.json.JSONModel(that.ci_att11);

					// that.getView().byId("UploadCollection1").setModel(aModel);
					that.showatt.bindItems("/", oItems);
					that.getView().getModel("oGlobalModel").setProperty("/ci_att1", that.ci_att11);

				}
			});

		},
		downListPress: function (oEvent) {
			var that = this;
			that.fle1 = oEvent.getParameter("listItem").getBindingContext().getProperty().Name;
			that.ext2 = oEvent.getParameter("listItem").getBindingContext().getProperty().Ext;
			that.docnum = oEvent.getParameter("listItem").getBindingContext().getProperty().Doc;

			sap.m.MessageBox.show(
				"Do you want to download the Attachment ?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirmation Message",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						// notify user
						if (oAction == "YES") {
							that.fle = that.fle1.toUpperCase();
							console.log("that.fle", that.fle);
							that.ext = that.ext2.toUpperCase();
							console.log("that.ext", that.ext);
							var oModel3 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRJ_PM_APPS_IH_SRV/", true);
							var sPath = "/DMS_Base64Set?$filter=DocumentNum eq '" + that.docnum + "'and IFilename eq '" + that.fle + "." + that.ext +
								"'";
							oModel3.read(sPath, {
								success: function (oData, oResponse) {
									var length = oData.results.length;
									// that.getView().getModel("oviewModel").setProperty("/busy", true);
									for (var i = 0; i < length; i++) {
										that.base64 = oData.results[i].LvBase64;
										that.doctype = oData.results[i].DocumentNum;
										console.log("that.doctype", that.doctype);
										that.downloads();
									}
								},

							});

						} else {

						}
					}
				});

		},
		downloads: function () {

			var that = this;
			//that.getView().getModel("oviewModel").setProperty("/busy", false);
			download("data:application/+ that.FileExt;base64," + that.base64, that.fle + "." + that.ext, "application");

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("object").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			this.result = sap.ui.xmlfragment("results", "zee.POGrunt.fragments.result", this);
			this.getView().addDependent(this.result);
			this.oModel_MM = this.getOwnerComponent().getModel("user");
			this.oViewModel = new sap.ui.model.json.JSONModel({
				Approvebutton: false, // footer button 
				Rejectbutton: false, // footer button 
				supervisorreject: false, //footer button
			});
			this.getView().setModel(this.oViewModel, "Page1Model"); //  Viewmodel
		
		},
		click: function () {
			this.oRouter.navTo("master");
		}
	});

});