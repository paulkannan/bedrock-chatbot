document.addEventListener('DOMContentLoaded', function() {
    // Run this function when the DOM is fully loaded

    // Set the initial state of the dropdown to "-- Select Option --"
    var selectOption = document.getElementById('selectOption');
    selectOption.value = "";

    // Hide the input container by default
    var userInputContainer = document.querySelector('.user-input-container');
    userInputContainer.style.display = 'none';

    // Call toggleInput to show/hide the input container based on the initial state
    toggleInput();
});

var toggleInput = () => {
    var selectOption = document.getElementById('selectOption').value;
    var userInputContainer = document.querySelector('.user-input-container');
    var outputBox = document.getElementById('outputBox');

    // Clear the output box when the option is changed
    outputBox.innerHTML = "";
    outputBox.style.display = 'none';

    if (selectOption === "Text Generation") {
        userInputContainer.style.display = 'flex';
    } 
    else if (selectOption === "Image Generation") {
      userInputContainer.style.display = 'flex';
    }
    else {
        userInputContainer.style.display = 'none';
    }
}

var callAPI = (selectOption) => {
  if (selectOption === "Text Generation") {
      handleTextGeneration();
  } else if (selectOption === "Image Generation") {
      handleImageGeneration();
  } else {
      alert("Please select a valid option.");
  }
}

var handleTextGeneration = () => {
  var userInput = document.getElementById('userInput').value.trim();
  if (userInput === '') {
      alert("Please enter text for generation.");
      return;
  }

  var apiEndpoint = "https://f4gy8v62kc.execute-api.us-east-1.amazonaws.com/dev";
  var inputString = `Human: ${userInput}  \n\nAssistant:`;
  makeAPICall(apiEndpoint, inputString);
}

var handleImageGeneration = () => {
  var userInput = document.getElementById('userInput').value.trim();
  if (userInput === '') {
      alert("Please provide text details for image generation.");
      return;
  }

  var apiEndpoint = "https://ebclwr4v22.execute-api.us-east-1.amazonaws.com/dev";
  var inputString = `${userInput}`;
  makeAPICall(apiEndpoint, inputString);
}

var makeAPICall = (apiEndpoint, inputString) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = {
      "input": inputString                
  };

  console.log("Request body:", JSON.stringify(raw));

  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
  };

  fetch(apiEndpoint, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
      // Get the selected option value from the <select> element
      var selectOption = document.getElementById('selectOption').value;  
      
      console.log("Select option value:", selectOption);
      
        if (selectOption === "Text Generation") {
            console.log("Reached display response", data);
            displayResponse(data);
        } 
        else if (selectOption === "Image Generation") {
                 console.log("Reached image response", data);
                 displayImage(data);
        }
        else {
            console.log(data);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

var displayResponse = (data) => {
  var outputBox = document.getElementById('outputBox');

  try {
      // Parse the JSON response
      var parsedData = JSON.parse(data.body);

      // Check if the response has the expected structure
      if (parsedData && parsedData.Answer) {
          // Extract the "Answer" property
          var answer = parsedData.Answer;

          // Format the Answer property for better readability
          var formattedAnswer = answer.replace(/\\n/g, '<br>');  // Use '<br>' for line breaks

          // Update the output box with the formatted content
          outputBox.innerHTML = formattedAnswer;
          outputBox.style.display = 'block';
      } else {
          console.error('Invalid response structure:', parsedData);
      }
  } catch (error) {
      console.error('Error parsing response:', error);
  }
}

var displayImage = (data) => {
  // Parse the JSON response
  var parsedData = JSON.parse(data.body);
  console.log("Parsed Data: ",parsedData);

  // Extract the download_url from the parsed data
  var downloadUrl = parsedData.download_url;
  console.log("Parsed url: ",downloadUrl);

  // Display the download_url in the outputBox
  outputBox.textContent = 'You can download your image from this URL: ' + downloadUrl;
  outputBox.style.display = 'block';
};

// function([string1, string2],target id,[color1,color2])    
consoleText(['Hello World.', 'Serverless AI/ML', 'Language Processing','Visual Comprehension','Code Generation', 'Speech to Text'], 'text',['tomato','rebeccapurple','blue','green','orange']);

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ['#fff'];
  var visible = true;
  var con = document.getElementById('console');
  var letterCount = 1;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id)
  target.setAttribute('style', 'color:' + colors[0])
  window.setInterval(function() {

    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount)
      window.setTimeout(function() {
        var usedColor = colors.shift();
        colors.push(usedColor);
        var usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.setAttribute('style', 'color:' + colors[0])
        letterCount += x;
        waiting = false;
      }, 1000)
    } else if (letterCount === words[0].length + 1 && waiting === false) {
      waiting = true;
      window.setTimeout(function() {
        x = -1;
        letterCount += x;
        waiting = false;
      }, 1000)
    } else if (waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount)
      letterCount += x;
    }
  }, 120)
  window.setInterval(function() {
    if (visible === true) {
      con.className = 'console-underscore hidden'
      visible = false;

    } else {
      con.className = 'console-underscore'

      visible = true;
    }
  }, 400)
}