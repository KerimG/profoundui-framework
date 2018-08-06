
pui.cloud["publish screen"] = {};

pui.cloud["publish screen"]["show"] = function() {
  pui.cloud.show("publish");
}

pui.cloud["publish screen"]["signout"] = function() {
  var token = localStorage["pui-cloud-token"];
  if (typeof token !== "string") token = "";

  screenMask.msg = "Signing you out";
  screenMask.show();
  ajaxJSON({
    "url": "/cloud/logout",
    "method": "post",
    "params": {
      "token": token
    },
    "async": true,
    "handler": function (response, err) {
      screenMask.hide();
      localStorage.setItem("pui-cloud-token", "");
      pui.cloud["signin screen"].show();
    }
  });

}

pui.cloud["publish screen"]["publish"] = function() {
  alert('to do')
}
