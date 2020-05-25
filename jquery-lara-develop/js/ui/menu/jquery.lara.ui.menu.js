/* ====================================================================+
 * File name      : jquery.lara.ui.menu.js
 * Beginning      : 2011-Oct-18
 * Last modified  : 2012-Abr-14
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0.0
 * version widget :   1.0.0
 * 
 * Description    : Un menu.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
 * 
 *  Aperos-Lara:
 *    jquery.lara.ui.menuitem.js
 * 
 * --------------------------------------+
 * 
 * css file depends:
 *   jQuery:
 *     jquery-ui.css (custom)
 * 
 *   Aperos-Lara:
 *     jquery.lara.ui.menu.css
 */

/*
 * v0.0.0 | 2011-Oct-18
 *     - Creación del widget.
 * 
 * v0.0.1 | 2012-Mar-30
 *   News:
 *     - none
 *   Patching:
 *     - Se corrigió un problema que provocaba que los checkbox y radio buttons, en su forma nativa, no se pudiesen 
 *       seleccionar.
 * 
 * v0.1.0 | 2012-Abr-14
 *   News:
 *     - Se cambió la estructura, uniendo la clase menuitem con la clase menu, obteniendo como resultado una reducción
 *       conciderable de código pensada y dirigida para el usuario final.
 *     - Se agrego la posibilidad de utilizar un scroll en el menu, para aquellos menues con un extenso contenido.
 *   Patching:
 *     - none.
 * 
 * --------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget ui menu has been released.
 */

(function($, undefined) {
	var idIncrement = 0;
	
	$.widget("ui.menu", {
		versionLibrary: "1.0.0.0",
		version: "1.0.0",
		
		options: {
			position: {
				my: "left top",
				at: "right top"
			},
			
			scrolling: {
				scroll: false,
				height: ""
			}
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.menuId = this.element.attr( "id" ) || "ui-menu-" + idIncrement++;
			
			this.element
				.addClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-reset")
				.attr("role", "menu")
				.disableSelection()
				.delegate(".ui-menu-li:has(a)", "mouseover.menu", function(event) {
					if (o.disabled) { return; }
					var item = $(event.target).closest(".ui-menu-li:has(a)");
					self.focus(event, item);
					event.stopPropagation();
					event.preventDefault();
				})
				.delegate(".ui-menu-li:has(a)", "mouseout.menu", function(event) {
					if (o.disabled) { return; }
					self.blur(event);
					event.stopPropagation();
					event.preventDefault();
				})
				.delegate(".ui-menu-li:has(a):has(.ui-state-disabled)", "click.menu", function(event) {
					if (o.disabled) { return; }
					//self.closeAll();
					//event.stopPropagation();
					event.preventDefault();
				});
			/*
			this.element.parents("body")
				.bind('dblclick.menu', function(event) {
					if (o.disabled) { return; }
					self.closeAll();
					event.stopPropagation();
					event.preventDefault();
				});
			*/
			
			this.refresh();
			this._scrolling();
			
			$(document)
				.bind("click.menu", function(event) {
					if (o.disabled) { return; }
					self.closeAll();
					//event.stopPropagation();
					//event.preventDefault();
				});
		},
		
		refresh: function() {
			var self = this;
			
			var submenus = this.element.find("ul:not(.ui-menu)")
				.addClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-reset")
				.attr("role", "menu")
				.attr("aria-hide", "true")
				.attr("aria-expanded", "false")
				.hide();
			
			var menuId = this.menuId;
			submenus.add(this.element).children("li:not(.ui-menu-li):has(a)")
				.addClass("ui-menu-li")
				.attr("role", "item")
				.children("a")
					.addClass("ui-menu-iteml ui-corner-all")
					.attr("role", "menuitem")
					.attr("id", function(i) {
						return menuId + "-" + i;
					});
			
			submenus.add(this.element)
				.children("li.ui-menu-label") // li:not(.ui-menu-li):not(a)
				.addClass("ui-state-disabled")
				.attr("role", "label");
			
			submenus.each(function() {
				var menu = $(this),
					item = menu.prev("a");

				item.attr("aria-haspopup", "true")
					.prepend('<span class="ui-menu-iteml-submenu-icon ui-icon ui-icon-carat-1-e"></span>');
				menu.attr("aria-submenu", item.attr("id"));
			
				//$(this).attr("submenu", $(this).prev().attr("id"));
			});
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			this._removeShortcutkeys();
			
			// Destruccion de las opciones del menu.
			this.element
				.find("li")
				.removeClass("ui-menu-li")
				.removeAttr("role")
				.children("a")
				.removeClass("ui-corner-all ui-menu-margin ui-menu-iteml")
				.find(".ui-menu-iteml-submenu-icon")
				.remove()
				.end()
				.find(".ui-menu-icon-item")
				.remove()
				.end()
				.find(".ui-menu-iteml-keys")
				.remove();
				
			// Destruccion del menu y los submenues.
			this.element
				.removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-reset")
				.removeAttr("role")
				.find("ul")
					.removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-helper-reset")
					.removeAttr("role")
					.removeAttr("aria-hide")
					.removeAttr("aria-expanded")
					.removeAttr("submenu")
					.show();
			
			this.element
				.find(".ui-menu-li:has(a), .ui-menu-li:has(a):has(.ui-state-disabled)")
				.undelegate(".menu");
			
			$(document)
				.unbind(".menu");
			
			this.active = null;
		},
		
		_removeShortcutkeys: function() {
			var submenus = this.element.find("ul");
			
			submenus
				.add(this.element)
				.children("li:has(a)")
				.each(function() {
					var item = $(this),
						key = item.children("a").children("span.ui-menu-iteml-keys");
					
					shortcut.remove(key.text());
				});
		},
		
		focus: function(event, item) {
			//var opcion = $(event.target);
			
			// Optenemos la opcion activa y a su primer hijo le asignamos el estado focus.
			this.active = item
				.first()
				.children("a");
			
			if (!(this.active.attr("aria-disabled") === "true")) {
				this.active.addClass("ui-state-focus");
			}
			// Al elemento principal le enviamos un registro de cual elemento esta activo.
			this.element
				.attr("aria-item-active", this.active.attr("id"));
			
			// Le asignamos a al opcion activa el estado de activo si tiene un submenu.
			this.active
				.parent()
				.closest(".ui-menu-li:has(.ui-menu)")
				.children("a:first")
					.addClass("ui-state-active");
			
			this._close();
			
			submenu = $("> ul", item);
			
			if (submenu.length && /^mouse/.test(event.type)) {
				this._preopen(submenu);
			}
		},
		
		blur: function(event) {
			//var opcion = $(opcion);
			
			//if (!this.activa) { return; }
			
			// Quitamos de la opcion activa el estado focus.
			this.active.removeClass('ui-state-focus');
			/*opcion
				.first()
				.children("a")
				.removeClass("ui-state-focus");*/
		},
		
		_preopen: function(submenu) {
			//this._cerrar();
			this._open(submenu);
		},
		
		_open: function(submenu) {
			this.element
				.find(".ui-menu")
				.not(submenu.parents())
				.hide()
				.attr({
					"aria-hide": "true",
					"aria-expanded": "false"
				});
			
			var position = $.extend({}, {
					of: this.active
				}, $.type(this.options.position) == 'function'  
					? this.options.position(this.active) 
					: this.options.position);
			
			submenu
				.show()
				.attr({
					"aria-hide": "false",
					"aria-expanded": "true"
				})
				.position(position);
		},
		
		_close: function() {
			this.active
				.closest("a")
				.parent() // li
				.parent() // ul
				.find(".ui-menu-li > .ui-menu")
					.hide()
					.attr({
						"aria-hide": "true",
						"aria-expanded": "false"
					})
				.end()
				.find("a.ui-state-active")
					.removeClass("ui-state-active");
		},
		
		closeAll: function() {
			this.element
				.find("ul")
					.hide()
					.attr({
						"aria-hide": "true",
						"aria-expanded": "false"
					})
				.end()
				.find("a.ui-state-active")
					.removeClass("ui-state-active");
		},
		
		_scrolling: function() {
			var self = this,
				o = self.options;
			
			if (o.scrolling.scroll) {
				this.element
					.css("height", (o.scrolling.height === null || o.scrolling.height === undefined || o.scrolling.height === "") ? "" :
							(typeof o.scrolling.height === "string") ? o.scrolling.height : o.scrolling.height + "px")
					.css("overflow-y", "auto");
			} else {
				this.element
					.css("height", "")
					.css("overflow-y", "hidden");
			}
		},
		
		addIcon: function(item, icon) {
			this.element
				.find("a[href='" + item + "']")
				.prepend('<span class="ui-menu-icon-item ui-icon ' + icon + '"></span>')
				.addClass("ui-menu-margin");
		},
		
		addShortcutkey: function(item, shortcutkey, disableInInput) {
			var self = this,
				o = self.options,
				disableInInput = (disableInInput !== false) ? disableInInput : false;
				
			this.element
				.find("a[href='" + item + "']")
				.append('<span class="ui-menu-iteml-keys">' + shortcutkey + '</span>')
			
			shortcut.add(shortcutkey, function(event) {
				if (o.disabled) { return; }
				self.element
					.find("a[href='" + item + "']").trigger("click");
			}, {
				disable_in_input: disableInInput
			});
		},
		
		disableItem: function(item) {
			this.element
				.find("a[href='" + item + "']")
				.addClass("ui-state-disabled");
		},
		
		enableItem: function(item) {
			this.element
				.find("a[href='" + item + "']")
				.removeClass("ui-state-disabled");
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			this.refresh();
		},
		
		_setOption: function(key, value) {
			
			switch (key) {
				case 'scrolling':
					this._scrolling();
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);