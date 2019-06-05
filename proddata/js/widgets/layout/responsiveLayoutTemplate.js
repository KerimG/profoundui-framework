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
 * Depending on argument: 
 * 1. returns template properties for the Responsive Layout.
 * 2. returns a DIV element to contain the widget.
 * @param {Object} parms
 * @returns {Element|Object}
 */
pui.layout.template.responsiveLayoutTemplate = function (parms) {

  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  if (returnProps) {
    // Define the properties that appear in Template Settings in Designer.
    return pui.layout.mergeProps([
      { name: "layout items", help: pui.helpTextProperties("5", "The number of containers for this layout.", ["other"]), choices: ['1', '2', '3', '4', '5', '6', 'Other...'] },
      { name: "style rules", type: "responsive", help: pui.helpTextProperties("blank", "String of CSS stylesheet rules, used to define positions and dimensions of containers. Leave empty when styles are expected to be defined" +   " in an external stylesheet. See <a target=\"_blank\" href=\"http://www.profoundlogic.com/docs/display/PUI/Responsive+Layout\">Responsive Layout</a> for more information.") },
      { name: "use viewport", help: pui.helpTextProperties("true", "Determines how @media rules in &quot;style rules&quot; are interpreted. When &quot;use viewport&quot; is true, " +   "the page size determines which @media rules to apply. When false, the layout's height and width determine which @media rules to apply. <br><br>See " +   "<a href=\"http://www.profoundlogic.com/docs/display/PUI/Responsive+Layout\" target=\"_blank\">Responsive Layout</a> for more information."), choices: ["true", "false"] },
      { name: "container names", type: "list", help: pui.helpTextProperties("blank", "List of container names to aid in designing screens. Names appear only in Responsive Dialog preview and Designer canvas.") }
    ]);
  }

  var dom;
  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  } else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";

  var reslay;
  if (designMode) {
    reslay = new pui.designer.responsive.ResponsiveLayout();
    reslay.designMode = true;
  } else {
    reslay = new pui.ResponsiveLayout();
  }
  if (proxyMode) reslay.forProxy = true;
  reslay.container = dom;

  //Expose ResponsiveLayout so that layout.setProperty can handle the "id" correctly.
  dom.responsivelayout = reslay;

  dom.sizeMe = function () {
    dom.responsivelayout.resize();
  };

  // Map special setters to properties. These are called at the end of pui.Layout.layout.setProperty(), which is
  // the global property setter for "layout" widgets. When one property changes, each are evaluated in this order.
  
  if (properties["container names"] != null) {
    reslay.setContainerNames(properties["container names"]);  //setNumItems depends on the value set here.
  }

  if (properties["layout items"] != null) {
    reslay.setNumItems(properties["layout items"]);
  }

  if (properties["use viewport"] != null) {
    reslay.setUseViewport(properties["use viewport"] != "false");
  }

  if (properties["style rules"] != null) {
    reslay.setRules(properties["style rules"]);
  }
  
  return dom;
};
