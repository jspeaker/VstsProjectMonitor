var Fakes = Fakes || {};

Fakes.DomAccess = function (data) {
  var path;
  var paths = [];

  var get = function (relativePath, callback) {
    path = relativePath;
    paths.push(path);
    callback && callback(data, relativePath);
  };

  return {
    get: get,
    relativePath: function() {
      return path;
    },
    relativePaths: function() {
      return paths;
    }
  };
};
