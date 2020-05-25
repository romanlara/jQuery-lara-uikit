/* 
 * ------------------------- Time Recognizer ---------------------------
 * (c) Copyright 2012 Lara E.M.S. Roman. All Rights Reserved.
 * ====================================================================+
 * File name     : jquery.lara.utility.TimeRecognizer.js
 * Beginning     : 2012-Jul-19
 * Last modified : 2012-Oct-03
 * 
 * Author        : Lara E.M.S. Roman
 * version       : 1.0.0
 * 
 * Description   : Objeto que calcula la cantidad de años, meses o días
 *                 dos fechas.
 * ====================================================================+
 */

/*
 * ------------------------ LOG DE VERSIONES ---------------------------
 * v1.0 Alpha | 2012-Jul-19
 *     - Creación del objeto.
 * 
 * v1.0 Alpha 1 | 2012-Sep-11
 *   News:
 *     - Pueden usarse las funciones publicas getAmountYears(), getAmountMonths(), getAmountDays(),
 *       dateFormatIsCorrect() & timeFormatIsCorrect(). Las demás estan en desarrollo.
 *   Patchings:
 *     - La funcion privada _calculateDays() quien es utilizada por la función publica getAmountDays()
 *       esta en proceso de corrección, por lo que aun presenta fallas.
 * 
 * v1.0 Alpha 2 | 2012-Sep-27
 *   News:
 *     - Pueden usarse todas las funciones, excepto: dateLessThan(), timeLessThan(), getMuchLonger() & getMinimumValue().
 *   Patching:
 *     - Se ha corregido la funcion _calculateDays(), ahora si mide los días en todos los casos.
 * 
 * v1.0.0 | 2012-Oct-03
 *   News:
 *     - Objeto liberado.
 *   Patchings:
 *     - De momento no se pueden utilizar las función: getMuchLonger().
 */

/**
 * ------------------- OPCIONES Y METODOS PUBLICOS ---------------------
 * 
 */

(function ($, window, undefined) {
	// Objeto que se puede utilizar en varios archivos para hacer referencia a ciertas funciones.
	$.TimeRecognizer = {};
	// Version de la clase.
	$.TimeRecognizer.version = "1.0.0";
	// Formato de la fecha.
	// [ ], entre corchetes para los números.
	// { }, entre llaves para las unidades.
	$.TimeRecognizer.dateFormat = "[yy] {YY}, [mm] {MM} and [dd] {DD}";
	// Formato del tiempo.
	// [ ], entre corchetes para los números.
	// { }, entre llaves para las unidades.
	$.TimeRecognizer.timeFormat = "[hh] {HH}, [mm] {MM} and [ss] {SS}";
	// Palabras claves en plural.
	$.TimeRecognizer.pluralYear = "years";
	$.TimeRecognizer.pluralMonth = "months";
	$.TimeRecognizer.pluralDay = "days";
	$.TimeRecognizer.pluralHour = "hours";
	$.TimeRecognizer.pluralMinute = "minutes";
	$.TimeRecognizer.pluralSecond = "seconds";
	// Palabras claves en singular.
	$.TimeRecognizer.singleYear = "year";
	$.TimeRecognizer.singleMonth = "month";
	$.TimeRecognizer.singleDay = "day";
	$.TimeRecognizer.singleHour = "hour";
	$.TimeRecognizer.singleMinute = "minute";
	$.TimeRecognizer.singleSecond = "second";
	// Variables de entrada.
	$.TimeRecognizer.firstDate = [];
	$.TimeRecognizer.lastDate = [];
	$.TimeRecognizer.firstTime = [];
	$.TimeRecognizer.lastTime = [];
	// Unidad detectada.
	$.TimeRecognizer.unit = "";
	
	/**
	 * Calcula si el año dado es bisiesto o no.
	 * 
	 * @param {int} year : Año que se quiere calcular si es bisiesto o no.
	 * @return {boolean} true or false : Verdadero para Es Bisiesto y Falso para No es Bisiesto.
	 */
	$.TimeRecognizer._leapYear = function(year) {
		return ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) ? true : false;
	}
	
	/**
	 * Obtiene la cantidad de días que tene el mes que se les quiere conocer.
	 * 
	 * @param {int} month : Mes que se quiere saber cuantos días tiene.
	 * @param {int} year  : Año que se relaciona con si es bisiesto, en caso de que el mes sea Febrero.
	 */
	$.TimeRecognizer._numberOfDaysInAMonth = function(month, year) {
		var daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		                 // 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12
		
		if (month == 2) {
			return ($.TimeRecognizer._leapYear(year)) ? daysOfMonths[month - 1] + 1 : daysOfMonths[month - 1];
		} else {
			return daysOfMonths[month - 1];
		}
	}
	
	/**
	 * Calcula la cantidad en años trascurridos.
	 * 
	 * @return {Int} : los años transcurridos
	 */
	$.TimeRecognizer._calculateYears = function() {
		var years = 0;
		
		years = Math.abs($.TimeRecognizer.firstDate[2] - $.TimeRecognizer.lastDate[2]);
			
		if ($.TimeRecognizer.firstDate[2] <= $.TimeRecognizer.lastDate[2]) {
			if ($.TimeRecognizer.firstDate[1] < $.TimeRecognizer.lastDate[1]) {
				years = years;
			} else if ($.TimeRecognizer.firstDate[1] == $.TimeRecognizer.lastDate[1]) {
				if ($.TimeRecognizer.firstDate[2] == $.TimeRecognizer.lastDate[2]) {
					years = years;
				} else {
					if ($.TimeRecognizer.firstDate[0] <= $.TimeRecognizer.lastDate[0]) {
						years = years;
					} else {
						years -= 1;
					}
				}
			} else {
				if ($.TimeRecognizer.firstDate[2] < $.TimeRecognizer.lastDate[2]) {
					years -= 1;
				} else {
					years = -1;
				}
			}
		} else {
			years = -1;
		}
		
		return years;
	}
	
	/**
	 * Calcula la cantidad en meses trascurridos.
	 * 
	 * @return {Int} : los meses transcurridos.
	 */
	$.TimeRecognizer._calculateMonths = function() {
		var months = 0,
			bonus = 0;
		
		// Obtenemos la cantidad de meses que hay entre los años.
		months = Math.abs($.TimeRecognizer.firstDate[2] - $.TimeRecognizer.lastDate[2]) * 12;
		// Obtenemos los meses de diferencia, sean faltantes o sobrantes.
		bonus = $.TimeRecognizer.firstDate[1] - $.TimeRecognizer.lastDate[1];
		// El total de meses se lerestan son meses faltantes o sobrantes.
		return months - bonus;
	}
	
	/**
	 * Calcula la cantidad en días trascurridos.
	 * 
	 * @return {Int} : los días transcurridos.
	 */
	$.TimeRecognizer._calculateDays = function() {
		var days = 0
			counterLeapYears = 0,
			counterYears = $.TimeRecognizer.firstDate[2];
		
		// Restamos los años y multiplicamos la cantidad por días, y obtenemos los días
		// trasncurridos generales.
		days = Math.abs($.TimeRecognizer.firstDate[2] - $.TimeRecognizer.lastDate[2]) * 365;
		
		// Contamos cuantos años bisiesto hubieron entre las dos fechas.
		for (i = 0; i < $.TimeRecognizer._calculateYears(); i++) {
			if ($.TimeRecognizer._leapYear(counterYears)) {
				counterLeapYears++;
			}
			counterYears++;
		}
		
		days += counterLeapYears; // Sumamos los años bisiestos como si fueran días que faltaron por contar.
		
		// Revisamos que que los años sean menores o iguales.
		if ($.TimeRecognizer.firstDate[2] <= $.TimeRecognizer.lastDate[2]) {
			// Revisamos que el primer  mes sea menor.
			if ($.TimeRecognizer.firstDate[1] < $.TimeRecognizer.lastDate[1]) {
				// Revisamos que los años sean iguales o el primero menor.
				if ($.TimeRecognizer.firstDate[2] == $.TimeRecognizer.lastDate[2]) {
					// Se otienen la cantidad de días por mes, iniciando con el mes de la primer fecha,
					// y se suma a lo que se tiene, que pudiera ser un 1 en caso de año bisiesto o un 0 de no serlo.
					days += addDaysPerMonth($.TimeRecognizer.firstDate[1], $.TimeRecognizer.lastDate[1]);
					// Restamos con el día dado de la primer fecha.
					days -= $.TimeRecognizer.firstDate[0];
					// Sumamos con el día dado de la segunda fecha.
					days += $.TimeRecognizer.lastDate[0];
					// Y restamos uno en caso de ser bisiesto, sino, queda sin cambios.
					days = ($.TimeRecognizer._leapYear($.TimeRecognizer.lastDate[2]) && days == 365) ? days + 1 : (days == 364) ? days + 1 : days;
					/* Nota 1: Con esto obtenemos la cantidad exacta de días transcurridos cuando los
					 *         años son iguales y el primer mes es menor. Ejem. Entre una fecha como 
					 *         14/08/2012 al 10/09/2012, tenemos cero años transcurridos, entonces
					 *         el contador de días cuenta del mes 08 al mes 09 obteneindo 31 días, 
					 *         entonces a ello le restamos el día 14, porque para el mes 08 van 14 días 
					 *         transcurridos, eso nos da 17 días. Después sumamos los días trascurridos 
					 *         por el mes 09, es decir, sumar el día 10 de ese mes, y el resultado da 27.
					 *         Luego, entra por un proceso de decisión, si debe sumarle uno o no al valor, 
					 *         ya sea por año bisiesto y que el resultado fuese 365 o 364 días.
					 * 
					 * Nota 2: Así no se calcula mal cuando no se es un año bisiesto. Ejem. Entre una fecha como
					 *         14/08/2013 al 10/09/2013, se obtienen 27 días en total, y no 26 o 28 días.
					 * 
					 * Nota 3: ¿Por qué comparamos con 365 o 364? El calculo para una fecha bisiesta como
					 *         01/01/2012 a 31/12/2012, dara como resultado 365 días transcurridos, el contador
					 *         contará del mes 01 al 11 dando como resultado 335 días, a ello le restamos el día
					 *         01, y después le sumamos el día 31 dando como resultado 365 días, por ello verificamos
					 *         si el año es biciesto y dío como resultado 365 para sumar 1. Por lo que, si no es bisiesto,
					 *         no dió 365, sino 364, verificamos para sumar también 1. En caso contrario a esta
					 *         nota, dará el resultado de las notas 1 & 2. Este caso es cuando las fechas dan un año por estar
					 *         en lo extremos. Solo si los años con iguales y el primer mes es menor.
					 */         
				} else {
					// Si no fuesen iguales los años, es decir, que el primero fuese menor,
					// obtenemos la cantidad de días por mes, iniciando con el mes de la primer fecha,
					// se suma a lo que se tiene y después, sumamos con el día dado de la segunda fecha.
					days += addDaysPerMonth($.TimeRecognizer.firstDate[1], $.TimeRecognizer.lastDate[1]);
					days += $.TimeRecognizer.lastDate[0];	
				}
			// Revisamos que los meses sean iguales.
			} else if ($.TimeRecognizer.firstDate[1] == $.TimeRecognizer.lastDate[1]) {
				// Revisamos que el primer año sea menor.
				if ($.TimeRecognizer.firstDate[2] < $.TimeRecognizer.lastDate[2]) {
					// Revisamos que el segundo año al restarle 1 sea menor.
					if ($.TimeRecognizer.firstDate[2] < ($.TimeRecognizer.lastDate[2] - 1)) {
						// si entra, obtenemos la cantidad de días por mes, iniciando con 1(Enero), el primer
						// mes del año, y terminamos con el mes dado de la segunda fecha. Después, sumamos con
						// el día dado de la segunda fecha.
						days += addDaysPerMonth(1, $.TimeRecognizer.lastDate[1]);
						days += $.TimeRecognizer.lastDate[0];
					// Si son iguales
					} else {
						days += addDaysPerMonth(1, $.TimeRecognizer.lastDate[1]);
						days += $.TimeRecognizer.lastDate[0];
					}
				// Revisamos que los años sean iguales.
				} else if ($.TimeRecognizer.firstDate[2] == $.TimeRecognizer.lastDate[2]) {
					// Revisamos que el primer día sea menor.
					if ($.TimeRecognizer.firstDate[0] < $.TimeRecognizer.lastDate[0]) {
						// Al ser menor se debe hacer una resta para obtener la cantidad que 
						// transcurrió en el mismo mes y año.
						days = Math.abs($.TimeRecognizer.firstDate[0] - $.TimeRecognizer.lastDate[0]);
					// Revisamos que los días sean iguales.
					} else if ($.TimeRecognizer.firstDate[0] == $.TimeRecognizer.lastDate[0]) {
						days = 0; // Sí es así, equivale a 0 días trascurridos.
					} else {
						days = -1; // Si no, se rechaza el calculo.
					}
				}
			} else {
				// Revisamos que el segundo año al restarle 1 sea menor.
				if ($.TimeRecognizer.firstDate[2] < ($.TimeRecognizer.lastDate[2] - 1)) {
					// Si entra, sumamos la cantidad de días por mes, y los días faltantes
					// del mes final.
					days += addDaysPerMonth(1, $.TimeRecognizer.lastDate[1]);
					days += $.TimeRecognizer.lastDate[0];
				} else {
					days = addDaysPerMonth($.TimeRecognizer.firstDate[1], 13) - $.TimeRecognizer.firstDate[0];
					days += addDaysPerMonth(1, $.TimeRecognizer.lastDate[1]);
					days += $.TimeRecognizer.lastDate[0];
				}
			}
		} else {
			days = -1; // Si el primer año es mayor se rechaza el calculo.
		}
		
		/**
		 * Suma la cantidad de días a partir de un mes de inicio hasta el final.
		 * 
		 * @param {Int} begin : Mes incial.
		 * @param {Int} finish: Mes final.
		 * @return {Int} : Cantidad de dias entre esos meses.
		 */
		function addDaysPerMonth(begin, finish) {
			var d = 0;
			
			for (i = begin; i < finish; i++) {
				d += $.TimeRecognizer._numberOfDaysInAMonth(i, $.TimeRecognizer.lastDate[2]);
			}
			
			return d;
		}
		
		return days;
	}
	
	/**
	 * Calcula la cantidad en horas trascurridas.
	 * 
	 * @return {Int} : las horas transcurridas.
	 */
	$.TimeRecognizer._calculateHours = function() {
		var hours = 0,
			days = 0;
		
		days = $.TimeRecognizer._calculateDays();
		hours = days * 24;
		
		if ($.TimeRecognizer.firstTime.length > 0 && $.TimeRecognizer.lastDate.length > 0) {
			hours += Math.abs($.TimeRecognizer.firstTime[0] - $.TimeRecognizer.lastTime[0]);	
		} else {
			hours = hours;
		}
		
		return hours;
	}
	
	/**
	 * Calcula la cantidad en minutos trascurridas.
	 * 
	 * @return {Int} : las minutos transcurridas.
	 */
	$.TimeRecognizer._calculateMinutes = function() {
		var minutes = 0,
			days = 0;
		
		days = $.TimeRecognizer._calculateDays();
		minutes = days * 1440;
		
		if ($.TimeRecognizer.firstTime.length > 0 && $.TimeRecognizer.lastDate.length > 0) {
			minutes += Math.abs($.TimeRecognizer.firstTime[1] - $.TimeRecognizer.lastTime[1]);
		} else {
			minutes = minutes;
		}
		
		return minutes;
	}
	
	/**
	 * Calcula la cantidad en minutos trascurridas.
	 * 
	 * @return {Int} : las minutos transcurridas.
	 */
	$.TimeRecognizer._calculateSeconds = function() {
		var seconds = 0,
			days = 0;
		
		days = $.TimeRecognizer._calculateDays();
		seconds = days * 86400;
		
		if ($.TimeRecognizer.firstTime.length > 0 && $.TimeRecognizer.lastDate.length > 0) {
			seconds += Math.abs($.TimeRecognizer.firstTime[2] - $.TimeRecognizer.lastTime[2]);
		} else {
			seconds = seconds;
		}
		
		return seconds;
	}
	
	/**
	 * Calcula la cantidad maxima posible entre dos fechas.
	 * 
	 * nota: Para saber en que unidad se calculó utilise 
	 *       la propiedad $.TimeRecognizer.unit del objeto.
	 * 
	 * @return {Int} : cantidad maxima posible transcurrida.
	 */
	$.TimeRecognizer._calculateMaximumPossibleValue = function() {
		var result = 0;
		
		// Se busca que el primer año sea menor o igual.
		if ($.TimeRecognizer.firstDate[2] <= $.TimeRecognizer.lastDate[2]) {
			// Buscamos si el primer mes es menor.
			if ($.TimeRecognizer.firstDate[1] < $.TimeRecognizer.lastDate[1]) {
				// Si es así, buscamos si los años son iguales
				if ($.TimeRecognizer.firstDate[2] == $.TimeRecognizer.lastDate[2]) {
					// Si lo son, calculamos meses.
					result = $.TimeRecognizer._calculateMonths();
					$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "month");
				} else {
					// Si no lo son, calculamos años.
					result = $.TimeRecognizer._calculateYears();
					$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "year");
				}
			// Buscamos si los meses son iguales.
			} else if ($.TimeRecognizer.firstDate[1] == $.TimeRecognizer.lastDate[1]) {
				// Buscamos si el primer año es menor
				if ($.TimeRecognizer.firstDate[2] < $.TimeRecognizer.lastDate[2]) {
					// Si los años estan muy distanciados, se calculan los años.
					if ($.TimeRecognizer.firstDate[2] < ($.TimeRecognizer.lastDate[2] - 1)) {
						result = $.TimeRecognizer._calculateYears();
						$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "year");
					// Si no lo estan entonces.
					} else {
						// Calculamos meses.
						result = $.TimeRecognizer._calculateMonths();
						$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "month");
					}
				// Buscamos si los años son iguales
				} else if ($.TimeRecognizer.firstDate[2] == $.TimeRecognizer.lastDate[2]) {
					// Entonces, buscamos que el primer día sea menor
					if ($.TimeRecognizer.firstDate[0] < $.TimeRecognizer.lastDate[0]) {
						// Calculamos los días
						result = $.TimeRecognizer._calculateDays();
						$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "day");
					// Si no, buscamos si los días son iguales
					} else if ($.TimeRecognizer.firstDate[0] == $.TimeRecognizer.lastDate[0]) {
						// Si es así, buscamos en las horas, en minutos o en los segundos.
						if ($.TimeRecognizer.firstTime[0] < $.TimeRecognizer.lastTime[0]) {
							result = $.TimeRecognizer._calculateHours();
							$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "hour");
						} else if ($.TimeRecognizer.firstTime[0] == $.TimeRecognizer.lastTime[0]) {
							if ($.TimeRecognizer.firstTime[1] < $.TimeRecognizer.lastTime[1]) {
								result = $.TimeRecognizer._calculateMinutes();
								$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "minute");
							} else if ($.TimeRecognizer.firstTime[1] == $.TimeRecognizer.lastTime[1]) {
								if ($.TimeRecognizer.firstTime[2] < $.TimeRecognizer.lastTime[2]) {
									result = $.TimeRecognizer._calculateSeconds();
									$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "second");
								} else if ($.TimeRecognizer.firstTime[2] == $.TimeRecognizer.lastTime[2]) {
									result = $.TimeRecognizer._calculateSeconds();
									$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "second");
								} else {
									result = -1;
								}
							} else {
								result = -1;
							}
						} else {
							result = -1;
						}
					} else {
						result = -1; // Se rechaza por ser mayor el primer día.
					}
				}
			// Buscamos por ende, si el primer mes resulto ser mayor.
			} else {
				// Si los años estan muy distanciados, se calculan los años.
				if ($.TimeRecognizer.firstDate[2] < ($.TimeRecognizer.lastDate[2] - 1)) {
					result = $.TimeRecognizer._calculateYears();
					$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "year");
				// Si no lo estan entonces.
				} else {
					// Calculamos meses.
					result = $.TimeRecognizer._calculateMonths();
					$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(result, "month");
				}
			}
		} else {
			result = -1; // Se rechaza por ser mayor el primer año.
		}
		
		return result;
	}
	
	/**
	 * Obtiene el plural de la unidad.
	 * 
	 * @param {String} text : texto que se quiere devolver en plural.
	 * @return {String} : texto en plural.
	 */
	$.TimeRecognizer._getPluralText = function(text) {
		switch (text) {
			case "year":
				return $.TimeRecognizer.pluralYear;
				break;
			case "month":
				return $.TimeRecognizer.pluralMonth;
				break;
			case "day":
				return $.TimeRecognizer.pluralDay;
				break;
			case "hour":
				return $.TimeRecognizer.pluralHour;
				break;
			case "minute":
				return $.TimeRecognizer.pluralMinute;
				break;
			case "second":
				return $.TimeRecognizer.pluralSecond;
				break;
		}
	}
	
	/**
	 * Obtiene el singular de la unidad.
	 * 
	 * @param {String} text : texto que se quiere devolver en singular.
	 * @return {String} : texto en singular.
	 */
	$.TimeRecognizer._getSingleText = function(text) {
		switch (text) {
			case "year":
				return $.TimeRecognizer.singleYear;
				break;
			case "month":
				return $.TimeRecognizer.singleMonth;
				break;
			case "day":
				return $.TimeRecognizer.singleDay;
				break;
			case "hour":
				return $.TimeRecognizer.singleHour;
				break;
			case "minute":
				return $.TimeRecognizer.singleMinute;
				break;
			case "second":
				return $.TimeRecognizer.singleSecond;
				break;
		}
	}
	
	/**
	 * Determina si el número es plural o singular.
	 * 
	 * @param {Int} num : número.
	 * @param {String} : texto.
	 * 
	 * @return {String} : texto en plural o singular
	 */
	$.TimeRecognizer._detectPluralOrSingleText = function(num, text) {
		if (num > 1) {
			return $.TimeRecognizer._getPluralText(text);
		} else if (num == 1) {
			return $.TimeRecognizer._getSingleText(text);
		} else if (num == -1) {
			return $.TimeRecognizer._getSingleText(text);
		} else {
			return $.TimeRecognizer._getPluralText(text);
		}
	}
	
	/**
	 * Fragmenta las variables de entrada en arreglos.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 */
	$.TimeRecognizer._inputFragmentationDate = function(firstDate, lastDate) {
		// Si existen las unidades, las fragmentamos
		// Fragmentamos la fecha inicial
		if (firstDate !== "") {
			$.TimeRecognizer.firstDate.push(parseInt(firstDate.substring(0, 2), 10));
			$.TimeRecognizer.firstDate.push(parseInt(firstDate.substring(3, 5), 10));
			$.TimeRecognizer.firstDate.push(parseInt(firstDate.substring(6), 10));
		} else {
			$.TimeRecognizer.firstDate = [];
		}
		// Fragmentamos la fecha final
		if (lastDate !== "") {
			$.TimeRecognizer.lastDate.push(parseInt(lastDate.substring(0, 2), 10));
			$.TimeRecognizer.lastDate.push(parseInt(lastDate.substring(3, 5), 10));
			$.TimeRecognizer.lastDate.push(parseInt(lastDate.substring(6), 10));
		} else {
			$.TimeRecognizer.lastDate = [];
		}
	}
	
	/**
	 * Fragmenta las variables de entrada en arreglos.
	 * 
	 * @param {String} firstTime : Horas, minutos y segundos, el formato de entrada debe ser hh:mm:ss
	 * @param {String} lastTime  : Horas, minutos y segundos, el formato de entrada debe ser hh:mm:ss
	 */
	$.TimeRecognizer._inputFragmentationTime = function(firstTime, lastTime) {
		// Si existen las unidades, las fragmentamos
		// Fragmentamos la tiempo inicial
		if (firstTime !== "") {
			$.TimeRecognizer.firstTime.push(parseInt(firstTime.substring(0, 2), 10));
			$.TimeRecognizer.firstTime.push(parseInt(firstTime.substring(3, 5), 10));
			$.TimeRecognizer.firstTime.push(parseInt(firstTime.substring(6), 10));
		} else {
			$.TimeRecognizer.firstTime = [];
		}
		// Fragmentamos la tiempo final
		if (lastTime !== "") {
			$.TimeRecognizer.lastTime.push(parseInt(lastTime.substring(0, 2), 10));
			$.TimeRecognizer.lastTime.push(parseInt(lastTime.substring(3, 5), 10));
			$.TimeRecognizer.lastTime.push(parseInt(lastTime.substring(6), 10));
		} else {
			$.TimeRecognizer.lastTime = [];
		}
	}
	
	/**
	 * Reinicia las variables de entrada.
	 */
	$.TimeRecognizer._resetInputVars = function() {
		$.TimeRecognizer.firstDate = [];
		$.TimeRecognizer.lastDate = [];
		$.TimeRecognizer.firstTime = [];
		$.TimeRecognizer.lastTime = [];
	}
	
	/**
	 * Verifica que el formato de la fecha esté correcta.
	 * 
	 * @param {String} date : Fecha que se va a verificar. dd/mm/yyyy
	 * @return {boolean} true or false : Verdadero si lo cumple, falso si no.
	 */
	$.TimeRecognizer.dateFormatIsCorrect = function(date) {
		var reg = /^[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]$/;
		
		return reg.test(date);
	}
	
	/**
	 * Varifica que el formato de las horas esté correcta
	 * 
	 * @param {String} time : Tiempo que se va a verificar. hh:mm:ss
	 * @return {boolean} : Verdadero si es correcto, falso si no lo es.
	 */
	$.TimeRecognizer.timeFormatIsCorrect = function(time) {
		var reg = /^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]$/;
		
		return reg.test(time);
	}
	
	/**
	 * Verifica que la fecha inicial sea menor a la final
	 * 
	 * @param {String} firstDate : fecha inicial.
	 * @param {String} lastDate : fecha final.
	 * 
	 * @return {boolean} : buscamos que el valor sea true.
	 */
	$.TimeRecognizer.dateLessThan = function(firstDate, lastDate) {
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		
		if ($.TimeRecognizer.firstDate[2] <= $.TimeRecognizer.lastDate[2]) {
			if ($.TimeRecognizer.firstDate[1] < $.TimeRecognizer.lastDate[1]) {
				return true;
			} else if ($.TimeRecognizer.firstDate[1] == $.TimeRecognizer.lastDate[1]) {
				if ($.TimeRecognizer.firstDate[2] == $.TimeRecognizer.lastDate[2]) {
					if ($.TimeRecognizer.firstDate[0] <= $.TimeRecognizer.lastDate[0]) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			} else {
				if ($.TimeRecognizer.firstDate[2] < $.TimeRecognizer.lastDate[2]) {
					return true;
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}
	
	/**
	 * Verifica que la tiempo inicial sea menor al final
	 * 
	 * @param {String} firstDate : tiempo inicial.
	 * @param {String} lastDate : tiempo final.
	 * 
	 * @return {boolean} : buscamos que el valor sea true.
	 */
	$.TimeRecognizer.timeLessThan = function(firstTime, lastTime) {
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationTime(firstTime, lastTime);
		
		if ($.TimeRecognizer.firstTime[0] <= $.TimeRecognizer.lastTime[0]) {
			if ($.TimeRecognizer.firstTime[1] < $.TimeRecognizer.lastTime[1]) {
				return true;
			} else if ($.TimeRecognizer.firstTime[1] == $.TimeRecognizer.lastTime[1]) {
				if ($.TimeRecognizer.firstTime[0] == $.TimeRecognizer.lastTime[0]) {
					if ($.TimeRecognizer.firstTime[2] <= $.TimeRecognizer.lastTime[2]) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			} else {
				if ($.TimeRecognizer.firstTime[0] < $.TimeRecognizer.lastTime[0]) {
					return true;
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}
	
	/**
	 * Obtiene, basandose en el rango, la cantidad en años.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * 
	 * @return 
	 */
	$.TimeRecognizer.getAmountYears = function(firstDate, lastDate) {
		var years = 0;
		
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		
		years = $.TimeRecognizer._calculateYears();
		
		$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(years, "year");
		
		return years;
	}
	
	/**
	 * Obtiene, basandose en el rango, la cantidad en meses.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * 
	 * @return 
	 */
	$.TimeRecognizer.getAmountMonths = function(firstDate, lastDate) {
		var months = 0;
		
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		
		months = $.TimeRecognizer._calculateMonths();
		
		$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(months, "month");
		
		return months;
	}
	
	/**
	 * Obtiene, basandose en el rango, la cantidad en días.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * 
	 * @return 
	 */
	$.TimeRecognizer.getAmountDays = function(firstDate, lastDate) {
		var days = 0;
		
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		
		days = $.TimeRecognizer._calculateDays();
		
		$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(days, "day");
		
		return days;
	}
	
	/**
	 * Obtiene, basandose en el rango, la cantidad en horas.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * 
	 * @return 
	 */
	$.TimeRecognizer.getAmountHours = function(firstDate, lastDate, firstTime, lastTime) {
		var hours = 0;
		
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		$.TimeRecognizer._inputFragmentationTime(firstTime, lastTime);
		
		hours = $.TimeRecognizer._calculateHours();
		
		$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(hours, "hour");
		
		return hours;
	}
	
	/**
	 * Obtiene, basandose en el rango, la cantidad en minutos.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * 
	 * @return 
	 */
	$.TimeRecognizer.getAmountMinutes = function(firstDate, lastDate, firstTime, lastTime) {
		var minutes = 0;
		
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		$.TimeRecognizer._inputFragmentationTime(firstTime, lastTime);
		
		minutes = $.TimeRecognizer._calculateMinutes();
		
		$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(minutes, "minute");
		
		return minutes;
	}
	
	/**
	 * Obtiene, basandose en el rango, la cantidad en segundos.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * 
	 * @return 
	 */
	$.TimeRecognizer.getAmountSeconds = function(firstDate, lastDate, firstTime, lastTime) {
		var seconds = 0;
		
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		$.TimeRecognizer._inputFragmentationTime(firstTime, lastTime);
		
		seconds = $.TimeRecognizer._calculateSeconds();
		
		$.TimeRecognizer.unit = $.TimeRecognizer._detectPluralOrSingleText(seconds, "second");
		
		return seconds;
	}
	
	/**
	 * Obtiene la cantidad de tiempo que hay entre las dos fechas dadas en forma textual.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} firstTime : Horas, minutos y segundos, el formato de entrada debe ser hh:mm:ss
	 * @param {String} lastTime  : Horas, minutos y segundos, el formato de entrada debe ser hh:mm:ss
	 * 
	 * @return {String} : Una cadena con el formato aplicado.
	 */
	$.TimeRecognizer.getMuchLonger = function(firstDate, lastDate, firstTime, lastTime) {
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentation(firstDate, lastDate, firstTime, lastTime);
	}
	
	/**
	 * Obtiene, basandose en el rango, el valor maximo posible de la fecha.
	 * 
	 * nota: Para saber en que unidad se calculó utilise 
	 *       la propiedad $.TimeRecognizer.unit del objeto.
	 * 
	 * @param {String} firstDate : Fecha inicial, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} lastDate  : Fecha final, el formato de entrada debe ser dd/mm/yyyy.
	 * @param {String} firstTime : Horas, minutos y segundos, el formato de entrada debe ser hh:mm:ss
	 * @param {String} lastTime  : Horas, minutos y segundos, el formato de entrada debe ser hh:mm:ss
	 * 
	 * @return {Int} : Cantidad maxima posible transcurrida.
	 */
	$.TimeRecognizer.getMaximumPossibleValue = function(firstDate, lastDate, firstTime, lastTime) {
		var result = 0;
		
		$.TimeRecognizer._resetInputVars();
		$.TimeRecognizer._inputFragmentationDate(firstDate, lastDate);
		$.TimeRecognizer._inputFragmentationTime(firstTime, lastTime);
		
		result = $.TimeRecognizer._calculateMaximumPossibleValue();
		
		return result;
	}
})(jQuery, window);
