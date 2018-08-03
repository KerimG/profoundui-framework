
pui.cloud.publish = function () {
  
  // To Do:
  //   1. Should Save All files first
  //   2. Should write to settings file (probably as part of the /share_workspace request below, instead of a separate request)

  screenMask.msg = "Sharing workspace...";
  screenMask.show();
  ajaxJSON({
    "url": "/share_workspace",
    "method": "post",
    "params": {
      "workspace_id": pui.cloud["workspace_id"]
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
      setTimeout(function() { pui.alert("Workspace shared as " + document.documentURI); }, 0);
    }         
  });

}

