const app = require("express")();
const AWS = require("aws-sdk");
AWS.config.region = "us-east-1";
// access_key_id and secret_access_key are set in ./.aws/credentials

const ml = new AWS.MachineLearning();

app.get("/predict/:away/:awayWL/:home/:homeWL", async function(req, res) {
  // Set up the record
  const record = {
    home: req.params.home,
    away: req.params.away,
    homeWL: req.params.homeWL,
    awayWL: req.params.awayWL
  };

  // Make the AWS call
  const result = await ml
    .predict({
      MLModelId: "ml-Zgx0grvBZyy", // feb 12th
      PredictEndpoint:
        "https://realtime.machinelearning.us-east-1.amazonaws.com",
      Record: record
    })
    .promise();

  // Pull the prediction from the result
  let prediction = result.Prediction.predictedValue;

  // Round it
  prediction = Math.round(prediction * 10) / 10;

  // Send it out
  if (prediction > 0) {
    res.send({ winner: req.params.home, by: prediction });
  } else {
    res.send({ winner: req.params.away, by: -1 * prediction });
  }
});

const PORT = 8001;
app.listen(PORT);
console.log(`Listening on ${PORT}`);
