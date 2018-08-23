var Fakes = Fakes || {};

Fakes.BugData = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var fakeData = {
    "bugs": [
      {
        "id": 1,
        "url": "http://url.tld/nasty/bug"
      },
      {
        "id": 2,
        "url": "http://url.tld/nastier/bug"
      },
      {
        "id": 3,
        "url": "http://url.tld/nastiest/bug"
      }
    ]
  };

  return {
    get: function() {
      return fakeData;
    }
  };
};
