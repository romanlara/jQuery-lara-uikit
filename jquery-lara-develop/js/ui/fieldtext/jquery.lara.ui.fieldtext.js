/* ====================================================================+
 * File name      : jquery.lara.ui.fieldtext.js
 * Beginning      : 2011-Nov-22
 * Last modified  : 2012-Jun-18
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Descripcion    : Un campo de texto.
 * ====================================================================+
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
 *     jquery.lara.ui.fieldtext.css
 */

/*
 * v0.0.0 | 2011-Nov-22
 *     - Creación del widget.
 * 
 * v0.1.0 | 2011-Feb-08
 *   News:
 *     - Nueva funcionalidad, ahora es posible cambiar el texto a mayusculas.
 *   Patching:
 *     - none.
 * 
 * v0.1.0 | 2012-May-29
 *   News:
 *     - Nueva funcionalidad, ahora es posible establecer un maximo de caracteres.
 * 
 * v0.2.0 | 2012-Jun-18
 *   Patching:
 *     - Se ha mejorado la funcionalidad del maximo de caracteres.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget ui fieldtext has been released.
 */

(function($, undefined) {
	$.widget("ui.fieldtext", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		options: {
			colon: false,
			upperCase: false,
			maxlength: 0
		},
		
		_create: function() {
			var self = this,
				o = self.options,
				len,              // Para guardar el tamaño del texto.
				surplus;          // Para guardar el sobrante entre el tamaño del texto y el maximo.
				
			this.element
				.addClass("ui-fieldtext ui-widget-content ui-corner-all")
				.attr("role", "fieldtext");
			
			this._setLabel();
			this._setUpperCase();
			
			if (o.maxlength > 0) {
				this.element.attr("maxlength", o.maxlength);
				/*len = this.element.attr("value").length;
				surplus = (len - o.characterCounter);

				this.element
					.attr("value", this.element.attr("value").substring(0, (len - surplus)))
					.attr("aria-valuemin", len)
					.attr("aria-valuemax", o.characterCounter);*/
			}
			
			this.element
				.bind("focus.fieldtext", function(event) {
					if (o.disabled) { return; }
					// Para Safari es necesario un retraso.
					//setTimeout(function() { self.element.select(); }, 10);
					self.element.addClass("ui-state-focus");
					self.element.css("font-weight", "normal");
				})
				.bind("blur.fieldtext", function(event) {
					if (o.disabled) { return; }
					self.element.removeClass("ui-state-focus");
				});
				
			/*if (o.maxlength > 0) {
				this.element
					.bind("keyup.fieldtext", function(event) {
						if (o.disabled) { return; }
						event.preventDefault();
						event.stopPropagation();
						
						len = $(this).attr("value").length,
						surplus = (len - o.characterCounter);
							
						if ($(this).attr("value").length <= o.characterCounter) {
							self.element.attr("aria-valuemin", $(this).attr("value").length);
							$(this).attr("value", $(this).attr("value").substring(0, len - surplus));
						} else {
							$(this).attr("value", $(this).attr("value").substring(0, len - surplus));
						}
					});
			}*/
			
			this.refresh();
		},
		
		refresh: function() {
			var self = this,
				o = self.options
				len = this.element.attr("value").length,
				surplus = (len - o.maxlength);
			
			if (o.maxlength > 0) {
				if (this.element.attr("value").length > o.maxlength) {
					//this.element.text("aria-valuemin", this.element.attr("value").length);
					this.element.attr("value", this.element.attr("value").substring(0, len - surplus));
				}/* else {
					this.element.attr("value", this.element.attr("value").substring(0, len - surplus));
				}*/
			}
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			if (this.element.prev().is("label")) {
				this.label
					.removeClass("ui-widget ui-fieltext-label-after")
					.removeAttr("role");
			}
			
			if (this.options.upperCase) {
				this.element
					.removeAttr("style")
					.removeAttr("onblur");
			}
			
			this.element
				.unbind(".fieldtext")
				.removeClass("ui-fieldtext text ui-widget-content ui-corner-all")
				.removeAttr("role")
				.removeAttr("aria-valuemin")
				.removeAttr("aria-valuemax");
		},
		
		_setLabel: function() {
			var self = this,
				o = self.options;
			
			if (this.element.prev().is("label")) {
				this.label = this.element.prev();
				
				this.label
					.addClass("ui-fieldtext-label ui-widget")
					.attr("role", "label");
				
				if (o.colon) { this.label.addClass("ui-fieltext-label-after"); }
			}
		},
		
		_setUpperCase: function() {
			var self = this,
				o = self.options;
			
			if (o.upperCase) {
				this.element
					.attr("style", "text-transform:uppercase;")
					.attr("onblur", "javascript:this.value=this.value.toUpperCase();");
			} else {
				this.element
					.removeAttr("style")
					.removeAttr("onblur");
			}
		},
		
		focus: function() {
			this.element.focus();
		},
		
		clean: function() {
			this.element.val("");
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
		},
		
		_setOption: function(key, value) {
			var self = this,
				o = self.options;
			
			switch (key) {
				case "disabled":
					if (value) {
						this.element.attr("disabled", "disabled");
					} else {
						this.element.removeAttr("disabled");
					}
					break;
				case "upperCase":
					this._setUpperCase();
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);
