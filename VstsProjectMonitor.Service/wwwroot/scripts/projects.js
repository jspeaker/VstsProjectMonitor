var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.Projects = function (domAccess, projectRepository, buildDefinitions, scribe) {
  // ReSharper disable CallerCalleeUsing
  if (!domAccess || !projectRepository || !buildDefinitions || !scribe)
    return new arguments.callee(ProjectMonitor.domAccess,
      new ProjectMonitor.ProjectRepository(ProjectMonitor.domAccess),
      new ProjectMonitor.BuildDefinitions(new ProjectMonitor.BuildDefinitionRepository(ProjectMonitor.domAccess), new Output.HtmlScribe(ProjectMonitor.domAccess)),
      new Output.HtmlScribe(ProjectMonitor.domAccess));

  if (!(this instanceof arguments.callee)) return new arguments.callee(domAccess, projectRepository, buildDefinitions, scribe);
  // ReSharper restore CallerCalleeUsing

  var render = function (target, callback) {
    projectRepository.projects(function (data) {
      if (!data || !data.projects || data.projects.length === 0) {
        callback && callback();
        return;
      }

      var projects = data.projects;
      for (var index = 0; index < projects.length; index += 1) {
        var projectName = projects[index].name;
        scribe.inscribe(target, "optgroup", "project-" + projects[index].id, "select2-selectable-group", projectName, [["label", projectName]]);
        buildDefinitions.render(projectName, target, callback);
      }

      domAccess(target).change(function () {
        //new ProjectMonitor.Historian().record();
        ProjectMonitor.Ui().load();
      });
    });
  };

  return {
    render: render
  };
};

ProjectMonitor.ProjectsUi = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var selectId = "#projects";

  var load = function (callback) {
    new ProjectMonitor.Projects().render(selectId, callback);
  };

  var projects = function () {
    var projectOptions = ProjectMonitor.domAccess(selectId + " option:selected");

    var projectNames = [];
    for (var index = 0; index < projectOptions.length; index += 1) {
      projectNames.push(ProjectMonitor.domAccess(projectOptions[index]).data("project-name"));
    }

    return projectNames.distinct();
  };

  // TODO: unit test this
  var buildDefinitionIds = function () {
    var nameOptions = ProjectMonitor.domAccess(selectId + " option:selected");
    var names = [];
    for (var index = 0; index < nameOptions.length; index += 1) {
      names.push(ProjectMonitor.domAccess(nameOptions[index]).data("project-name") + "-" + nameOptions[index].value);
    }
    return names;
  };

  return {
    load: load,
    projects: projects,
    buildDefinitionIds: buildDefinitionIds
  };
};
