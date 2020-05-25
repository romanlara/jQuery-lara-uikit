/* ====================================================================+
 * File name      : jquery.lara.ui.checkbox.js
 * Beginning      : 2011-Sep-26
 * Last modified  : 2012-Jun-06
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un boton de comfirmacion personalizado.
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
 *     jquery.lara.ui.checkbox.css
 */

/*
 * v0.0.0 | 2011-Sep-26
 *     - Creación del widget.
 * 
 * v0.0.1 | 2011-Sep-27
 *   News:
 *     - Se cambio el nombre de la variable 'tamLeyenda' a 'tamTextoLeyenda', en options.
 *   Patching:
 *     - Se eliminó la variable 'textoColor', en options.
 * 
 * v0.1.0 | 2011-Sep-28
 *   News:
 *     - Opción de elegir que la variable 'contenidoWidget' obtenga la apariencia que jQuery ofrece en el widget.
 *     - Opción de introducir un color para el borde del elemento 'fieldset', a travéz de la variable 'colorBordeLeyenda'. (#RRGGBB)
 *   Patching:
 *     - none.
 * 
 * v0.2.0 | 2011-Oct-02
 *   New:
 *     - Nueva estructura.
 *   Patching:
 *     - Se modifico la apariencia y su funcionalidad respecto a ésta, por tanto también su estructura.
 * 
 * v0.3.0 | 2011-Oct-14
 *   News:
 *     - Nueva estructura.
 *     - Ahora con la nueva estructura es posible agregar o eliminar elementos durante la ejecución.
 *   Patching:
 *     - Se modifico toda la estructura, esta vez siguiendo las reglas de Widget Factory.
 * 
 * v0.4.0 | 2011-Nov-01
 *   News:
 *     - Nueva estructura.
 *   Patching:
 *     - Se transformo por completo el widget, para una mejor compatibilidad con otros widgets como el menu.
 *     - Se cambio el nombre del widget para mayor comodidad.
 * 
 * v0.5.0 | 2011-Nov-07
 *   News:
 *     - Se agrego la funcionalidad 'textoLlamativo', pinta de color el texto cuando el mouse esté encima o está seleccionado el elemento.
 *   Patching:
 *     - none.
 * 
 * v0.6.0 | 2011-Nov-17
 *   News:
 *     - none.
 *   Patching:
 *     - Se eliminó la envoltura igu-checkbox para que el input sea la interfaz y sea más fácil de consultar.
 * 
 * v0.7.0 | 2011-Dic.07
 *   New:
 *     - Los siguientes métodos .elegir(), ._elegir(), .seleccionar(), ._seleccionar() y ._quitarSeleccion(),
 *       cambiaron de nombre a: .toggleSelect(), ._toggleSelect(), .select(), ._select() y ._unselect().
 *       Esto fue así para un mejor manejo de los métodos.
 *   Patching:
 *     - Se mejoró el sistema de inhibición del elemento.
 *     - Se agregaron dos métodos de sobreescritura .selected() & .unselected().
 *     - Se agregaron dos métodos de invocación .select() & .unselect().
 *     - Se mejoraron los métodos ._select() & ._unselect() para asegurar la selección y la no 
 *       selección del elemento. Esto hace que el comportamiento de este widget sea más similar
 *       a la de un checkbox original.
 * 
 * v0.7.1 | 2011-Dic-09
 *   News:
 *     - none.
 *   Patching:
 *     - Se cambiaron varios nombres internos del castellano al ingles, esto es para abarcar mayor campo.
 * 
 * v0.7.2 | 2012-Feb-08
 *   News:
 *     - none.
 *   Patching:
 *     - Se cambio el color de estado en focus de la caja por uno más apropiado a los distitos customs.
 * 
 * v0.8.0 | 2012-Jun-06
 *   News:
 *     - Ahora es posible seleccionar el checkbox con el teclado.
 *   patching:
 *     - none.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget ui checkbox has been released.
 */

(function($) {
	$.widget("ui.checkbox", {
		versionLibrary: "1.0.0",
		version: "1.0.0", // La version de la interfaz gráfica.
		
		options: {
			glowingtext: false,    // Para resaltar el texto.
			icon: 'ui-icon-check', // Para utilisar el icono que guste el usuario.
			text: true,            // Para ocultar o mostrar el texto, en false es usado para tablas.
			box: true              // Para ocultar o mostrar la caja, en false es usado para menues.
		},
		
		/**
		 * Metodo privado automatico; el consturctor del widget, que solo
		 * se ejecuta una ves por instancia. Si se destruye el widget, solo
		 * llame a este metodo.
		 */
		_create: function() {
			var self = this,
				o = self.options;
			
			//this.element.hide();
			
			this.element
				.addClass("ui-checkbox-input")
				.next()
					.addClass("ui-checkbox")
					.wrapInner('<span class="ui-checkbox-text" />')
					.find(".ui-checkbox-text")
						.wrap('<span class="ui-checkbox-button ui-widget ui-corner-all ui-helper-reset" />')
						.end()
					.find(".ui-checkbox-button")
						.attr({
							"aria-active": "false",
							"aria-selected": "false"
						})
						//.prepend('<span class="ui-icon ' + o.icon + '" style="display: none;" aria-hide="true" />')
						.prepend('<span class="ui-checkbox-box ui-widget-content ui-corner-all ui-icon-check" />');
			
			this.element
				.bind("focus.checkbox", function(event) {
					if (o.disabled) { return; }
					self.focus();
				})
				.bind("blur.checkbox", function(event) {
					if (o.disabled) { return; }
					self.blur();
				})
				.bind("keydown.checkbox", function(event) {
					if (o.disabled) { return; }
					
					if (event.keyCode == $.ui.keyCode.ENTER) {
						event.preventDefault();
						self._toggleSelect();
					}
				});
				
			this.element
				.next()
				.disableSelection()
				.bind("focus.checkbox", function(event) {
					if (o.disabled) { return; }
					self.focus();
				})
				.bind("blur.checkbox", function(event) {
					if (o.disabled) { return; }
					self.blur();
				})
				.bind("mouseover.checkbox", function(event) {
					if (o.disabled) { return; }
					self.focus();
				})
				.bind("mouseout.checkbox", function(event) {
					if (o.disabled) { return; }
					self.blur();
				})
				.bind("click.checkbox", function(event) {
					if (o.disabled) { return; }
					self._toggleSelect();
					event.stopPropagation();
					event.preventDefault();
				});
			
			this._refresh();
		},
		
		/**
		 * Metodo privado; que, con cualquier cambio en las opciones
		 * durante la ejecución, el widget se actualiza.
		 */
		_refresh: function() {
			if (!this.options.text) {
				this.element
					.next()
					.children()
					.find(".ui-checkbox-text")
						.hide();
			} else {
				this.element
					.next()
					.children()
					.find(".ui-checkbox-text")
						.show();
			}
			
			if (!this.options.box) {
				this.element
					.hide()
					.next()
					.children()
					.find(".ui-checkbox-box")
						.removeClass("ui-widget-content");
			} else {
				this.element
					.show()
					.next()
					.children()
					.find(".ui-checkbox-box")
						.addClass("ui-widget-content");
			}
			
			if (this.element.attr("checked")) {
				this.element
					.next()
					.children()
					.attr("aria-selected", "true");
					
				this.element
					.attr("checked", 1);
				
				this.element
					.next()
					.children()
					.find(".ui-icon-check")
						//.show()
						.addClass("ui-icon")
						.attr("aria-hide", "false");
			
				if (this.options.glowingtext) {		
					this.element
						.next()
						.children()
						.find(".ui-checkbox-text")
							.addClass("ui-state-active");
				}
			} else {
				this.element
					.next()
					.children()
					.attr("aria-selected", "false");
					
				this.element
					.removeAttr("checked");
			
				this.element
					.next()
					.children()
					.find(".ui-icon-check")
						//.hide()
						.removeClass("ui-icon")
						.attr("aria-hide", "true");
			
				if (this.options.glowingtext) {
					this.element
						.next()
						.children()
						.find(".ui-checkbox-text")
							.removeClass("ui-state-active");
				}
			}
			
			this._trigger("change");
		},
		
		/**
		 * Metodo privado; que destruye el widget.
		 */
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			// Mostramos el input.
			this.element
				.show();
			
			// Tomamos el texto y lo colocamos en el label,
			// para luego, eliminar el elemento .igu-checkbox-texto.
			this.element
				.removeClass("ui-checkbox-input")
				.unbind(".checkbox")
				.next()
				.unbind(".checkbox")
				.enableSelection()
				.removeClass("ui-checkbox")
				.html(this.element.next().find(".ui-checkbox-text").html())
				.children()
					.remove();
			// Con esto optenemos la version original html.
		},
		
		widget: function() {
			return this.element;
		},
		
		/**
		 * Metodo publico; para colocarle la apariencia de foco al widget.
		 */
		focus: function() {
			//this.element.next().children().find(".ui-checkbox-box").addClass("ui-state-highlight");
			if (this.options.glowingtext) {
				this.element.next().children().find(".ui-checkbox-text").addClass("ui-state-active");
			}
			//this.element.next().children().find(".igu-checkbox-texto").css({ 'font-weight': 'bold' });
			this.element.next().children().attr("aria-active", "true");
		},
		
		/**
		 * Metodo publico; para quitarle la apareincia de foco al widget.
		 */
		blur: function() {
			//this.element.next().children().find(".ui-checkbox-box").removeClass("ui-state-highlight");
			
			// Si el elemento no esta seleccionado, removemos el estado activo.
			if (this.options.glowingtext && this.element.next().children().attr("aria-selected") == "false") {
				this.element.next().children().find(".ui-checkbox-text").removeClass("ui-state-active");
			}
			
			//this.element.next().children().find(".igu-checkbox-texto").css({ 'font-weight': 'normal' });
			this.element.next().children().attr("aria-active", "false");
		},
		
		/**
		 * Metodo publico para el usuario programador
		 * en seleccionar el checkbox y deseleccionarlo, 
		 * funciona como una palanca(toggle). 
		 */
		toggleSelect: function() {
			if (this.element.attr("checked")) {
				this._unselect();
				//this.element.removeAttr("checked");
			} else {
				this._select();
				//this.element.attr("checked", 1);
			}
		},
		
		/**
		 * Metodo privado para uso interno, ya que, 
		 * el label selecciona y quita la seleccion 
		 * del input automaticamente.
		 */
		_toggleSelect: function() {
			if (this.element.attr("checked")) {
				this._unselect();
			} else {
				this._select();
			}
		},
		
		/**
		 * Metodo privado; como el label, al darle click, el input es seleccionado
		 * no es necesario hacerlo nosotros, pero si en cambiar los estados y apariencias
		 * a los elementos que hemos creado.
		 */
		_select: function() {
			if (!this.element.is(":checked")) {
				this.element
					.next()
					.children()
					.attr("aria-selected", "true");
					
				this.element
					.attr("checked", 1);
				
				this.element
					.next()
					.children()
					.find(".ui-icon-check")
						//.show()
						.addClass("ui-icon")
						.attr("aria-hide", "false");
			
				if (this.options.glowingtext) {		
					this.element
						.next()
						.children()
						.find(".ui-checkbox-text")
							.addClass("ui-state-active");
				}
				
				this.selected();
			}
		},
		
		/**
		 * Metodo privado; como el label, al darle click, el input es deseleccionado
		 * no es necesario hacerlo nosotros, pero si en cambiar los estados y apariencias
		 * a los elementos que hemos creado.
		 */
		_unselect: function() {
			if (this.element.is(":checked")) {
				this.element
					.next()
					.children()
					.attr("aria-selected", "false");
					
				this.element
					.removeAttr("checked");
			
				this.element
					.next()
					.children()
					.find(".ui-icon-check")
						//.hide()
						.removeClass("ui-icon")
						.attr("aria-hide", "true");
			
				if (this.options.glowingtext) {
					this.element
						.next()
						.children()
						.find(".ui-checkbox-text")
							.removeClass("ui-state-active");
				}
			
				this.unselected();
			}
		},
		
		select: function() {
			this._select();
		},
		
		unselect: function() {
			this._unselect();
		},
		
		/**
		 * Metodo publico; se ejecuta cuando el elemento es seleccionado.
		 */
		selected: function(event) {
			var ui = {
				item: this.element
			};
				
			this._trigger("selected", event, ui);
		},
		
		/**
		 * Metodo publico; se ejecuta cuando el elemento deja de estar seleccionado.
		 */
		unselected: function(event) {
			var ui = {
				item: this.element
			};
				
			this._trigger("unselected", event, ui);
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			this._refresh();
		},
		
		_setOption: function(key, value) {
			switch (key) {
				case "disabled":
					if (value) {
						this.element
							.attr("disabled", "disabled")
							.next()
							.addClass("ui-state-disabled")
							.attr("aria-disabled", "true");
					} else {
						this.element
							.removeAttr("disabled")
							.next()
							.removeClass("ui-state-disabled")
							.attr("aria-disabled", "false");
					}
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);
