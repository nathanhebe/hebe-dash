var utils = (function () {
    var private_var;

    function private_function() {
    }

    function setupExtensionFunctions() {
        //console.log('Setting up extension functions');
        // str.startsWith
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.slice(0, str.length) == str;
            };
        }
        // str.endsWith
        if (typeof String.prototype.endsWith != 'function') {
            String.prototype.endsWith = function (str) {
                return this.slice(-str.length) == str;
            };
        }
        // str.toPrecisionDigits
        if (typeof Number.prototype.toPrecisionDigits != 'function') {
            Number.prototype.toPrecisionDigits = function (len) {
                var str = this.toString();
                if (str.indexOf('.') > -1) {
                    var digits = str.replace(/\D/g, '');
                    if (digits.length > 3) {
                        var strChars = str.replace(/\d/g, '');
                        var result = str.substring(0, (len + strChars.length));
                        return result;
                    }
                }

                // rounding

                return str;
            };
        }
        // str.fixChars
        if (typeof String.prototype.fixChars != 'function') {
            String.prototype.fixChars = function (str) {
                //todo: replace any dodgy characters here
                return this.replace('ÂŁ', '£').replace('__', "'");
            };
        }

        // str.cleanDateFormats
        if (typeof String.prototype.cleanDateFormats != 'function') {
            String.prototype.cleanDateFormats = function () {
                var sanitizedStr = this;
                sanitizedStr = sanitizedStr.replace('T00:00:00', '');
                return sanitizedStr;
            };
        }
    };

    return {
        init: function () {
            setupExtensionFunctions();
        },
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        isArray: function (target) {
            return (Object.prototype.toString.call(target) === '[object Array]');
        },
        parseNumber: function (string) {
            var str = string.toString();
            var number = str.replace(/[^0-9\.]+/g, '');
            return parseFloat(number);
        },
        public_function2: function () {
        }
    }
})();


utils.init();