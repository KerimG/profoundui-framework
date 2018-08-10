
pui.cloud["password screen"] = {};

pui.cloud["password screen"]["show"] = function() {
  pui.cloud.show("password");
  getObj("_cloud_first_name").textContent = pui.cloud["signin screen"].first_name;
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
  screenMask.msg = "Logging you in";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/login",
    "method": "post",
    "params": {
      "profile": profile,
      "pwd": password
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
      if (pui.cloud.htmlDialogType === "publish") {
        pui.cloud["publish screen"].show();
      }
      else {
        var win = pui.cloud.savedHtmlDialogReference;
        win.close();
      }
      pui.ide.refreshRibbon();
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred. Check your connection and try again.");
      screenMask.hide();
    }
  });
}
