var Fakes = Fakes || {};

Fakes.ProjectData = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var fakeData = {
    "count": 3,
    "projects": [
      { "id": "8e161f07-7901-483a-bfd1-52bbc68499a3", "name": "strickland-website-redesign" },
      { "id": "2f31f87b-9072-40fc-b219-2c73a3b6f62c", "name": "strickland web" },
      { "id": "1bf647cd-18dd-4bb7-90c1-43a09679e198", "name": "strickland services" }
    ]
  };

  return {
    get: function () {
      return fakeData;
    }
  };
};
