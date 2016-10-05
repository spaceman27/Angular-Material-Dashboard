// Code goes here

"use strict";
var app = angular.module("app", [
  "ui.router",
  "ui.bootstrap",
  "ngAnimate",
  "ngAria",
  "ngMaterial"
]);
app.config([
  "$stateProvider", "$urlRouterProvider", "$httpProvider",
  function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state("home", {
        url: "/home",
        templateUrl: "layout/home.html",
        controller: "demoController"
      })
      .state("d3", {
        url: "/d3",
        templateUrl: "layout/d3.html",
        controller: "d3Controller"
      })
      .state("analytic", {
        url: "/analytic",
        templateUrl: "layout/analytic.html",
        controller: "analyticController"
      })
      .state("about", {
        url: "/about",
        templateUrl: "layout/about.html",
        controller: "aboutController"
      })
      .state("contact", {
        url: "/contact",
        templateUrl: "layout/contact.html"
      });
    // catch all route
    // send users to the home page 
    $urlRouterProvider.otherwise("home");
  }
]);