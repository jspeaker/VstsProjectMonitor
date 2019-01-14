var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.Bugs = function (bugRepository, scribe) {
  // ReSharper disable CallerCalleeUsing
  if (!bugRepository || !scribe) return new arguments.callee(new ProjectMonitor.BugRepository(ProjectMonitor.domAccess), new Output.HtmlScribe(ProjectMonitor.domAccess));
  if (!(this instanceof arguments.callee)) return new arguments.callee(bugRepository);
  // ReSharper restore CallerCalleeUsing

  var render = function (projectName, target) {
    bugRepository.bugs(projectName,
      function(data) {
        scribe.inscribe(target, "div", ProjectMonitor.ProjectName(projectName).domId(), "", "Open Bug Count: " + data.bugs.length, "");
      });
  };

  return {
    render: render
  };
};
