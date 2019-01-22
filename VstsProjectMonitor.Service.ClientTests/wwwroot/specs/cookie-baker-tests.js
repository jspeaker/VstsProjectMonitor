// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/cookie-baker.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />
/// <reference path="../dependencies/js.cookie.min.js" />

describe("GivenBuildDefinitions",
  function () {
    var cookieBaker = new ProjectMonitor.CookieBaker();
    var cookieName = "tasty-cookie";
    var ingredients = { name: "myProj" };

    beforeEach(function() {
      Cookies.remove(cookieName);
    });

    it("WhenAskingToBakeCookie_ThenItShouldBakeCookie",
      function () {
        cookieBaker.bake(cookieName, ingredients);
        var cookie = Cookies.get(cookieName);
        expect(JSON.parse(cookie).name).toBe("myProj");
      });

    describe("AndCookieExists",
      function() {
        it("WhenAskingToRetrieveCookie_ThenItShouldRetrieveCookie",
          function() {
            Cookies.set(cookieName, ingredients);
            var cookie = cookieBaker.retrieve(cookieName);
            expect(JSON.parse(cookie).name).toBe("myProj");
          });
      });
  });
