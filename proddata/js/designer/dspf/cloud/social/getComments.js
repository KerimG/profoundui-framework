
pui.social.getComments = function() {

  var workspace_id = pui.cloud.ws.id;
  if (!workspace_id) workspace_id = "";
  
  var cmp = Ext.getCmp('_south_panel_workspace_comments');

  cmp.update("Retrieving workspace comments...");
  ajaxJSON({
    "url": "/cloud/retrieve_comments",
    "method": "post",
    "params": {
      "workspace_id": workspace_id
    },
    "async": true,
    "suppressAlert": true,
    "handler": function (response) {
      if (response.success) {
        cmp.update(response["html"]);
      }
      else {
        cmp.update(response["error"]);
      }
    },
    "onfail": function() {
      cmp.update("An unexpected error ocurred while retrieving comments. Check your connection and try again.");      
    }
  });
  
}