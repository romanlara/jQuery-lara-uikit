/* ====================================================================+
 * File name     : jquery.lara.utility.colorpicker.js
 * Beginning     : none-none-00
 * Last modified : none-none-00
 * 
 * Author        : Lara E.M.S. Roman
 * version       : 0.0.0
 * 
 * Description   : Una utilidad para obtener colores.
 * ====================================================================+
 */

/**
 * Una utilidad para obtener colores.
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
 *     jquery.lara.utility.colorpicker.css
 */

(function($, undefined) {
	$.widget("utility.colorpicker", {
		version: "0.0.0",
		
		options: {
			
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.element
				.addClass("ui-utility-colorpicker ui-widget ui-widget-content ui-corner-all")
				.attr("role", "colorpicker");
			
			this.title = $("<div></div>")
				.addClass("ui-utility-colorpicker-titlebar ui-widget-header ui-corner-all")
				.html('<span class="ui-icon ui-icon-pencil"></span>'+this.element.attr("title"))
				.appendTo(this.element);
			
			this.sliderRed = $("<div></div>")
				.addClass("ui-utility-colorpicker-slider-red")
				.appendTo(this.element);
			this.sliderGreen = $("<div></div>")
				.addClass("ui-utility-colorpicker-slider-green")
				.appendTo(this.element);
			this.sliderBlue = $("<div></div>")
				.addClass("ui-utility-colorpicker-slider-blue")
				.appendTo(this.element);
				
			this.swatch = $("<div></div>")
				.addClass("ui-utility-colorpicker-swatch ui-widget-content ui-corner-all")
				.appendTo(this.element);
				
			this.sliderRed
				.slider({
					orientation: "horizontal",
					range: "min",
					max: 255,
					value: 127,
					slide: function() { self.refreshSwatch() },
					change: function() { self.refreshSwatch() }
				});
			this.sliderGreen
				.slider({
					orientation: "horizontal",
					range: "min",
					max: 255,
					value: 127,
					slide: function() { self.refreshSwatch() },
					change: function() { self.refreshSwatch() }
				});
			this.sliderBlue
				.slider({
					orientation: "horizontal",
					range: "min",
					max: 255,
					value: 127,
					slide: function() { self.refreshSwatch() },
					change: function() { self.refreshSwatch() }
				});
			this.sliderRed.slider("value", 255);
			this.sliderGreen.slider("value", 144);
			this.sliderBlue.slider("value", 60);
		},
		
		refresh: function() {
			
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			this.sliderRed
				.slider("destroy")
				.removeClass("ui-utility-colorpicker-slider-red")
				.remove();
			this.sliderGreen
				.slider("destroy")
				.removeClass("ui-utility-colorpicker-slider-green")
				.remove();
			this.sliderBlue
				.slider("destroy")
				.removeClass("ui-utility-colorpicker-slider-blue")
				.remove();
			this.swatch
				.removeClass("ui-utility-colorpicker-swatch ui-widget-content ui-corner-all")
				.remove();
			this.title
				.removeClass("ui-utility-colorpicker-titlebar ui-widget-header ui-corner-all")
				.remove();
			this.element
				.removeClass("ui-utility-colorpicker ui-widget ui-widget-content ui-corner-all")
				.removeAttr("role");
		},
		
		refreshSwatch: function() {
			var red = this.sliderRed.slider("value"),
				green = this.sliderGreen.slider("value"),
				blue = this.sliderBlue.slider("value"),
				hex = this.hexFromRGB(red, green, blue);
			
			this.swatch.css("background-color", "#" + hex);
		},
		
		hexFromRGB: function(r, g, b) {
			var hex = [
				r.toString(16),
				g.toString(16),
				b.toString(16)
			];
			
			$.each(hex, function(nr, val) {
				if (val.length === 1) {
					hex[nr] = "0" + val;
				}
			});
			
			return hex.join("").toUpperCase();
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