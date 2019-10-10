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
  var frequency = 0;
  var nextArrival = "";
  var minutesAway = ""; 


  $(document).ready(function() {
    var regex = /([01]?[0-9]|2[0-3]):([0-5][0-9])/;
    $('#firstTrainTime-input').keyup(function(){
      var val = $(this).val();
      if(val != regex) {
           val = val.replace(/[^0-9\:]/g,'');
      }
      $(this).val(val); 
  
    });
    
  });


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
    //console.log("CURRENT TIME: " + moment(currentTime).format("H:HH"));
  
    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);
  
    // Time apart (remainder)
    var remainder = diffTime % frequency;
   // console.log(remainder);
  
    // Minute Until Train
    var minutesTillTrain = frequency - remainder;
    minutesAway =("MINUTES TILL TRAIN: " + minutesTillTrain);
    console.log(minutesAway); 
   // Next Train
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    nextArrival =("ARRIVAL TIME: " + moment(nextTrain).format("H:HH"));
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
  
