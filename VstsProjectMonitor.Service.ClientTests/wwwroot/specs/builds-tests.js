// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/builds.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/html-scribe.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-repository.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

/// <reference path="../scripts/fakes/fake-build-data.js" />
/// <reference path="../scripts/fakes/fake-dom-access.js" />
/// <reference path="../scripts/fakes/fake-html-scribe.js" />

describe("GivenBuildsObject",
  function () {
    ProjectMonitor.init($);

    describe("AndBuildData",
      function () {
        var fakeDomAccess = new Fakes.DomAccess(new Fakes.BuildData().get());
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);
        var builds = new ProjectMonitor.Builds(ProjectMonitor.domAccess, projectRepository);

        beforeEach(function () {
          $("body").append("<div id='id'></div>");
        });

        afterEach(function () {
          $("#id").remove();
        });

        it("WhenAskingToRender_ThenItShouldInscribe",
          function () {
            builds.render("#id", "ProjectName-123");
            expect(ProjectMonitor.domAccess("#id tr").length).toBeGreaterThan(0);
          });
      });

    describe("AndNoBuildData",
      function () {
        var fakeDomAccess = new Fakes.DomAccess({});
        var projectRepository = new ProjectMonitor.ProjectRepository(fakeDomAccess);
        var builds = new ProjectMonitor.Builds(ProjectMonitor.domAccess, projectRepository);

        beforeEach(function () {
          $("body").append("<div id='id'></div>");
        });

        afterEach(function () {
          $("#id").remove();
        });

        it("WhenAskingToRender_ThenItShouldNotInscribe",
          function () {
            builds.render("#id", "ProjectName-123");
            expect(ProjectMonitor.domAccess("#id tr").length).toBe(0);
          });
      });

  });

// ReSharper restore UseOfImplicitGlobalInFunctionScope

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
// ReSharper disable once CyclomaticComplexity
    value: function (searchElement, fromIndex) {

// ReSharper disable once HeuristicallyUnreachableCode
// ReSharper disable once ConditionIsAlwaysConst
      if (this === null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1. 
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}
