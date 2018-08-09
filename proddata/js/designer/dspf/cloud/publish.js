
pui.cloud.publish = function(wsInfo) {

  var token = localStorage["pui-cloud-token"];
  if (typeof token !== "string") token = "";
  
  if (!wsInfo) wsInfo = {};

  pui.cloud.updateSettings();
  screenMask.msg = "Sharing workspace...";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/share_workspace",
    "method": "post",
    "params": {
      "workspace_id": pui.cloud["workspace_id"],
      "settings": JSON.stringify(pui.cloud["workspace_settings"], null, 2),
      "ws_info": JSON.stringify(wsInfo, null, 2),
      "token": token
    },
    "async": true,
    "suppressAlert": true,
    "handler": function (response, err) {
      screenMask.hide();
      if (!response["success"]) {
        pui.alert(response["message"]);
        return;
      }
      if (response["new"]) {
        var workspace_name = response["workspace_name"];
        pui.cloud["publish screen"].name = workspace_name;
        var user = pui.cloud.user;
        var path = "/";
        if (user) {
          path += user + "/";          
        }
        path += workspace_name;
        history.pushState({ "workspace_id": pui.cloud["workspace_id"], "workspace_name": workspace_name }, document.title, path);  // is replaceState() a better choice here?
        pui.cloud["new_workspace"] = false;
        pui.ide.refreshRibbon();
      }
      pui.cloud["published screen"].show();
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred. Check your connection and try again.");
      screenMask.hide();
    }
  });
 
}
