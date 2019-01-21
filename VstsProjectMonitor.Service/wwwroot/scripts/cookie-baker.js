var ProjectMonitor = ProjectMonitor || {};

// ReSharper disable once CyclomaticComplexity
ProjectMonitor.CookieBaker = function (cookieRepository) {
  // ReSharper disable CallerCalleeUsing
  if (!cookieRepository) return new arguments.callee(Cookies);
  if (!(this instanceof arguments.callee)) return new arguments.callee(Cookies);
  // ReSharper restore CallerCalleeUsing

  var bake = function (cookieName, ingredients) {
    cookieRepository.set(cookieName, ingredients);
  };

  var retrieve = function(cookieName) {
    return cookieRepository.get(cookieName);
  };

  return {
    bake: bake,
    retrieve: retrieve
  };
};