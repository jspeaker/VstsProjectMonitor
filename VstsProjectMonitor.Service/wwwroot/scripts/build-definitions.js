var ProjectMonitor = ProjectMonitor || {};

// ReSharper disable once CyclomaticComplexity
ProjectMonitor.BuildDefinitions = function (buildDefinitionRepository, scribe) {
    // ReSharper disable CallerCalleeUsing
    if (!buildDefinitionRepository || !scribe) return new arguments.callee(new ProjectMonitor.BuildDefinitionRepository(ProjectMonitor.domAccess), new Output.HtmlScribe(ProjectMonitor.domAccess));
    if (!(this instanceof arguments.callee)) return new arguments.callee(buildDefinitionRepository, scribe);
    // ReSharper restore CallerCalleeUsing

    var render = function (projectName, target, callback) {
        buildDefinitionRepository.buildDefinitions(projectName,
            function (data) {
                if (!data || !data.items || data.items.length === 0) {
                    callback && callback();
                    return;
                }

                var index;
                for (index = 0; index < data.items.length; index += 1) {
                    var item = data.items[index];
                    scribe.inscribe(target + " optgroup[label='" + projectName + "']", "option", "build-definition-" + item.id, "", item.name, [["value", item.id], ["data-project-name", projectName]]);
                }
                callback && callback();
            });
    };

    return {
        render: render
    };
};
