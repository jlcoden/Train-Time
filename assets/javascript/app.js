
  $(document).ready(function() {

var timepicker = new TimePicker('firstTrainTime-input', {
  lang: 'en',
  theme: 'dark'
});
timepicker.on('change', function(evt) {
  
  var value = (evt.hour || '00') + ':' + (evt.minute || '00');
  evt.element.value = value;

});


});
   

var config = {
  apiKey: "AIzaSyAvGvnm7PZyMb3SEsfh-cc4Fofbd6EOR_s",
    authDomain: "train-scheduler-b3777.firebaseapp.com",
    databaseURL: "https://train-scheduler-b3777.firebaseio.com",
    projectId: "train-scheduler-b3777",
    storageBucket: "",
    messagingSenderId: "59703338010",
    appId: "1:59703338010:web:0f3d4f26f4c719d4a19da3"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = ""; 
var frequency = 0;
var nextArrival = "";
var minutesAway = ""; 

// Capture Button Click
$("#add-train").on("click", function(event) {

  // Don't refresh the page!
  event.preventDefault();

  

  // YOUR TASK!!!
  // Code in the logic for storing and retrieving the most recent train.
  // Don't forget to provide initial data to your Firebase database.
  trainName = $("#trainName-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTrainTime = moment($("#firstTrainTime-input").val().trim(), "HH:mm").format("HH:mm");
  frequency = moment($("#frequency-input").val().trim(), "mm").format("mm");



  var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTrainTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var remainder = diffTime % frequency;
  console.log(remainder);

  // Minute Until Train
  var minutesTillTrain = frequency - remainder;
  minutesAway =("MINUTES TILL TRAIN: " + minutesTillTrain);
  console.log(minutesAway); 
 // Next Train
  var nextTrain = moment().add(minutesTillTrain, "minutes");
  nextArrival =("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  console.log(nextArrival); 



  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  });

});


// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function(snapshot) {

  // Log everything that's coming out of snapshot
  var sv = snapshot.val(); 

  console.log(sv);
  console.log(sv.trainName);
  console.log(sv.destination);
  console.log(sv.firstTrainTime);
  //console.log(sv.monthsWorked);
  console.log(sv.frequency);
  //console.log(sv.totalBilled);

     // Change the HTML to reflect
  var row = $("<tr>");
  var tableTrainName = $("<td>");
  var tableDestination = $("<td>");
  var tableFrequency = $("<td>");
  var tableNextArrival = $("<td>");
  var tableMinutesAway= $("<td>");

tableTrainName.text(sv.trainName);
tableDestination.text(sv.destination);
tableFrequency.text(sv.frequency);
tableNextArrival.text(sv.nextArrival);
tableMinutesAway.text(sv.minutesAway);
row.append(tableTrainName);
row.append(tableDestination);
row.append(tableFrequency);
row.append(tableNextArrival);
row.append(tableMinutesAway);
  
    $("#trains tbody").append(row);
  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});




   // Assume the following situations.

    // (TEST 1)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 3 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:18 -- 2 minutes away

    // (TEST 2)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:21 -- 5 minutes away


    // ==========================================================

    // Solved Mathematically
    // Test case 1:
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18

    // Solved Mathematically
    // Test case 2:
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21

    // // Assumptions
    // var tFrequency = 3;

    // // Time is 3:30 AM
   
    // // First Time (pushed back 1 year to make sure it comes before current time)
    
 