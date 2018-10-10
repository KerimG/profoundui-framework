
pui.cloud.publish = function(wsInfo) {

  var token = pui["getCookie"]("pui-cloud-token");
  if (typeof token !== "string") token = "";
  
  if (!wsInfo) wsInfo = {};

  if (!wsInfo["fromTemplate"]) pui.cloud.updateSettings();
  if (!wsInfo["fork"] && !wsInfo["fromTemplate"]) pui.ide.saveWidgetSets(true);
  screenMask.msg = "Sharing workspace";
  if (pui.cloud.ws["new"]) screenMask.msg = "Updating workspace";
  if (wsInfo["fork"]) screenMask.msg = "Forking workspace";
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
        if (response["messageEl"] && getObj(response["messageEl"])) {
          getObj(response["messageEl"]).innerHTML = "<br/>" + response["message"];
        }
        else {
          pui.alert(response["message"]);
        }
        if (!wsInfo["fromPublishScreen"]) {
          var win = pui.cloud.savedHtmlDialogReference;
          if (win) win.close();
        }
        return;
      }
      pui.cloud["publish screen"].name = pui.cloud.ws.name;
      pui.cloud["publish screen"].url_path = pui.cloud.ws.url_path;
      if (wsInfo.name) pui.cloud["publish screen"].name = wsInfo.name;
      if (wsInfo.url_path) pui.cloud["publish screen"].name = wsInfo.url_path;
      if (response["new"]) {
        var workspace_name = response["workspace_name"];
        var workspace_url_path = response["workspace_url_path"];
        pui.cloud.ws.name = workspace_name;
        pui.cloud.ws.url_path = workspace_url_path;
        pui.cloud["publish screen"].name = workspace_name;
        pui.cloud["publish screen"].url_path = workspace_url_path;
        var user = pui.cloud.user;
        var path = "/";
        if (user && !wsInfo["fromTemplate"]) {
          path += user + "/";          
        }
        path += workspace_url_path + "/";
        history.pushState({ "workspace_id": pui.cloud.ws.id, "workspace_name": workspace_name, "workspace_url_path": workspace_url_path }, document.title, path);  // is replaceState() a better choice here?
      }
      var wording = "updated";
      if (!pui.cloud.ws["owner"] && pui.cloud.user) wording = "published";
      if (wsInfo["fork"]) wording = "forked";
      pui.cloud.ws["new"] = false;
      if (wsInfo.name) {
        for (key in wsInfo) {
          if (key === "pwd") continue;
          if (key === "fork") continue;
          if (key === "fromPublishScreen") continue;
          pui.cloud.ws[key] = wsInfo[key];
        }
        if (!pui.cloud.ws["owner"] || wsInfo["fork"]) pui.cloud.ws["owner"] = pui.cloud.user;
      }
      if (wsInfo["fork"]) {
        pui.cloud.ws.id = response["workspace_id"];
        pui.cloud.ws["SERVER_DIR"] = pui["PROFOUNDJS_DIR"] + pui["dirSeparator"] + "modules" + pui["dirSeparator"] + response["workspace_id"] + pui["dirSeparator"] + "files";
        Ext.getCmp("fileTree").root.setId(pui.cloud.ws["SERVER_DIR"]);
        Ext.getCmp("fileTree").loader.baseParams["workspace_id"] = response["workspace_id"];
        Ext.getCmp("fileTree").root.reload();
        var centerPanel = Ext.getCmp("centerPanel");
        for (var i = 0; i < centerPanel.items.getCount(); i++) {
          var tab = centerPanel.items.itemAt(i);          
          var file;    
          if (tab.fileTab) {
            tab.root = pui.cloud.ws["SERVER_DIR"];
          }
          else {
            file = tab.currentDisplay.ifsFile;
            if (!file) continue;
            var parts = file.split(pui["dirSeparator"]);
            for (var j = 0; j < parts.length - 1; j++) {
              if (parts[j] === "modules") {
                parts[j + 1] = pui.cloud.ws.id;
                break;
              }
            }
            file = parts.join(pui["dirSeparator"]);
            tab.currentDisplay.ifsFile = file;
          }
        }
      }
      pui.ide.refreshRibbon();
      pui.cloud.ws["socialData"] = response["socialData"];
      Ext.getCmp("southPanel").setTitle(pui.social.genTitle());
      pui.social.getWorkspaceInfo();
      if (wsInfo["fork"]) pui.social.getComments();
      if (wsInfo["fromTemplate"]) {
        pui.cloud.openWorkspaceFiles(pui.cloud.ws["settings"]);
      }
      else {
        pui.cloud["published screen"].show();
        getObj("_cloud_publish_word1").innerHTML = wording;
        getObj("_cloud_publish_word2").innerHTML = wording;
      }      
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred. Check your connection and try again.");
      screenMask.hide();
    }
  });
 
}
