// ReSharper disable CyclomaticComplexity
// ReSharper disable NativeTypePrototypeExtending

Location.Wrapper = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var buildDefinitions = function () {
    return document.location.search.getQueryValue("buildDefinitions");
  };

  var projectNames = function () {
    var definitions = buildDefinitions();
    var projectBuildDefinitions = definitions.split(";");
    var projects = [];
    for (var index = 0; index < projectBuildDefinitions.length; index += 1) {
      projects.push(projectBuildDefinitions[index].split(",")[0].split("-")[0]);
    }
    return projects;
  };

  return {
    buildDefinitions: buildDefinitions,
    projectNames: projectNames
  };
};

String.prototype.getQueryValue = function (key) {
  var index, kvp;
  var query = decodeURIComponent(this.replace("?", ""));
  var params = query.split("&");
  for (index = 0; index < params.length; index += 1) {
    kvp = params[index].split("=");
    if (kvp.length > 1 && kvp[0] === key) {
      return kvp[1];
    }
  }
  return "";
};

Array.prototype.identifiers = function () {
  if (arguments[0] === undefined || arguments[0] === null) return [];

  var args = [].slice.call(arguments);
  var identifiers = [];

  for (var thisIndex = 0; thisIndex < this.length; thisIndex += 1) {
    var element = this[thisIndex];

    for (var argsIndex = 0; argsIndex < args.length; argsIndex += 1) {
      element = element[args[argsIndex]];
    }

    if (identifiers.includes(element)) continue;

    identifiers.push(element);
  }

  return identifiers;
};

Array.prototype.where = function (value) {
  if (arguments.length < 2) return [];

  var args = [].slice.call(arguments);
  var elements = [];

  for (var thisIndex = 0; thisIndex < this.length; thisIndex += 1) {
    var identifier = this[thisIndex];

    for (var argsIndex = 1; argsIndex < args.length; argsIndex += 1) {
      if (identifier === null || identifier === undefined) break;

      identifier = identifier[args[argsIndex]];
    }

    if (identifier !== value) continue;

    elements.push(this[thisIndex]);
  }

  return elements;
};

Array.prototype.distinct = function () {
  var distinctElements = [];
  for (var index = 0; index < this.length; index += 1) {
    if (distinctElements.indexOf(this[index]) > -1) continue;
    distinctElements.push(this[index]);
  }
  return distinctElements;
};