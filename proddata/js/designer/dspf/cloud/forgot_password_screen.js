
pui.cloud["forgot password screen"] = {};

pui.cloud["forgot password screen"]["show"] = function() {
  pui.cloud.show("forgot_password");
}

pui.cloud["forgot password screen"]["haveCode"] = function() {
  pui.cloud["reset password screen"].show();
}

pui.cloud["forgot password screen"]["startOver"] = function() {
  pui.cloud["signin screen"].show();
}

pui.cloud["forgot password screen"]["next"] = function() {
  alert("to do")
}
