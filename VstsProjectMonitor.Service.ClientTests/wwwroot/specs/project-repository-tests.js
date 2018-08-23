// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable PossiblyUnassignedProperty

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-repository.js" />

/// <reference path="../scripts/fakes/fake-dom-access.js" />
/// <reference path="../scripts/fakes/fake-build-data.js" />

describe("GivenProjectRepository",
  function () {
    it("WhenAskingForProjects_ThenItShouldUseCorrectUrl",
      function () {
        var fakeDomAccess = new Fakes.DomAccess();
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);

        projectRepository.projects();
        expect(fakeDomAccess.relativePath()).toBe("/api/project/");
      });

    describe("AndProjectData",
      function () {
        var fakeData = new Fakes.ProjectData().get();
        var fakeDomAccess = new Fakes.DomAccess(fakeData);
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);

        it("WhenAskingForProjects_ThenItShouldReturnData",
          function () {
            var actualData;

            projectRepository.projects(function (result) {
              actualData = result;
            });

            expect(actualData).toBe(fakeData);
          });
      });

    it("WhenAskingForBuildsForSingleProject_ThenItShouldUseCorrectUrl",
      function () {
        var fakeDomAccess = new Fakes.DomAccess();
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);

        projectRepository.builds(["ProjectName-123", "ProjectName-124", "ProjectName-125"]);

        expect(fakeDomAccess.relativePath()).toBe("/api/ProjectName/123,124,125/build/");
      });

    it("WhenAskingForBuildsForMultipleProjects_ThenItShouldUseCorrectUrls",
      function () {
        var fakeDomAccess = new Fakes.DomAccess();
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);

        projectRepository.builds(["ProjectOne-111", "ProjectOne-222", "ProjectOne-333", "ProjectTwo-888", "ProjectThree-999"]);

        expect(fakeDomAccess.relativePaths()[0]).toBe("/api/ProjectOne/111,222,333/build/");
        expect(fakeDomAccess.relativePaths()[1]).toBe("/api/ProjectTwo/888/build/");
        expect(fakeDomAccess.relativePaths()[2]).toBe("/api/ProjectThree/999/build/");
      });

    it("WhenAskingForBuild_ThenItShouldUseCorrectUrl",
      function () {
        var fakeDomAccess = new Fakes.DomAccess();
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);

        projectRepository.build("ProjectName-123");
        expect(fakeDomAccess.relativePath()).toBe("/api/ProjectName/123/build/");
      });

    describe("AndBuildData",
      function () {
        var fakeData = new Fakes.BuildData().get();
        var fakeDomAccess = new Fakes.DomAccess(fakeData);
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);

        it("WhenAskingForBuild_ThenItShouldReturnData",
          function () {
            var actualData;

            projectRepository.build("projectName", function (result) {
              actualData = result;
            });
            expect(actualData).toBe(fakeData);
          });
      });
  });

// ReSharper restore PossiblyUnassignedProperty
// ReSharper restore UseOfImplicitGlobalInFunctionScope
