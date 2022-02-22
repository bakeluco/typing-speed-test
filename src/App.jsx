import { loremIpsum } from "lorem-ipsum";

import { useEffect, useRef, useState } from "react";

const WORD_COUNT = 25;
const SECONDS = 60;

const App = () => {
  const [words, setWords] = useState([]);
  const [countdown, setCountdown] = useState(SECONDS);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [currentChar, setCurrentChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const inputBarRef = useRef(null);

  useEffect(() => setWords(loremIpsum({ count: WORD_COUNT }).split(" ")), []);
  useEffect(() => status == "started" && inputBarRef.current.focus(), [status]);
  useEffect(() => !currentInput && setCurrentCharIndex(-1), [currentInput]);

  const generateWords = () => {
    return setWords(loremIpsum({ count: WORD_COUNT }).split(" "));
  };

  const start = () => {
    if (status == "started") return;
    setStatus("started");
    let interval = setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          clearInterval(interval);
          setStatus("finished");
          setCurrentInput("");
          return SECONDS;
        } else return value - 1;
      });
    }, 1000);
  };

  const reset = () => {
    setStatus("waiting");
    generateWords();
    setCurrentWordIndex(0);
    setCorrect(0);
    setIncorrect(0);
    setCurrentCharIndex(-1);
    setCurrentChar("");
    return;
  };

  const handleKeyDown = ({ keyCode, key }) => {
    status == "waiting" && start();
    //shift
    if (keyCode == 16) return;
    //space
    if (keyCode == 32) {
      checkMatch();
      setCurrentInput("");
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentCharIndex(-1);
      //backspace
    } else if (keyCode == 8) {
      setCurrentCharIndex(currentCharIndex - 1);
      setCurrentChar("");
    } else {
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar(key);
    }
  };

  const checkMatch = () =>
    words[currentWordIndex] == currentInput.trim()
      ? setCorrect(correct + 1)
      : setIncorrect(incorrect + 1);

  const getCharClass = (wordIdx, charIdx, char) => {
    if (
      wordIdx == currentWordIndex &&
      charIdx == currentCharIndex &&
      currentChar &&
      status != "finished"
    ) {
      if (char == currentChar) return "has-underline-success";
      else return "has-underline-danger";
    } else if (
      wordIdx == currentWordIndex &&
      currentCharIndex >= words[currentWordIndex].length
    ) {
      return "has-underline-danger";
    } else if (wordIdx < currentWordIndex) return "is-finished";
    else return "";
  };

  return (
    <div className="container">
      <div className="hero mt-6">
        <div className="columns">
          <div className="column has-text-centered">
            <p className="is-size-5">Timer:</p>
            <p className="has-text-info is-size-1">
              {countdown
                ? (Math.floor(countdown / 60) > 9
                    ? Math.floor(countdown / 60)
                    : "0" + Math.floor(countdown / 60)) +
                  ":" +
                  (countdown % 60 > 9 ? countdown % 60 : "0" + (countdown % 60))
                : "00:00"}
            </p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5">WPM:</p>
            <p className="has-text-primary is-size-1">{correct + incorrect}</p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5">Accuracy:</p>
            <p className="has-text-info is-size-1">
              {!correct && !incorrect
                ? 100
                : Math.round((correct / (correct + incorrect)) * 100)}
              %
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        {status != "finished" && (
          <input
            ref={inputBarRef}
            placeholder="Start typing to play..."
            autoFocus
            type="text"
            className="input mb-2"
            onKeyDown={handleKeyDown}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        )}
        {status == "finished" && (
          <button
            disabled={!countdown}
            className={"button is-light is-outlined mb-2 is-fullwidth"}
            onClick={() => reset()}
          >
            Reset
          </button>
        )}
        <div className="card">
          <div className="card-content">
            <div className="content">
              {words.map((word, wordIdx) => (
                <span key={wordIdx}>
                  {word.split("").map((char, charIdx) => (
                    <span
                      className={getCharClass(wordIdx, charIdx, char)}
                      key={charIdx}
                    >
                      {char}
                    </span>
                  ))}{" "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section"></div>
    </div>
  );
};

export default App;
