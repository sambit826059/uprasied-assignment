export const randomNameGenerator = (): string => {
  const adjectives: string[] = [
    "swift",
    "silent",
    "brave",
    "mystic",
    "lucky",
    "fierce",
    "bold",
    "rapid",
    "graceful",
    "nimble",
    "elegant",
    "daring",
    "vibrant",
    "resolute",
    "majestic",
    "sly",
    "proud",
    "radiant",
    "vigilant",
    "audacious",
  ];

  const nouns: string[] = [
    "panther",
    "tiger",
    "falcon",
    "dragon",
    "whale",
    "phoenix",
    "lion",
    "eagle",
    "shark",
    "wolf",
    "bear",
    "cobra",
    "leopard",
    "griffin",
    "hyena",
    "viper",
    "ox",
    "cheetah",
    "stallion",
    "ram",
  ];

  // Genetating a new name from above arrays
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  // Random number generation
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return `${randomAdjective}-${randomNoun}-${randomNum}`;
};
