// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/bug-repository.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

/// <reference path="../scripts/fakes/fake-bug-data.js" />

describe("GivenBuildDefinitions",
  function () {

    var cookie1 = "tasty-cookie";

    beforeEach(function() {
      Cookies.remove(cookie1);
    });

    it("WhenAskingForCookie_ThenItShouldReturnBakedCookie",
      function () {
        var cookieBaker = new ProjectMonitor.CookieBaker($);

        var cookie = cookieBaker.bake(cookie1, { name: "myProj" });
        var tastyCookie = Cookies.get(cookie1);
        expect(JSON.parse(tastyCookie).name).toBe("myProj");
      });

    //describe("AndBugData",
    //  function () {
    //    var fakeData = new Fakes.BugData().get();
    //    var fakeDomAccess = new Fakes.DomAccess(fakeData);
    //    var bugRepository = new ProjectMonitor.BugRepository(fakeDomAccess);

    //    it("WhenAskingForBugs_ThenItShouldReturnData",
    //      function () {
    //        var actualData;
    //        var projectName = "strickland-website-redesign";

    //        bugRepository.bugs(projectName, function (result) {
    //          actualData = result;
    //        });
    //        expect(actualData).toBe(fakeData);
    //      });
      //});
  });
