export const randomNameGenerator = async () => {
  try {
    const response = await fetch("https://random-word-api.herokuapp.com/word");
    if (!response.ok) {
      throw new Error(
        `HTTP error creating random name! status: ${response.status}`,
      );
    }
    const data = await response.json();
    const randomNum = Math.floor(1000 + Math.random() * 9999);
    return data[0] + randomNum;
  } catch (error) {
    console.error("Error generating random name: ", error);
  }
};
