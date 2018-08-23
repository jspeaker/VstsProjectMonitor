var Fakes = Fakes || {};

Fakes.BuildData = function () {
  // ReSharper disable CallerCalleeUsing
  if (!(this instanceof arguments.callee)) return new arguments.callee();
  // ReSharper restore CallerCalleeUsing

  var fakeData = {
    "count": 3,
    "builds": [
      {
        "status": "completed",
        "result": "succeeded",
        "buildNumber": "1.0.0.2",
        "startTime": "2018-05-17T04:24:27.7694516Z",
        "definition": { "id": 4, "name": "AzureSqlAuth" },
        "requestedFor": {
          "displayName": "Jim Speaker",
          "imageUrl":
            "https://iontechdotorg.visualstudio.com/_api/_common/identityImage?id=f9a18dab-76b3-42bc-bb3a-103865994dae"
        }
      },
      {
        "status": "completed",
        "result": "failed",
        "buildNumber": "1.0.0.1",
        "startTime": "2018-05-17T04:22:29.7211446Z",
        "definition": { "id": 4, "name": "AzureSqlAuth" },
        "requestedFor": {
          "displayName": "Jim Speaker",
          "imageUrl":
            "https://iontechdotorg.visualstudio.com/_api/_common/identityImage?id=f9a18dab-76b3-42bc-bb3a-103865994dae"
        }
      },
      {
        "status": "completed",
        "result": "succeeded",
        "buildNumber": "1.0.0.2",
        "startTime": "2018-05-17T03:56:10.1694968Z",
        "definition": { "id": 3, "name": "Honest Joe's CI" },
        "requestedFor": {
          "displayName": "Jim Speaker",
          "imageUrl":
            "https://iontechdotorg.visualstudio.com/_api/_common/identityImage?id=f9a18dab-76b3-42bc-bb3a-103865994dae"
        }
      },
      {
        "status": "completed",
        "result": "succeeded",
        "buildNumber": "1.1.0.2",
        "startTime": "2018-05-18T03:56:10.1694968Z",
        "definition": { "id": 3, "name": "Honest Joe's CI" },
        "requestedFor": {
          "displayName": "Jim Speaker",
          "imageUrl":
            "https://iontechdotorg.visualstudio.com/_api/_common/identityImage?id=f9a18dab-76b3-42bc-bb3a-103865994dae"
        }
      },
      {
        "status": "completed",
        "result": "succeeded",
        "buildNumber": "1.1.0.2",
        "startTime": "2018-05-18T03:56:10.1694968Z",
        "definition": { "id": 4, "name": "AzureSqlAuth" },
        "requestedFor": {
          "displayName": "Jim Speaker",
          "imageUrl":
            "https://iontechdotorg.visualstudio.com/_api/_common/identityImage?id=f9a18dab-76b3-42bc-bb3a-103865994dae"
        }
      },
      {
        "status": "completed",
        "result": "succeeded",
        "buildNumber": "1.0.0.2",
        "startTime": "2018-05-19T03:56:10.1694968Z",
        "definition": { "id": 3, "name": "Honest Joe's CI" },
        "requestedFor": {
          "displayName": "Jim Speaker",
          "imageUrl":
            "https://iontechdotorg.visualstudio.com/_api/_common/identityImage?id=f9a18dab-76b3-42bc-bb3a-103865994dae"
        }
      }
    ]
  };

  return {
    get: function() {
      return fakeData;
    }
  };
};
