
pui.cloud["publish screen"] = {};

pui.cloud["publish screen"].show = function() {
  
  var fork = (pui.cloud.htmlDialogType === "fork");
  
  if (!pui.cloud.ws.name || !pui.cloud.ws["owner"] || pui.cloud.user === pui.cloud.ws["owner"] || fork) {
    pui.cloud.show("publish");
    var ws = pui.cloud.ws;
    if (ws["owner"] && !fork) getObj("_cloud_workspace_name").value = ws["name"];
    if (fork) {
      getObj("_cloud_workspace_name").placeholder = "New name";
      getObj("_cloud_publish_button").value = "Fork";
    }
    if (!fork) {  // leave screen default values when forking
      if (ws["owner"]) {
        getObj("_cloud_publish_button").value = "Update";
      }
      getObj("_cloud_view").checked = ws["view"];
      getObj("_cloud_open").checked = ws["open"];
      var modify = ws["modify"];
      if (ws["new"] || !ws["owner"]) modify = false;  // default to modify off on new/temp workspaces
      getObj("_cloud_modify").checked = modify;
      getObj("_cloud_run").checked = ws["run"];
      getObj("_cloud_comment").checked = ws["comment"];
      getObj("_cloud_protect").checked = ws["protect"];
    }
    getObj("_cloud_description").value = ws["description"];
    getObj("_cloud_keywords").value = ws["keywords"];
  }
  else {
    // Immediately skip to publish step because the user is updating another owner's workspace
    pui.cloud.publish({ url_path: pui.cloud.ws.url_path, name: pui.cloud.ws.name });
  }

}

pui.cloud["publish screen"]["protect"] = function() {
  var span = getObj("_cloud_password_span");
  if (getObj("_cloud_protect").checked) {
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
  var name = get("_cloud_workspace_name");
  var url_path = name.toLowerCase().replace(/ /g, "-");
  var nameEl = getObj("_cloud_workspace_name");
  var nameMsgEl = getObj("_cloud_workspace_name_msg");
  var view = getObj("_cloud_view").checked;
  var open = getObj("_cloud_open").checked;
  var modify = getObj("_cloud_modify").checked;  
  var run = getObj("_cloud_run").checked;
  var comment = getObj("_cloud_comment").checked;
  var permissionsMsgEl = getObj("_cloud_permissions_msg");
  var protect = getObj("_cloud_protect").checked;
  var password = get("_cloud_password");
  var passwordEl = getObj("_cloud_password");
  var passwordVisible = (getObj("_cloud_password_span").style.display !== "none");
  var passwordMsgEl = getObj("_cloud_password_msg");
  var description = get("_cloud_description");
  var keywords = get("_cloud_keywords");
  var go = true;

  nameMsgEl.innerHTML = "";
  permissionsMsgEl.innerHTML = "";
  passwordMsgEl.innerHTML = "";

  if (protect) {
    if (!password && passwordVisible) {
      passwordMsgEl.innerHTML = "<br/>Enter password or unselect password protect option.";
      passwordEl.focus();
      go = false;
    }
  }
  else {
    password = "";
  }
  if (!passwordVisible) {
    password = "";
  }

  if (modify && !open) {
    permissionsMsgEl.innerHTML = "<br/>You cannot modify workspaces without first opening them.";
    getObj("_cloud_open").focus();
    go = false;
  }
  
  if (!name) {
    nameMsgEl.innerHTML = "<br/>Enter workspace name.";
    nameEl.focus();
    go = false;
  }
  else {
    for (var i = 0; i < name.length; i++) {
      var ch = name.substr(i, 1);
      if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9") || (ch === ".") || (ch === "_") || (ch === "-") || (ch === " ")) {
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

  pui.cloud["publish screen"].name = name;
  pui.cloud["publish screen"].url_path = url_path;
  
  pui.cloud.publish({
    "name": name,
    "url_path": url_path,
    "view": view,
    "open": open,
    "modify": modify,
    "run": run,
    "comment": comment,
    "protect": protect,
    "pwd": password,
    "description": description,
    "keywords": keywords,
    "fromPublishScreen": true,
    "fork": (pui.cloud.htmlDialogType === "fork")
  });

}
