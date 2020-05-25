/* ====================================================================+
 * File name      : jquery.lara.ui.radiobutton.js
 * Beginning      : 2011-Sep-26
 * Last modified  : 2011-Jun-08
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un boton de radio personalizado.
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
 *     jquery.lara.ui.radiobutton.css
 */

/*
 * v0.0.0 | 2011-Sep-26
 *     - Creación del widget.
 * 
 * v0.0.1 | 2011-Sep-27
 *   News:
 *     - Cambio del nombre de la variable 'tamLeyenda' a 'tamTextoLeyenda', en options.
 *     - Se eliminó la variable 'textoColor', en options.
 *   Patching:
 *     - none.
 * 
 * v0.1.0 | 2011-Sep-28
 *   News:
 *     - none.
 *   Patching:
 *     - Opción de elegir que la variable 'contenidoWidget' obtenda la apariencia que jQuery ofrece en el widget.
 *     - Opción de introducir un color para el borde del elemento 'fieldset', a travéz de la variable 'colorBordeLeyenda'. (#RRGGBB)
 * 
 * v0.2.0 | 2011-Oct-02
 *   News:
 *     - none.
 *   Patching:
 *     - Se modifico la apariencia y su funcionalidad respecto a ésta, por tanto también su estructura.
 * 
 * v0.3.0 | 2011-Oct-14
 *   News:
 *     - Ahora con la nueva estructura es posible agregar o eliminar elementos durante la ejecución.
 *   Patching:
 *     - Se modifico toda la estructura, esta vez siguiendo las reglas de Widget Factory.
 * 
 * v0.4.0 | 2011-Nov-01
 *   News:
 *     - Se transformo por completo el widget, para una mejor compatibilidad con otros.
 *     - Se cambio el nombre del widget para mayor comodidad.
 *   Patching:
 *     - none.
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
 *   News:
 *     - Se agregaron dos métodos de sobreescritura .selected() & .unselected().
 *     - Se agregaron dos métodos de invocación .select() & .unselect().
 *   Patching:
 *     - Se mejoró el sistema de inhibición del elemento.
 *     - Los siguientes métodos .seleccionar(), ._elegir(), ._seleccionar() y ._quitarSeleccion(),
 *       cambiaron de nombre a: .select(), ._preselect(), ._select() y ._unselect().
 *       Esto fue así para un mejor manejo de los métodos.
 *     - Se mejoraron los métodos ._select() & ._unselect() para asegurar la selección y la no 
 *       selección del elemento. Esto hace que el comportamiento de este widget sea más similar
 *       a la de un radiobutton original.
 * 
 * v0.7.1 | 2011-Dic-09
 *   News:
 *     - none.
 *   Patching:
 *     - Se cambiaron varios nombres internos del castellano al ingles, esto es para abarcar mayor campo.
 * 
 * v0.7.2 | 2011-Feb-08
 *   News:
 *     - none.
 *   Patching:
 *     - Se cambio el color de estado en focus de la caja por uno más apropiado a los distinos customs.
 * 
 * v0.8.0 | 2012-Jun-06
 *   News:
 *     - Ahora es posible seleccionar el checkbox con el teclado.
 *   patching:
 *     - none.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget ui radiobutton has been released.
 */

(function($) {
	$.widget("ui.radiobutton", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		options: {
			glowingtext: false,     // Para resaltar el texto.
			icon: 'ui-icon-bullet', // Para utilisar el icono que guste el usuario.
			text: true,             // Para ocultar o mostrar el texto, en false es usado para tablas.
			box: true               // Para ocultar o mostrar la caja, en false es usado para menues.
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			//this.element.hide();
			
			this.element
				.addClass("ui-radiobutton-input")
				.next()
					.addClass("ui-radiobutton")
					.wrapInner('<span class="ui-radiobutton-text" />')
					.find(".ui-radiobutton-text")
						.wrap('<span class="ui-radiobutton-button ui-widget ui-corner-all ui-helper-reset" />')
						.end()
					.find(".ui-radiobutton-button")
						.attr({
							"aria-active": "false",
							"aria-selected": "false"
						})
						//.prepend('<span class="ui-icon ' + o.icon + '" style="display: none;" aria-hide="true" />')
						.prepend('<span class="ui-radiobutton-box ui-widget-content ui-icon-bullet" />');
			
			this.element
				.bind("focus.radiobutton", function(event) {
					if (o.disabled) { return; }
					self.focus();
				})
				.bind("blur.radiobutton", function(event) {
					if (o.disabled) { return; }
					self.blur();
				})
				.bind("keydown.radiobutton", function(event) {
					if (o.disabled) { return; }
					
					if (event.keyCode == $.ui.keyCode.ENTER) {
						event.preventDefault();
						self._preselect();
					}
				});
			
			this.element
				.next()
				.disableSelection()
				.bind("mouseenter.radiobutton", function(event) {
					if (o.disabled) { return; }
					self.focus();
				})
				.bind("mouseleave.radiobutton", function(event) {
					if (o.disabled) { return; }
					self.blur();
				})
				.bind("click.radiobutton", function(event) {
					if (o.disabled) { return; }
					self._preselect();
					event.stopPropagation();
					event.preventDefault();
				});
			
			this._refresh();
		},
		
		_refresh: function() {
			if (!this.options.text) {
				this.element
					.next()
					.children()
					.find(".ui-radiobutton-text")
						.hide();
			} else {
				this.element
					.next()
					.children()
					.find(".ui-radiobutton-text")
						.show();
			}
			
			if (!this.options.box) {
				this.element
					.hide()
					.next()
					.children()
					.find(".ui-radiobutton-box")
						.removeClass("ui-widget-content");
			} else {
				this.element
					.show()
					.next()
					.children()
					.find(".ui-radiobutton-box")
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
					.find(".ui-icon-bullet")
						//.show()
						.addClass("ui-icon")
						.attr("aria-hide", "false");
				
				if (this.options.glowingtext) {	
					this.element
						.next()
						.children()
							.find(".ui-radiobutton-text")
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
					.find(".ui-icon-bullet")
						//.hide()
						.removeClass("ui-icon")
						.attr("aria-hide", "true");
				
				if (this.options.glowingtext) {
					this.element
						.next()
						.children()
						.find(".ui-radiobutton-text")
							.removeClass("ui-state-active");
				}
			}
			
			this._trigger("change");
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			// Mostramos el input.
			this.element
				.show();
			
			// Tomamos el texto y lo colocamos en el label,
			// para luego, eliminar el elemento .igu-checkbox-texto.
			this.element
				.removeClass("ui-radiobutton-input")
				.unbind(".radiobutton")
				.next()
				.unbind(".radiobutton")
				.enableSelection()
				.removeClass("ui-radiobutton")
				.html(this.element.next().find(".ui-radiobutton-text").html())
				.children()
					.remove();
			// Con esto optenemos la version original html que creó el diseñador.
		},
		
		widget: function() {
			return this.element;
		},
		
		/**
		 * Metodo publico; para colocarle la apariencia de foco al widget.
		 */
		focus: function() {
			//this.element.next().children().find(".ui-radiobutton-box").addClass("ui-state-highlight");
			if (this.options.glowingtext) {
				this.element.next().children().find(".ui-radiobutton-text").addClass("ui-state-active");
			}
			//this.element.next().children().find(".igu-radiobutton-texto").css({ 'font-weight': 'bold' });
			this.element.next().children().attr("aria-active", "true");
		},
		
		/**
		 * Metodo publico; para quitarle la apareincia de foco al widget.
		 */
		blur: function() {
			//this.element.next().children().find(".ui-radiobutton-box").removeClass("ui-state-highlight");
			
			// Si el elemento no esta seleccionado, removemos el estado activo.
			if (this.options.glowingtext && this.element.next().children().attr("aria-selected") == "false") {
				this.element.next().children().find(".ui-radiobutton-text").removeClass("ui-state-active");
			}
			
			//this.element.next().children().find(".igu-radiobutton-texto").css({ 'font-weight': 'normal' });
			this.element.next().children().attr("aria-active", "false");
		},
		
		/**
		 * Metodo publico para el usuario programador
		 * en seleccionar el radiobutton. A diferencia
		 * del checkbox, este no se le puede quitar la
		 * seleccion, a menos de que se seleccione otro
		 * radiobutton. 
		 */
		select: function() {
			var group = this.element.attr("name"); 
			
			$("input[name='" + group + "']")
				.each(function() {
					$(this).data("radiobutton")._unselect();
				});
			this._select();
			/*
			this.element
				.attr("checked", 1);*/
		},
		
		/**
		 * Metodo privado para uso interno, ya que, 
		 * el label selecciona y quita la seleccion 
		 * del input automaticamente.
		 */
		_preselect: function() {
			var group = this.element.attr("name"); 
			
			$("input[name='" + group + "']")
				.each(function() {
					$(this).data("radiobutton")._unselect();
				});
			
			this._select();
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
					.find(".ui-icon-bullet")
						//.show()
						.addClass("ui-icon")
						.attr("aria-hide", "false");
				
				if (this.options.glowingtext) {	
					this.element
						.next()
						.children()
							.find(".ui-radiobutton-text")
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
					.find(".ui-icon-bullet")
						//.hide()
						.removeClass("ui-icon")
						.attr("aria-hide", "true");
				
				if (this.options.glowingtext) {
					this.element
						.next()
						.children()
						.find(".ui-radiobutton-text")
							.removeClass("ui-state-active");
				}
				
				this.unselected();
			}
		},
		
		selected: function(event) {
			var ui = {
				item: this.element
			};
				
			this._trigger("selected", event, ui);
		},
		
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
