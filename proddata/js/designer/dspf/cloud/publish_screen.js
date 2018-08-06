
pui.cloud["publish screen"] = {};

pui.cloud["publish screen"]["show"] = function() {
  pui.cloud.show("publish");
}

pui.cloud["publish screen"]["signout"] = function() {
  var token = localStorage["pui-cloud-token"];
  if (typeof token !== "string") token = "";

  screenMask.msg = "Signing you out";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/logout",
    "method": "post",
    "params": {
      "token": token
    },
    "async": true,
    "handler": function (response, err) {
      screenMask.hide();
      localStorage.setItem("pui-cloud-token", "");
      pui.cloud["signin screen"].show();
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred.");
      screenMask.hide();
    }
  });

}

pui.cloud["publish screen"]["publish"] = function() {
  var name = get("_cloud_package_name").toLowerCase();
  var nameEl = getObj("_cloud_package_name");
  var nameMsgEl = getObj("_cloud_package_msg");
  var view = getObj("_cloud_view").checked;
  var open = getObj("_cloud_open").checked;
  var modify = getObj("_cloud_modify").checked;
  var run = getObj("_cloud_run").checked;
  var permissionsMsgEl = getObj("_cloud_permissions_msg");
  var description = get("_cloud_description");
  var keywords = get("_cloud_keywords");
  var token = localStorage["pui-cloud-token"];
  var go = true;

  nameMsgEl.innerHTML = "";
  permissionsMsgEl.innerHTML = "";

  //if (!view && !open !modify && !run) {
  //  permissionsMsgEl.innerHTML = "<br/>You must select at least one checkbox.";
  //  go = false;
  //}
  
  if (!name) {
    nameMsgEl.innerHTML = "<br/>Enter package name.";
    nameEl.focus();
    go = false;
  }
  else {
    for (var i = 0; i < name.length; i++) {
      var ch = name.substr(i, 1);
      if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9") || (ch === ".") || (ch === "_")) {
        // valid character
      }
      else {
        nameMsgEl.innerHTML = "<br/>Package name contains invalid characters.";
        nameEl.focus();
        go = false;
      }
    }
  }
  
  if (!go) return;
  
  pui.cloud.publish({
    "name": name,
    "view": view,
    "open": open,
    "modify": modify,
    "run": run,
    "description": description,
    "keywords": keywords,
    "token": token
  });

}
