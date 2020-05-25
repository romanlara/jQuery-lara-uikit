/* ====================================================================+
 * File name     : jquery.lara.utility.calculator.js
 * Beginning     : none-none-00
 * Last modified : none-none-00
 * 
 * Author        : Lara E.M.S. Roman
 * version       : 0.0.0
 * 
 * Description   : Una calculadora.
 * ====================================================================+
 */

/**
 * Una calculadora
 * @author Lara E.M.S. Roman
 * @since none-none-00
 * @version 0.0.0
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
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
 *     jquery.lara.utility.calculator.css
 */

(function($, undefined) {
	$.widget("utility.calculator", {
		version: "0.0.0",
		
		options: {
			
		},
		
		_create: function() {
			
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
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);