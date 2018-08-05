
pui.cloud["create account screen"] = {};

pui.cloud["create account screen"]["show"] = function() {
  pui.cloud.show("create_account");
}

pui.cloud["create account screen"]["signin"] = function() {
  pui.cloud["signin screen"]["show"]();
}

pui.cloud["create account screen"]["next"] = function() {
  var first = get("_cloud_first_name");
  var firstEl = getObj("_cloud_first_name");
  var last = get("_cloud_last_name");
  var lastEl = getObj("_cloud_last_name");
  var nameMsgEl = getObj("_cloud_name_msg");
  var profile = get("_cloud_profile").toLowerCase();
  var profileEl = getObj("_cloud_profile");
  var profileMsgEl = getObj("_cloud_profile_msg");
  var email = get("_cloud_email").toLowerCase();
  var emailEl = getObj("_cloud_email");
  var emailMsgEl = getObj("_cloud_email_msg");
  var password1 = get("_cloud_password1").toLowerCase();
  var passwordEl1 = getObj("_cloud_password1");
  var password2 = get("_cloud_password2").toLowerCase();
  var passwordEl2 = getObj("_cloud_password2");
  var passwordMsgEl = getObj("_cloud_password_msg");
  var company = get("_cloud_company");
  var phone = get("_cloud_phone");
  var details = get("_cloud_project_details");  
  
  nameMsgEl.innerHTML = "";
  profileMsgEl.innerHTML = "";
  emailMsgEl.innerHTML = "";
  passwordMsgEl.innerHTML = "";
  
  var send = true;

  if (!password1) {
    passwordMsgEl.innerHTML = "<br/>Enter password.";
    passwordEl1.focus();
    send = false;
  }
  else if (password1.length < 8) {
    passwordMsgEl.innerHTML = "<br/>Password must be 8 or more characters.";
    passwordEl1.focus();
    send = false;
  }
  else if (!password2) {
    passwordMsgEl.innerHTML = "<br/>Confirm password.";
    passwordEl2.focus();
    send = false;
  }
  else if (password1 != password2) {
    passwordMsgEl.innerHTML = "<br/>Password do not match.";
    passwordEl1.focus();
    send = false;
  }
  
  if (!email) {
    emailMsgEl.innerHTML = "<br/>Enter email address.";
    emailEl.focus();
    send = false;
  }
  else if (!pui.validateEmail(email)) {
    emailMsgEl.innerHTML = "<br/>This is not a valid email address.";
    emailEl.focus();
    send = false;    
  }

  if (!profile) {
    profileMsgEl.innerHTML = "<br/>Enter profile name.";
    profileEl.focus();
    send = false;
  }
  else {
    for (var i = 0; i < profile.length; i++) {
      var ch = profile.substr(i, 1);
      if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9") || (ch === ".") || (ch === "_")) {
        // valid character
      }
      else {
        profileMsgEl.innerHTML = "<br/>Profile name contains invalid characters.";
        profileEl.focus();
        send = false;
      }
    }
  }

  if (!first || !last) {
    nameMsgEl.innerHTML = "<br/>Enter first and last name.";
    if (first && !last) lastEl.focus();
    else firstEl.focus();
    send = false;
  }

  if (!send) return; 
  
  screenMask.msg = "Creating account";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/create_account",
    "method": "post",
    "params": {
      "first": first,
      "last": last,
      "profile": profile,
      "email": email,
      "pwd": password1,
      "company": company,
      "phone": phone,
      "details": details
    },
    "async": true,
    "handler": function (response, err) {
      screenMask.hide();
      if (!response["success"]) {
        for (var i = 0; i < response["messages"].length; i++) {
          var msg = response["messages"][i];
          if (msg["messageEl"]) {
            getObj(msg["messageEl"]).innerHTML = "<br/>" + msg["message"];
          }
          else {
            pui.alert(msg["message"]);
          }
          if (msg["focusEl"]) {
            getObj(msg["focusEl"]).focus();
          }
        }
        return;
      }
      localStorage.setItem("pui-cloud-token", response["token"]);
      pui.cloud["publish screen"].show();
    }
  });

}
