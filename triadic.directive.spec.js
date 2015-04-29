'use strict';

describe('Directive: triadic', function () {

  // load the directive's module
  beforeEach(module('componentsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<triadic></triadic>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the triadic directive');
  }));
});