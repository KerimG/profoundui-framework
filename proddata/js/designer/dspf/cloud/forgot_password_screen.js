
pui.cloud["forgot password screen"] = {};

pui.cloud["forgot password screen"]["show"] = function() {
  pui.cloud.show("forgot_password");
  if (pui.cloud["signin screen"].email_used) {
    getObj("_cloud_email").value = pui.cloud["signin screen"].entered_profile;
  }
}

pui.cloud["forgot password screen"]["haveCode"] = function() {
  pui.cloud["reset password screen"].show();
}

pui.cloud["forgot password screen"]["startOver"] = function() {
  pui.cloud["signin screen"].show();
}

pui.cloud["forgot password screen"]["next"] = function() {
  var email = get("_cloud_email").toLowerCase();
  var emailEl = getObj("_cloud_email");
  var msgEl = getObj("_cloud_email_msg");

  if (!email) {
    msgEl.innerHTML = "<br/>Enter an email.";
    emailEl.focus();
    return;
  }
  
  screenMask.msg = "Sending password reset code";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/send_reset_code",
    "method": "post",
    "params": {
      "email": email
    },
    "async": true,
    "suppressAlert": true,
    "handler": function (response, err) {
      screenMask.hide();
      if (!response["success"]) {
        msgEl.innerHTML = "<br/>" + response["message"];
        emailEl.focus();
        return;
      }      
      pui.cloud["reset password screen"].show();
      getObj("_cloud_email").value = email;
      setTimeout(function() {
        pui.alert("Check your inbox! We just emailed you a password reset code.");
        getObj("_cloud_code").focus();
      }, 0);
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred. Check your connection and try again.");
      screenMask.hide();
    }
  });
}
