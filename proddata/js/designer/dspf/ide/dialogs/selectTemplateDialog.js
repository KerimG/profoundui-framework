

pui.ide.dialogs.selectTemplateDialog = function() {

  var winItems = 
	[{
		  "region": "center",
    	"layout": "fit",
    	"bodyStyle": "white-space: normal; padding: 10px 10px 10px 10px",
    	"autoScroll": true,
    	"id": "_select_template_content",
    	"html": ""
	}];

  var wwidth = 800;
  var wheight = 600;
  var vwidth = pui.ide.viewPort.getWidth();
  var vheight = pui.ide.viewPort.getHeight();

  var win = new Ext.Window({
    "title": "Select Template",
    "width": wwidth,
    "height": wheight,
    "minWidth": 500,
    "minHeight": 375,
    "layout": "fit",
    "modal": true,
    "maximized": (vwidth < wwidth || vheight < wheight) ? true : false,
    "buttonAlign": "center",
    "defaultButton": 0,
    "constrain": true,
    "listeners": 
	  {
  		"show": function() {
  		  var contentArea = Ext.get('_select_template_content').dom.firstChild.firstChild;
  		  contentArea.innerHTML = "Select template content goes here";
		  },
      "beforeclose": function() 
		  {
    	 toolbar.designer.disabled = false;
    	},
    	"render": function(win)
    	{
    	  // Firefox's popup blocker won't allow launch via mapping with the Window's "keys" config option.
    	  // This is because "keys" binds functions to keydown event, and Firefox only allows popups on keypress.
    	  // Use the "render" listener because the DOM keypress event is not exposed through addListener.
    	  new Ext.KeyMap(win.getEl(), {
    	    "key": Ext.EventObject.ENTER,
    	    "handler": win.buttons[0].handler,
    	    "stopEvent": true
    	  }, "keypress");

    	}
    },
    "buttons": [
      { 
        "text": "Ok",
        "handler": function() {
          alert("Ok - to do");
          win.close();
        }
      },
      {
        "text": "Cancel",
        "handler": function() {
          alert("Cancel - to do");
          win.close();
        }
      }
    ],
    "items": [
      winItems
    ]
  });

  toolbar.designer.disabled = true;  
  win.show();
}

