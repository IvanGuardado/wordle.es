import { DateTime, Duration } from "luxon";
import React, { useEffect, useState } from "react";
import { getTodaysWord } from "../lib/utils";

const game = {
  attempts: [],
  setAttempts: () => {},
  matrix: [],
  setMatrix: () => {},
  tried: [],
  setTried: () => {},
  present: [],
  setPresent: () => {},
  correct: [],
  setCorrect: () => {},
  gameStatus: null,
  setGameStatus: () => {},
  processWord: () => {},
  saveGame: () => {},
  colorBlind: false,
  setColorBlind: () => {},
};

export const GameContext = React.createContext({ game });

export function getEndTimeForDate(date) {
  // Returns the end of the time for the given date

  let endTime = date.plus(Duration.fromObject({ day: 1 }));
  endTime = DateTime.fromObject(
    {
      year: endTime.year,
      month: endTime.month,
      day: endTime.day,
    },
    { zone: "America/New_York" }
  );

  return endTime;
}

export const GameContextProvider = (props) => {
  const [attempts, setAttempts] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [tried, setTried] = useState([]);
  const [present, setPresent] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [gameStatus, setGameStatus] = useState("PLAYING");
  const [colorBlind, setColorBlind] = useState(false);

  const processWord_ = (word) => {
    // Internal logic to parse the word and determine if it is correct or not

    let solution2 = getTodaysWord(props.word);
    let newMatrixRow = ["x", "x", "x", "x", "x"];
    let newTried = [];
    let newPresent = [];
    let newCorrect = [];

    // Update letters
    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);

      if (char == solution2.charAt(i)) {
        newMatrixRow[i] = "c";
        newCorrect.push(char);
      } else if (solution2.includes(char)) {
        newPresent.push(char);
      } else {
        newTried.push(char);
      }
    }

    // Update present state
    // remove correct chars from present chars
    for (let i = 0; i < newCorrect.length; i++) {
      const correctChar = newCorrect[i];
      solution2 = solution2.replace(correctChar, "_");
    }

    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);
      if (newMatrixRow[i] == "x" && solution2.includes(char)) {
        newMatrixRow[i] = "p";
        solution2 = solution2.replace(char, "_");
      }
    }

    return { newMatrixRow, newTried, newPresent, newCorrect };
  };

  const processWord = (word) => {
    const solution = getTodaysWord(props.word);
    if (game.gameStatus != "WIN" && game.gameStatus != "LOSE") {
      const { newMatrixRow, newTried, newPresent, newCorrect } =
        processWord_(word);
      const newAttempts = [...attempts, word];

      setAttempts(newAttempts);
      setMatrix([...matrix, newMatrixRow]);
      setTried([...tried, ...newTried]);
      setPresent([...present, ...newPresent]);
      setCorrect([...correct, ...newCorrect]);

      if (word == solution) {
        setGameStatus("WIN");
      } else if (newAttempts.length == 6) {
        setGameStatus("LOSE");
      }
    }
  };

  function saveGame() {
    const lastPlayed = DateTime.local({
      zone: "America/New_York",
    });

    localStorage.setItem(
      "gameState",
      JSON.stringify({
        board: attempts,
        lastPlayedTs: lastPlayed.valueOf(),
      })
    );

    localStorage.setItem("colorBlindTheme", JSON.stringify(colorBlind));
  }

  useEffect(() => {
    // Load settings
    const colorBlind_ = localStorage.getItem("colorBlindTheme");
    if (colorBlind_) {
      setColorBlind(JSON.parse(colorBlind_));
    }

    // Set word of the day
    let today = DateTime.local({ zone: "America/New_York" });
    let nextGameStartsAt = getEndTimeForDate(today);

    const solution_ = getTodaysWord(props.word);

    // Load gameState
    const gameState = localStorage.getItem("gameState");

    if (gameState) {
      const state = JSON.parse(gameState);
      setGameStatus("PLAYING");

      let lastPlayed = DateTime.fromMillis(state.lastPlayedTs, {
        zone: "America/New_York",
      });
      const savedGameEndDay = getEndTimeForDate(lastPlayed);

      if (!nextGameStartsAt.equals(savedGameEndDay)) {
        // New day: Reset game
        setAttempts([]);
      } else {
        // Same day: Load board
        let matrix_ = [];
        let tried_ = [];
        let present_ = [];
        let correct_ = [];

        for (let i = 0; i < state.board.length; i++) {
          const word = state.board[i];
          const { newMatrixRow, newTried, newPresent, newCorrect } =
            processWord_(word);

          matrix_ = [...matrix_, newMatrixRow];
          tried_ = [...tried_, ...newTried];
          present_ = [...present_, ...newPresent];
          correct_ = [...correct_, ...newCorrect];

          if (word == solution_) {
            setGameStatus("WIN");
          }
        }

        setAttempts(state.board);
        setMatrix(matrix_);
        setTried(tried_);
        setPresent(present_);
        setCorrect(correct_);

        if (state.board.length == 6) {
          setGameStatus("LOSE");
        }
      }
    } else {
      setGameStatus("NEW");
    }
  }, []);

  useEffect(() => {
    saveGame();
  });

  const values = {
    attempts,
    setAttempts,
    matrix,
    setMatrix,
    tried,
    setTried,
    present,
    setPresent,
    correct,
    setCorrect,
    gameStatus,
    setGameStatus,
    processWord,
    saveGame,
    colorBlind,
    setColorBlind,
  };

  return (
    <GameContext.Provider value={values}>{props.children}</GameContext.Provider>
  );
};
