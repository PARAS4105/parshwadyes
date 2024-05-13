app.directive('onlyLettersInput', function(){

   return {

    require: 'ngModel',

    link: function(scope, element, attr, ngModelCtrl) {

      function fromUser(text) {

        var transformedInput = text.replace(/[^a-zA-Z]/g, '');

        if (transformedInput !== text) {

          ngModelCtrl.$setViewValue(transformedInput);

          ngModelCtrl.$render();

        }

        return transformedInput;

      }

      ngModelCtrl.$parsers.push(fromUser);

    }

  };

});

app.directive('validateName', function(){

   return {

    require: 'ngModel',

    link: function(scope, element, attr, ngModelCtrl) {

      function fromUser(text) {

        var transformedInput = text.replace(/[^a-zA-Z0-9& ]/g, '');

        if (transformedInput !== text) {

          ngModelCtrl.$setViewValue(transformedInput);

          ngModelCtrl.$render();

        }

        return transformedInput;

      }

      ngModelCtrl.$parsers.push(fromUser);

    }

  };

});

app.directive('onlyAlphanumeric', function(){

   return {

    require: 'ngModel',

    link: function(scope, element, attr, ngModelCtrl) {

      function fromUser(text) {

        var transformedInput = text.replace(/[^A-Z0-9]/g, '');

        if (transformedInput !== text) {

          ngModelCtrl.$setViewValue(transformedInput);

          ngModelCtrl.$render();

        }

        return transformedInput;

      }

      ngModelCtrl.$parsers.push(fromUser);

    }

  };

});

app.directive('onlyLettersInputSpace', function(){

   return {

    require: 'ngModel',

    link: function(scope, element, attr, ngModelCtrl) {

      function fromUser(text) {

        var transformedInput = text.replace(/[^a-zA-Z ]/g, '');

        if (transformedInput !== text) {

          ngModelCtrl.$setViewValue(transformedInput);

          ngModelCtrl.$render();

        }

        return transformedInput;

      }

      ngModelCtrl.$parsers.push(fromUser);

    }

  };

});



app.directive('numbersOnly', function () {

    return {

        require: 'ngModel',

        link: function (scope, element, attr, ngModelCtrl) {

            function fromUser(text) {

                if (text) {
                    text = text.toString();
                    var transformedInput = text.replace(/[^0-9.]/g, '');

                    if (transformedInput !== text) {

                        ngModelCtrl.$setViewValue(transformedInput);

                        ngModelCtrl.$render();

                    }

                    return transformedInput;

                }

                return undefined;

            }

            ngModelCtrl.$parsers.push(fromUser);

        }

    };

});

app.directive("compareTo", function ()  
{  
    return {  
        require: "ngModel",  
        scope:  
        {  
            confirmPassword: "=compareTo"  
        },  
        link: function (scope, element, attributes, modelVal)  
        {  
            modelVal.$validators.compareTo = function (val)  
            {  
                return val == scope.confirmPassword;  
            };  
            scope.$watch("confirmPassword", function ()  
            {  
                modelVal.$validate();  
            });  
        }  
    };  
});



app.directive('onlyDigits', function () {

    return {

        require: 'ngModel',

        link: function (scope, element, attr, ngModelCtrl) {

            function fromUser(text) {

                if (text) {

                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {

                        ngModelCtrl.$setViewValue(transformedInput);

                        ngModelCtrl.$render();

                    }

                    return transformedInput;

                }

                return undefined;

            }

            ngModelCtrl.$parsers.push(fromUser);

        }

    };

});



app.directive('phoneNumber', function () {

    return {

        require: 'ngModel',

        link: function (scope, element, attr, ngModelCtrl) {

            function fromUser(text) {

                if (text) {

                    var transformedInput = text.replace(/^\d{11,11}$/, '');

                    if (transformedInput !== text) {

                        ngModelCtrl.$setViewValue(transformedInput);

                        ngModelCtrl.$render();

                    }

                    return transformedInput;

                }

                return undefined;

            }

            ngModelCtrl.$parsers.push(fromUser);

        }

    };

});





app.directive('validEmail', function () {

    return {

        require: 'ngModel',

        link: function (scope, element, attrs, control) {

            control.$parsers.push(function (viewValue) {

                var newEmail = control.$viewValue;

                control.$setValidity("invalidEmail", true);

                if (typeof newEmail === "object" || newEmail == "") return newEmail;  // pass through if we clicked date from popup

                if (!newEmail.match(/^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;,.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/))

                    control.$setValidity("invalidEmail", false);

                return viewValue;

            });

        }

    };

});





app.directive("limitTo", [function() {

    return {

        restrict: "A",

        link: function(scope, elem, attrs) {

            var limit = parseInt(attrs.limitTo);

            angular.element(elem).on("keypress", function(e) {

                if (this.value.length == limit) e.preventDefault();

            });

        }

    }

}]);



app.directive('decimalNumber', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9.]/g, '');

                    if (digits.split('.').length > 2) {
                        digits = digits.substring(0, digits.length - 1);
                    }

                    if (digits.split('.')[0] == "") {
                        digits = "0" + '.' + digits.split('.')[1];
                    }

                    if (digits.split('.')[1] && digits.split('.')[1].length > 2) {
                         digits = digits.split('.')[0] + '.' + digits.split('.')[1].substring(0, 2);
                    }

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseFloat(digits);
                }
                return "";
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});

app.directive('validateEquals', [function () {

    return {

      require: 'ngModel',

      link: function (scope, elem, attrs, ctrl) {

        var firstPassword = '#' + attrs.validateEquals;

        elem.add(firstPassword).on('keyup', function () {

          scope.$apply(function () {

            var v = elem.val()===$(firstPassword).val();

            ctrl.$setValidity('inputmatch', v);

          });

        });

      }

    } 

}]);

app.directive('lowerThan', [
  function() {
    var link = function($scope, $element, $attrs, ctrl) {
      var validate = function(viewValue) {
        var comparisonModel = $attrs.lowerThan;
        if(!viewValue || !comparisonModel){
          ctrl.$setValidity('lowerThan', true);
          return viewValue;
        } else {
          ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) <= parseInt(comparisonModel, 10) );
          return viewValue;
        }
      };
      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.push(validate);
      $attrs.$observe('lowerThan', function(comparisonModel){
        return validate(ctrl.$viewValue);
      });
    };
    return {
      require: 'ngModel',
      link: link
    };
  }
]);