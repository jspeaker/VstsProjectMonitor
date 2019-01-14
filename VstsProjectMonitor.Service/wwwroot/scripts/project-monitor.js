var ProjectMonitor = ProjectMonitor || {};

ProjectMonitor.init = function (domAccess, callback) {
  this.domAccess = domAccess;

  callback && callback();
};

ProjectMonitor.ProjectName = function (projectName) {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee(projectName);
  // ReSharper restore CallerCalleeUsing

  this.projectName = projectName;

  var domId = function() {
    return projectName.replace(/\s/gi, "-");
  };

  return {
    domId: domId
  };
};

ProjectMonitor.Ui = function (domAccess, builds, bugs, projectsUi, scribe) {
  // ReSharper disable CallerCalleeUsing
  if (!domAccess || !builds || !bugs || !projectsUi || !scribe) return new arguments.callee(ProjectMonitor.domAccess, new ProjectMonitor.Builds(), new ProjectMonitor.Bugs(), new ProjectMonitor.ProjectsUi(), new Output.HtmlScribe(ProjectMonitor.domAccess));
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var writeProjectHeader = function (tableSectionId, projectName) {
    scribe.inscribe(tableSectionId, "h2", "", "", projectName, "");
  };

  var writeTable = function (tableSectionId, domId) {
    scribe.inscribe(tableSectionId, "table", "table-" + domId, "table table-striped table-condensed table-hover", "", "");
  };

  var writeTableHeader = function (domId) {
    var domIdEscaped = domId.replace(".", "\\.");
    scribe.inscribe("#table-" + domIdEscaped, "thead", "", "", "", "");
    scribe.inscribe("#table-" + domIdEscaped + " thead", "tr", "", "", "", "");
    scribe.inscribe("#table-" + domIdEscaped + " thead tr", "th", "", "", "", "");
    scribe.inscribe("#table-" + domIdEscaped + " thead tr", "th", "", "", "Current", "");
    scribe.inscribe("#table-" + domIdEscaped + " thead tr", "th", "", "", "Last Build", "");
    scribe.inscribe("#table-" + domIdEscaped + " thead tr", "th", "", "", "Before Last", "");
  };

  var writeBugCount = function (projectName, domId) {
    bugs.render(projectName, "#table-" + domId.replace(".", "\\."));
  };

  var writeTableBody = function (domId) {
    scribe.inscribe("#table-" + domId.replace(".", "\\."), "tbody", "", "", "", "");
  };

  var initializeSection = function () {
    var tableSectionId = "#build-tables";

    scribe.clear(tableSectionId);

    var projects = projectsUi.projects();
    for (var index = 0; index < projects.length; index += 1) {
      var projectName = projects[index];
      var domId = ProjectMonitor.ProjectName(projectName).domId();

      writeProjectHeader(tableSectionId, projectName);
      writeTable(tableSectionId, domId);
      writeTableHeader(domId);
      writeBugCount(projectName, domId);
      writeTableBody(domId);
    }
  };

  var reload = function () {
    var buildDefinitionIds = projectsUi.buildDefinitionIds();

    // todo: optimize performance - this is making a call for every selected build definition. Make these calls grouped by project?
    // the service does cache and optimize this somewhat, but it's not "perfect."
    for (var index = 0; index < buildDefinitionIds.length; index += 1) {
      builds.render("#table-" + ProjectMonitor.ProjectName(buildDefinitionIds[index].split("-")[0]).domId() + " tbody", buildDefinitionIds[index]);
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