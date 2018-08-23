// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable PossiblyUnassignedProperty

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/build-definition-repository.js" />

/// <reference path="../scripts/fakes/fake-dom-access.js" />
/// <reference path="../scripts/fakes/fake-build-definition-data.js" />

describe("GivenBuildDefinitionRepository",
  function () {
    it("WhenAskingForBuildDefinitionList_ThenItShouldUseCorrectUrl",
      function () {
        var fakeDomAccess = new Fakes.DomAccess();
        var buildDefinitionRepository = new ProjectMonitor.BuildDefinitionRepository(fakeDomAccess);
        var projectName = "strickland-website-redesign";

        buildDefinitionRepository.buildDefinitions(projectName);
        expect(fakeDomAccess.relativePath()).toBe("/api/" + projectName + "/build/definition");
      });

    describe("AndBuildDefinitionData",
      function () {
        var fakeData = new Fakes.BuildDefinitionData().get();
        var fakeDomAccess = new Fakes.DomAccess(fakeData);
        var buildDefinitionRepository = new ProjectMonitor.BuildDefinitionRepository(fakeDomAccess);

        it("WhenAskingForProject_ThenItShouldReturnData",
          function () {
            var actualData;
            var projectName = "strickland-website-redesign";

            buildDefinitionRepository.buildDefinitions(projectName, function (result) {
              actualData = result;
            });
            expect(actualData).toBe(fakeData);
            expect(actualData.count).toBe(3);
          });
      });
  });

// ReSharper restore PossiblyUnassignedProperty
// ReSharper restore UseOfImplicitGlobalInFunctionScope
