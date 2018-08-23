var Output = Output || {};

Output.HtmlScribe = function (domAccess) {
  if (!domAccess) return new arguments.callee($);
  if (!(this instanceof arguments.callee)) return new arguments.callee(domAccess);

  var clear = function (target) {
    domAccess(target).html("");
  };

  var setAttribute = function (element, attribute, value) {
    if (value === undefined || value === null || value === "") return;
    domAccess(element).attr(attribute, value);
  };

  var createElement = function (tag, content, id, cssClass, attributes) {
    var element = domAccess("<" + tag + ">" + content + "</" + tag + ">");
    setAttribute(element, "id", id);
    setAttribute(element, "class", cssClass);

    if (!attributes || attributes.length === 0) return element;

    for (var index = 0; index < attributes.length; index += 1) {
      var attribute = attributes[index];
      if (!attribute || attribute.length !== 2) continue;
      setAttribute(element, attribute[0], attribute[1]);
    }

    return element;
  };

  var inscribe = function (target, tag, id, cssClass, content, attributes) {
    var element = createElement(tag, content, id, cssClass, attributes);

    if (id !== "" && domAccess(target).find("#" + id).length > 0) {
      var existingElement = domAccess(target).find("#" + id);
      domAccess(existingElement).replaceWith(element);
      return element;
    }

    domAccess(element).appendTo(target);
    return element;
  };

  return {
    clear: clear,
    inscribe: inscribe
  };
};
