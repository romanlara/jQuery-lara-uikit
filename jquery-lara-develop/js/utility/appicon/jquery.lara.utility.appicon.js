/* ====================================================================+
 * File name     : jquery.lara.utility.appicon.js
 * Beginning     : 2012-Mar-21
 * Last modified : 2012-Mar-21
 * 
 * Author        : Lara E.M.S. Roman
 * version       : 1.0.0
 * 
 * Description   : Un creador de icono de aplicación.
 * ====================================================================+
 */

/**
 * Un creador de icono de aplicación.
 * @author Lara E.M.S. Roman
 * @since 2012-Mar-21
 * @version 1.0.0
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
 * 
 *  Aperos-Lara:
 *    ninguno
 * 
 * --------------------------------------+
 * 
 * css file depends:
 *   jQuery:
 *     jquery-ui.css (custom)
 * 
 *   Aperos-Lara:
 *     jquery.lara.utility.appicon.css
 */

/*
 * v1.0.0 | 2012-Mar-21
 *     - Creación del widget.
 */

(function($, undefined) {
	$.widget("utility.appicon", {
		version: "1.0.0",
		
		options: {
			
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			
		},
		
		_init: function() {
			
		},
		
		refresh: function() {
			
		},
		
		destroy: function() {
			
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			this.refresh();
		},
		
		_setOption: function(key, value) {
			var self = this,
				o = self.options;
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);