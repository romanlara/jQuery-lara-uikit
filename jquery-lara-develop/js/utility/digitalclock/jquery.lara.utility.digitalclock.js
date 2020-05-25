/* ====================================================================+
 * File name      : jquery.lara.utility.digitalclock.js
 * Beginning      : 2011-Dic-11
 * Last modified  : 2011-Dic-26
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un reloj digital.
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
 *     jquery.lara.utility.digitalclock.css
 */

/*
 * v0.0.0 | 2011-Dic-11
 *     - Creación del widget.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget utility digitalclock has been released.
 */

(function($, undefined) {
	$.widget("utility.digitalclock", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		_exit: false,
		
		options: {
			timeFormat: '[hh]:[mm]:[ss]',
			dateFormat: "[dd]th {dayName} {monthName} [yy]",
			
			dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			monthNames: ['January','February','March','April','May','June',
			             'July','August','September','October','November','December'],
			
			displayColons: false,
			militaryTime: false,
			displayDate: false
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.clock = this.element
				.addClass("ui-utility-digitalclock ui-widget ui-helper-reset")
				.attr("role", "clock");
			
			this._exit = false;
			this.refresh();
		},
		
		refresh: function() {
			var self = this,
				o = self.options,
				objDate = new Date(),
				day = objDate.getDay(),
				date = objDate.getDate(),
				month = objDate.getMonth(),
				year = objDate.getFullYear(),
				hours = objDate.getHours(),
				minutes = objDate.getMinutes(),
				seconds = objDate.getSeconds(),
				meridiem = "",
				fullHours = "",
				fullDate = "",
				labelclock = "";
			
			if (o.militaryTime) {
				if(hours >= 12) {
					hours -= 12;
					meridiem = " p.m.";
				} else {
					meridiem = " a.m.";
				}
			}
			
			if (o.displayDate) {
				fullDate = o.dateFormat;
				
				fullDate = fullDate.replace("[dd]", date);
				fullDate = fullDate.replace("{dayName}", this._getDayName(day));
				fullDate = fullDate.replace("{monthName}", this._getMonthName(month));
				fullDate = fullDate.replace("[yy]", year);
			}
			
			labelclock = fullDate + o.timeFormat + meridiem;

			labelclock = labelclock.replace(":[mm]",
				'<span class="ui-utility-digitalclock-colon">:</span>[mm]');
			labelclock = labelclock.replace(":[ss]",
				'<span class="ui-utility-digitalclock-colon">:</span>[ss]');
			
			labelclock = labelclock.replace("[hh]", this._getTwoDigits(hours));
			labelclock = labelclock.replace("[mm]", this._getTwoDigits(minutes));
			labelclock = labelclock.replace("[ss]", this._getTwoDigits(seconds));
			
			this.clock.html(labelclock);
			
			if (o.displayColons) {
				this.clock.find(".ui-utility-digitalclock-colon").fadeTo(800, 0.0);
			}
			
			setTimeout(function() { if (!self._exit) { self.refresh(); } }, 1000);
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			this._exit = true;
			
			this.options
				.timeFormat = '[hh]:[mm]:[ss]';
			
			this.clock
				.removeClass("ui-utility-digitalclock ui-widget ui-helper-reset")
				.removeAttr("role");
		},
		
		_getTwoDigits: function(digit) {
			return (digit >= 10) ? digit : '0' + digit;
		},
		
		_getDayName: function(digit) {
			return this.options.dayNames[digit];
		},
		
		_getMonthName: function(digit) {
			return this.options.monthNames[digit];
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			//this.refresh();
		},
		
		_setOption: function(key, value) {
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);