//Firebase config
var config = {
  apiKey: "AIzaSyAvGvnm7PZyMb3SEsfh-cc4Fofbd6EOR_s",
  authDomain: "train-scheduler-b3777.firebaseapp.com",
  databaseURL: "https://train-scheduler-b3777.firebaseio.com",
  projectId: "train-scheduler-b3777",
  storageBucket: "",
  messagingSenderId: "59703338010",
  appId: "1:59703338010:web:0f3d4f26f4c719d4a19da3"
};

//Initializing the firebase config
firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var frequency = 0;
var nextArrival = "";
var minutesAway = "";

//Form validation for the First Train Arrival Time, so that only numbers and ":" can be typed
$(document).ready(function() {
  var regex = /([01]?[0-9]|2[0-3]):([0-5][0-9])/;
  $("#firstTrainTime-input").keyup(function() {
    var val = $(this).val();
    if (val != regex) {
      val = val.replace(/[^0-9\:]/g, "");
    }
    $(this).val(val);
  });
});

//on click function to remove the train from the schedule
$(document).on("click", ".trainArrival", function() {
  keyref = $(this).attr("data-remove");
  database
    .ref()
    .child(keyref)
    .remove();
  window.location.reload();
});

// Capture Button Click for adding train
$("#add-train").on("click", function(event) {
  //prevent page from refreshing
  event.preventDefault();

  //getting the value for train name input
  trainName = $("#trainName-input")
    .val()
    .trim();
  //getting the value for destination input
  destination = $("#destination-input")
    .val()
    .trim();
  //getting the value for first train time input and formatting in 24 hour time
  firstTrainTime = moment(
    $("#firstTrainTime-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("HH:mm");
  //getting value of minutes and formatting to minutes
  frequency = moment(
    $("#frequency-input")
      .val()
      .trim(),
    "mm"
  ).format("mm");
  //converting train time to 24 hour time
  var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(
    1,
    "years"
  );
  console.log(firstTrainTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
  //console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var remainder = diffTime % frequency;
  // console.log(remainder);

  // Minute Until Train
  var minutesTillTrain = frequency - remainder;
  minutesAway = "MINUTES TILL TRAIN: " + minutesTillTrain;
  console.log(minutesAway);
  // Next Train
  var nextTrain = moment().add(minutesTillTrain, "minutes");
  nextArrival = "ARRIVAL TIME: " + moment(nextTrain).format("HH:mm");
  console.log(nextArrival);

  //Push data to firebase
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  });
});

// Firebase watcher + initial loader
database.ref().on(
  "child_added",
  function(snapshot) {
    // Log everything that's coming out of snapshot
    var sv = snapshot.val();
    //adding key to remove each object
    var key = snapshot.key;

    // Dynamically create row and tables
    var row = $("<tr>");
    var tableTrainName = $("<td>");
    var tableDestination = $("<td>");
    var tableFrequency = $("<td>");
    var tableNextArrival = $("<td>");
    var tableMinutesAway = $("<td>");
    //add a remove button to delete the train from the schedule
    var tableRemove = $(
      "<td class='text-center'><button class='trainArrival btn btn-danger btn-xs' data-remove='" +
        key +
        "'>X</button></td>"
    );
    //place data in table
    tableTrainName.text(sv.trainName);
    tableDestination.text(sv.destination);
    tableFrequency.text(sv.frequency);
    tableNextArrival.text(sv.nextArrival);
    tableMinutesAway.text(sv.minutesAway);
    //append the rows to the tabble
    row.append(tableTrainName);
    row.append(tableDestination);
    row.append(tableFrequency);
    row.append(tableNextArrival);
    row.append(tableMinutesAway);
    row.append(tableRemove);
    //place rows in table body
    $("#trains tbody").append(row);
    // Handle the errors
  },

  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);
