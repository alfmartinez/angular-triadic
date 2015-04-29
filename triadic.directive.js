'use strict';

angular.module('alfmartinez.triadic', [])
  .directive('triadic', ['$timeout', '$document', function(timer, $document) {
    return {
      template: '<canvas height="{{height}}" width="{{size}}"></canvas>',
      restrict: 'E',
      scope: {
        size: '=size',
        value: '=value'
      },
      link: function(scope, element, attrs) {
        function render() {
          var context = element.find('canvas')[0].getContext('2d');

          function renderTriangle() {
            context.fillStyle = '#A00000';
            context.beginPath();
            context.moveTo(0, scope.height);
            context.lineTo(scope.size / 2, 0);
            context.lineTo(scope.size, scope.height);
            context.closePath();
            context.fill();
          }

          function renderBackground() {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, scope.size, scope.height);
          }

          function renderCursor() {
            context.beginPath();
            context.arc(scope.position.x, scope.position.y, 11, 0, 2 *
              Math.PI,
              false);
            context.fillStyle = 'green';
            context.fill();
          }

          renderBackground();
          renderTriangle();
          renderCursor();

          positionToValues();
        }

        function distance(point1, point2) {

          var xs = 0;
          var ys = 0;

          xs = point2.x - point1.x;
          xs = xs * xs;

          ys = point2.y - point1.y;
          ys = ys * ys;

          return Math.round(Math.sqrt(xs + ys));
        }

        function clickedOnHandle(event) {
          var x = event.offsetX,
            y = event.offsetY;
          return distance({
            x, y
          }, scope.position) < 7 ? true : false;
        }

        function valuesToPosition() {
          return {
            x: scope.size / 2,
            y: Math.round(scope.size * Math.sqrt(3) / 3)
          };
        }
        scope.height = Math.round(scope.size * Math.sqrt(3) / 2);
        scope.position = valuesToPosition();


        function positionToValues() {
          var center = {
            x: scope.size / 2,
            y: Math.round(scope.size * Math.sqrt(3) / 3)
          };

          var axisOne = {
            x: 0 - center.x,
            y: scope.height - center.y
          };

          var axisTwo = {
            x: scope.size / 2 - center.x,
            y: 0 - center.y
          };

          var axisThree = {
            x: scope.size - center.x,
            y: scope.height - center.y
          };

          var local = {
            x: scope.position.x - center.x,
            y: scope.position.y - center.y
          };

          scope.value.one = scalarP(local, axisOne);
          scope.value.two = scalarP(local, axisTwo);
          scope.value.three = scalarP(local, axisThree);
          scope.$apply();
        }

        function scalarP(v1, v2) {
          var product = v1.x * v2.x + v1.y * v2.y;
          return product > 0 ? Math.sqrt(product) : 0;
        }

        function mousemove(event) {
          if (event.offsetX > 0 && event.offsetX < scope.size && event.offsetY <
            scope.height && event.offsetY > 0) {
            scope.position.x = event.offsetX;
            scope.position.y = event.offsetY;
          }
          render();
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }

        timer(render, 0);
        element.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          if (clickedOnHandle(event)) {
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          }
        });


      }
    };
  }]);
