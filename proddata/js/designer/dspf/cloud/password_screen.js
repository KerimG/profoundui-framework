
pui.cloud["password screen"] = {};

pui.cloud["password screen"]["show"] = function() {
  pui.cloud.show("password");
  //getObj("_cloud_first_name").textContent = pui.cloud["signin screen"].first_name;
  getObj("_cloud_display_name").textContent = pui.cloud["signin screen"].display_name;
}

pui.cloud["password screen"]["startOver"] = function() {
  pui.cloud["signin screen"].show();
}

pui.cloud["password screen"]["forgotPassword"] = function() {
  pui.cloud["forgot password screen"].show();
}

pui.cloud["password screen"]["next"] = function() {
  var profile = pui.cloud["signin screen"].profile_name;
  var password = get("_cloud_password").toLowerCase();
  var passwordEl = getObj("_cloud_password");
  var msgEl = getObj("_cloud_password_msg");
  if (!password) {
    msgEl.innerHTML = "<br/>Enter password.";
    passwordEl.focus();
    return;
  }
  var workspace_id = pui.cloud.ws.id;
  if (!workspace_id) workspace_id = "";
  screenMask.msg = "Logging you in";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/login",
    "method": "post",
    "params": {
      "profile": profile,
      "pwd": password,
      "workspace_id": workspace_id
    },
    "async": true,
    "suppressAlert": true,
    "handler": function (response, err) {
      screenMask.hide();
      if (!response["success"]) {
        msgEl.innerHTML = "<br/>" + response["message"];
        passwordEl.value = "";
        passwordEl.focus();
        return;
      }
      pui["setCookie"]("pui-cloud-token", response["token"], 366, "/");
      pui.cloud.showUser(response);
      if (pui.cloud.htmlDialogType === "publish" || pui.cloud.htmlDialogType === "fork") {
        pui.cloud["publish screen"].show();
      }
      else {
        var win = pui.cloud.savedHtmlDialogReference;
        win.close();
      }
      pui.ide.refreshRibbon();
      pui.cloud.ws["socialData"] = response["socialData"];
      Ext.getCmp("southPanel").setTitle(pui.social.genTitle());
      pui.social.getWorkspaceInfo();
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred. Check your connection and try again.");
      screenMask.hide();
    }
  });
}
