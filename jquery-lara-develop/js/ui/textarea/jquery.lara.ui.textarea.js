/* ====================================================================+
 * File name      : jquery.lara.ui.textarea.js
 * Beginning      : 2011-Nov-22
 * Last modified  : 2012-May-29
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un area de texto.
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
 *     jquery.lara.ui.textarea.css
 */

/*
 * v0.0.0 | 2011-Nov-22
 *     - Creación del widget.
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
 *     - widget ui textarea has been released.
 */

(function($, undefined) {
	$.widget("ui.textarea", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		options: {
			height: null,
			width: null,
			colon: false,
			upperCase: false,
			characterCounter: 0
		},
		
		_create: function() {
			var self = this,
				o = self.options,
				len,              // Para guardar el tamaño del texto.
				surplus;          // Para guardar el sobrante entre el tamaño del texto y el maximo.
				
			this.element
				.addClass("ui-textarea text ui-widget-content ui-corner-all")
				.attr("role", "textarea")
				.css({
					height: o.height,
					width: o.width
				});
			
			this._setLabel();
			
			if (o.characterCounter > 0) {
				len = this.element.attr("value").length;
				surplus = (len - o.characterCounter);
				
				this.element
					.attr("value", this.element.attr("value").substring(0, (len - surplus)))
					.attr("aria-valuemin", len)
					.attr("aria-valuemax", o.characterCounter);
			}
			
			this._setUpperCase();
			
			this.element
				.bind("focus.textarea", function(event) {
					if (o.disabled) { return; }
					// Para Safari es necesario un retraso.
					setTimeout(function() { self.element.select(); }, 10);
				});
			
			if (o.characterCounter > 0) {
				this.element
					.bind("keyup.textarea", function(event) {
						if (o.disabled) { return; }
						len = $(this).attr("value").length,
						surplus = (len - o.characterCounter);
							
						if ($(this).attr("value").length <= o.characterCounter) {
							self.element.attr("aria-valuemin", $(this).attr("value").length);
							$(this).attr("value", $(this).attr("value").substring(0, len - surplus));
						} else {
							$(this).attr("value", $(this).attr("value").substring(0, len - surplus));
						}
					});
			}
		},
		
		_refresh: function() {
			var self = this,
				o = self.options,
				len = this.element.attr("value").length,
				surplus = (len - o.characterCounter);
			
			if (o.characterCounter > 0) {
				if (this.element.attr("value").length <= o.characterCounter) {
					this.characterCounter.text(this.element.attr("value").length);
					this.element.attr("value", this.element.attr("value").substring(0, len - surplus));
				} else {
					this.element.attr("value", this.element.attr("value").substring(0, len - surplus));
				}
			}
			/*
			this.element
				.css({
					height: this.options.height,
					width: this.options.width
				});*/
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			if (this.element.parent().prev().is("label")) {
				this.label
					.removeClass("ui-widget ui-textarea-label-after")
					.removeAttr("role");
			}
			
			if (this.options.upperCase) {
				this.element
					.removeAttr("style")
					.removeAttr("onblur");
			}
			
			this.element
				.unbind(".textarea")
				.removeClass("ui-textarea text ui-widget-content ui-corner-all")
				.removeAttr("role")
				.removeAttr("aria-valuemin")
				.removeAttr("aria-valuemax");;
		},
		
		_setLabel: function() {
			var self = this,
				o = self.options;
			
			if (this.element.prev().is("label")) {
				this.label = this.element.prev();
				
				this.label
					.addClass("ui-textarea-label ui-widget")
					.attr("role", "label");
				
				if (o.colon) { this.label.addClass("ui-textarea-label-after"); }
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
			//this.refresh();
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
