/* ====================================================================+
 * File name      : jquery.lara.ui.toolbar.js
 * Beginning      : 2012-Ene-08
 * Last modified  : 2012-Ene-08
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un barra de herramientas.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
 *    jquery.ui.sortable.js
 * 
 *  Aperos-Lara:
 *    none
 * 
 * --------------------------------------+
 * 
 * css file depends:
 *   jQuery:
 *     jquery-ui.css (custom)
 * 
 *   Aperos-Lara:
 *     jquery.lara.ui.toolbar.css
 */

/*
 * v0.0.0 | 2012-Ene-08
 *     - Creación del widget.
 * 
 * v1.0.0 | 2012-May-04
 *     - widget ui toolbar has been released.
 */

(function($, undefined) {
	$.widget("ui.toolbar", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		options: {
			splitter: "ui-icon-grip-dotted-vertical"
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.uiToolbar = this.element
				.addClass("ui-toolbar ui-widget ui-state-default")
				.attr("role", "toolbar")
				.sortable({ 
					placeholder: "ui-state-highlight",
					axis: "x",
					opacity: 0.6
				})
				.disableSelection();
				
			this.refresh();
		},
		
		refresh: function() {
			var self = this,
				o = self.options;
			
			itembar = this.element
				.find("li:not(.ui-toolbar-itembar)")
				.addClass("ui-toolbar-itembar")
				.attr("role", "item");
				
			itembar.each(function() {
				var item = $(this);
				
				item.prepend('<a href="#" style="cursor: default;"><span class="ui-toolbar-splitter ui-icon ' + o.splitter + '"></span></a>');
			});
		},
		
		destroy: function() {
			this.element
				.find(".ui-toolbar-itembar")
					.find(".ui-toolbar-splitter")
						.parent("a")
							.remove()
						.end()
					.end()
				.removeClass("ui-toolbar-itembar")
				.removeAttr("role");
			
			this.uiToolbar
				.removeClass("ui-toolbar ui-widget ui-state-default")
				.removeAttr("role")
				.sortable("destroy")
				.enableSelection();
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			this.refresh();
		},
		
		_setOption: function(key, value) {
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);
