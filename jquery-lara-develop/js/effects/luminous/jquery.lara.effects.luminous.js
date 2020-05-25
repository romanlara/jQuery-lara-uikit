/* ====================================================================+
 * File name      : jquery.lara.effects.luminous.js
 * Beginning      : 2012-Mar-01
 * Last modified  : 2012-Mar-01
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 0.0.0.0
 * version widget :   0.0.0
 * 
 * Description    : Un efecto de luminosidad realzada.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *    jquery.ui.widget.js
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
 *     jquery.lara.effects.luminous.css
 */

/*
 * v0.0.0 | 2012-Mar-01
 *     - Creación del widget.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 0000-none-00
 *     - widget effects luminous has been released.
 */

(function($, undefined) {
	$.widget("effects.luminous", {
		version: "1.0.0",
		
		_isWalk: false,
		_stop: false,
		
		options: {
			autoStart: true,
			colors: [],
			corner: null,
			speed: 800,
			delay: 500
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.element
				.attr("aria-effects", "luminous");
			
			this._createLuminous();
			
			this.index = 0;
			this.len = o.colors.length;
		},
		
		_init: function() {
			var self = this,
				o = self.options;
			
			if (o.autoStart) { 
				this._isWalk = true;
				this.refresh();
			}
		},
		
		_createLuminous: function() {
			var self = this,
				o = self.options;
			
			this.luminous = $("<div><div>")
				.addClass("ui-effects-luminous ui-widget ui-helper-reset")
				.insertAfter(this.element);
			
			(o.corner == null) ? 
			this.luminous.addClass("") :
			this.luminous.addClass(o.corner);
			
			this.luminous
				.css({
					"width": this.element.innerWidth(),
					"height": this.element.innerHeight(),
					"left": this.element.position().left,
					"top": this.element.position().top,
					"border-width": this.element.css("border-width"),
					"border-style": this.element.css("border-style"),
					"border-color": this.element.css("border-color"),
					//"background-color": "#5c90f3",
					"opacity": 0.4,
					"filter": "alpha(opacity=40)",
					"margin-top": this.element.css("margin-top"),
					"margin-bottom": this.element.css("margin-bottom"),
					"margin-left": this.element.css("margin-left"),
					"margin-right": this.element.css("margin-right")
				});
			
			this.luminous
				.bind('click.luminous', function() {
					if (o.disabled) { return; }
					self.stop();
				});
		},
		
		refresh: function() {
			var self = this,
				o = self.options;
			
			if (this.index == this.len) { this.index = 0; }
			
			this.luminous
				.animate({
					"background-color": o.colors[this.index]
				}, o.speed);
			
			this.timeout = setTimeout(function() {
				if (!self._stop) { 
					self.index++;
					self.refresh(); 
				}
			}, o.delay);
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			clearTimeout(this.timeout);
			this._isWalk = false;
			this._stop = true;
			this.luminous.unbind(".luminous")
			this.luminous.remove();
			this.element
				.removeAttr("aria-effects");
		},
		
		start: function() {
			if (!this._isWalk) {
				this._isWalk = true;
				this._stop = false;
				this._createLuminous();
				this.refresh(); 
			}
		},
		
		stop: function() {
			if (!this._stop) {
				clearTimeout(this.timeout);
				this._isWalk = false;
				this._stop = true;
				this.luminous.unbind(".luminous")
				this.luminous.remove();
				this.task();
			}
		},
		
		task: function(event) {
			var ui = {
				item: this.luminous,
			};
				
			this._trigger("task", event, ui);
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