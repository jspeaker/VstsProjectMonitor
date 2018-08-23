var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.BuildDefinitionGroup = function (builds, scribe) {
  // ReSharper disable CallerCalleeUsing
  if (!scribe) return new arguments.callee(builds, new Output.HtmlScribe(ProjectMonitor.domAccess));
  if (!(this instanceof arguments.callee)) return new arguments.callee(builds, scribe);
  // ReSharper restore CallerCalleeUsing

  var build = function (index) {
    if (builds.length < index + 1) return { result: "empty", buildNumber: "&nbsp;", definition: { id: 0, name: "" } };

    return builds[index];
  };

  var cacheBuildDefinitionGroup = function (buildDefinitionRow) {
    ProjectMonitor.domAccess(buildDefinitionRow).data("builds", builds);
  };

  var rowId = function () {
    if (builds.length === 0) return "no-builds-for-definition";

    return "definition-" + builds[0].definition.id;
  };

  var render = function (target) {
    var buildDefinitionRow = scribe.inscribe(target.replace(".", "\\."), "tr", rowId(), "", "");
    cacheBuildDefinitionGroup(buildDefinitionRow);

    scribe.inscribe(scribe.inscribe(buildDefinitionRow, "td", "", "", ""), "p", "", "", builds[0].definition.name);

    for (var index = 0; index < 3; index += 1) {
      scribe.inscribe(scribe.inscribe(buildDefinitionRow, "td", "", "", ""), "p", "", build(index).result, build(index).buildNumber);
    }
  };

  return {
    render: render
  };
};

ProjectMonitor.Builds = function (domAccess, projectRepository) {
  // ReSharper disable CallerCalleeUsing
  if (!domAccess || !projectRepository) return new arguments.callee(ProjectMonitor.domAccess, new ProjectMonitor.ProjectRepository(ProjectMonitor.domAccess));
  if (!(this instanceof arguments.callee)) return new arguments.callee(domAccess, projectRepository);
  // ReSharper restore CallerCalleeUsing

  var currentCachedBuild = function (buildDefinitionId) {
    var cachedBuildData = domAccess("#definition-" + buildDefinitionId).data("builds");
    return cachedBuildData && cachedBuildData.length > 0 ? cachedBuildData[0] : { buildNumber: 0, status: "" };
  };

  var write = function (target, builds) {
    var buildDefinitionIds = builds.identifiers("definition", "id");

    for (var index = 0; index < buildDefinitionIds.length; index += 1) {
      var cachedBuildData = currentCachedBuild(buildDefinitionIds[index]);

      var mostRecentBuild = builds[0];
      var identical = mostRecentBuild.buildNumber === cachedBuildData.buildNumber && mostRecentBuild.status === cachedBuildData.status;
      if (identical) continue;

      new ProjectMonitor.BuildDefinitionGroup(builds.where(buildDefinitionIds[index], "definition", "id")).render(target);
    }
  };

  var render = function (target, buildDefinitionId) {
    projectRepository.build(buildDefinitionId,
      function (data) {
        if (!data || !data.builds || data.builds.length === 0) return;
        write(target, data.builds);
      });
  };

  return {
    render: render
  };
};
