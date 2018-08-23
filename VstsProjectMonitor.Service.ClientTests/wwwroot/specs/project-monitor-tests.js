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

describe("GivenProjectMonitorUi",
  function () {
    ProjectMonitor.init($);

    describe("AndSelectedProjectBuildDefinitions",
      function () {

        beforeEach(function () {
          $("body").append("<select id='projects' multiple='multiple'><option value='123' data-project-name='projectOne' selected='selected'></option><option value='124' data-project-name='projectOne'></option><option value='234' data-project-name='projectTwo'></option><option value='125' data-project-name='projectThree' selected='selected'></option></select>");
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

            expect($("body #table-projectOne").length).toBe(1);
            expect($("body #table-projectTwo").length).toBe(0);
            expect($("body #table-projectThree").length).toBe(1);
          });

        it("WhenAskingToLoad_ThenItShouldInitializeTables",
          function () {
            projectMonitorUi.load();

            expect($("body #build-tables h2")[0].innerText).toBe("projectOne");
            expect($("body #build-tables h2")[1].innerText).toBe("projectThree");

            expect($("body #table-projectOne thead tr th").length).toBe(4);
            expect($("body #table-projectTwo").length).toBe(0);
            expect($("body #table-projectThree thead tr th").length).toBe(4);

            expect($("body #table-projectOne tbody").length).toBe(1);
            expect($("body #table-projectThree tbody").length).toBe(1);
          });

        it("WhenAskingToLoad_ThenItShouldRenderBugCount",
          function () {
            projectMonitorUi.load();

            expect($("body #table-projectOne #projectOne").length).toBe(1);
            expect($("body #table-projectTwo #projectTwo").length).toBe(0);
            expect($("body #table-projectThree #projectThree").length).toBe(1);

            expect($("body #table-projectOne #projectOne").html()).toBe("Open Bug Count: 3");
            expect($("body #table-projectThree #projectThree").html()).toBe("Open Bug Count: 3");
          });
      });
  });

// ReSharper restore PossiblyUnassignedProperty
// ReSharper restore UseOfImplicitGlobalInFunctionScope
