import { CogIcon, QuestionMarkCircleIcon } from "@heroicons/react/outline";
import React, { useContext, useState } from "react";
import { GameContext } from "../components/GameContext";
import WordleGrid from "../components/GridGame";
import InfoModal from "../components/InfoModal";
import Keyboard from "../components/KeyboardUI";
import Settings from "../components/Settings";

export default function Index({}) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const game = useContext(GameContext);

  // Link sibling components
  let receiver = (keyName) => {};

  const trigger = (keyName) => {
    receiver && receiver(keyName);
  };

  const receiverCreator = (handler) => {
    receiver = handler;
  };

  return (
    <div class={`${game.colorBlind ? "colorblind" : ""}`}>
      {showHelpModal || game.gameStatus == "NEW" ? (
        <InfoModal
          closeModal={() => {
            setShowHelpModal(false);
            if (game.gameStatus == "NEW") {
              game.setGameStatus("PLAYING");
              game.saveGame();
            }
          }}
        />
      ) : null}

      {showSettings ? (
        <Settings
          closeModal={() => {
            setShowSettings(false);
          }}
        />
      ) : null}

      <div className="flex flex-col h-screen">
        <header>
          <div className="flex flex-row mx-auto max-w-lg py-2 border-b">
            <button
              className="my-2 flex-none"
              onClick={() => {
                setShowHelpModal(true);
              }}
            >
              <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500" />
            </button>

            <div className="flex-auto text-center">
              <h1 className="uppercase font-extrabold text-4xl tracking-wider">
                Wordle (ES)
              </h1>
            </div>

            <button
              className="my-2 flex-none"
              onClick={() => {
                setShowSettings(true);
              }}
            >
              <CogIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </header>

        <WordleGrid receiverCreator={receiverCreator} />
        <Keyboard clickHandler={trigger} />
      </div>
    </div>
  );
}
