/* ====================================================================+
 * File name      : jquery.lara.effects.jump.js
 * Beginning      : none-none-00
 * Last modified  : none-none-00
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 0.0.0.0
 * version widget :   0.0.0
 * 
 * Description    : Un efecto salto.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.effects.core.js
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
 *     jquery.lara.effects.jump.css
 */

/*
 * v0.0.0 | 2012-Mar-01
 *     - Creación del widget.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 0000-none-00
 *     - widget effects jump has been released.
 */

(function($, undefined) {
	$.widget("effects.jump", {
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