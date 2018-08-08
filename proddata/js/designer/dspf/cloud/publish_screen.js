
pui.cloud["publish screen"] = {};

pui.cloud["publish screen"]["show"] = function() {
  pui.cloud.show("publish");
}

pui.cloud["publish screen"]["protect"] = function() {
  var span = getObj("_cloud_password_span");
  if (span.style.display === "none") {
    span.style.display = "";
    getObj("_cloud_password").focus();
  }
  else {
    span.style.display = "none";
  }
}

pui.cloud["publish screen"]["signout"] = function() {
  pui.cloud.signout(function() {
    pui.cloud["signin screen"].show();
  });
}

pui.cloud["publish screen"]["publish"] = function() {
  var name = get("_cloud_workspace_name").toLowerCase();
  var nameEl = getObj("_cloud_workspace_name");
  var nameMsgEl = getObj("_cloud_workspace_name_msg");
  var view = getObj("_cloud_view").checked;
  var open = getObj("_cloud_open").checked;
  var modify = getObj("_cloud_modify").checked;  
  var run = getObj("_cloud_run").checked;
  var permissionsMsgEl = getObj("_cloud_permissions_msg");
  var protect = getObj("_cloud_protect").checked;
  var password = get("_cloud_password");
  var passwordEl = getObj("_cloud_password");
  var passwordMsgEl = getObj("_cloud_password_msg");
  var description = get("_cloud_description");
  var keywords = get("_cloud_keywords");
  var token = localStorage["pui-cloud-token"];
  var go = true;

  nameMsgEl.innerHTML = "";
  permissionsMsgEl.innerHTML = "";
  passwordMsgEl.innerHTML = "";

  if (protect) {
    if (!password) {
      passwordMsgEl.innerHTML = "<br/>Enter password or unselect password protect option.";
      passwordEl.focus();
      go = false;
    }
  }
  else {
    password = "";
  }
  
  if (modify && !open) {
    permissionsMsgEl.innerHTML = "<br/>You cannot modify workspaces without first opening them.";
    go = false;
  }
  
  if (!name) {
    nameMsgEl.innerHTML = "<br/>Enter workspace name.";
    nameEl.focus();
    go = false;
  }
  else if (name.includes(" ")) {
    nameMsgEl.innerHTML = "<br/>Workspace name cannot contain spaces.";
    nameEl.focus();
    go = false;
  }
  else {
    for (var i = 0; i < name.length; i++) {
      var ch = name.substr(i, 1);
      if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9") || (ch === ".") || (ch === "_") || (ch === "-")) {
        // valid character
      }
      else {
        nameMsgEl.innerHTML = "<br/>Workspace name contains invalid characters.";
        nameEl.focus();
        go = false;
        break;
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
    "protect": protect,
    "pwd": password,
    "description": description,
    "keywords": keywords,
    "token": token
  });

}
