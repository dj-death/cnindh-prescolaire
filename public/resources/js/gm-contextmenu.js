/**
 * @author NoSmoking : https://www.developpez.net/forums/u405341/nosmoking/
 * @version 1.0.0
 */
"use strict";

function ContextMenu(opts) {
  var me = this;
  google.maps.OverlayView.call(this);
  this.version = "1.0.0";
  this.target = null;
  this.latLng = opts.latlng || {
    "lat": 0,
    "lng": 0
  };
  this.map = opts.map;
  this.height = 0;
  this.width = 0;
  this.isVisible = false;
  this.eventDragTarget = null;
  this.div = opts.idMenu === "object" ? opts.idMenu : document.getElementById(opts.idMenu);
  this.callback = opts.callback || function() {};
  this.scope = opts.scope || target;

  this.valideAction = function(e) {
    e.stopPropagation();
    // pas de clic droit et/ou enchainement mouseup et click
    if (e.button === 0 && this.isVisible) {
      // déclenche action menu
      var elem = e.target;
      var action = elem.getAttribute("data-action");
      if (action) {
        me.callback.call(me.scope, {
          "action": action,
          "element": elem,
          "latLng": me.latLng
        });
        // ferme le menu
        me.hide();
      }
    }
  };
  if (this.div) {
    this.div.style.position = "absolute";
    this.div.style.visibility = "hidden";
    this.div.style.display = "block";
    //-----------------------
    // Gestion des événements
    //-----------------------
    // action déclenchant la fermeture
    var events = "center_changed click maptypeid_changed zoom_changed";
    events.split(" ").forEach(function(elem) {
      google.maps.event.addListener(me.map, elem, function(e) {
        me.hide();
      });
    });
    // action au click sur context menu
    google.maps.event.addDomListener(this.div, "click", function(e) {
      me.valideAction(e);
    });
    // on efface sur touche echap.
    google.maps.event.addDomListener(this.map.getDiv(), "keydown", function(e) {
      if (e.keyCode === 27) {
        me.hide();
      }
    });
    // si click en dehors de la carte
    google.maps.event.addDomListener(document.querySelector("BODY"), "mousedown", function(e) {
      me.hide();
    });
    // si mouseup souris enfoncée lors d'un mouseover
    google.maps.event.addDomListener(this.div, "mouseup", function(e) {
      me.valideAction(e);
    });
    // on ne fait rien de plus
    google.maps.event.addDomListener(this.div, "mousedown", function(e) {
      e.stopPropagation();
    });

  }
  this.setMap(this.map);
}
ContextMenu.prototype = new google.maps.OverlayView();
ContextMenu.prototype.onAdd = function() {
  if (this.div) {
    var panes = this.getPanes();
    if (this.div.parentNode !== panes.floatPane) {
      panes.floatPane.appendChild(this.div);
      this.height = this.div.offsetHeight;
      this.width = this.div.offsetWidth;
    }
  }
};
ContextMenu.prototype.draw = function() {
  if (this.isVisible && this.div) {
    var pos = this.getUniteion().fromLatLngToDivPixel(this.latLng);
    if (pos) {
      this.div.style.left = pos.x + "px";
      this.div.style.top = pos.y + "px";
      this.div.style.display = "block";
    }
  }
};
ContextMenu.prototype.remove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};
ContextMenu.prototype.show = function(target, latLng) {
  var me = this;
  // efface les autres context menu si existent
  google.maps.event.trigger(this.map, "click", {
    "action": "show"
  });
  // ferme si drag sur élement déclencheur
  this.eventDragTarget = google.maps.event.addListener( target, "dragstart", function() {
    me.hide();
  });  
  if (this.div) {
    // on met hors écran pour éviter une éventuel effet de « flash »
    this.div.style.top = "-2000px";
    // affectation valeurs
    this.target = target;
    this.latLng = latLng;
    // calcul position
    this.panMap();
    // affiche
    this.div.style.visibility = "visible";
    this.isVisible = true;
  }
};
ContextMenu.prototype.hide = function() {
  if (this.isVisible && this.div) {
    google.maps.event.removeListener(this.eventDragTarget);
    this.div.style.visibility = "hidden";
    this.isVisible = false;
  }
};
ContextMenu.prototype.panMap = function() {
  // récup. des vraies dimensions si full screen
  var mapDiv = this.map.getDiv().firstElementChild;
  var pan = {
    x: 0,
    y: 0
  };
  var menuSize = {
    "width": this.width + 5,
    "height": this.height + 15 // tient compte du copyRight
  };
  var mapSize = {
    "width": mapDiv.offsetWidth,
    "height": mapDiv.offsetHeight
  };
  // récup. position d'affichage
  var pos = this.getUniteion().fromLatLngToContainerPixel(this.latLng);
  // calcul du décalage à opérer
  var ecart = mapSize.width - menuSize.width;
  if (pos.x > ecart) {
    pan.x = pos.x - ecart;
  }
  ecart = mapSize.height - menuSize.height;
  if (pos.y > ecart) {
    pan.y = pos.y - ecart;
  }
  // décalage de la carte
  this.map.panBy(pan.x, pan.y);
};