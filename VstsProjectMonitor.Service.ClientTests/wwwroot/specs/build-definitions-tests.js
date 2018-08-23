// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/html-scribe.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-repository.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/projects.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/build-definition-repository.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/build-definitions.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

/// <reference path="../scripts/fakes/fake-project-data.js" />
/// <reference path="../scripts/fakes/fake-build-definition-data.js" />
/// <reference path="../scripts/fakes/fake-dom-access.js" />
/// <reference path="../scripts/fakes/fake-html-scribe.js" />

describe("GivenBuildDefinitionsObject",
    function () {
        ProjectMonitor.init($);

        describe("AndBuildDefinitionData",
            function () {
                var fakeProjectDataDomAccess = new Fakes.DomAccess(new Fakes.ProjectData().get());
                var projectRepository = new ProjectMonitor.ProjectRepository(fakeProjectDataDomAccess);
                var fakeBuildDefinitionDomAccess = new Fakes.DomAccess(new Fakes.BuildDefinitionData().get());
                var buildDefinitionRepository = new ProjectMonitor.BuildDefinitionRepository(fakeBuildDefinitionDomAccess);
                var htmlScribe = new Output.HtmlScribe($);
                var buildDefinitions = new ProjectMonitor.BuildDefinitions(buildDefinitionRepository, htmlScribe);
                var projects = new ProjectMonitor.Projects($, projectRepository, buildDefinitions, htmlScribe);


                beforeEach(function () {
                    $("body").append("<div id='id'></div>");
                });

                afterEach(function () {
                    $("#id").remove();
                });

                it("WhenAskingToRender_ThenItShouldInscribe",
                    function () {
                        projects.render("#id");
                        var stricklandWebsiteRedesign = "strickland-website-redesign";
                        buildDefinitions.render(stricklandWebsiteRedesign, "#id");

                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option").length).toBe(3);
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].id).toBe("build-definition-123");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].className).toBe("");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].innerText).toBe("one two three");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].attributes.length).toBe(3);
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].attributes[0].name).toBe("id");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].attributes[1].name).toBe("value");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].attributes[2].name).toBe("data-project-name");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[0].attributes[2].value).toBe(stricklandWebsiteRedesign);

                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].id).toBe("build-definition-234");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].className).toBe("");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].innerText).toBe("two three four");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].attributes.length).toBe(3);
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].attributes[0].name).toBe("id");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].attributes[1].name).toBe("value");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].attributes[2].name).toBe("data-project-name");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[1].attributes[2].value).toBe(stricklandWebsiteRedesign);

                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].id).toBe("build-definition-345");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].className).toBe("");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].innerText).toBe("three four five");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].attributes.length).toBe(3);
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].attributes[0].name).toBe("id");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].attributes[1].name).toBe("value");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].attributes[2].name).toBe("data-project-name");
                        expect(ProjectMonitor.domAccess("#id optgroup[label='strickland-website-redesign'] option")[2].attributes[2].value).toBe(stricklandWebsiteRedesign);
                    });
            });

        describe("AndNoBuildDefinitionData",
            function () {
                var fakeDomAccess = new Fakes.DomAccess({});
                var buildDefinitionRepository = new ProjectMonitor.BuildDefinitionRepository(fakeDomAccess);
                var buildDefinitions = new ProjectMonitor.BuildDefinitions(buildDefinitionRepository, new Output.HtmlScribe($));

                beforeEach(function () {
                    $("body").append("<div id='id'></div>");
                });

                afterEach(function () {
                    $("#id").remove();
                });

                it("WhenAskingToRender_ThenItShouldNotInscribe",
                    function () {
                        buildDefinitions.render("#id");
                        expect(ProjectMonitor.domAccess("#id option").length).toBe(0);
                    });
            });
    });
