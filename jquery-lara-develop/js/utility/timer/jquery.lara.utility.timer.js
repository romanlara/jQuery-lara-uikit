/* ====================================================================+
 * File name      : jquery.lara.utility.timer.js
 * Beginning      : 2011-Dic-28
 * Last modified  : 2012-May-24
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un temporizador.
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
 *     jquery.lara.utility.timer.css
 */

/*
 * v0.0.0 | 2011-Dic-28
 *     - Creación del widget.
 * 
 * v0.1.0 | 2012-May-03
 *   News:
 *     - Ahora es posible hacer que el temporizador esté en diferentes idiomas con el alfabeto latino.
 *     - Ahora es posible acortar el formato de tiempo en su visualización, mostrando por ejemplo:
 *       Si debe contar a partir de 1 minuto, solo muestra en pantalla '01 minuto' y cuando cambie a
 *       59 segundos, desaparece la leyenda anterior y muestra a su vez en pantalla '59 segundos'.
 * 
 * v0.2.0 | 2012-May-24
 *   News:
 *     - Se agrego la opción de agregar un texto al finalizar el temporizador, solo funciona si
 *       el 'shortenTime' está activo.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget utility timer has been released.
 */

(function($, undefined) {
	$.widget("utility.timer", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		_isWalk: false,
		_finish: false,
		_hours: 0,
		_minutes: 0,
		_seconds: 0,
		
		options: {
			setHours: 0,
			setMinutes: 0,
			shortenTime: false,
			
			/* La nomenclatura para el formato del temporizador es:
			 * [hh] = Horas en números.
			 * [mm] = Minutos en números.
			 * [ss] = Segundos en números.
			 * 
			 * {HH} = Nombre de las horas.
			 * {MM} = Nombre de los minutos.
			 * {SS} = Nombre de los segundos.
			 */
			pluralHoursText: "hours",
			pluralMinutesText: "minutes",
			pluralSecondsText: "seconds",
			singleHoursText: "hour",
			singleMinutesText: "minute",
			singleSecondsText: "second",
			finishText: "finished",
			timeFormat: "[hh]:[mm]:[ss]"
		},
		
		_create: function() {
			var self = this,
				o = self.options
				fullTime = "";
			
			this.timer = this.element
				.addClass("ui-utility-timer ui-widget ui-helper-reset")
				.attr("role", "timer");
				
			this._hours = (o.setHours >= 24) ? 23 : (o.setHours < 0) ? 0 : o.setHours;
			this._minutes = (o.setMinutes > 59) ? 59 : (o.setMinutes < 0) ? 0 : o.setMinutes;
			
			fullTime = o.timeFormat;
			
			if (o.shortenTime) {
				fullTime = this._deleteHours(fullTime);
				fullTime = this._deleteMinutes(fullTime);
				fullTime = this._deleteSeconds(fullTime);
			}
			
			fullTime = fullTime.replace("[hh]", this._getTwoDigits(this._hours));
			fullTime = fullTime.replace("[mm]", this._getTwoDigits(this._minutes));
			fullTime = fullTime.replace("[ss]", this._getTwoDigits(this._seconds));
			
			fullTime = this._setPluralSingleHoursText(fullTime);
			fullTime = this._setPluralSingleMinutesText(fullTime);
			fullTime = this._setPluralSingleSecondsText(fullTime);
			
			this.timer.html(fullTime);
			
			this._isWalk = true;
			this._finish = false;
			setTimeout(function() { self.refresh(); }, 1000);
		},
		
		refresh: function() {
			var self = this,
				o = self.options,
				fullTime = "";
			
			this._hours = (this._minutes == 0 && this._seconds == 0) ? --this._hours : this._hours;
			
			this._minutes = (this._hourse == 0 && this._seconds == 0) ?
				(this._minutes != 0) ? --this._minutes : 59 :
				(this._minutes != 0) ? (this._seconds == 0) ? --this._minutes : this._minutes : 
				(this._seconds != 0) ? this._minutes : 59;
			
			this._seconds = (this._seconds == 0) ? 59 : --this._seconds;
			
			fullTime = o.timeFormat;
			
			if (o.shortenTime) {
				fullTime = this._deleteHours(fullTime);
				fullTime = this._deleteMinutes(fullTime);
				fullTime = this._deleteSeconds(fullTime);
				fullTime = this._finishTimer(fullTime);
			}
			
			fullTime = fullTime.replace("[hh]", this._getTwoDigits(this._hours));
			fullTime = fullTime.replace("[mm]", this._getTwoDigits(this._minutes));
			fullTime = fullTime.replace("[ss]", this._getTwoDigits(this._seconds));
			
			fullTime = this._setPluralSingleHoursText(fullTime);
			fullTime = this._setPluralSingleMinutesText(fullTime);
			fullTime = this._setPluralSingleSecondsText(fullTime);
			
			this.timer.html(fullTime);
			
			this.timeout = setTimeout(function() {
				if (self._hours == 0 && 
					self._minutes == 0 && 
					self._seconds == 0) { self._finish = true; }
				if (!self._finish) { self.refresh(); } else { self.task(); }
			}, 1000);
		},
		
		destroy: function() {
			var self = this,
				o = self.options;
			
			$.Widget.prototype.destroy.call(this, arguments);
			
			this._finish = true;
			clearTimeout(this.timeout);
			this._hours = o.setHours;
			this._minutes = o.setMinutes;
			this._seconds = 0;
			
			this.timer
				.removeClass("ui-utility-timer ui-widget ui-helper-reset")
				.removeAttr("role");
		},
		
		_setPluralSingleHoursText: function(fullTime) {
			var self = this,
				o = self.options;
			
			if (this._hours > 1) {
				return fullTime.replace("{HH}", o.pluralHoursText);
			} else if (this._hours == 1) {
				return fullTime.replace("{HH}", o.singleHoursText);
			} else {
				return fullTime.replace("{HH}", o.pluralHoursText);
			}
		},
		
		_setPluralSingleMinutesText: function(fullTime) {
			var self = this,
				o = self.options;
			
			if (this._minutes > 1) {
				return fullTime.replace("{MM}", o.pluralMinutesText);
			} else if (this._minutes == 1) {
				return fullTime.replace("{MM}", o.singleMinutesText);
			} else {
				return fullTime.replace("{MM}", o.pluralMinutesText);
			}
		},
		
		_setPluralSingleSecondsText: function(fullTime) {
			var self = this,
				o = self.options;
			
			if (this._seconds > 1) {
				return fullTime.replace("{SS}", o.pluralSecondsText);
			} else if (this._seconds == 1) {
				return fullTime.replace("{SS}", o.singleSecondsText);
			} else {
				return fullTime.replace("{SS}", o.pluralSecondsText);
			}
		},
		
		_deleteHours: function(fullTime) {
			var self = this,
				o = self.options;
			
			if (this._hours == 0) {
				fullTime = fullTime.replace("[hh]", "");
				fullTime = fullTime.replace("{HH}", "");
				return fullTime;
			} else {
				return fullTime;
			}
		},
		
		_deleteMinutes: function(fullTime) {
			var self = this,
				o = self.options;
			
			if (this._minutes == 0) {
				fullTime = fullTime.replace("[mm]", "");
				fullTime = fullTime.replace("{MM}", "");
				return fullTime;
			} else {
				return fullTime;
			}
		},
		
		_deleteSeconds: function(fullTime) {
			var self = this,
				o = self.options;
			
			if (this._seconds == 0) {
				fullTime = fullTime.replace("[ss]", "");
				fullTime = fullTime.replace("{SS}", "");
				return fullTime;
			} else {
				return fullTime;
			}
		},
		
		_finishTimer: function(fullTime) {
			if (this._hours == 0 && this._minutes == 0 && this._seconds == 0) {
				return fullTime = this.options.finishText;
			} else {
				return fullTime;
			}
		},
		
		_getTwoDigits: function(digit) {
			return (digit >= 10) ? digit : '0' + digit;
		},
		
		stop: function() {
			var self = this,
				o = self.options;
				
			this._isWalk = false;
			this._finish = true;
			clearTimeout(this.timeout);
		},
		
		walk: function() {
			if (!this._isWalk) {
				if (this._hours != 0 || this._minutes != 0 || this._seconds != 0 ) { 
					this._isWalk = true;
					this._finish = false;
					this.refresh(); 
				}
			}
		},
		
		reset: function() {
			var self = this,
				o = self.options,
				fullTime = "";
			
			clearTimeout(this.timeout);
			this._finish = true;
			this._hours = o.setHours;
			this._minutes = o.setMinutes;
			this._seconds = 0;
			
			fullTime = o.timeFormat;
			
			if (o.shortenTime) {
				fullTime = this._deleteHours(fullTime);
				fullTime = this._deleteMinutes(fullTime);
				fullTime = this._deleteSeconds(fullTime);
			}
			
			fullTime = fullTime.replace("[hh]", this._getTwoDigits(this._hours));
			fullTime = fullTime.replace("[mm]", this._getTwoDigits(this._minutes));
			fullTime = fullTime.replace("[ss]", this._getTwoDigits(this._seconds));
			
			fullTime = this._setPluralSingleHoursText(fullTime);
			fullTime = this._setPluralSingleMinutesText(fullTime);
			fullTime = this._setPluralSingleSecondsText(fullTime);
			
			this.timer.html(fullTime);
			
			this._isWalk = true;
			this._finish = false;
			setTimeout(function() { self.refresh(); }, 1000);
		},
		
		task: function(event) {
			var ui = {
				item: this.element,
				hours: this._hours,
				minutes: this._minutes,
				seconds: this._seconds,
				timeFormat: this.options.timeFormat
			};
				
			this._trigger("task", event, ui);
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			//this.refresh();
		},
		
		_setOption: function(key, value) {
			switch(key) {
				case "setHours":
					key = (value >= 24) ? 23 : (value < 0) ? 0 : value;
					break;
				case "setMinutes":
					key = (value > 59) ? 59 : (value < 0) ? 0 : value;
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);