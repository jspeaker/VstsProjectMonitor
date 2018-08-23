var Fakes = Fakes || {};

Fakes.BuildDefinitionData = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var fakeData = {
    "count": 3,
    "items": [
      {
        "id": "123",
        "name": "one two three"
      },
      {
        "id": "234",
        "name": "two three four"
      },
      {
        "id": "345",
        "name": "three four five"
      }
    ]
  };

  return {
    get: function () {
      return fakeData;
    }
  };
};
