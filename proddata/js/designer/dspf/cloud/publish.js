
pui.cloud.publish = function(packageInfo) {

  var token = localStorage["pui-cloud-token"];
  if (typeof token !== "string") token = "";
  
  if (!packageInfo) packageInfo = {};

  pui.cloud.updateSettings();
  screenMask.msg = "Sharing workspace...";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/share_workspace",
    "method": "post",
    "params": {
      "workspace_id": pui.cloud["workspace_id"],
      "settings": JSON.stringify(pui.cloud["workspace_settings"], null, 2),
      "package_info": JSON.stringify(packageInfo, null, 2),
      "token": token
    },
    "async": true,
    "handler": function (response, err) {
      screenMask.hide();
      if (!response["success"]) {
        pui.alert(response["message"]);
        return;
      }
      if (response["new"]) {
        var shareurl = response["share_url"];
        history.pushState({ "workspace_id": pui.cloud["workspace_id"], "share_url": shareurl }, document.title, "/" + shareurl);
        // is replaceState() a better choice here?
      }
      pui.cloud["published screen"].show();
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred.");
      screenMask.hide();
    }
  });
 
}
