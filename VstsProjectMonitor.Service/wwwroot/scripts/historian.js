var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.Historian = function (cookieBaker) {
  // ReSharper disable CallerCalleeUsing
  if (!cookieBaker) return new arguments.callee(new ProjectMonitor.CookieBaker());
  if (!(this instanceof arguments.callee)) return new arguments.callee(cookieBaker);
  // ReSharper restore CallerCalleeUsing

  var record = function (target, recordName) {
    var selectedBuildDefinitions = $(target).find("option:selected");
    var projectBuildDefinitions = [];
    var index;

    for (index = 0; index < selectedBuildDefinitions.length; index += 1) {
      var projectName = $(selectedBuildDefinitions[index]).data("project-name");
      var project = projectBuildDefinitions.find(function (element) { return element.projectName === projectName; });

      if (!project) {
        project = { projectName: projectName, buildDefinitionIds: [] };
        projectBuildDefinitions.push(project);
      }

      projectBuildDefinitions.find(function (element) { return element.projectName === projectName; }).buildDefinitionIds.push(selectedBuildDefinitions[index].value);
    }
    cookieBaker.bake(recordName, projectBuildDefinitions);
  };

  var recite = function (recordName) {
    return cookieBaker.retrieve(recordName);
  };

  return {
    record: record,
    recite: recite
  };
};
