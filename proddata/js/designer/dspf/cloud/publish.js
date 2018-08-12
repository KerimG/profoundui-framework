
pui.cloud.publish = function(wsInfo) {

  var token = pui["getCookie"]("pui-cloud-token");
  if (typeof token !== "string") token = "";
  
  if (!wsInfo) wsInfo = {};

  pui.cloud.updateSettings();
  screenMask.msg = "Sharing workspace...";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/share_workspace",
    "method": "post",
    "params": {
      "workspace_id": pui.cloud.ws.id,
      "settings": JSON.stringify(pui.cloud.ws["settings"], null, 2),
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
      pui.cloud["publish screen"].name = pui.cloud.ws.name;
      if (wsInfo.name) pui.cloud["publish screen"].name = wsInfo.name;
      if (response["new"]) {
        var workspace_name = response["workspace_name"];
        pui.cloud.ws.name = workspace_name;
        pui.cloud["publish screen"].name = workspace_name;
        var user = pui.cloud.user;
        var path = "/";
        if (user) {
          path += user + "/";          
        }
        path += workspace_name;
        history.pushState({ "workspace_id": pui.cloud.ws.id, "workspace_name": workspace_name }, document.title, path);  // is replaceState() a better choice here?
      }
      var wording = "published";
      if (!pui.cloud.ws["new"]) wording = "updated";
      pui.cloud.ws["new"] = false;
      if (wsInfo.name) {
        for (key in wsInfo) {
          if (key === "pwd") continue;
          pui.cloud.ws[key] = wsInfo[key];
        }
        if (!pui.cloud.ws["owner"]) pui.cloud.ws["owner"] = pui.cloud.user;
      }      
      pui.ide.refreshRibbon();
      pui.cloud.ws["socialData"] = response["socialData"];
      Ext.getCmp("southPanel").setTitle(pui.social.genTitle());
      pui.cloud["published screen"].show();
      getObj("_cloud_publish_word1").innerHTML = wording;
      getObj("_cloud_publish_word2").innerHTML = wording;
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred. Check your connection and try again.");
      screenMask.hide();
    }
  });
 
}
