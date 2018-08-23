// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable PossiblyUnassignedProperty

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/html-scribe.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

describe("GivenScribeAndHtml",
  function () {
    var scribe = new Output.HtmlScribe($);

    beforeEach(function () {
      $("#child").remove();
    });

    afterEach(function () {
      $("#child").remove();
    });

    it("WhenAskingToInscribe_ThenItShouldWriteToTheDom",
      function () {
        scribe.inscribe("body", "p", "child", "some-class", "Strickland Propane");
        expect($("#child").length).toEqual(1);
      });


    it("WhenAskingToInscribe_ThenItShouldNotWriteDuplicateIdsToTheDom",
      function () {
        scribe.inscribe("body", "p", "child", "some-class", "Strickland Propane");
        scribe.inscribe("body", "p", "child", "some-class", "Strickland Propane");
        expect($("#child").length).toEqual(1);
      });


    it("WhenAskingToClear_ThenItShouldRemoveHtml",
      function () {
        scribe.inscribe("body", "div", "child", "", "");
        scribe.inscribe("#child", "p", "grandchild", "", "Strickland Propane");

        expect($("#grandchild").length).toEqual(1);

        scribe.clear("#child");

        expect($("#grandchild").length).toEqual(0);
      });
  });

// ReSharper restore PossiblyUnassignedProperty
// ReSharper restore UseOfImplicitGlobalInFunctionScope