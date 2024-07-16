import "./style.css";
import { initForm } from "./scripts/form.js";
import { getComedians } from "./scripts/api.js";
import { createComedianBlock } from "./scripts/comedians.js";

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

  initForm(bookingForm, bookingFullName, bookingInputPnone, bookingInputTicketNumber);

  if (comedians) {
    amountComedians.textContent = comedians.length;
    const comedianBlock = createComedianBlock(comedians, bookingComediandsList);
    bookingComediandsList.append(comedianBlock);
  }
};

init();
