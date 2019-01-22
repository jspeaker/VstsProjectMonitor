var Fakes = Fakes || {};

Fakes.CookieBaker = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var cookies = [];

  var bake = function (cookieName, ingredients) {
    cookies.push({ name: cookieName, value: ingredients });
  };

  var retrieve = function (cookieName) {
    return JSON.stringify(cookies.find(function(element) {
      return element.name === cookieName;
    }).value);
  };

  return {
    bake: bake,
    retrieve: retrieve
  };
};
