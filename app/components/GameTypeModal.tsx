"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faTrophy,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/firebase";
import { useGame } from "@/app/context/GameContext";

interface GameTypeModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface ImageData {
  url: string;
  type: string;
}

interface GameResponse {
  images: ImageData[];
  gameId: string;
}

const GameTypeModal = ({ isOpen, closeModal }: GameTypeModalProps) => {
  const router = useRouter();
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setError] = useState<string | null>(null);
  const { setGameData } = useGame();

  const gameModes = [
    {
      name: "Classic",
      description: "Practise with random images",
      icon: faGamepad,
      color: "bg-blue-500",
      route: "/game/classic",
    },
    {
      name: "Competition",
      description: "Compete against others",
      icon: faTrophy,
      color: "bg-[var(--heartflow-red)]",
      route: "/game/competition",
    },
    {
      name: "Custom",
      description: "Limited time challenges",
      icon: faStar,
      color: "bg-purple-500",
      route: "/game/custom",
    },
  ];

  // const gameBoards = [
  //   {
  //     name: "Single",
  //     description: "One image at a time",
  //     icon: faGamepad,
  //     color: "bg-green-500",
  //   },
  //   {
  //     name: "Dual",
  //     description: "Choose counter factual from a pair of images",
  //     icon: faTrophy,
  //     color: "bg-red-500",
  //   },
  // ];

  // const gameTypes = [
  //     {
  //         name: 'Classic',
  //         description: 'Practice at your own pace',
  //         details: [
  //             'Take your time analyzing images',
  //             'No time pressure',
  //             'Track your progress'
  //         ],
  //         icon: faGamepad,
  //         color: 'bg-blue-500',
  //         route: '/game/classic'
  //     },
  //     {
  //         name: 'Competitive',
  //         description: 'Compete against others',
  //         details: [
  //             'Race against the clock',
  //             'Score points quickly',
  //             'Compete for leaderboard'
  //         ],
  //         icon: faTrophy,
  //         color: 'bg-[var(--heartflow-red)]',
  //         route: '/game/competitive'
  //     },
  //     {
  //         name: 'Special',
  //         description: 'Limited time challenges',
  //         details: [
  //             'Daily challenges',
  //             'Streak bonuses',
  //             'Earn badges'
  //         ],
  //         icon: faStar,
  //         color: 'bg-purple-500',
  //         route: '/game/special'
  //     },
  // ]

  const handleGameSelect = async (route: string) => {
    if (route === "/game/classic") {
      if (imageCount) {
        try {
          setIsLoading(true);
          const user = auth.currentUser;
          if (!user) {
            throw new Error("No user logged in");
          }

          const idToken = await user.getIdToken(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/game/initialize-classic-game`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                imageCount: imageCount,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to initialize game");
          }
  
          const data: GameResponse = await response.json();
          console.log("Raw API response:", data);

          // Format images with the correct URL field - no more pairs, just single images
          const formattedImages = data.images.map(
            (img: ImageData, index: number) => ({
              id: index + 1,
              path: img.url, // Use the url field from the API
              type: img.type,
            })
          );

          console.log("Formatted images:", formattedImages);

          setGameData(data.gameId, imageCount, formattedImages);

          closeModal();
          router.push(`/game/classic`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Failed to start game:", error);
            setError(error.message);
          } else {
            setError("An unknown error occured");
          }
          console.log(errorState);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      closeModal();
      router.push(route);
    }
  };
  

  const handleMouseEnter = (name: string) => {
    setHoveredType(name);
    if (!showDetails) setShowDetails(true);
  };

  const selectedGameMode = gameModes.find((g) => g.name === hoveredType);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black/25" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl transform rounded-2xl bg-white shadow-xl transition-all overflow-hidden">
              <div className="flex h-[500px]">
                <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
                  <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                    Select Game Mode
                  </Dialog.Title>

                  <div className="space-y-3">
                    {gameModes.map((mode) => (
                      <button
                        key={mode.name}
                        onMouseEnter={() => handleMouseEnter(mode.name)}
                        className={`w-full p-4 flex items-center justify-between rounded-xl border transition-all duration-200
                                                    ${
                                                      selectedMode === mode.name
                                                        ? "border-[var(--heartflow-blue)] bg-blue-50"
                                                        : "border-gray-200 hover:border-[var(--heartflow-blue)] hover:shadow-md"
                                                    }`}
                        onClick={() => setSelectedMode(mode.name)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`${mode.color} w-10 h-10 rounded-lg flex items-center justify-center`}
                          >
                            <FontAwesomeIcon
                              icon={mode.icon}
                              className="w-5 h-5 text-white"
                            />
                          </div>
                          <div className="ml-4 text-left">
                            <h4 className="text-base font-medium text-gray-900">
                              {mode.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {mode.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-1/2 relative">
                  <Transition
                    show={showDetails}
                    enter="transition-all duration-300 ease-in-out"
                    enterFrom="opacity-0 translate-x-4"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-300 ease-in-out"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-4"
                  >
                    <div className="absolute inset-0 overflow-y-auto">
                      <div className="p-6">
                        {selectedGameMode ? (
                          <div className="flex flex-col h-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                              {selectedGameMode.name} Mode
                            </h3>

                            <div className="flex-1 min-h-0">
                              {selectedGameMode.name === "Classic" && (
                                <div className="mt-6">
                                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                                    Number of Images
                                  </h4>
                                  <div className="grid grid-cols-4 gap-2">
                                    {[5, 10, 15, 20, 30, 40, 50].map((num) => (
                                      <button
                                        key={num}
                                        onClick={() => setImageCount(num)}
                                        className={`py-2 px-3 rounded border text-sm font-medium transition-colors
                                                                                    ${
                                                                                      imageCount ===
                                                                                      num
                                                                                        ? "bg-blue-500 text-white border-blue-500"
                                                                                        : "border-gray-300 hover:border-blue-500"
                                                                                    }`}
                                      >
                                        {num}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                handleGameSelect(selectedGameMode.route)
                              }
                              disabled={
                                selectedGameMode.name === "Classic" &&
                                (!imageCount || isLoading)
                              }
                              className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                                                                 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                  Loading...
                                </div>
                              ) : (
                                "Start Game"
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-500">
                            Select a game type to see details
                          </div>
                        )}
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GameTypeModal;
