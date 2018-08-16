//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.


/**
 * Depending on argument: returns template properties for the Tab Layout; or returns a DIV element to contain the widget.
 * @param {Object} parms
 * @returns {Element|Object}
 */
pui.layout.template.tabTemplate = function(parms) {  
  
  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  if (returnProps) {
    return pui.layout.mergeProps([
      pui.layout.adoptNamedProperty("tab names"),
      pui.layout.adoptNamedProperty("active tab"),
      pui.layout.adoptNamedProperty("ontabclick"),
      pui.layout.adoptNamedProperty("tab response"),
      pui.layout.adoptNamedProperty("response AID"),
      pui.layout.adoptNamedProperty("bypass validation"),
      
      pui.layout.adoptNamedProperty("color"),
      pui.layout.adoptNamedProperty("font family"),
      pui.layout.adoptNamedProperty("font size"),
      pui.layout.adoptNamedProperty("font style"),
      pui.layout.adoptNamedProperty("font weight"),
      // Note: the layout doesn't use text-align, which is useless with tabs; tabs are only as wide as the text.
      pui.layout.adoptNamedProperty("text decoration"),
      pui.layout.adoptNamedProperty("text transform"),
      { name: "lazy load", choices: ["true", "false"],
        help: pui.layout.helpTextLayoutProperties("false","When true, render contents of tab after the user clicks a tab instead of rendering everything immediately (which can be slower).",[],"") },
      { name: "onlazyload", type: "js", help: pui.layout.helpTextLayoutProperties("blank","Initiates a client-side script after a container is rendered lazily. (See lazy load property.)",[])}
    ]);
  }

  var dom;
  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  }
  else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";
  var tabLayout = new pui.TabLayout();
  if (proxyMode) tabLayout.forProxy = true;
  tabLayout.container = dom;
  tabLayout.designMode = designMode;
  tabLayout.init();
  
  dom.tabLayout = tabLayout;
  dom.sizeMe = dom.tabLayout.resize;  //Allows certain designer methods to cause a resize.
  
  tabLayout.setTabNames(properties["tab names"]);
  
  tabLayout.setOntabclick(properties["ontabclick"]);
  
  tabLayout.setAllStyles(properties); //Set color, font, etc. properties.
  
  var height = properties["height"];
  if (height == null) height = "200px";
  tabLayout.setHeight(height);
  
  // Note: tab keys is not implemented, because it's for Genie.
  
  if (!designMode) {
    // Set the active tab to the property value.
    var activeTab = properties["active tab"];
    if (activeTab != null) {
      activeTab = Number(activeTab);
      if (!isNaN(activeTab) && activeTab != 0) {
        tabLayout.setTab(activeTab);
      }
      dom.sendActiveTab = true;
    }
    
    if (properties["tab response"]) {
      dom.sendTabResponse = true;
    }
    
    var responseAID = properties["response AID"];
    if (responseAID != null && responseAID != ""){
      dom.responseAID = responseAID;
    }
  }
  
  if (proxyMode) {
    dom.style.position = "relative";
  }

  return dom;

};