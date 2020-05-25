/* ====================================================================+
 * File name      : jquery.lara.ui.table.js
 * Beginning      : 2011-Nov-16
 * Last modified  : 2011-Dic-10
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 0.0.0.0
 * version widget :   0.0.0
 * 
 * Description    : Una tabla.
 * ====================================================================+
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
 *     jquery.lara.ui.table.css
 */

/*
 * v0.0.0 | 2011-Nov-16
 *     - Creación del widget.
 * 
 * v1.0.0 | 0000-none-00
 *     - widget ui table has been released.
 */

(function($, undefined) {
	$.widget("ui.table", {
		versionLibrary: "0.0.0.0",
		version: "0.0.0",
		
		_rowToEdit: null,
		_quantityMaxRows: 0,
		_counterIncrement: 0,
		_counterDecrement: 0,
		
		options: {
			actionsMenu: null,     // Para que la tabla reconozca cual es su menu de acciones.
			
			// Los siguientes ajustes son para agregar acciones de edicion.
			toolCheckboxes: {      // Para agregar una columna de checkboxes, con los que se podran seleccionar filas.
				activate: false,     // True, para agregar la columna de checkboxes.
				laraCheckboxes: false, // True, para usar los checkbox del archivo jquery.lara.ui.checkbox.js.
				label: null          // Null, para usar el icono ui-icon-check, o Cadena para usar una palabra descriptiva.
			},
			editingToolButton: {   // Para agregar un boton de edicion para cada fila.
				activate: false,      // True, para agregar el boton editar.
				textButton: "Edit", // Para usarlo en otro idioma como 'Editar'(Castellano) o 'Herausgeben'(Aleman).
				text: true,           // False, para solo mostrar iconos si los hay.
				label: null,          // Cadena, para mostrar una leyenda sobre el mouse.
				icons: {
					primary: null,    // Cadena, para el icono primario.
					secondary: null   // Cadena, para el icono secundario.
				}
			},
			
			// Los siguiente ajustes son para obtener los datos una determinada fila,
			// o reconocer si hay alguna en edicion. 
			thereIsARowBeingEdited: false, // Para conocer si hay una fila siendo etidada.
			dataToEdit: []                 // Para obtener los datos de la fila que se quiere editar.
		},
		
		_create: function() {
			var self = this,
				o = self.options;
				
			this.element
				.addClass("ui-table ui-widget ui-helper-reset")
				.attr("role", "table")
				.find("thead tr:last")
					.addClass("ui-widget-header");
			
			this.filter = this.element.find("thead tr:first")
				.addClass("ui-widget-content");
				
			this.originalHeaders = this.element.find("thead tr:last th")
				.addClass("ui-table-th-buttons")
				.attr("aria-order", "ascending"); // descending
			
			this._createCaption();
			this._createThToolCheckboxes();
			this._createThToolSettings();
			
			// ----------------------------------------------------------
			// Registramos los eventos
			this.caption.disableSelection();
			this.iconDisplay
				.bind("click.table", function(event) {
					if (o.disabled) { return; }
					self.iconDisplay
						.toggleClass("ui-icon-triangle-1-s")
						.toggleClass("ui-icon-triangle-1-e");
					self.element
						.find("thead")
						.toggle();
					self.element
						.find("tbody")
						.toggle();
					
					event.stopPropagation();
					event.preventDefault();
					return false;
				});
			this.element
				.find("thead tr:last th.ui-table-th-toolsettings")
				.bind("click.table", function(event) {
					if (o.disabled) { return; }
					$(o.actionsMenu)
						.css("position", "fixed")
						.css("box-shadow", "2px 2px 5px -2px rgba(0, 0, 0, 0.5)")
						.css("width", "15%")
						.toggle()
						.position({
							of: $(this),
							my: "right top",
							at: "right bottom"
						});
					event.stopPropagation();
					event.preventDefault();
				});
			this.element
				.find("thead tr:last th.ui-table-th-buttons")
				.bind("mouseover.table", function(event) {
					if (o.disabled) { return; }
					$(this).addClass("ui-state-hover");
				})
				.bind("mouseleave.table", function(event) {
					if (o.disabled) { return; }
					$(this).removeClass("ui-state-hover");
				});
			this.element
				.find("thead tr th.ui-table-th-toolcheck")
				.bind("click.table", function(event) {
					if (o.disabled) { return; }
					var checkbox = self.element
						.find("tbody tr td.ui-table-td-toolcheck")
						.children("input");
					
					if (o.toolCheckboxes.activate) {
						if (o.toolCheckboxes.laraCheckboxes) {
							if (checkbox.is(":checked")) {
								checkbox.checkbox("unselect");
							} else {
								checkbox.checkbox("select");
							}
						} else {
							if (checkbox.is(":checked")) {
								checkbox.removeAttr("checked");
								//checkbox.parent().parent().removeClass("ui-selected").addClass("ui-unselected");
							} else {
								checkbox.attr("checked", 1);
								//checkbox.parent().parent().addClass("ui-selected").removeClass("ui-unselected");
							}
						}
					}
				});
			this.element
				.delegate("tbody tr td.ui-table-td-toolsettings button", "click.table", function(event) {
					if (o.disabled) { return; }
					self._preedit(event);
				});
			
			// ----------------------------------------------------------
			this.refresh();
		},
		
		refresh: function() {
			var self = this,
				o = self.options,
				rowsChecked = this.element.find("tbody tr.ui-table-tr-toolcheck td.ui-table-td-toolcheck").find("input:checked").length,
				rowsTotal = this.element.find("tbody").children("tr").length;
			
			// Actualizamos los contadores.
			self._quantityMaxRows = rowsTotal;
			self._counterIncrement = rowsChecked;
			self._counterDecrement = (rowsChecked !== 0) ? ++self._counterDecrement : self._quantityMaxRows;
			
			$(o.actionsMenu).find("#quantityUnselected").text("(" + self._counterDecrement + ")");
			
			// ----------------------------------------------------------
			// Los chekcboxes
			// A todas las filas que no tengan un checkbox se los asignamos.
			if (o.toolCheckboxes.activate) {
				if (o.toolCheckboxes.laraCheckboxes) {
					rows = this.element.find("tbody tr:not(.ui-table-tr-toolcheck):has(td)")
						.addClass("ui-table-tr-toolcheck")
						.prepend('<td class="ui-table-td-toolcheck"><input type="checkbox" /><label></label></td>');
					
					rows.each(function(i) {
						var row = $(this),
							name =  self.element.attr("id") + "-" + i;
				
						row.find("input").attr("name", name);
						row.find("label").attr("for", name);
						row.find("input").checkbox({ 
							text: false,
							selected: function(event, ui) {
								var selected = ((self._counterIncrement < self._quantityMaxRows && self._counterIncrement > 0) ? 
												++self._counterIncrement : ++self._counterIncrement),
									unselected = ((self._counterDecrement <= self._quantityMaxRows && self._counterDecrement > 0) ? 
												--self._counterDecrement : ++self._counterDecrement);
								
								// Incrementa por los checkbox seleccionados.
								$(o.actionsMenu).find("#quantitySelected").text("(" + selected + ")");
								// Decrementa por los checkbox no seleccionados.
								$(o.actionsMenu).find("#quantityUnselected").text("(" + unselected + ")");
							},
							unselected: function(event, ui) {
								var selected = ((self._counterIncrement <= self._quantityMaxRows && self._counterIncrement > 0) ? 
												--self._counterIncrement : ++self._counterIncrement),
									unselected = ((self._counterDecrement < self._quantityMaxRows && self._counterDecrement > 0) ? 
												++self._counterDecrement : ++self._counterDecrement);
								
								// Incrementa por los checkbox seleccionados.
								$(o.actionsMenu).find("#quantitySelected").text("(" + selected + ")");
								// Decrementa por los checkbox no seleccionados.
								$(o.actionsMenu).find("#quantityUnselected").text("(" + unselected + ")");
							}
						});
					});
				} else {
					rows = this.element.find("tbody tr:not(.ui-table-tr-toolcheck):has(td)")
						.addClass("ui-table-tr-toolcheck")
						.prepend('<td class="ui-table-td-toolcheck"><input type="checkbox" /><label></label></td>');
				}
			}
			// ----------------------------------------------------------
			// Los botones de edición.
			if (o.editingToolButton.activate) {
				TRSettings = this.element.find("tbody tr:not(.ui-table-tr-toolsettings):has(td)")
					.addClass("ui-table-tr-toolsettings")
					.append('<td class="ui-table-td-toolsettings"><button>' + o.editingToolButton.textButton + '</button></td>');
				
				buttonSettings = this.element.find("tbody tr.ui-table-tr-toolsettings td.ui-table-td-toolsettings button:not(.ui-button)")
					.button({
						text: o.editingToolButton.text,
						label: o.editingToolButton.label,
						icons: {
							primary: o.editingToolButton.icons.primary,
							secondary: o.editingToolButton.icons.secondary
						}
					});
			} else {
				TRSettings = this.element.find("tbody tr:not(.ui-table-tr-toolsettings):has(td)")
					.addClass("ui-table-tr-toolsettings")
					.append('<td class="ui-table-td-toolsettings"></td>');
			}
			
			// ----------------------------------------------------------
			// Filtro
			if (this.filter.children("th").length < 2) {
				this.filter.children("th").attr("colspan", this.element.find("thead tr:last th").length);
			}
			
			this.updateQuantityRows();
		},
		
		destroy: function() {
			// Eliminamos todos los elementos .ui-table-td-toolsettings
			this.element
				.find("tbody tr.ui-table-tr-toolsettings")
				.removeClass("ui-table-tr-toolsettings")
				.find("td.ui-table-td-toolsettings")
					.children("button")
						.undelegate(".table")
						.button("destroy")
						.end()
				.remove();
			
			// Eliminamos todos los elementos .ui-table-td-toolcheck
			this.element
				.find("tbody tr.ui-table-tr-toolcheck")
				.removeClass("ui-table-tr-toolcheck")
				.find("td.ui-table-td-toolcheck")
					.children("input")
						.checkbox("destroy")
						.end()
				.remove();
			
			// Removemos los eventos que tiene ui-table-th-buttons.
			this.element
				.find("thead tr:last th.ui-table-th-buttons")
				.unbind(".table");
			
			// Eliminamos los th toolsettings y toolcheck.
			this.element
				.find("thead tr:last th.ui-table-th-toolsettings")
				.unbind(".table")
				.remove();
			this.element
				.find("thead tr:last th.ui-table-th-toolcheck")
				.unbind(".table")
				.remove();
			
			// Eliminamos algunos elementos del .ui-table-wrap-inner-caption
			this.iconDisplay
				.unbind(".table")
				.remove();
			this.quantityRows
				.remove();
			
			// Eliminamos de <caption> el elemento .ui-table-wrap-inner-caption
			this.caption
				.enableSelection()
				.children("div")
				.children()
				.unwrap(this.wrapInnerCaption);
			
			// Devolvemos a caption a su visualización original.
			this.caption
				.removeClass("ui-state-default");
			
			// Devolvemos los th principales a su visualización original.
			this.originalHeaders
				.removeClass("ui-table-th-buttons")
				.removeAttr("aria-order");
			
			// Devolvemos el filtro a su visualización original.
			this.filter
				.removeClass("ui-widget-content");
			
			// Devolvemos por último a la tabla a su visualización original.
			this.element
				.removeClass("ui-table ui-widget ui-helper-reset")
				.removeAttr("role")
				.find("thead tr:last")
				.removeClass("ui-widget-header");
		},
		
		_createCaption: function() {
			var self = this,
				o = self.options,
				text = "";
			
			this.caption = this.element.find("caption")
				.addClass("ui-state-default");
				
			this.caption
				.wrapInner("<div></div>");
				
			this.wrapInnerCaption = this.caption.children("div")
				.addClass("ui-table-wrap-inner-caption");
			
			this.iconDisplay = $("<span></span>")
				.addClass("ui-table-icon-display" +
						  " ui-icon" +
						  " ui-icon-triangle-1-s")
				.prependTo(this.wrapInnerCaption);
			
			this.quantityRows = $("<span></span>")
				.addClass("ui-table-quantity-rows")
				.appendTo(this.wrapInnerCaption);
		},
		
		updateQuantityRows: function() {
			this.quantityRows.text("(" + this.element.find("tbody").children("tr").length + ")");
		},
		
		_createThToolCheckboxes: function() {
			var self = this,
				o = self.options,
				th;
			
			if (o.toolCheckboxes.activate) {
				th = $("<th></th>")
					.addClass("ui-table-th-toolcheck" +
							  " ui-table-th-buttons");
				
				if (o.toolCheckboxes.label === null || o.toolCheckboxes.label === "") {
					icono = $("<span></span>")
						.addClass("ui-icon ui-icon-check")
						.appendTo(th);
				} else if (typeof o.toolCheckboxes.label === "string") {
					th.html(o.toolCheckboxes.label);
				}
				
				th.prependTo(self.element.find("thead tr:last"));
			}
		},
		
		_createThToolSettings: function() {
			var self = this,
				o = self.options,
				th = $("<th></th>")
					.addClass("ui-table-th-toolsettings" +
							  " ui-table-th-buttons"),
				iconoDown = $("<span style='float: right;'></span>")
					.addClass("ui-icon ui-icon-triangle-1-s")
					.appendTo(th),
				iconoGear = $("<span style='float: right;'></span>")
					.addClass("ui-icon ui-icon-gear")
					.appendTo(th);
			
			th.appendTo(self.element.find("thead tr:last"));
		},
		
		add: function(row) {
			var self = this,
				o = self.options;
			
			this.element
				.find("tbody")
				.append(row);
			
			this.refresh();
		},
		
		remove: function() {
			var rowToRemove = this.element
				.find("tbody tr td.ui-table-td-toolcheck")
					.find("input:checked");
					
			rowToRemove.checkbox("unselect");
			rowToRemove.closest("tr").remove();
			this.refresh();
		},
		
		_preedit: function(event) {
			var self = this,
				o = self.options,
				tr = $(event.target).parent().parent(),
				data = [];
			
			for (var i = 0; i < tr.find("td").length; i++) {
				if (i !== 0 || i !== tr.find("td").length) {
					data[i - 1] = tr.find("td").eq(i).text();
				}
			}
			
			o.dataToEdit = data;
			this._rowToEdit = tr;
			o.thereIsARowBeingEdited = true;
			this.preedit(event);
		},
		
		preedit: function(event) {
			var ui = {
				item: this.element
			};
				
			this._trigger("preedit", event, ui);
		},
		
		edit: function(datos) {
			var self = this,
				o = self.options,
				tr = this._rowToEdit;
				
			for (var i = 0; i < tr.find("td").length; i++) {
				if (i !== 0 || i !== tr.find("td").length) {
					tr.find("td").eq(i).text(datos[i - 1]);
				}
			}
			
			this._rowToEdit = null;
			o.thereIsARowBeingEdited = false;
		},
		
		cancelEditing: function() {
			this._rowToEdit = null;
			this.options.thereIsARowBeingEdited = false;
		},
		
		selectAll: function() {
			this.element
				.find("thead tr th.ui-table-th-toolcheck")
				.trigger("click");
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