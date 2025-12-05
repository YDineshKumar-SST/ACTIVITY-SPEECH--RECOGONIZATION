 function initSpeechToText() {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser. Try Chrome or Edge.");
        return;
      }

      var recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; 

      var startBtn = document.getElementById("startBtn");
      var stopBtn = document.getElementById("stopBtn");
      var clearBtn = document.getElementById("clearBtn");
      var saveBtn = document.getElementById("saveBtn");
      var textArea = document.getElementById("textArea");
      var savedCards = document.getElementById("savedCards");

     
      var notes = JSON.parse(localStorage.getItem("notes")) || [];
      showCards();

      startBtn.onclick = function () {
        recognition.start();
        textArea.placeholder = "Listening...";
      };

    
      stopBtn.onclick = function () {
        recognition.stop();
        textArea.placeholder = "Stopped listening.";
      };

      recognition.onresult = function (event) {
        var transcript = "";
        for (var i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        textArea.value = transcript;
      };

      recognition.onerror = function (event) {
        textArea.value = "Error: " + event.error;
      };

      clearBtn.onclick = function () {
        textArea.value = "";
      };

      saveBtn.onclick = function () {
        var text = textArea.value.trim();
        if (text !== "") {
          notes.push(text);
          localStorage.setItem("notes", JSON.stringify(notes));
          showCards();
          textArea.value = "";
        }
      };

      function showCards() {
        savedCards.innerHTML = "";
        for (var i = 0; i < notes.length; i++) {
          var card = document.createElement("div");
          card.className = "card";

          var p = document.createElement("p");
          p.textContent = notes[i];

          var delBtn = document.createElement("button");
          delBtn.textContent = "Delete";
          delBtn.setAttribute("data-index", i);

          delBtn.onclick = function () {
            var index = this.getAttribute("data-index");
            notes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            showCards();
          };

          card.appendChild(p);
          card.appendChild(delBtn);
          savedCards.appendChild(card);
        }
      }
    }

    window.onload = initSpeechToText;