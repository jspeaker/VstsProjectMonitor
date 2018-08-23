var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.BuildDefinitionRepository = function (domAccess) {
  // ReSharper disable CallerCalleeUsing
  if (!domAccess) return new arguments.callee(ProjectMonitor.domAccess);
  if (!(this instanceof arguments.callee)) return new arguments.callee(domAccess);
  // ReSharper restore CallerCalleeUsing

  var buildDefinitions = function (projectName, callback) {
    domAccess.get("/api/" + projectName + "/build/definition", function (result) {
      callback && callback(result);
    });
  };

  return {
    buildDefinitions: buildDefinitions
  };
};
