// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define(["dojo/_base/declare","jimu/BaseFeatureAction","jimu/WidgetManager"],function(a,c,d){return a(c,{map:null,iconClass:"icon-set-as-incident",isFeatureSupported:function(b){return 1!==b.features.length?!1:!0},onExecute:function(b){return d.getInstance().triggerWidgetOpen(this.widgetId).then(function(a){a._setEventLocation(b.features[0])})}})});