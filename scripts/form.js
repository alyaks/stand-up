import { Notification } from "./Notification.js";
import Inputmask from "inputmask";
import JustValidate from "just-validate";

export const initForm = (
  bookingForm,
  bookingFullName,
  bookingInputPnone,
  bookingInputTicketNumber,
) => {
  const notification = Notification.getInstance();
  const validate = new JustValidate(bookingForm, {
    errorFieldCssClass: "booking__input_invalid",
    successFieldCssClass: "booking__input_valid",
  });

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

        const elem = fields[key];
        if (!elem.isValid) {
          errorMessage += `${elem.errorMessage}, `;
        }
      }
      notification.show(errorMessage.slice(0, -2), false);
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
