import "./style.css";
import { initForm } from "./scripts/form.js";
import { getComedians } from "./scripts/api.js";
import { initChangeSection } from "./scripts/changeSection.js";

const init = async () => {
  const bookingComediandsList = document.querySelector(
    ".booking__comediands-list",
  );
  const bookingForm = document.querySelector(".booking__form");
  const amountComedians = document.querySelector(
    ".event__info-item_comedians .event__info-number",
  );
  const bookingFullName = document.querySelector("#fullName");
  const bookingInputPnone = document.querySelector("#phone");
  const bookingInputTicketNumber = document.querySelector("#ticketNumber");

  const comedians = await getComedians();

  const event = document.querySelector(".event");
  const booking = document.querySelector(".booking");
  const eventButtonReserve = document.querySelector(".event__button-reserve");
  const eventButtonEdit = document.querySelector(".event__button-edit");
  const bookingTitle = document.querySelector(".booking__title");

  if (comedians) {
    amountComedians.textContent = comedians.length;

    const changeSection = initChangeSection(
      bookingForm,
      event,
      booking,
      eventButtonReserve,
      eventButtonEdit,
      bookingTitle,
      comedians,
      bookingComediandsList,
    );

    initForm(
      bookingForm,
      bookingFullName,
      bookingInputPnone,
      bookingInputTicketNumber,
      changeSection,
      bookingComediandsList,
    );
  }
};

init();
