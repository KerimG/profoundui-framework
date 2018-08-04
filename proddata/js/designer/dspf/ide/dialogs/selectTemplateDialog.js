
pui.ide.dialogs.selectTemplateDialog = function() {

  function selectTemplate() {
    ajaxJSON()
  }

  var winItems = 
	[{
		  "region": "center",
    	"layout": "fit",
    	"bodyStyle": "white-space: normal; padding: 10px 10px 10px 10px",
    	"autoScroll": true,
    	"id": "_select_template_content",
    	"html": ""
	}];

  var wwidth = 700;
  var wheight = 500;
  var vwidth = pui.ide.viewPort.getWidth();
  var vheight = pui.ide.viewPort.getHeight();

  var win = new Ext.Window({
    "title": "Select Template",
    "width": wwidth,
    "height": wheight,
    "minWidth": 400,
    "minHeight": 275,
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
  		  contentArea.innerHTML = pui.cloud["templates_html"];
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
          if (pui.ide["sendTemplateSelection"]()) {
            win.close();
          }
        }
      },
      {
        "text": "Cancel",
        "handler": function() {
          // One possible option is: Instead of leaving the workspace completely blank, we can use the first template as a default template
          //pui.ide["setTemplateSelection"](0);
          //pui.ide["sendTemplateSelection"]();
          win.close();
        }
      }
    ],
    "items": [
      winItems
    ]
  });

  toolbar.designer.disabled = true;
  pui.ide.savedTemplateDialogReference = win;
  win.show();
}


pui.ide["templateDoubleClick"] = function(idx) {
  pui.ide["setTemplateSelection"](idx);
  pui.ide["sendTemplateSelection"]();
  var win = pui.ide.savedTemplateDialogReference;
  win.close();
}

pui.ide["setTemplateSelection"] = function(idx) {
  getObj("_cloud_template_selection").value = String(idx);
  var i = 0;
  var templateDiv = getObj("_cloud_template" + i);
  while (templateDiv) {
    templateDiv.style.backgroundColor = "";
    i++;
    templateDiv = getObj("_cloud_template" + i);
  }
  getObj("_cloud_template" + idx).style.backgroundColor = "#cccccc";
}

pui.ide["sendTemplateSelection"] = function() {
  var idx = getObj("_cloud_template_selection").value;
  if (idx === "") {
    pui.alert("Please select a template.");
    return false;
  }
  ajaxJSON({
    "method": "post",
    "url": "/select_template",
    "params": {
      "workspace_id": pui.cloud["workspace_id"],
      "template_idx": idx
    },
    "handler": function(response) {
      if (response.success) {
        pui.cloud.openWorkspaceFiles(pui.cloud["templates"][idx]);
      }
    }
  });
  return true;
}
