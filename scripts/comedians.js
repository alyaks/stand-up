import TomSelect from "tom-select";

const MAX_Comedians = 6;

export const createComedianBlock = (comedians, bookingComediandsList) => {
  const bookingComedian = document.createElement("li");
  bookingComedian.classList.add("booking__comedian");

  const bookingSelectComedian = document.createElement("select");
  bookingSelectComedian.classList.add(
    "booking__select",
    "booking__select_comedian",
  );

  const bookingSelectTime = document.createElement("select");
  bookingSelectTime.classList.add("booking__select", "booking__select_time");

  const inputHidden = document.createElement("input");
  inputHidden.type = "hidden";
  inputHidden.name = "booking";

  const bookingHall = document.createElement("button");
  bookingHall.classList.add("booking__hall");
  bookingHall.type = "button";

  bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);

  const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
    hideSelected: true,
    placeholder: "Выбрать комика",
    options: comedians.map((item) => ({
      value: item.id,
      text: item.comedian,
    })),
  });

  const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
    hideSelected: true,
    placeholder: "Выбрать время",
  });
  bookingTomSelectTime.disable();

  bookingTomSelectComedian.on("change", (id) => {
    bookingTomSelectTime.enable();
    bookingTomSelectComedian.blur();

    const { performances } = comedians.find((item) => item.id === id);

    bookingTomSelectTime.clear();
    bookingTomSelectTime.clearOptions();

    bookingTomSelectTime.addOptions(
      performances.map((item) => ({
        value: item.time,
        text: item.time,
      })),
    );

    bookingHall.remove();
  });

  bookingTomSelectTime.on("change", (time) => {
    if (!time) {
      return;
    }

    const idComedian = bookingTomSelectComedian.getValue();
    const { performances } = comedians.find((item) => item.id === idComedian);
    const { hall } = performances.find((item) => item.time === time);

    inputHidden.value = `${idComedian}, ${time}`;

    bookingTomSelectTime.blur();
    bookingHall.textContent = hall;
    bookingComedian.append(bookingHall);
  });

  const createNextBookingComedian = () => {
    if (bookingComediandsList.children.length < MAX_Comedians) {
      const nextComedianBlock = createComedianBlock(
        comedians,
        bookingComediandsList,
      );
      bookingComediandsList.append(nextComedianBlock);
    }

    bookingTomSelectTime.off("change", createNextBookingComedian);
  };

  bookingTomSelectTime.on("change", createNextBookingComedian);
  return bookingComedian;
};
