var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.init = function (domAccess, callback) {
  this.domAccess = domAccess;

  callback && callback();
};

ProjectMonitor.Ui = function (domAccess, builds, bugs, projectsUi, scribe) {
  // ReSharper disable CallerCalleeUsing
  if (!domAccess || !builds || !bugs || !projectsUi || !scribe) return new arguments.callee(ProjectMonitor.domAccess, new ProjectMonitor.Builds(), new ProjectMonitor.Bugs(), new ProjectMonitor.ProjectsUi(), new Output.HtmlScribe(ProjectMonitor.domAccess));
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var writeProjectHeader = function (tableSectionId, projectName) {
    scribe.inscribe(tableSectionId, "h2", "", "", projectName, "");
  };

  var writeTable = function (tableSectionId, projectName) {
    scribe.inscribe(tableSectionId, "table", "table-" + projectName, "table table-striped table-condensed table-hover", "", "");
  };

  var writeTableHeader = function (projectName) {
    var projectNameEscaped = projectName.replace(".", "\\.");
    scribe.inscribe("#table-" + projectNameEscaped, "thead", "", "", "", "");
    scribe.inscribe("#table-" + projectNameEscaped + " thead", "tr", "", "", "", "");
    scribe.inscribe("#table-" + projectNameEscaped + " thead tr", "th", "", "", "", "");
    scribe.inscribe("#table-" + projectNameEscaped + " thead tr", "th", "", "", "Current", "");
    scribe.inscribe("#table-" + projectNameEscaped + " thead tr", "th", "", "", "Last Build", "");
    scribe.inscribe("#table-" + projectNameEscaped + " thead tr", "th", "", "", "Before Last", "");
  };

  var writeBugCount = function (projectName) {
    bugs.render(projectName, "#table-" + projectName.replace(".", "\\."));
  };

  var writeTableBody = function (projectName) {
    scribe.inscribe("#table-" + projectName.replace(".", "\\."), "tbody", "", "", "", "");
  };

  var initializeSection = function () {
    var tableSectionId = "#build-tables";

    scribe.clear(tableSectionId);

    var projects = projectsUi.projects();
    for (var index = 0; index < projects.length; index += 1) {
      var projectName = projects[index];

      writeProjectHeader(tableSectionId, projectName);
      writeTable(tableSectionId, projectName);
      writeTableHeader(projectName);
      writeBugCount(projectName);
      writeTableBody(projectName);
    }
  };

  var reload = function () {
    var buildDefinitionIds = projectsUi.buildDefinitionIds();

    // todo: optimize performance - this is making a call for every selected build definition. Make these calls grouped by project?
    // the service does cache and optimize this somewhat, but it's not "perfect."
    for (var index = 0; index < buildDefinitionIds.length; index += 1) {
      builds.render("#table-" + buildDefinitionIds[index].split("-")[0] + " tbody", buildDefinitionIds[index]);
    }
  };

  var load = function () {
    initializeSection();
    reload();
  };

  var pulse = function () {
    var inProgressBuilds = ProjectMonitor.domAccess("tbody > tr > td > p.pending");
    for (var index = 0; index < inProgressBuilds.length; index += 1) {
      var inProgressBuild = ProjectMonitor.domAccess(inProgressBuilds[index]);
      inProgressBuild.css("opacity") === "1" ? inProgressBuild.fadeTo("slow", .2, "swing") : inProgressBuild.fadeTo("slow", 1, "swing");
    }
  };

  return {
    load: load,
    reload: reload,
    pulse: pulse
  };
};