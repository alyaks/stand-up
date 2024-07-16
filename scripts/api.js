import { Notification } from "./Notification.js";

export const getComedians = async () => {
  const notification = Notification.getInstance();

  try {
    const response = await fetch("http://localhost:8080/comedians");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.log(`Trouble with fetch: ${error.message}`);
    notification.show("Возникла ошибка сервера, попробуйте позже");
  }
};
