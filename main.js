import { Notification } from "./scripts/Notification.js";
import "./style.css";
import TomSelect from "tom-select";
import Inputmask from "inputmask";
import JustValidate from "just-validate";

const MAX_Comedians = 6;

const notification = Notification.getInstance();

const bookingComediandsList = document.querySelector(
  ".booking__comediands-list",
);

const bookingForm = document.querySelector(".booking__form");

const createComedianBlock = (comedians) => {
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
      const nextComedianBlock = createComedianBlock(comedians);
      bookingComediandsList.append(nextComedianBlock);
    }

    bookingTomSelectTime.off("change", createNextBookingComedian);
  };

  bookingTomSelectTime.on("change", createNextBookingComedian);
  return bookingComedian;
};

const getComedians = async () => {
  const response = await fetch("http://localhost:8080/comedians");
  return response.json();
};

const init = async () => {
  const amountComedians = document.querySelector(
    ".event__info-item_comedians .event__info-number",
  );

  const comedians = await getComedians();

  amountComedians.textContent = comedians.length;

  const comedianBlock = createComedianBlock(comedians);
  bookingComediandsList.append(comedianBlock);

  const validate = new JustValidate(bookingForm, {
    errorFieldCssClass: "booking__input_invalid",
    successFieldCssClass: "booking__input_valid",
  });

  const bookingFullName = document.querySelector("#fullName");
  const bookingInputPnone = document.querySelector("#phone");
  const bookingInputTicketNumber = document.querySelector("#ticketNumber");

  new Inputmask("+375(99)-999-9999").mask(bookingInputPnone);
  new Inputmask("99999999").mask(bookingInputTicketNumber);

  validate
    .addField(bookingFullName, [
      { rule: "required", errorMessage: "Введите имя" },
    ])
    .addField(bookingInputPnone, [
      { rule: "required", errorMessage: "Введите номер телефона" },
      {
        validator() {
          const phone = bookingInputPnone.inputmask.unmaskedvalue();
          return phone.length === 9 && !!Number(phone);
        },
        errorMessage: "Некорректный телефон!",
      },
    ])
    .addField(bookingInputTicketNumber, [
      { rule: "required", errorMessage: "Введите номер билета" },
      {
        validator() {
          const ticket = bookingInputTicketNumber.inputmask.unmaskedvalue();
          return ticket.length === 8 && !!Number(ticket);
        },
        errorMessage: "Неверный номер билета!",
      },
    ])
    .onFail((fields) => {
      let errorMessage = "";
      for (const key in fields) {
        if (!Object.hasOwnProperty.call(fields, key)) {
          continue;
        }

        const elem = fields[key]
        if(!elem.isValid) {
          errorMessage += `${elem.errorMessage}, `
        }
      }
      notification.show(errorMessage.slice(0, -2), false)
    });

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = { booking: [] };

    const times = new Set();

    new FormData(bookingForm).forEach((value, field) => {
      if (field === "booking") {
        const [comedian, time] = value.split(",");

        if (comedian && time) {
          data.booking.push({ comedian, time });
          times.add(time);
        }
      } else {
        data[field] = value;
      }

      if (times.size !== data.booking.length) {
        notification.show("Время должно быть разным!", false);
      }
    });
  });
};

init();
