
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

  var wwidth = 500;
  var wheight = 300;
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
    "listeners": 
	  {
  		"show": function() {
        var user = null;  // to do -- retreieve currently signed in user
        if (user) {
          pui.cloud["publish screen"]["show"]();
        }
        else {
          pui.cloud["signin screen"]["show"]();          
        }
		  },
      "beforeclose": function() 
		  {
    	 toolbar.designer.disabled = false;
    	},
    	"render": function(win)
    	{

    	}
    },
    "buttons": [
    ],
    "items": [
      winItems
    ]
  });

  toolbar.designer.disabled = true;
  win.show();
}


pui.cloud.show = function(view) {
  var contentArea = Ext.get(pui.cloud.currentContentAreaId).dom.firstChild.firstChild;
  contentArea.innerHTML = pui.cloud.views[view];
}
