
pui.cloud["signin screen"] = {};

pui.cloud["signin screen"]["show"] = function() {
  pui.cloud.show("signin");
  var hideSkip = false;
  if (pui.cloud.htmlDialogType === "signin") hideSkip = true;
  if (pui.cloud.htmlDialogType === "fork") hideSkip = true;
  if (pui.cloud.ws["owner"]) hideSkip = true;
  if (hideSkip) {
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
      pui.cloud["signin screen"].display_name = response["display_name"];
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


pui.cloud["signin screen"]["social"] = function(type) {
  var w = 600;
  var h = 600;
  
  if (type === "facebook") {
    w = 1100;
  }
  
  var url = "/oauth/" + type;
  
  // Calculate how to center window 
  
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = window.open(url, "Sign in with " + type, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}


pui.cloud["signin screen"]["complete social"] = function(info) {
  pui["setCookie"]("pui-cloud-token", info["token"], 366, "/");  
  pui.cloud.showUser(info);
  if (pui.cloud.htmlDialogType === "publish" || pui.cloud.htmlDialogType === "fork") {
    pui.cloud["publish screen"].show();
  }
  else {
    var win = pui.cloud.savedHtmlDialogReference;
    win.close();
  }
  pui.ide.refreshRibbon();
  pui.social.refreshSocialData();
  pui.social.getWorkspaceInfo();
}

