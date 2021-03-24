<script>

// Script maintained by AppDirect Inc. for Mindbody Partner Store
// Datasources: window.dataStore and window.bootstrapData
// window.dataStore is the data source available on sfb pages
// window.bootstrapData is the data source available on non-sfb pages

if (!window.bootstrapData) 

{ //when bootstrapData is the source
    window.bootstrapData = {};
    if (!bootstrapData.bootstrap) {
        bootstrapData.bootstrap = {}
    }
    if (!bootstrapData.bootstrap.UserInfo) {
        bootstrapData.bootstrap = {
            UserInfo: null
        }
    }
    if (!bootstrapData.bootstrap.CompanyInfo) {
        bootstrapData.bootstrap = {
            CompanyInfo: null
        }
    }
}

console.log(0);

var userId;
var companyId;
var companyName;
var visitorId;
var accountId;
var visitorRole;
var accountName;

if (window.dataStore){ //when dataStore is the source
     
      if (window.dataStore.config.user.isLoggedIn) { //for logged in user 
  
                userId = window.dataStore.config.user.userUuid;
                companyId = window.dataStore.config.user.companyUuid;
                var sessionUserId=sessionStorage.getItem("appdirect_user_id");
                var sessionCompanyId =sessionStorage.getItem("appdirect_company_id");

                if  (!sessionUserId || sessionUserId != userId || !sessionCompanyId || sessionCompanyId != companyId){
                    setAppDirectSession(userId,companyId);
                }
                visitorId   = sessionStorage.getItem("appdirect_visitor_id");
                visitorRole = sessionStorage.getItem("appdirect_visitor_role");
                accountId   = sessionStorage.getItem("appdirect_account_id");
                accountName = sessionStorage.getItem("appdirect_account_name");

        }

        else {
            //offline logged out user
             visitorId   = "null";
             visitorRole = "null";
             accountId   = "null";
             accountName = "null";      
        }      

}

    else { 
           // when bootstrapData is the source
        userId = bootstrapData.bootstrap.UserInfo.user_id;
        companyId = bootstrapData.bootstrap.CompanyInfo.uuid;
        var sessionUserId=sessionStorage.getItem("appdirect_user_id"); //fetching userId from cookies
        var sessionCompanyId =sessionStorage.getItem("appdirect_company_id"); //fetching companyId from cookies
   
        if  (!sessionUserId || sessionUserId != userId || !sessionCompanyId || sessionCompanyId != companyId){
           setAppDirectSession(userId,companyId); 
        }
        visitorId   = sessionStorage.getItem("appdirect_visitor_id");
        visitorRole = sessionStorage.getItem("appdirect_visitor_role");
        accountId   = sessionStorage.getItem("appdirect_account_id");
        accountName = sessionStorage.getItem("appdirect_account_name");

   }

function setAppDirectSession(pUserId,pCompanyId)
{
 sessionStorage.setItem("appdirect_user_id",pUserId);
 sessionStorage.setItem("appdirect_company_id",pCompanyId);

 var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/api/account/v2/companies/" + pCompanyId, false);
    xhttp.send();
    var jsonResponse = JSON.parse(xhttp.responseText);
   
    var pCompanyName = jsonResponse.name; // appending companyName from Json response

    //The below section uses "customAttributes", which has to be defined at the Marketplace.
    //With respect to MINDBODY, the custom attributes "sourceid" and "companytype" were defined at Company level in the Marketplace.
    if (jsonResponse.customAttributes){
        var sourceIdCustomAttribute = jsonResponse.customAttributes.filter(function (chain) {
            return chain.name === "sourceid";});
        var companyTypeCustomAttribute = jsonResponse.customAttributes.filter(function (chain) {
            return chain.name === "companytype";});
        
        
        if (Array.isArray(companyTypeCustomAttribute) && companyTypeCustomAttribute.length && companyTypeCustomAttribute[0].valueKeys[0]==="developer" && Array.isArray(sourceIdCustomAttribute)  && sourceIdCustomAttribute.length){
            sessionStorage.setItem("appdirect_account_id","developer_" + sourceIdCustomAttribute[0].value);
            sessionStorage.setItem("appdirect_visitor_role","Developer Visitor");
            sessionStorage.setItem("appdirect_account_name",pCompanyName);

        }
        else if ( Array.isArray(companyTypeCustomAttribute) && companyTypeCustomAttribute.length && companyTypeCustomAttribute[0].valueKeys[0]==="consultant"){
            sessionStorage.setItem("appdirect_account_id","consultant_" + pCompanyName);
            sessionStorage.setItem("appdirect_visitor_role","Consultant Visitor");
            sessionStorage.setItem("appdirect_account_name",pCompanyName);
        }
        else if (Array.isArray(companyTypeCustomAttribute) && companyTypeCustomAttribute.length && companyTypeCustomAttribute[0].valueKeys[0]==="channel_partner"){
            sessionStorage.setItem("appdirect_account_id","channelpartner_" + pCompanyName);
            sessionStorage.setItem("appdirect_visitor_role","Channel Partner Visitor");
            sessionStorage.setItem("appdirect_account_name",pCompanyName);
        }
        else{
            sessionStorage.setItem("appdirect_account_id","null");
            sessionStorage.setItem("appdirect_account_name","null");

        }
    }
    else {
            sessionStorage.setItem("appdirect_account_id","null");
    }

    //This portion is customized for MINDBODY
    if (pCompanyName === "MINDBODY") {
        sessionStorage.setItem("appdirect_visitor_id","mb_admin");
     } else if (pCompanyName != "MINDBODY") {
        sessionStorage.setItem("appdirect_visitor_id","appdirect_" + pUserId);
    
     }
     else {
        sessionStorage.setItem("appdirect_visitor_id","null");
     }

}

//Pendo install script

(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
    v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
        o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
        y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
        z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');

        // Call this whenever information about your visitors becomes available
        // Please use Strings, Numbers, or Bools for value types.
        pendo.initialize({
            visitor: {
                id:              visitorId ,  // Required if user is logged in
                // email:        // Recommended if using Pendo Feedback, or NPS Email
                // full_name:    // Recommended if using Pendo Feedback
                user_type:         visitorRole

                // You can add any additional visitor level key-values here,
                // as long as it's not one of the above reserved names.
            },

            account: {
                id:           accountId , // Highly recommended
                business_name:         accountName  // Optional
                // is_paying:    // Recommended if using Pendo Feedback
                // monthly_value:// Recommended if using Pendo Feedback
                // planLevel:    // Optional
                // planPrice:    // Optional
                // creationDate: // Optional

                // You can add any additional account level key-values here,
                // as long as it's not one of the above reserved names.
            }
        });
})('fb42ee48-8a12-4887-434f-717517a989aa'); //this is MINDBODY pendo tag

</script>
