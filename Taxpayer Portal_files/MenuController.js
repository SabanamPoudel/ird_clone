Ext.define('MyApp.controller.MenuController', {
    extend: 'Ext.app.Controller',

    stores: [
        'LoginUser'
    ],
    views: [
        'MenuController'
    ],

    onTrMenusItemClick: function(dataview, record, item, index, e, options) {
        
		var me = this;
		var nepDate=Ext.get('nepDate').dom.innerHTML;
		Ext.Ajax.request({
			url: '../Handlers/Security/SessionHandler.ashx?method=ClearSession',
			params:{},
		success: function ( result, request ) {
			
			}
		});
		if(nepDate==='undefined')
		{
			msg('INFO','Unable to Process Request. Please, Refresh the Browser and try after sometimes');
			return;
		}
		var  menu_id = record.data.id 
		var arr_menu_ids = ['R000701','R000702','R000703','R000704']; // for etds only
		var etd_menu_index = arr_menu_ids.indexOf(menu_id);
	
		if(etd_menu_index >= 0 )
		{
			location.href = "http://taxpayerportalb.ird.gov.np:8081/taxpayer/app.html";
			return false;
		}
		//added@2080.05.19
		if(menu_id == "R008011")
		{
			location.href = "http://ereturns.ird.gov.np:8289/servicefee/ForeignEmployment/FETServiceFeeMain";
			return false;
		}
		else if(menu_id == "R008021")
		{
			location.href = "http://ereturns.ird.gov.np:8289/servicefee/ForeignTourism/FTTServiceFeeMain";
			return false;
		}
		else if(menu_id == "R008031")
		{
			location.href = "http://ereturns.ird.gov.np:8289/servicefee/Luxury/LUXServiceFeeMain";
			return false;
		}
		else if(menu_id == "R010105")
		{
			location.href = "http://ereturns.ird.gov.np:8289/servicefee/DSTServiceFee";
			return false;
		}
		else if(menu_id == "R000601")
		{
			location.href = "http://ereturns.ird.gov.np:8289/incometax/d01/d01ReturnEntry";
			return false;
		}
		else if(menu_id == "R000751")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/ExciseReturnEntry";
			return false;
		}
		else if(menu_id == "R000752")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/ExciseReturnLogin";
			return false;
		}
		else if(menu_id == "R000753")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/ExciseCloseBusinessEntry";
			return false;
		}
		else if(menu_id == "R000754")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/ExciseCloseBusinessLogin";
			return false;
		}
		else if(menu_id == "R000902")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/SelfRenewPermit";
			return false;
		}
		else if(menu_id == "R000906")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/NewPermit";
			return false;
		}
		else if(menu_id == "R000908")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/ManufacturerLogin";
			return false;
		}
		else if(menu_id == "R010106")
		{
			location.href = "http://ereturns.ird.gov.np:8289/dstVat/AirlinesBusinessRegistration";
			return false;
		}
		else if(menu_id == "R010107")
		{
			location.href = "http://ereturns.ird.gov.np:8289/dstVat/AirlinesRegistrationLogin";
			return false;
		}
		else if(menu_id == "R010108")
		{
			location.href = "http://ereturns.ird.gov.np:8289/vat/NRAVatReturnEntry";
			return false;
		}
		
		/*else if(menu_id == "R000611")
		{
			location.href = "http://ereturns.ird.gov.np:8289/incometax/d04/getSubmissionNoD04";
			return false;
		}*/
		
		
		
		/*else if(menu_id == "R000907")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/BrandRegistrationEntry";
			return false;
		}
		else if(menu_id == "R000755")
		{
			location.href = "http://ereturns.ird.gov.np:8289/excise/BrandRegistrationLogin";
			return false;
		}*/
		else if(menu_id == "R010111")
		{
			location.href = "http://ereturns.ird.gov.np:8289/dstVat/AirlinesBusinessRegistration";
			return false;
		}
		else if(menu_id == "R010112")
		{
			location.href = "http://ereturns.ird.gov.np:8289/dstVat/AirlinesRegistrationLogin";
			return false;
		}
		else if(menu_id == "R010113")
		{
			location.href = "http://ereturns.ird.gov.np:8289/vat/NRAVatReturnEntry";
			return false;
		}
		else if(menu_id == "R010114")
		{
			location.href = "http://ereturns.ird.gov.np:8289/vat/NRAVatReturnLogin";
			return false;
		}
		
		
		
		
		//if(record.data.link!=='ManufacturesLogin')
		//{
			var user = me.getController('MyApp.controller.LoginSecurity');    
			var valid = user.validateSession("default");
		
			if(record.data.link)
			{
				if(valid) 
				{    
			
					var uiConfig = {menuLink:record.data.link,
						pageTitle:record.data.qtip
					};

					DynamicUI(uiConfig);
					
					getFormToken(function(obj){
						Ext.get('frmToken').dom.innerHTML=obj;
					});
				}
			}
		//}
		//else
		//{
		//	location.replace('manufacturerapp.html');		
		//}

	
    },
	onTrMenus1ItemClick: function(dataview, record, item, index, e, options) {
        var me = this;
		var nepDate=Ext.get('nepDate').dom.innerHTML;
		//var waitmessage = waitMsg("Loading...");
		
		if(nepDate==='undefined')
		{
			msg('INFO','Unable to Process Request. Please, Refresh the Browser and try after sometimes');
			return;
		}
		//if(record.data.link!=='ManufacturesLogin')
		//{
			var user = me.getController('MyApp.controller.LoginSecurity');    
			var valid = user.validateSession("default");
			
			var params={userId:Ext.ComponentQuery.query('#hdnUserId')[0].getValue(),
				locationId:Ext.ComponentQuery.query('#hdnLocationId')[0].getValue(),
				LocationName:Ext.ComponentQuery.query('#hdnLocationName')[0].getValue() ,
				WorkPlaceNo:Ext.ComponentQuery.query('#hdnWorkPlaceNo')[0].getValue() };
			
			if(record.data.link)
			{
				if(valid) 
				{    
					var uiConfig = {menuLink:record.data.link,
						pageTitle:record.data.qtip
					};

					DynamicUI(uiConfig,function(){
						
					},{params:params});;
				}
			}
		//}
		//else
		//{
		//	location.replace('manufacturerapp.html');		
		//}

	
    },

    init: function(application) {
        this.control({
            "#trMenus": {
                itemclick: this.onTrMenusItemClick
            },
			"#trMenus1": {
                itemclick: this.onTrMenus1ItemClick
            }
        });
    }

});
