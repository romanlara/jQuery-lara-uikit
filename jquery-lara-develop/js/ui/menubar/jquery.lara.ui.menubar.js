/* ====================================================================+
 * File name      : jquery.lara.ui.menubar.js
 * Beginning      : 2011-Oct-18
 * Last modified  : 2012-May-03
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0.0
 * version widget :   1.0.0
 * 
 * Description    : Una barra de menu.
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
 *    jquery.lara.ui.menu.js
 * 
 * --------------------------------------+
 * 
 * css file depends:
 *   jQuery:
 *     jquery-ui.css (custom)
 * 
 *   Aperos-Lara:
 *     jquery.lara.ui.menubar.css
 */

/*
 * v0.0.0 | 2011-Oct-18
 *     - Creación del widget.
 * 
 * v0.1.0 | 2012-May-03
 *   News:
 *     - none
 *   Patching:
 *     - Se mejoró el problema de cerrar los menues de la barra de menu al dar click fuera de ellos,
 *       antes se necesitaba que se dieran dos clicks para hacerlo, ahora ya es posible cerrárlos
 *       con solo un click.
 * 
 * --------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget ui menubar has been released.
 */

(function($, undefined) {
	$.widget("ui.menubar", {
		versionLibrary: "1.0.0.0",
		version: "1.0.0",
		
		options: {
			position: {
				my: "left top",
				at: "left bottom"
			},
			anchors: ""
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.element
				.addClass("ui-menubar ui-widget ui-widget-header ui-helper-reset")
				.attr("role", "menubar")
				.disableSelection();
				
			items = this.items = this.element.children("li")
				.addClass("ui-menubar-item")
				.attr("role", "item")
				.children("a")
				.addClass("ui-menubar-button")
				.attr({
					"role": "label",
					"id": function(i) {
						return self.element.attr("id") + "-" + i;
					}
				});
			
			items
				.each(function() {
					var item = $(this),
						anchor = item.attr("href"),
						menu = $(anchor);
					
					o.anchors += anchor + ", ";
					
					menu//.menu()
						.attr({
							"aria-hide": "true",
							"aria-expanded": "false"
						})
						.hide();
					
					item.bind("click.menubar focus.menubar mouseenter.menubar", function(event) {
						if (o.disabled) { return; }
						event.preventDefault();
						
						if (event.type == 'click' && menu.is(':visible') && self.active && self.active[0] == menu[0]) {
							self._close(menu, item);
							return;
						}
						if ((self.open && event.type == 'mouseenter') || event.type == 'click') {
							self._open(event, menu, item);
						}
					})
					
					menu.each(function() {
						$(this)
							.children("li")
							.bind("click.menubar", function(event) {
								if (o.disabled) { return; }
								self.closeAll();
								self.open = false;
								event.stopPropagation();
								event.preventDefault();
							});
					})
				});
			/*
			this.element.parents("body")
				.bind('dblclick.menubar', function(event) {
					if (o.disabled) { return; }
					self.closeAll();
					self.open = false;
					event.stopPropagation();
					event.preventDefault();
				});*/
			/*$(document)
				.bind("dblclick.menubar", function(event) {
					if (o.disabled) { return; }
					self.closeAll();
					self.open = false;
					//event.stopPropagation();
					//event.preventDefault();
				});*/
			$(document).mousedown(function(event) {
				if (o.disabled) { return; }
				if (!$(event.target).closest(".ui-menu").length) {
					setTimeout(function() {
						if (!$(event.target).closest(".ui-menubar").length) {
							self.closeAll();
							self.open = false;
						}
					}, 1);
				}
			});
		},
		
		refresh: function() {
			
		},
		
		destroy: function() {
			var self = this;
			
			$.Widget.prototype.destroy.call(this, arguments);
			
			this.element
				.removeClass("ui-menubar ui-widget ui-widget-header ui-helper-reset")
				.removeAttr("role")
				.children("li")
				.removeClass("ui-menubar-item")
				.removeAttr("role")
				.unbind(".menubar");
				
			this.element
				.children("li")
				.children("a")
				.removeClass("ui-menubar-button")
				.removeAttr("role")
				.removeAttr("id");
				
					
			$(this.options.anchors).removeAttr("aria-hide")
				.removeAttr("aria-expanded")
				.show();
			
			this.element.parents()
				.unbind(".menubar");
		},
		
		_close: function(menu, item) {
			menu//.menu("cerrarTodo")
				.hide()
				.attr({
					"aria-hide": "true",
					"aria-expanded": "false"
				});
			
			item.removeClass("ui-state-active");
			
			this.open = false;
		},
		
		closeAll: function() {
			this.element
				.find("li")
				.children("a.ui-state-active")
					.removeClass("ui-state-active");
			
			
			$(this.options.anchors)
				.hide()
				.attr({
					"aria-hide": "true",
					"aria-expanded": "false"
				})
				.menu("closeAll");
		},
		
		_open: function(event, menu, item) {
			this.closeAll();
			
			item.addClass("ui-state-active");
				
			var position = $.extend({}, {
					of: item
				}, $.type(this.options.position) == 'function'  
					? this.options.position(item) 
					: this.options.position);
			
			this.active = menu
				.show()
				.attr({
					"aria-hide": "false",
					"aria-expanded": "true"
				})
				.position({
					of: item,
					my: "left top",
					at: "left bottom"
				});
			this.open = true;
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			//this.refresh();
		},
		
		_setOption: function(key, value) {
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);