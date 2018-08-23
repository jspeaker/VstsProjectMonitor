var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.BugRepository = function (domAccess) {
  // ReSharper disable CallerCalleeUsing
  if (!domAccess) return new arguments.callee(ProjectMonitor.domAccess);
  if (!(this instanceof arguments.callee)) return new arguments.callee(domAccess);
  // ReSharper restore CallerCalleeUsing

  var bugs = function(projectName, callback) {
    domAccess.get("/api/" + projectName + "/bug", function (result) {
      callback && callback(result);
    });
  };

  return {
    bugs: bugs
  };
};
