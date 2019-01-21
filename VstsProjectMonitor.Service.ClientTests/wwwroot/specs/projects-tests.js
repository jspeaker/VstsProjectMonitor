// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/build-definitions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/html-scribe.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-repository.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/projects.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/build-definition-repository.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

/// <reference path="../scripts/fakes/fake-project-data.js" />
/// <reference path="../scripts/fakes/fake-build-definition-data.js" />
/// <reference path="../scripts/fakes/fake-dom-access.js" />
/// <reference path="../scripts/fakes/fake-html-scribe.js" />

describe("GivenProjectsObject",
  function () {
    ProjectMonitor.init($);

    describe("AndProjectsData",
      function () {
        var projectRepository = new ProjectMonitor.ProjectRepository(new Fakes.DomAccess(new Fakes.ProjectData().get()));
        var buildDefinitionRepository = new ProjectMonitor.BuildDefinitionRepository(new Fakes.DomAccess(new Fakes.BuildDefinitionData().get()));
        var htmlScribe = new Output.HtmlScribe($);
        var projects = new ProjectMonitor.Projects($, projectRepository, new ProjectMonitor.BuildDefinitions(buildDefinitionRepository, htmlScribe), htmlScribe);

        beforeEach(function () {
          $("body").append("<div id='id'></div>");
        });

        afterEach(function () {
          $("#id").remove();
        });

        it("WhenAskingToRender_ThenItShouldInscribe",
          function () {
            projects.render("#id");

            expect(ProjectMonitor.domAccess("#id optgroup").length).toBe(3);
            expect(ProjectMonitor.domAccess("#id optgroup.select2-selectable-group").length).toBe(3);
            expect(ProjectMonitor.domAccess("#id optgroup.select2-selectable-group[label='strickland web']").length).toBe(1);
          });

        it("WhenAskingToRender_ThenItShouldCallCallback",
          function () {
            var callbackCalled = false;
            projects.render("#id", function () {
              callbackCalled = true;
            });

            expect(callbackCalled).toBe(true);
          });
      });

    describe("AndNoProjectsData",
      function () {
        var projectRepository = new ProjectMonitor.ProjectRepository(new Fakes.DomAccess({}));
        var buildDefinitionRepository = new ProjectMonitor.BuildDefinitionRepository(new Fakes.DomAccess({}));
        var htmlScribe = new Output.HtmlScribe($);
        var projects = new ProjectMonitor.Projects($, projectRepository, new ProjectMonitor.BuildDefinitions(buildDefinitionRepository, htmlScribe), htmlScribe);

        beforeEach(function () {
          $("body").append("<div id='id'></div>");
        });

        afterEach(function () {
          $("#id").remove();
        });

        it("WhenAskingToRender_ThenItShouldNotInscribe",
          function () {
            projects.render("#id");
            expect(ProjectMonitor.domAccess("#id optgroup").length).toBe(0);
          });

        it("WhenAskingToRender_ThenItShouldCallCallback",
          function () {
            var callbackCalled = false;
            projects.render("#id", function () {
              callbackCalled = true;
            });

            expect(callbackCalled).toBe(true);
          });
      });
  });

describe("GivenProjectsUiObject",
  function () {
    describe("AndSelectedProjectBuildDefinitions",
      function () {
        // arrange
        ProjectMonitor.init($);

        beforeEach(function () {
          $("body").append("<select id='projects' multiple='multiple'><option value='123' data-project-name='projectOne' selected='selected'></option><option value='124' data-project-name='projectOne'></option><option value='234' selected='selected' data-project-name='projectTwo'></option><option value='125' data-project-name='projectThree'></option></select>");
        });

        afterEach(function () {
          $("#projects").remove();
        });

        it("WhenAskingForProjects_ThenItShouldReturnCorrectProjects",
          function () {
            var projectsUi = new ProjectMonitor.ProjectsUi();

            // act
            var projects = projectsUi.projects();

            // assert
            expect(projects.length).toBe(2);
            expect(projects[0]).toBe("projectOne");
            expect(projects[1]).toBe("projectTwo");
          });

        it("WhenAskingForBuildDefintionIds_ThenItShouldReturnAddThemToACookie",
          function() {
            var projectsUi = new ProjectMonitor.ProjectsUi();

            //act
            projectsUi.buildDefinitionIds();

            //assert
            var cookie = Cookies.get("BuildDefinitionIds");
            expect(cookie).not.toBe(undefined);
            var cookieObject = JSON.parse(cookie);
            expect(cookieObject.length).toBe(2);
            expect(cookieObject[0]).toBe("projectOne-123");
            expect(cookieObject[1]).toBe("projectTwo-234");
          }
        );

      });

    describe("AndNoSelectedProjectBuildDefinitions",
      function () {
        // arrange
        ProjectMonitor.init($);

        beforeEach(function () {
          $("body").append("<select id='projects' multiple='multiple'><option value='123' data-project-name='projectOne'></option><option value='124' data-project-name='projectOne'></option><option value='234' data-project-name='projectTwo'></option><option value='125' data-project-name='projectThree'></option></select>");
        });

        afterEach(function () {
          $("#projects").remove();
        });

        it("WhenAskingForProjects_ThenItShouldReturnCorrectProjects",
          function () {
            var projectsUi = new ProjectMonitor.ProjectsUi();

            // act
            var projects = projectsUi.projects();

            // assert
            expect(projects.length).toBe(0);
          });
      });
  });
