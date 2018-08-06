
pui.cloud.publishDialog = function() {
  pui.cloud.currentContentAreaId = "_publish_dialog_content";

  var winItems = 
	[{
		  "region": "center",
    	"layout": "fit",
    	"bodyStyle": "white-space: normal; padding: 10px 10px 10px 10px",
    	"autoScroll": true,
    	"id": pui.cloud.currentContentAreaId,
    	"html": ""
	}];

  var wwidth = 525;
  var wheight = 425;
  var vwidth = pui.ide.viewPort.getWidth();
  var vheight = pui.ide.viewPort.getHeight();

  var win = new Ext.Window({
    "title": "Publish",
    "width": wwidth,
    "height": wheight,
    "minWidth": 400,
    "minHeight": 200,
    "layout": "fit",
    "modal": true,
    "maximized": (vwidth < wwidth || vheight < wheight) ? true : false,
    "constrain": true,
    "listeners": {
  		"show": function() {
        pui.cloud.verifyToken(function(info) {
          if (info.success) {
            pui.cloud["publish screen"].show();
          }
          else {
            pui.cloud["signin screen"].show();          
          }
        });
		  },
      "beforeclose": function() {
    	  if (toolbar && toolbar.designer) toolbar.designer.disabled = false;
    	},
    	"render": function(win)	{
    	  new Ext.KeyMap(win.getEl(), {
    	    "key": Ext.EventObject.ENTER,
    	    "handler": function() {
            var contentArea = Ext.get(pui.cloud.currentContentAreaId).dom.firstChild.firstChild;
            var els = contentArea.getElementsByTagName("input");
            for (var i = 0; i < els.length; i++) {
              var el = els[i];
              if (el.type === "button") {
                el.click();
                return;
              }
            }
          },
    	    "stopEvent": true
    	  }, "keypress");
    	}
    },
    "buttons": [],
    "items": [
      winItems
    ]
  });

  if (toolbar && toolbar.designer) toolbar.designer.disabled = true;
  pui.cloud.savedPublishDialogReference = win;
  win.show();
}


pui.cloud.show = function(view) {
  var contentArea = Ext.get(pui.cloud.currentContentAreaId).dom.firstChild.firstChild;
  contentArea.innerHTML = pui.cloud.views[view];
  var firstBox = contentArea.getElementsByTagName("input")[0];
  if (firstBox != null && (firstBox.type === "text" || firstBox.type === "password")) {
    firstBox.focus();
  }
}
