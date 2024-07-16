import { Notification } from "./Notification.js";

export const getComedians = async () => {
  try {
    const response = await fetch("http://localhost:8080/comedians");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.log(`Trouble with fetch: ${error.message}`);
    Notification.getInstance().show(
      "Возникла ошибка сервера, попробуйте позже",
    );
  }
};

export const sendData = async (method, data, id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/clients${id ? `/${id}` : ""}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.log(`Trouble with fetch: ${error.message}`);
    Notification.getInstance().show(
      "Возникла ошибка сервера, попробуйте позже",
    );
    return false;
  }
};
