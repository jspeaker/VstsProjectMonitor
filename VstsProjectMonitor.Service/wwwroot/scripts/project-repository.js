var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.ProjectRepository = function (domAccess) {
  // ReSharper disable CallerCalleeUsing
  if (!domAccess) return new arguments.callee(ProjectMonitor.domAccess);
  if (!(this instanceof arguments.callee)) return new arguments.callee(domAccess);
  // ReSharper restore CallerCalleeUsing

  var builds = function (buildDefinitionIds, callback) {
    var index;
    var projectName;
    var projectNames = [];
    var definitionIds;

    for (index = 0; index < buildDefinitionIds.length; index += 1) {
      projectName = buildDefinitionIds[index].split("-")[0];
      if (projectNames.indexOf(projectName) > -1) continue;
      projectNames.push(projectName); 

      definitionIds = [];
      for (var idIndex = 0; idIndex < buildDefinitionIds.length; idIndex += 1) {
        if (buildDefinitionIds[idIndex].split("-")[0] !== projectName) continue;
        definitionIds.push(buildDefinitionIds[idIndex].split("-")[1]);
      }

      domAccess.get("/api/" + projectName + "/" + definitionIds.join(",") + "/build/", function (result) {
        callback && callback(result);
      });
    }
  };

  var build = function (buildDefinitionId, callback) {
    var projectSegment = buildDefinitionId.split("-")[0];
    var idSegment = buildDefinitionId.split("-")[1];

    domAccess.get("/api/" + projectSegment + "/" + idSegment + "/build/", function (result) {
      callback && callback(result);
    });
  };

  var projects = function (callback) {
    domAccess.get("/api/project/", function (result) {
      callback && callback(result);
    });
  };

  return {
    builds: builds,
    build: build,
    projects: projects
  };
};
