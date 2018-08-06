
pui.cloud["reset password screen"] = {};

pui.cloud["reset password screen"]["show"] = function() {
  pui.cloud.show("reset_password");
}

pui.cloud["reset password screen"]["resendCode"] = function() {
  pui.cloud["forgot password screen"]["next"]();
}

pui.cloud["reset password screen"]["startOver"] = function() {
  pui.cloud["signin screen"].show();
}

pui.cloud["reset password screen"]["next"] = function() {
  var email = get("_cloud_email").toLowerCase();
  var emailEl = getObj("_cloud_email");
  var emailMsgEl = getObj("_cloud_email_msg");
  var code = get("_cloud_code").toLowerCase();
  var codeEl = getObj("_cloud_code");
  var codeMsgEl = getObj("_cloud_code_msg");
  var password1 = get("_cloud_password1");
  var passwordEl1 = getObj("_cloud_password1");
  var password2 = get("_cloud_password2");
  var passwordEl2 = getObj("_cloud_password2");
  var passwordMsgEl = getObj("_cloud_password_msg");
  
  emailMsgEl.innerHTML = "";
  codeMsgEl.innerHTML = "";
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
    passwordMsgEl.innerHTML = "<br/>Passwords do not match.";
    passwordEl1.focus();
    send = false;
  }
  
  if (!code) {
    codeMsgEl.innerHTML = "<br/>Enter code.";
    codeEl.focus();
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

  if (!send) return; 
  
  screenMask.msg = "Resetting your password";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/reset_password",
    "method": "post",
    "params": {
      "email": email,
      "code": code,
      "pwd": password1
    },
    "async": true,
    "handler": function (response, err) {
      screenMask.hide();
      if (!response["success"]) {
        passwordMsgEl.innerHTML = "<br/>The email and code you provided are invalid, or the code has expired.";
        return;
      }
      pui.cloud["signin screen"].show();
      setTimeout(function() {
        pui.alert("Your password has been reset.");
      }, 0);
    },
    "onfail": function() {
      pui.alert("An unexpected error ocurred.");
      screenMask.hide();
    }
  });

}
