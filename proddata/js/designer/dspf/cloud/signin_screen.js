
pui.cloud["signin screen"] = {};

pui.cloud["signin screen"]["show"] = function() {
  pui.cloud.show("signin");
  if (pui.cloud.htmlDialogType === "signin") {
    getObj("_cloud_skip").style.display = "none";
  }
}

pui.cloud["signin screen"]["createAccount"] = function() {
  pui.cloud["create account screen"]["show"]();
}

pui.cloud["signin screen"]["skip"] = function() {
  pui.cloud["skip signin screen"].show();
}

pui.cloud["signin screen"]["next"] = function() {
  var profile = get("_cloud_profile").toLowerCase();
  var profileEl = getObj("_cloud_profile");
  var msgEl = getObj("_cloud_profile_msg");
  if (!profile) {
    msgEl.innerHTML = "<br/>Enter an email or profile name.";
    profileEl.focus();
    return;
  }
  screenMask.msg = "Verifying email or profile name";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/verify_profile",
    "method": "post",
    "params": {
      "profile": profile
    },
    "async": true,
    "suppressAlert": true,
    "handler": function (response, err) {
      screenMask.hide();
      if (!response["success"]) {
        msgEl.innerHTML = "<br/>" + response["message"];
        profileEl.focus();
        return;
      }
      pui.cloud["signin screen"].profile_name = response["profile_name"];
      pui.cloud["signin screen"].first_name = response["first_name"];
      pui.cloud["signin screen"].email_used = response["email_used"];
      pui.cloud["signin screen"].entered_profile = profile;
      pui.cloud["password screen"].show();
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred. Check your connection and try again.");
      screenMask.hide();
    }
  });
}
