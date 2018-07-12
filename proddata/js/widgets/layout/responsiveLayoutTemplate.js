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



function helpTextResponsiveProperties(defVal, descVal, descAdd) {
  var codeOpen = "<code style='color: blue; letter-spacing: 0px; font-weight: bold;'>";
  var codeClose = "</code>";
  var falseSpan = "<span title='The default value of the property is false.'>false</span>";
  var trueSpan = "<span title='The default value of the property is false.'>true</span>";
  var blankSpan = "<span title='The default value of the property is unset or not defined.'>[blank]</span>";
  var cssSpan = "[<span title='The default value is the value defined in the CSS &#010;(theme/developer CSS classes defined in a CSS&#010;file or \"style\" DOM attribute) for the element.'>CSS value</span>]";
  var placeholderSpan = "[<span title='The default value of the property is placeholder &#010;text, such as \"Lorem Ipsum...\" or \"HTML Content\".'>placeholder text</span>]";
  var browserSpan = "[<span title='The default is determined by the browser for the element.'>browser setting</span>]";
  var widgetSpan = "[<span title='The default value of this property is determined by the selected widget.'>selected widget</span>]";
  var themeSpan = "[<span title='The default value of this property is based on the selected widget and its theme/template/purpose.'>selected widget</span>]";
  var skinSpan = "[<span title='The default value of this property is determined by &#010;the selected skin and it's defaults, CSS, and/or JavaScript customizations.'>selected skin</span>]";
  var idSpan = "[<span title='The default ID is based on the name of the selected &#010;widget with no spaces and the first letter of each word capitalized.'>WidgetName</span>][<span title='A whole number value starting from 1 determined by how many of the same widget have previously been added to the Design grid.'>number</span>]";
  var positionSpan = "[<span title='The default values are determined by where the &#010;widget is dropped/placed on the Designer grid.'>user drop point</span>]";
  var bindSpan = "<span title='This property requires being bound and a value passed by an RPG program.'>[bound value]</span>";
  var otherText = " The 'Other...' option can be selected to write in a custom value.";
  var posDefVals = ["css", "blank", "false", "true", "placeholder", "browser", "theme", "skin", "id", "bind", "widget", "position"];
  // ------------------
  // Default Value:
  var helpString = "<hr><b title='The default value(s) of this property.'>Default Value:</b> ";
  // <c>value</c>
  helpString += codeOpen;
  if (posDefVals.includes(defVal)) {
    if (defVal === "true") {
      helpString += trueSpan;
    } else if (defVal === "blank") {
      helpString += blankSpan;
    } else if (defVal === "css") {
      helpString += cssSpan;
    } else if (defVal === "false") {
      helpString += falseSpan;
    } else if (defVal === "placeholder") {
      helpString += placeholderSpan;
    } else if (defVal === "browser") {
      helpString += browserSpan;
    } else if (defVal === "theme") {
      helpString += themeSpan;
    } else if (defVal === "skin") {
      helpString += skinSpan;
    } else if (defVal === "id") {
      helpString += idSpan;
    } else if (defVal === "bind") {
      helpString += bindSpan;
    } else if (defVal === "widget") {
      helpString += widgetSpan;
    } else if (defVal === "position") {
      helpString += positionSpan;
    }
  } else {
    helpString += defVal;
  }
  helpString += codeClose;
  // ------------------
  // Description:
  helpString += "<hr><b title='A general description of the widget's properties.'>Description: </b>";
  // Description text...
  helpString += descVal;

  // Other...
  if (descAdd.includes("other")) {
    helpString += otherText;
  }
  // ------------------
  helpString += "<hr><br>";

  return helpString;
}

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
    return pui.layout.mergeProps([{
        name: "layout items",
        help: helpTextResponsiveProperties("5", "The number of containers for this layout.", ["other"]),
        choices: ['1', '2', '3', '4', '5', '6', 'Other...']
      },
      {
        name: "style rules",
        type: "responsive",
        help: helpTextResponsiveProperties("<br>@media screen { <br>&nbsp;&nbsp;&nbsp;#_id_ > .puiresp { <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;display:grid; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grid-template-rows:auto; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grid-template-columns:repeat(4, 1fr); <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grid-column-gap:3px; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grid-row-gap:3px;<br>&nbsp;&nbsp;&nbsp;}<br>}", "String of CSS stylesheet rules, used to define positions and dimensions of containers. Leave empty when styles are expected to be defined" +
          " in an external stylesheet. See <a target=\"_blank\" href=\"http://www.profoundlogic.com/docs/display/PUI/Responsive+Layout\">Responsive Layout</a> for more information.", [])
      },
      {
        name: "use viewport",
        help: helpTextResponsiveProperties("true", "Determines how @media rules in &quot;style rules&quot; are interpreted. When &quot;use viewport&quot; is true, " +
          "the page size determines which @media rules to apply. When false, the layout's height and width determine which @media rules to apply. <br><br>See " +
          "<a href=\"http://www.profoundlogic.com/docs/display/PUI/Responsive+Layout\" target=\"_blank\">Responsive Layout</a> for more information.", []),
        choices: ["true", "false"]
      }
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