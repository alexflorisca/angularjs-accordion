'use strict';

/**
 * Simple accordion with HTML headers
 *
 * TODO: Show/Hide panel transitions - look at how bootstrap does it
 * TODO: Refactor so main functions are set on the accordion-section
 * 			 rather than the accordionSectionHeader
 *
 *
 * USE:
 * <accordion>
 * 	 <accordion-section>
 * 	 	 <accordion-section-header>Header</accordion-section-header>
 * 	 	 <accordion-section-body>
 * 	 	 	 Accordion body here.
 * 	 	 </accordion-section-body>
 * 	 </accordion-section>
 * </accordion>
 */

angular.module('accordion', []);
angular.module('accordion')

// Accordion settings
.constant('config', {
	openMultiple: false, 		// Multiple open windows allowed?
	alwaysOpen: true,				// Should one window always be open?
	defaultOpen: false 			// Should all the windows be open to start with?
})

.directive('accordion', ['config', function(config) {
	return {
		restrict: 'E',
		scope: {},
		transclude: true,
		replace: true,
		template: '<dl ng-transclude class="accordion"></dl>',
		controller: function() {
			// We need to keepa track of all the sections in the accordion
			var sections = [];

			// Add a section to the accordion
			this.addSection = function(section) {
				sections.push(section);

				// If the alwaysOpen setting is set to true
				// open the first section initially
				if(config.alwaysOpen && sections.length > 0) {
					sections[0].expanded = true;
				}
			};

			// Collapse all sections & expand the selected one
			this.expandSection = function(section) {
				// Hide all sections first if necessary
				if(!config.openMultiple) {
					angular.forEach(sections, function(iteratedSection) {
						if(iteratedSection !== section) {
							iteratedSection.expanded = false;
						}
					});
				}
				// Make sure one tap is always open if set in config
				if(config.alwaysOpen && !config.openMultiple) {
					section.expanded = true;
				}
				// Otherwise toggle the section visibility
				else {
					section.expanded = !section.expanded;
				}
			};
		}
	};
}])

.directive('accordionSection', function() {
	return {
		restrict: 'E',
		require: '^accordion',
		transclude: true,
		replace: true,
		template: '<dd ng-transclude class="accordion-section"></dd>'
	};
})

.directive('accordionSectionHeader', ['config', function(config) {
	return {
		restrict: 'E',
		require: '^accordion',
		transclude: true,
		replace: true,
		template: '<div ng-transclude class="accordion-section-header" ng-click="toggle()"></div>',
		link: function(scope, element, attrs, ctrl) {
			// Set initial state of the section
			scope.expanded = config.defaultOpen;

			// Add the section to the accordion
			ctrl.addSection(scope);

			scope.toggle = function() {
				ctrl.expandSection(scope);
			};
		}
	};
}])

.directive('accordionSectionBody', function() {
	return {
		restrict: 'E',
		require: 'accordionSectionHeader',
		transclude: true,
		replace: true,
		template: '<div ng-transclude class="accordion-section-body" ng-show="expanded"></div>'
	};
});