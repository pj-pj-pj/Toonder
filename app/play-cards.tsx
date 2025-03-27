import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { router } from "expo-router";
import characters from "../constants/characters.json";
import {
  BotMessageSquare,
  Grid,
  ScanHeart,
  TableRowsSplit,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { MD3Colors, ProgressBar } from "react-native-paper";

type GameCard = {
  id: number;
  imgUrl: string;
  isFlipped: boolean;
};

const randomArrFunction = <T,>(arr: T[]): T[] => {
  const shuffledArr = [...arr];
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }
  return shuffledArr;
};

const gameCardsFunction = () => {
  // Shuffle characters first, then pick the first 14
  const selectedCharacters = randomArrFunction(characters).slice(0, 14);
  const imgUrls: string[] = selectedCharacters.map(
    ({ "img-url": imgUrl }) => imgUrl
  );

  // Create pairs (14 unique * 2 = 28 total)
  const pairedImgUrls: string[] = [...imgUrls, ...imgUrls];
  const randomImgUrls: string[] = randomArrFunction(pairedImgUrls);

  return randomImgUrls.map((imgUrl, index) => ({
    id: index,
    imgUrl,
    isFlipped: false,
  }));
};

export default function PlayCardsScreen() {
  const [timeLeft, setTimeLeft] = useState(85);
  const progress = timeLeft / 85;

  const [cards, setCards] = useState(gameCardsFunction());
  const [selectedCards, setSelectedCards] = useState<GameCard[]>([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [isGameStart, setGameStart] = useState(false);
  const [isShowCards, setIsShowCards] = useState(false);

  useEffect(() => {
    if (isGameStart && !gameWon) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      }
    }

    if (timeLeft <= 0) {
      setGameLost(true);
    }
  }, [timeLeft, isGameStart]);

  function showCardsForOne() {
    setIsShowCards(true);
    setTimeout(() => {
      setIsShowCards(false);
    }, 1800);
  }

  function handleGameRestart() {
    setCards(gameCardsFunction());
    setSelectedCards([]);
    setMatches(0);
    setWinMessage(new Animated.Value(0));
    setGameWon(false);
    setGameStart(false);
    setGameLost(false);
    setTimeLeft(86);
  }

  const cardClickFunction = (card: GameCard) => {
    if (!gameWon && selectedCards.length < 2 && !card.isFlipped) {
      const updatedSelectedCards = [...selectedCards, card];
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);

      if (updatedSelectedCards.length === 2) {
        if (updatedSelectedCards[0].imgUrl === updatedSelectedCards[1].imgUrl) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
            winGameFunction();
            setGameWon(true);
          }
        } else {
          setTimeout(() => {
            const flippedCards = updatedCards.map((c) =>
              updatedSelectedCards.some((s) => s.id === c.id)
                ? { ...c, isFlipped: false }
                : c
            );
            setSelectedCards([]);
            setCards(flippedCards);
          }, 800);
        }
      }
    }
  };

  const winGameFunction = () => {
    Animated.timing(winMessage, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (matches === cards.length / 2) {
      winGameFunction();
      setGameWon(true);
    }
  }, [matches]);

  const msg = `Pairs: ${matches} / ${cards.length / 2}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toonder</Text>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.replace("/love-exam")}>
          <Text style={styles.subtitleInactive}>
            <ScanHeart
              size={15}
              strokeWidth={1.5}
              color={"#e6e6e6"}
              style={{ paddingHorizontal: 15 }}
            />
            Love Exam
          </Text>
        </TouchableOpacity>
        <View style={styles.subtitle}>
          <Grid
            size={15}
            strokeWidth={1.5}
            color={"white"}
          />
          <Text style={{ color: "white", fontSize: 16 }}>Play Cards</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.replace("/character-selection")}
        >
          <Text style={styles.subtitleInactive}>
            <BotMessageSquare
              size={15}
              strokeWidth={1.5}
              color={"#e6e6e6"}
              style={{ paddingHorizontal: 15 }}
            />
            Chatbots
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        <View
          style={{
            display: "flex",
            marginTop: 12,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: 30,
            gap: 30,
          }}
        >
          {!gameWon && (
            <Text
              style={{
                color: "#7F7B9C",
              }}
            >
              Find your perfect match!
            </Text>
          )}
          {isGameStart ? (
            <Text
              style={{
                color: "#7F7B9C",
                padding: 5,
                paddingHorizontal: 20,
                backgroundColor: "#E1DFF0",
                borderRadius: 25,
              }}
            >
              {msg}
            </Text>
          ) : null}
        </View>
        {gameLost ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <View style={styles.winMessage}>
              <View style={styles.winMessageContent}>
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  Game Over! 💔
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                  }}
                >
                  You run out of time.
                </Text>
              </View>
              <View
                style={{
                  height: "55%",
                }}
              >
                {Array.from({
                  length: Math.ceil(Math.min(cards.length, 16) / 4),
                }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {cards.slice(index * 4, index * 4 + 4).map((card) => (
                      <TouchableOpacity
                        key={card.id}
                        style={[
                          {
                            flex: 1,
                            margin: 4,
                            alignItems: "center",
                            backgroundColor: "gray",
                            borderRadius: 5,
                          },
                        ]}
                      ></TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => handleGameRestart()}
                style={{
                  padding: 12,
                  paddingHorizontal: 85,
                  backgroundColor: "#918ABD",
                  marginTop: 15,
                  borderRadius: 25,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}
                >
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            {gameWon ? (
              <View style={styles.winMessage}>
                <View style={styles.winMessageContent}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    Perfect Match 💖
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    You found all the hidden hearts!
                  </Text>
                </View>
                <View
                  style={{
                    height: "55%",
                  }}
                >
                  {Array.from({
                    length: Math.ceil(Math.min(cards.length, 16) / 4),
                  }).map((_, index) => (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      {cards.slice(index * 4, index * 4 + 4).map((card) => (
                        <TouchableOpacity
                          key={card.id}
                          style={[
                            {
                              flex: 1,
                              margin: 4,
                              alignItems: "center",
                              backgroundColor: "#F08887",
                              borderRadius: 5,
                            },
                          ]}
                        ></TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => handleGameRestart()}
                  style={{
                    padding: 12,
                    paddingHorizontal: 85,
                    backgroundColor: "#918ABD",
                    marginTop: 15,
                    borderRadius: 25,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    Restart
                  </Text>
                </TouchableOpacity>
              </View>
            ) : isGameStart ? (
              <>
                <View style={styles.grid}>
                  {Array.from({
                    length: Math.ceil(Math.min(cards.length, 28) / 4),
                  }).map((_, index) => (
                    <View
                      key={index}
                      style={styles.row}
                    >
                      {cards.slice(index * 4, index * 4 + 4).map((card) => (
                        <TouchableOpacity
                          key={card.id}
                          style={[
                            styles.card,
                            card.isFlipped && styles.cardFlipped,
                          ]}
                          onPress={() => cardClickFunction(card)}
                          disabled={isShowCards}
                        >
                          {isShowCards ? (
                            <Image
                              style={styles.img}
                              source={{ uri: card.imgUrl }}
                            />
                          ) : card.isFlipped ? (
                            <Image
                              style={styles.img}
                              source={{ uri: card.imgUrl }}
                            />
                          ) : null}
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    height: "55%",
                  }}
                >
                  {Array.from({
                    length: Math.ceil(Math.min(cards.length, 16) / 4),
                  }).map((_, index) => (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      {cards.slice(index * 4, index * 4 + 4).map((card) => (
                        <TouchableOpacity
                          key={card.id}
                          style={[
                            {
                              flex: 1,
                              margin: 4,
                              alignItems: "center",
                              backgroundColor: "#D9D9D9",
                              borderRadius: 5,
                            },
                            (card.id === 1 || card.id === 10) &&
                              styles.specialCard,
                          ]}
                        ></TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={{
                    padding: 12,
                    paddingHorizontal: 85,
                    backgroundColor: "#F08887",
                    marginTop: 15,
                    borderRadius: 25,
                  }}
                  onPress={() => {
                    setGameStart(!isGameStart);
                    showCardsForOne();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                    }}
                  >
                    <TableRowsSplit
                      size={16}
                      strokeWidth={1.5}
                      color={"#000"}
                      style={{ paddingHorizontal: 18 }}
                    />
                    Play game
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        {isGameStart && !gameWon && (
          <View
            style={{ paddingHorizontal: 30, marginTop: 5, paddingVertical: 20 }}
          >
            <Text style={{ textAlign: "center", marginTop: 8 }}>
              {timeLeft} seconds remaining
            </Text>
            <ProgressBar
              progress={progress}
              color={"#F6A5A4"}
              style={{
                borderRadius: 50,
                height: 7,
                maxWidth: 300,
                margin: "auto",
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7C7B9B",
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "auto",
    alignItems: "center",
    paddingBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F08887",
    marginLeft: 12,
    fontFamily: "titleFont",
  },
  subtitle: {
    color: "white",
    paddingHorizontal: 15,
    paddingTop: 9,
    paddingBottom: 10,
    marginTop: -10,
    marginBottom: -52,
    zIndex: 999999,
    textAlign: "center",
    backgroundColor: "#F08887",
    borderRadius: 18,
    fontFamily: "subtitleFont",
    flexDirection: "row",
    gap: 5,
  },
  subtitleInactive: {
    fontSize: 16,
    color: "#e6e6e6",
    textAlign: "center",
    borderRadius: 18,
    fontFamily: "subtitleFont",
    paddingHorizontal: 20,
    paddingTop: 9,
    paddingBottom: 10,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "white",
    flex: 1,
  },
  specialCard: { backgroundColor: "#F08887" },
  matchText: {
    fontSize: 18,
    color: "black",
  },
  grid: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
  },
  row: {
    flex: 1,
    marginVertical: 3,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    flex: 1,
    height: "100%",
    margin: 3,
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
  },
  img: { width: "100%", height: "100%", borderRadius: 5 },
  cardFlipped: {
    backgroundColor: "white",
  },
  cardIcon: {
    color: "blue",
  },
  winMessage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  winMessageContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
