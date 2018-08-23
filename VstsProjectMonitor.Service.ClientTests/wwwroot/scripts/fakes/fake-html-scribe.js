var Output = Output || {};

Output.FakeScribe = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var inscriptions = $("<div id='id'></div>");

  var clear = function () {
    inscriptions.clear();
  };

  var setAttribute = function (element, attribute, value) {
    if (value === undefined || value === null || value === "") return;
    $(element).attr(attribute, value);
  };

  var inscribe = function (target, tag, id, cssClass, content) {
    var element = $("<" + tag + ">" + content + "</" + tag + ">");
    setAttribute(element, "id", id);
    setAttribute(element, "class", cssClass);
    inscriptions.append(element);
  };

  return {
    clear: clear,
    inscribe: inscribe,
    inscriptions: function () {
      return inscriptions;
    }
  };
};
