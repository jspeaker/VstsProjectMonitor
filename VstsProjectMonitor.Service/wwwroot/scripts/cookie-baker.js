var ProjectMonitor = ProjectMonitor || {};

// ReSharper disable once CyclomaticComplexity
ProjectMonitor.CookieBaker = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var bake = function (cookieName, ingredients) {
    Cookies.set(cookieName, ingredients);
  };

  return {
    bake: bake
  };
};
