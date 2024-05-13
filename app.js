app = angular.module("parshwadyes", ['ngRoute', /*'ngIdle',*/ 'base64', 'ngStorage', 'ngValidate', 'ngSanitize', 'ngFileUpload', /*'checklist-model',*/ "ui.bootstrap", /*"angular-google-analytics",*/ 'ksSwiper', /*'hl.sticky',*/ 'ui.swiper', 'ngMaterial' /*'ngMessages',*/ /*'socialbase.sweetAlert',*/ /*'rzModule',*/ /*'socialLogin',*/ /*'angular-nicescroll',*/ /*'ui.bootstrap.datetimepicker',*/ /*'angular-progress-arc'*/]);
/*ngImgCrop*/

app.$inject = ['SweetAlert'];

var base_url = 'http://192.168.1.17/parshwadyes/';

app.config(['$locationProvider', '$routeProvider', '$validatorProvider', /*'AnalyticsProvider',*/ /*'socialProvider',*/
	function ($locationProvider, $routeProvider, $validatorProvider /*AnalyticsProvider,*/ /*socialProvider*/) {

		// /** Adding validation method for password **/
		// $validatorProvider.addMethod("pwcheck", function(value, element, param) {
		// 	return (/[A-Z]/.test(value) && /\d/.test(value) && /[$@$!%*#?&]/.test(value));
		// }, 'Password must contain 1 special character, 1 Capital letter and 1 Digit!');

		/** Adding validation method for letters only **/
		// $validatorProvider.addMethod("lettersonly", function(value, element) {
		// 	return this.optional(element) || /^[a-z]+$/i.test(value);
		// }, "Special characters and numbers are not allowed!");

		// /** Adding validation method for letters only **/
		// $validatorProvider.addMethod("alphaonly", function(value, element) {
		// 	return this.optional(element) || /^[a-zA-Z\s]+$/i.test(value);
		// }, "Special characters and numbers are not allowed!");

		$locationProvider.hashPrefix('');

		$validatorProvider.addMethod('notEqualTo', function (value, element, param) {
			var target = $(param);
			if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
				target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
					$(element).valid();
				});
			}
			return value !== target.val();
		}, 'Please enter other string, string should be diffrent.');

		$validatorProvider.addMethod('validate_name', function (value, element) {
			/*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
			return (/^[A-Za-z]?[A-Za-z ]*$/.test(value));
			// has a digit
		}, 'Please enter valid name.');

		$validatorProvider.addMethod('floating_val', function (value, element) {
			/*return this.optional(element) || /^http:\/\/mydomain.com/.test(value);*/
			return (/^\d{1,5}([\.](\d{1,4})?)?$/.test(value));
			// has a digit
		}, 'Please enter valid value.');

		$routeProvider.when("/", {
			templateUrl: "templates/home.html?ver=12-01-2023-v1",
			controller: "homeController",
			page_title: "",
		})

			.otherwise({
				redirectTo: "/"
			});

		$locationProvider.html5Mode(true);
	}
]);

app.run(function ($timeout, $rootScope, $location, $localStorage, $http, $window, $routeParams, $filter) {
	$rootScope.$on('$routeChangeStart', function (evt, current, previous, $filter, next) {
		// $rootScope.page_title = "";

		$rootScope.page_load_start = true;
		$rootScope.load_start = true;
		// $rootScope.loading_bar_fun();

		// angular.element(".loading_body").class("opacity": "0");

		$rootScope.base_url = base_url;
		$rootScope.screenWidth = screen.width;
		$rootScope.activePath = $location.path();
		$rootScope.pageContent = "";
		$rootScope.category_get = "";
		$rootScope.dropdown_category_get = "";
		$window.scrollTo(0, 0);
		$rootScope.page_title = current.$$route.page_title ? current.$$route.page_title : "";
		$rootScope.page_description = current.$$route.page_description ? current.$$route.page_description : "";

		$rootScope.page_flag = current.$$route.page_flag;

	});

	$rootScope.$on('$routeChangeSuccess', function (evt, current, previous) {
		$timeout(function () {
			$window.scrollTo(0, 0);
		}, 1000);
	});

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		if (next.indexOf('/uploads/') > 0) {
			event.preventDefault();
		}
	});

});

app.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter, {
						'event': event
					});
				});
				event.preventDefault();
			}
		});
	};
});

app.directive('numbersOnly', function () {
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

app.filter('replace', [function () {

	return function (input, from, to) {

		if (input === undefined) {
			return;
		}

		var regex = new RegExp(from, 'g');
		return input.replace(regex, to);

	};

}]);

app.directive('lettersOnly', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attr, ngModelCtrl) {
			function fromUser(text) {
				if (text) {
					var transformedInput = text.replace(/[^a-zA-Z ]/g, '');

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

app.directive('hires', function () {
	return {
		restrict: 'A',
		scope: {
			hires: '@'
		},
		link: function (scope, element, attrs) {
			element.addClass("lazyLoad_loadd");
			element.one('load', function () {
				setTimeout(function () {
					element.attr('src', scope.hires);
					element.removeClass("lazyLoad_loadd");
					element.addClass("lazyLoad_load");
				}, 500)
			});
		}
	};
});

app.directive("limitTo", [function () {
	return {
		restrict: "A",
		link: function (scope, elem, attrs) {
			var limit = parseInt(attrs.limitTo);
			angular.element(elem).on("keypress", function (e) {
				if (this.value.length == limit) e.preventDefault();
			});
		}
	}
}]);

app.directive("limitTo2", [function () {
	return {
		restrict: "C",
		link: function (scope, elem, attrs) {
			var limit = parseInt(attrs.limitTo);
			angular.element(elem).on("keypress", function (e) {
				if (this.value.length == limit) e.preventDefault();
			});
		}
	}
}]);

app.directive('ngSpace', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if (event.which === 32) {
				scope.$apply(function () {
					scope.$eval(attrs.ngSpace, {
						'event': event
					});
				});
				event.preventDefault();
			}
		});
	};
});

app.directive('scrollOnClick', function () {
	return {
		restrict: 'EA',
		template: '<a title="Scroll to Top" class="scrollup">Scroll</a>',
		link: function (scope, $elm) {
			$(window).scroll(function () {
				if ($(this).scrollTop() > 300) {
					$('.scrollup').fadeIn();
				} else {
					$('.scrollup').fadeOut();
				}
			});
			$elm.on('click', function () {
				$("html,body").animate({
					scrollTop: '0px'
				}, "slow");
			});
		}
	}
});

app.directive('ngEscape', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if (event.which === 27) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEscape, {
						'event': event
					});
				});
				event.preventDefault();
			}
		});
	};
});

app.directive('focusClass', function () {
	return {
		link: function (scope, elem, attrs) {
			elem.find('input').on('focus', function () {
				elem.toggleClass(attrs.focusClass);
			}).on('blur', function () {
				elem.toggleClass(attrs.focusClass);
			});
		}
	}
});

app.directive('ngFile', ['$parse',
	function ($parse) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('change', function () {
					$parse(attrs.ngFile).assign(scope, element[0].files)
					scope.$apply();
				});
			}
		};
	}
]);

app.directive('ngFileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.ngFileModel);
			var isMultiple = attrs.multiple;
			var modelSetter = model.assign;
			element.bind('change', function () {
				var values = [];
				angular.forEach(element[0].files, function (item) {
					var value = {
						name: item.name,
						size: item.size,
						extension: item.name.substring(item.name.lastIndexOf('.') + 1, item.name.length),
						url: URL.createObjectURL(item),
						_file: item
					};
					values.push(value);
				});
				scope.$apply(function () {
					if (isMultiple) {
						modelSetter(scope, values);
					} else {
						modelSetter(scope, values[0]);
					}
				});
			});
		}
	};
}]);

app.filter("trustUrl", ['$sce',
	function ($sce) {
		return function (recordingUrl) {
			return $sce.trustAsResourceUrl(recordingUrl);
		};
	}
]);

app.filter('sanitizer', ['$sce',
	function ($sce) {
		return function (url) {
			return $sce.trustAsHtml(url);
		};
	}
]);

app.filter('dateSuffix', function ($filter) {
	var suffixes = ["th", "st", "nd", "rd"];
	return function (input) {
		var dtfilter = $filter('date')(input, 'EEE, MMM dd');
		var day = parseInt(dtfilter.slice(-2));
		var relevantDigits = (day < 30) ? day % 20 : day % 30;
		var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
		return dtfilter + suffix;
	};
});

app.directive('accordion', function () {
	return {
		restrict: 'ACE',
		link: function (scope, element, attributes) {
			var ele = angular.element(element)
			angular.element('#accordion .accordion_click.active').next('.content_accordian').show();
			ele.bind('click', function () {
				ele.toggleClass('active');
				ele.next('.content_accordian').stop().slideToggle();
				ele.parents('.career_position_list, .venture_menu_list').siblings().find('.accordion_click').removeClass('active');
				ele.parents('.career_position_list').siblings().find('.content_accordian').slideUp();
				return false;
			});
		},
	}
});

app.directive('readMore', ['$compile', function ($compile) {
	return {
		restrict: 'A',
		scope: true,
		link: function (scope, element, attrs) {

			scope.collapsed = false;

			scope.toggle = function () {
				scope.collapsed = !scope.collapsed;
			};

			attrs.$observe('ddTextCollapseText', function (text) {

				var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

				if (text.length > maxLength) {
					var firstPart = String(text).substring(0, maxLength);
					var secondPart = String(text).substring(maxLength, text.length);

					var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
					var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
					var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
					var lineBreak = $compile('<br ng-if="collapsed" class="readmore_para">')(scope);
					var toggleButton = $compile('<span class="readmore_click" ng-click="toggle();">{{collapsed ? "read less" : "read more"}}</span>')(scope);

					element.empty();
					element.append(firstSpan);
					element.append(secondSpan);
					element.append(moreIndicatorSpan);
					element.append(lineBreak);
					element.append(toggleButton);
				} else {
					element.empty();
					element.append(text);
				}
			});
		}
	};
}]);

app.directive('starRating', function () {
	return {
		restrict: 'A',
		template: '<ul class="rating" ng-class="{readonly: readonly}">'
			+ '    <li  ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)" ng-mouseover="toggle($index)">'
			+ '<i class="fa fa-star" aria-hidden="true"></i>'
			+ '</li>'
			+ '</ul>',
		scope: {
			readonly: '=',
			ratingValue: '=',
			max: '=',
			onRatingSelected: '&'
		},
		link: function (scope, elem, attrs) {
			var updateStars = function () {
				scope.stars = [];
				for (var i = 0; i < scope.max; i++) {
					scope.stars.push({
						filled: i < scope.ratingValue
					});
				}
			};

			scope.toggle = function (index) {
				if (scope.readonly == undefined || scope.readonly === false) {
					scope.ratingValue = index + 1;
					scope.onRatingSelected({
						rating: index + 1
					});
				}
			};

			scope.$watch('ratingValue',
				function (oldVal, newVal) {
					if (newVal) {
						updateStars();
					}
				}
			);
		}
	};
}
);

app.controller("MainController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, $window, $route, $base64, $timeout, $sce, $mdToast, $filter, $interval) {

    $rootScope.year = new Date().getFullYear();

})

app.controller("homeController", function ($scope, $location, $rootScope, $timeout, $http, $localStorage, $routeParams, $window, $route, $base64, $timeout, $sce, $mdToast, $filter, $interval) {

	console.log("Home controller");

})