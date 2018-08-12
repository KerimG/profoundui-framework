
pui.social["showComments"] = function() {
  var panel = Ext.getCmp("southPanel");
  if (panel.collapsed) panel.expand();
  
  setTimeout(function() {
    alert('to do - show comments!');
  }, 300);

}
