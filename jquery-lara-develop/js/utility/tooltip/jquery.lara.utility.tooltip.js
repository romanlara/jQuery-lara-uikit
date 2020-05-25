/* ====================================================================+
 * File name      : jquery.lara.utility.tooltip.js
 * Beginning      : 2011-Feb-07
 * Last modified  : 2012-Jul-26
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Una leyenda que da una explicación de un elemento.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
 *    jquery.ui.effects.*.js
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
 *     jquery.lara.utility.tooltip.css
 */

/*
 * v0.0.0 | 2011-Feb-07
 *     - Creación del widget
 * 
 * v0.1.0 | 2011-Feb-08
 *   News:
 *     - Nueva funcionalida, ahora se puede usar el evento 'mouse' para que la leyenda aparesca 
 *       a lado del mouse y lo siga si éste se mueve.
 *   Patching:
 *     - Se mejoró el sistema de aparición de la leyenda, cambiando en el evento 'mouseenter'
 *       el setTimeout() por un setInterval(), para no abrir el legend hasta que pase un tiempo
 *       'delayInOpening' para hacerlo. Si el mouse se saliese del elemento, entonces el setInterval()
 *       es borrado, para empezar de nuevo, cuando el mouse este dentro otra vez. 
 *       Así se corrige la molestia de que, con un solo roce, aparesca la leyenda.
 * 
 * v0.2.0 | 2012-Jul-25
 *   News:
 *     - Nueva posibilidad de incluirle al legend un triangulo que indica de quien pertenece esa leyenda.
 *   Patching:
 *     - none.
 * 
 * v0.3.0 | 2012-Jul-26
 *   News:
 *     - Nuevo evento preopen(), se pueden hacer otras tareas antes de abrirse la leyenda.
 *     - Nuevo evento preclose(), se pueden hacer otras tareas antes de cerrarse la leyenda.
 *   Patching:
 *     - none.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget utility legend has been released.
 */

(function($, undefined) {
	$.widget("utility.tooltip", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		options: {
			width: null,           // Para distribuir mejor la lectura si hay mucho texto.
			position: {
				my: "left center",
				at: "right center"
			},
			triangle: {
				position: "left",  // Para colocar el triangulo en uno de los lados de la leyenda, no en esquinas.
				colorBorder: "#9BCBED", // Color que deba tener el borde del triangulo.
				colorContent: "#FEFEFE" // Color que deba tener el interior del triangulo.
			},
			mouse: false,          // Si se quiere que la leyenda aparesca alado del mouse.
			                       // Si es 'true' no se necesita especificar la opción 'position'.
			mouseleave: true,      // Si es 'true' permite que se cierre la leyenda después de que el mouse
			                       // dejó de estar encima. Si es 'false' la leyenda se mantiene abierta 
			                       // hasta que se cumpla superiodo de duración.
			
			message: null,         // Un mensaje que deba mostrar el elemento puede ser texto, una imagen o algo más sofisticado. 
			
			delayInOpening: 100,   // Un tiempo de retrazo antes de aparecer.
			openDuration: null,    // Un tiempo de duración abierto para luego cerrar.
			show: null,            // El tipo de efecto al mostrarse.
			hide: null             // El tipo de efecto al ocultarse.
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.timer_counter = 0; // Un contador para activar la legenda que subirá de 100 en 100.
			
			this.element
				.attr("aria-has-tooltip", "false");
			
			this.element
				.bind("mouseenter.tooltip", function(event) {
					if (o.disabled) { return; }
					
					if (self.element.attr("aria-has-tooltip") === "false") {
						self.timerDelay = setInterval(function() {
							if (self.timer_counter >= o.delayInOpening) {
								clearInterval(self.timerDelay);
								self.timer_counter = 0;
								self._open(event); //$(event ? event : this.element)
							} else {
								self.timer_counter += 100;
							}
						}, 100);
					}
				})
				.bind("mouseleave.tooltip", function(event) {
					if (o.disabled) { return; }
					
					if (self.element.attr("aria-has-tooltip") === "true") {
						if (!o.mouseleave) { return; }
						self._close();
					} else {
						clearInterval(self.timerDelay);
						self.timer_counter = 0;
					}
				})
				.bind("mousemove.tooltip", function(event) {
					if (o.disabled) { return; }
					
					if (self.element.attr("aria-has-tooltip") === "true") {
						self._moveTooltip(event);
					}
				});
		},
		
		_tooltip: function() {
			var self = this,
				o = self.options;
			
			this.tooltip = $('<div></div>')
				.addClass("ui-utility-tooltip ui-widget ui-widget-content ui-corner-all")
				.attr("role", "tip")
				.css("width", o.width)
				.appendTo(document.body)
				.hide();
			
			this.wrap = $('<div></div>')
				.addClass("ui-utility-tooltip-wrap")
				.appendTo(this.tooltip);
			
			this.content = $('<div></div>')
				.addClass("ui-utility-tooltip-content")
				.appendTo(this.wrap);
			
			this.message(o.message);
			
			if (!o.mouse) {
				this.triangle = $("<div></div>")
					.addClass("ui-utility-tooltip-triangle")
					.appendTo(this.tooltip);
				this.triangle2 = $("<div></div>")
					.addClass("ui-utility-tooltip-triangle-content")
					.appendTo(this.tooltip);
			
				this._detectPositionTriangle();
			}
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			clearTimeout(this.timerDelay);
			
			this.element
				.removeAttr("aria-has-tooltip")
				.unbind(".tooltip");
		},
		
		_remove: function() {
			clearTimeout(this.timerClose);
			
			this.element
				.attr("aria-has-tooltip", "false");
			
			this.content.remove();
			if (!this.options.mouse) { this.triangle.remove(); this.triangle2.remove(); }
			this.tooltip.remove();
		},
		
		_detectPositionTriangle: function() {
			var self = this,
				o = self.options,
				posTop_1 = 0,
				posTop_2 = 0;
			
			if (o.triangle.position === "top") {
				this.triangle
					.css("border-color", "transparent transparent "+ o.triangle.colorBorder +" transparent")
					.css({ left: -1, top: -16 })
					.position($.extend({ of: this.tooltip }, { my: "center top", at: "center top" }));
				this.triangle2
					.css("border-color", "transparent transparent "+ o.triangle.colorContent +" transparent")
					.css({ left: -1, top: -12 })
					.position($.extend({ of: this.tooltip }, { my: "center top", at: "center top" }));
			} else if (o.triangle.position === "bottom") {
				posTop_1 = ($.browser.mozilla) ? 13 : 11;
				posTop_2 = ($.browser.mozilla) ? 9 : 7;
				this.triangle
					.css("border-color", o.triangle.colorBorder + " transparent transparent transparent")
					.css({ left: -1, top: posTop_1 })
					.position($.extend({ of: this.tooltip }, { my: "center bottom", at: "center bottom" }));
				this.triangle2
					.css("border-color", o.triangle.colorContent + " transparent transparent transparent")
					.css({ left: -1, top: posTop_2 })
					.position($.extend({ of: this.tooltip }, { my: "center bottom", at: "center bottom" }));
			} else if (o.triangle.position === "left") {
				this.triangle
					.css("border-color", "transparent "+ o.triangle.colorBorder +" transparent transparent")
					.css({ left: -16, top: -2 })
					.position($.extend({ of: this.tooltip }, { my: "left center", at: "left center" }));
				this.triangle2
					.css("border-color", "transparent "+ o.triangle.colorContent +" transparent transparent")
					.css({ left: -12, top: -2 })
					.position($.extend({ of: this.tooltip }, { my: "left center", at: "left center" }));
			} else if (o.triangle.position === "right") {
				posTop_1 = ($.browser.mozilla) ? -1 : -2;
				posTop_2 = ($.browser.mozilla) ? -1 : -2;
				this.triangle
					.css("border-color", "transparent transparent transparent " + o.triangle.colorBorder)
					.css({ left: 12, top: posTop_1 })
					.position($.extend({ of: this.tooltip }, { my: "right center", at: "right center" }));
				this.triangle2
					.css("border-color", "transparent transparent transparent " + o.triangle.colorContent)
					.css({ left: 8, top: posTop_2 })
					.position($.extend({ of: this.tooltip }, { my: "right center", at: "right center" }));
			}
		},
		
		_moveTooltip: function(e) {
			if (this.options.mouse) {
				this.tooltip
					.css({
						left: e.pageX,
						top: e.pageY + 18
					});
			}
		},
		
		_open: function(e) {
			var self = this,
				o = self.options;
			
			if (this.element.attr("aria-has-tooltip") === "false") {
				this._tooltip();
			}
			
			this.preopen(e);
			
			if (o.show !== null) {
				if (o.mouse) {
					this.tooltip
						.css({ left: e.pageX, top: e.pageY + 18 })
						.show(o.show);
				} else {
					this.tooltip
						.css({ left: 0, top: 0 })
						.position($.extend({ of: e.target }, o.position))
						.show(o.show);
				}
			} else {
				if (o.mouse) {
					this.tooltip
						.css({ left: e.pageX, top: e.pageY + 18 })
						.show();
				} else {
					this.tooltip
						.css({ left: 0, top: 0 })
						.position($.extend({ of: e.target }, o.position))
						.show();
				}
			}
			
			this.element.attr("aria-has-tooltip", "true");
			
			if (o.openDuration !== null) {
				this.timerClose = setTimeout(function() {
					self._close();
				}, o.openDuration);
			}
		},
		
		_close: function() {
			var self = this,
				o = self.options;
			
			this.preclose();
			
			if (o.hide !== null) {
				this.tooltip.hide(o.hide, function() {
					self._remove();
				});
			} else {
				this.tooltip.hide();
				this._remove();
			}
		},
		
		message: function(message) {
			this.content.append(message);
		},
		
		disable: function() {
			
		},
		
		enable: function() {
			
		},
		
		preopen: function(event) {
			var ui = {
				item: this.element,
				tooltip: this.tooltip,
				offsetTooltip: this.tooltip.offset(),
				triangleBorder: this.triangle,
				triangleContent: this.triangle2,
				offsetTB: this.triangle.offset(),
				offsetTC: this.triangle2.offset()
			};
				
			this._trigger("preopen", event, ui);
		},
		
		preclose: function(event) {
			var ui = {
				item: this.element,
				tooltip: this.tooltip,
				offsetTooltip: this.tooltip.offset(),
				triangleBorder: this.triangle,
				triangleContent: this.triangle2,
				offsetTB: this.triangle.offset(),
				offsetTC: this.triangle2.offset()
			};
				
			this._trigger("preclose", event, ui);
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
		},
		
		_setOption: function(key, value) {
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);
