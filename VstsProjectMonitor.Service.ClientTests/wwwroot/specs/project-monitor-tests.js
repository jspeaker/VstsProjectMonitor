// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable PossiblyUnassignedProperty

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/builds.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/build-definitions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/build-definition-repository.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/projects.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-repository.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/html-scribe.js" />

/// <reference path="../scripts/fakes/fake-dom-access.js" />

describe("GivenProjectNameWithSpaces",
  function() {
    ProjectMonitor.init($);

    it("ShouldReplaceSpacesWithDashes",
      function() {
        var projectId = new ProjectMonitor.ProjectName("Project Name With  Spaces").domId();

        expect(projectId).toBe("Project-Name-With--Spaces");
      });
  });

describe("GivenProjectMonitorUi",
  function () {
    ProjectMonitor.init($);

    describe("AndSelectedProjectBuildDefinitions",
      function () {

        beforeEach(function () {
          $("body").append("<select id='projects' multiple='multiple'><option value='123' data-project-name='project One' selected='selected'></option><option value='124' data-project-name='project One'></option><option value='234' data-project-name='project  Two'></option><option value='125' data-project-name='project Three' selected='selected'></option></select>");
          $("body").append("<section id='build-tables'></section>");
        });

        afterEach(function () {
          $("#projects").remove();
          $("#build-tables").remove();
        });

        var fakeDomAccess = new Fakes.DomAccess(new Fakes.BugData().get());
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);
        var bugRepository = new ProjectMonitor.BugRepository(fakeDomAccess);
        var builds = new ProjectMonitor.Builds(fakeDomAccess, projectRepository);
        var bugs = new ProjectMonitor.Bugs(bugRepository, new Output.HtmlScribe($));
        var projectMonitorUi = new ProjectMonitor.Ui($, builds, bugs, new ProjectMonitor.ProjectsUi(), new Output.HtmlScribe($));

        it("WhenAskingToLoad_ThenItShouldCreateTables",
          function () {
            projectMonitorUi.load();

            expect($("body #table-project-One").length).toBe(1);
            expect($("body #table-project--Two").length).toBe(0);
            expect($("body #table-project-Three").length).toBe(1);
          });

        it("WhenAskingToLoad_ThenItShouldInitializeTables",
          function () {
            projectMonitorUi.load();

            expect($("body #build-tables h2")[0].innerText).toBe("project One");
            expect($("body #build-tables h2")[1].innerText).toBe("project Three");

            expect($("body #table-project-One thead tr th").length).toBe(4);
            expect($("body #table-project--Two").length).toBe(0);
            expect($("body #table-project-Three thead tr th").length).toBe(4);

            expect($("body #table-project-One tbody").length).toBe(1);
            expect($("body #table-project-Three tbody").length).toBe(1);
          });

        it("WhenAskingToLoad_ThenItShouldRenderBugCount",
          function () {
            projectMonitorUi.load();

            expect($("body #table-project-One #project-One").length).toBe(1);
            expect($("body #table-project--Two #project--Two").length).toBe(0);
            expect($("body #table-project-Three #project-Three").length).toBe(1);

            expect($("body #table-project-One #project-One").html()).toBe("Open Bug Count: 3");
            expect($("body #table-project-Three #project-Three").html()).toBe("Open Bug Count: 3");
          });
      });
  });

// ReSharper restore PossiblyUnassignedProperty
// ReSharper restore UseOfImplicitGlobalInFunctionScope
