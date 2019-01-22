// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/historian.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />
/// <reference path="../dependencies/js.cookie.min.js" />

describe("GivenSelectedBuildDefinitions",
  function () {
    var cookieBaker = new Fakes.CookieBaker();
    var historian = new ProjectMonitor.Historian(cookieBaker);
    var recordName = "ProjectBuildDefinitions";

    beforeEach(function () {
      $("body").append("<select id='projects' multiple='multiple'><option value='123' data-project-name='project One' selected='selected'></option><option value='124' data-project-name='project One'><option value='999' data-project-name='project One' selected='selected'></option><option value='234' data-project-name='project  Two'></option><option value='125' data-project-name='project Three' selected='selected'></option></select>");
      $("body").append("<section id='build-tables'></section>");

      historian.record($("#projects"), recordName);
    });

    afterEach(function () {
      $("#projects").remove();
      $("#build-tables").remove();
    });

    it("WhenAskingToRecordHistory_ThenItShouldRecordHistory",
      function () {
        var actual = JSON.parse(cookieBaker.retrieve(recordName));

        expect(actual.length).toBe(2);
        expect(actual[0].projectName).toBe("project One");
        expect(actual[1].projectName).toBe("project Three");
        expect(actual[0].buildDefinitionIds.length).toBe(2);
        var p1BuildDefIds = actual[0].buildDefinitionIds;
        var p3BuildDefIds = actual[1].buildDefinitionIds;
        expect(p1BuildDefIds[0]).toBe("123");
        expect(p1BuildDefIds[1]).toBe("999");
        expect(p3BuildDefIds[0]).toBe("125");
      });

    describe("AndHistorianHasRecorded",
      function() {
        it("WhenAskingToReciteHistory_ThenItShouldReciteHistory",
          function() {
            var actual = JSON.parse(historian.recite(recordName));

            expect(actual.length).toBe(2);
            expect(actual[0].projectName).toBe("project One");
            expect(actual[1].projectName).toBe("project Three");
            expect(actual[0].buildDefinitionIds.length).toBe(2);
            var p1BuildDefIds = actual[0].buildDefinitionIds;
            var p3BuildDefIds = actual[1].buildDefinitionIds;
            expect(p1BuildDefIds[0]).toBe("123");
            expect(p1BuildDefIds[1]).toBe("999");
            expect(p3BuildDefIds[0]).toBe("125");
          });
      });
  });
