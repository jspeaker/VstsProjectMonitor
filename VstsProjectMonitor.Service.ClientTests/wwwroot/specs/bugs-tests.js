// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/bug-repository.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

/// <reference path="../scripts/fakes/fake-bug-data.js" />

describe("GivenBugsObject",
  function () {
    ProjectMonitor.init($);

    describe("AndBugData",
      function () {
        var bugRepository = new ProjectMonitor.BugRepository(new Fakes.DomAccess(new Fakes.BugData().get()));
        var htmlScribe = new Output.HtmlScribe($);
        var bugs = new ProjectMonitor.Bugs(bugRepository, htmlScribe);

        beforeEach(function () {
          $("body").append("<div id='id'></div>");
        });

        afterEach(function () {
          $("#id").remove();
        });

        it("WhenAskingToRender_ThenItShouldInscribe",
          function () {
            bugs.render("strickland-accessories", "#id");

            var bugContainer = ProjectMonitor.domAccess("#id #strickland-accessories");
            expect(bugContainer.length).toBe(1);
            expect($(bugContainer).html()).toBe("Open Bug Count: 3");
          });
      });
  });
