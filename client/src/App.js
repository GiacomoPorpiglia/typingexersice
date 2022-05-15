import Counter from "./components/Counter";
import StringParagraph from "./components/StringParagraph";
import Statistics from "./components/Statistics";
import React, {useState, useEffect} from "react";

import axios from 'axios'
//--------------------Variables initialization------------------------------------

var string = ""

var inputString = "" // WHAT THE USER HAS WRITTEN

var rightCharactersCount = 0;
var wrongCharactersCount = 0;

var startTime = undefined, endTime = undefined;

var prevClickTime = undefined;

var keyboardListening = true;

var stats = {
    time: undefined,
    totalWords: undefined,
    correctWords: undefined,
    wpm: undefined,
    cpm: undefined,
}

var initialTime = new Date()
var runTimer = false

//----------------------------------------------------------------


const App = () => {


    const [rightCharacters, updateRightCharacters ] = useState(0);
    const [wrongCharacters, updateWrongCharacters ] = useState(0);

    const [showStatistics, updateStatistics ] = useState(false);
    const [startingString, updateStartingString ] = useState("");


    //ONCE THE USER RESTARTS, THE STRING GETS UPDATED

    useEffect(() => {
        string = startingString
        // console.log("UPDATED");
    }, [startingString])

    //FETCH THE NEW STRING FROM THE SERVER WHEN THE USER RESTARTS OR WHEN IT ENTERS THE FIRST TIME
    const getNewString = () => {
        return axios.get('/api/newstring')
            .then(res => updateStartingString(res.data))
            .catch((error) => alert(error.message))
    }





    const handleKeyPress = (e) => {
        if(keyboardListening) {
            if(!startTime && 65 <= e.keyCode <= 90) {
                startTime = new Date()
                initialTime = new Date()
                runTimer = true
            }

            var char = String.fromCharCode(e.keyCode); // Converts keyCode (number) into the corresponding character
            
            if(e.shiftKey) { // if shift is pressed, do nothing, because by default the char will be uppercase
                //DO NOTHING
            } else if(65 <= e.keyCode <= 90) { // else make it lowercase, if it is a UPPERCASE letter (code between 65 and 90 ASCII)
                if(prevClickTime === undefined || Date.now()-prevClickTime > 1000 ) {
                    char = char.toLowerCase();
                    prevClickTime=Date.now()
                }
            }
            
            inputString = inputString.concat(char);
    //   console.log(string, inputString)
            findErrors(string, inputString)
        }
    }

    const deleteChar = (e) => {
        if(keyboardListening && e.keyCode === 8) { // BACKSPACE (to delete the last character)
            inputString = inputString.substring(0, inputString.length-1) //delete last character from inputString
            findErrors(string, inputString)
        }
    }


  const findErrors = (string, inputString) => {
    var inner = "" // innerHTML of the #string
    rightCharactersCount = 0;
    wrongCharactersCount = 0;
    for(let i = 0; i < inputString.length; i++) {
        if(string[i] === inputString[i]) {
            let startingPoint = i
            inner = inner.concat('<span class="completedText">')
            while(string[i] === inputString[i] && inputString[i]) { // make the characters yellow ("completedText") if they are right
                rightCharactersCount++;
                i++;
                if(i === inputString.length) break;
            }
            inner = inner.concat(string.substring(startingPoint, i))
            inner = inner.concat('</span>')
        }
        if(string[i] !== inputString[i]) {
            let startingPoint = i
            inner = inner.concat('<span class="errorText">')
            while(string[i] !== inputString[i] && inputString[i]) {  // make the characters yellow ("errorText") if they are wrong
                i++;
                if(i >= inputString.length) break;
            }
            wrongCharactersCount+=i-startingPoint;
            inner = inner.concat(inputString.substring(startingPoint, i).replace(" ", "_"))
            inner = inner.concat('</span>')
        }
        i--;
    }
    inner = inner.concat(string.substring(inputString.length, string.length)) // add the remaining part of the string the user hasn't written yet
    updateRightCharacters(rightCharactersCount)
    updateWrongCharacters(wrongCharactersCount)
 
    document.querySelector('#string').innerHTML = inner
    if(rightCharactersCount+wrongCharactersCount >= string.length-1) { // If the user has completed the text
        keyboardListening = false;
        showStats();
    }       

  }


  //WHEN THE USER HAS ENDED TO WRITE THE STREAM
  const showStats = () => {
      endTime = new Date()
      runTimer = false
      let time = endTime-startTime;
      let inputStringWords = inputString.split(' ')
      let stringWords = string.split(' ')
      let correctWords = 0;
      for(let i = 0; i < stringWords.length; i++) {
          if(stringWords[i] === inputStringWords[i]) {
              correctWords++;
          }
      }

    
      stats.time = Math.round(time/1000);
      stats.totalWords = stringWords.length
      stats.correctWords = correctWords
      stats.wpm = Math.round((correctWords*1000/time)*60)
      stats.cpm = Math.round((rightCharactersCount*1000/time)*60)

      updateStatistics(true) // SET showstatistics to TRUE
  }

  const reset = () => {
    updateStatistics(false) // SET showstatistics to FALSE

    getNewString() // calls fetch from the server / to ge a new string from the available ones in strings.txt in the server
    inputString = "" // WHAT THE USER HAS WRITTEN

    initialTime = new Date()
    keyboardListening = true
    rightCharactersCount = 0;
    wrongCharactersCount = 0;
    updateRightCharacters(rightCharactersCount)
    updateWrongCharacters(wrongCharactersCount)

    startTime = undefined;
    endTime = undefined;

    prevClickTime = undefined;
  }


  window.onload = () => {
      getNewString()
      document.addEventListener('keypress', handleKeyPress)
      document.addEventListener('keydown', deleteChar)   
  }


  return (
    <div className="App container">
      <h1 className="text-center primary">Typing Exercise <span className="blinking-cursor">|</span> </h1>
      <br></br>
      <Counter rightCharacters={rightCharacters} initialTime={initialTime} runTimer = {runTimer} wrongCharacters={wrongCharacters} />
      <br></br>
      <StringParagraph string = {startingString} showStatistics={showStatistics} />
      <br></br>
      <Statistics showStatistics={showStatistics} stats = {stats} reset = {reset}/>
    </div>
  );
}

export default App;
