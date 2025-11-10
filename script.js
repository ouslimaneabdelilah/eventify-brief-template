const screens = document.querySelectorAll(".screen");
const sidebar_btns = document.querySelectorAll(".sidebar__btn");
const dataurl = "db.json";
const title_header = document.getElementById("page-title");
const subtitle_header = document.getElementById("page-subtitle");
let state = {
  events: [],
  archive: [],
};

// ============================================

async function loadData() {
  const dataEvents = localStorage.getItem("events");
  const dataArchive = localStorage.getItem("archive");
  if (dataEvents) state.events = JSON.parse(dataEvents);
  if (dataArchive) state.archive = JSON.parse(dataArchive);
  try {
    const res = await fetch(dataurl);
    const data = await res.json();
    if (!dataArchive) state.archive = data.archive || [];
    if (!dataEvents) state.events = data.events || [];
  } catch (err) {
    console.log("error f data");
  }
}

function saveData() {
  localStorage.setItem("events", JSON.stringify(state.events));
  localStorage.setItem("archive", JSON.stringify(state.archive));
}

// ============================================
// SCREEN SWITCHING
// ============================================

function switchScreen(e) {
  screens.forEach((scr) => {
    scr.classList.remove("is-visible");
  });
  sidebar_btns.forEach((scr) => {
    scr.classList.remove("is-active");
  });
  e.classList.add("is-active");
  Array.from(screens).map((b) =>
    b.dataset.screen === e.dataset.screen ? b.classList.add("is-visible") : ""
  );
  fetch(dataurl)
    .then((res) => res.json())
    .then((data) => {
      if (!data) return;
      data.contentHeader.forEach((data) => {
        if (data.action === e.dataset.screen) {
          title_header.innerText = data.title;
          subtitle_header.innerText = data.subtitle;
        }
      });
    });
}

// Listen to sidebar button clicks
// document.querySelectorAll('.sidebar__btn').forEach(btn => {
//     btn.addEventListener('click', () => switchScreen(btn.dataset.screen))
// })

// ============================================
// STATISTICS SCREEN
// ============================================

// function renderStats() {
//   // TODO:
//   // Calculate from events array:
//   const totalEvents = state.events.length;

//   const totalSeats = state.events.reduce((sum, e) => sum + e.seats, 0);
//   const totalPrice = state.events.reduce(
//     (sum, e) => sum + e.price * e.seats,
//     0
//   );

//   // Update DOM:
//   document.getElementById("stat-total-events").textContent = totalEvents;
//   document.getElementById("stat-total-seats").textContent = totalSeats;
//   document.getElementById("stat-total-price").textContent =
//     "$" + totalPrice.toFixed(2);
// }

// ============================================
// ADD EVENT FORM
// ============================================

function addEvent(newEvent) {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.push(newEvent);
  localStorage.setItem("events", JSON.stringify(events));
  state.events = events;
}

function handleFormSubmit(e) {
  e.preventDefault();
  const eventTitle = document.getElementById("event-title");
  const eventImage = document.getElementById("event-image");
  const eventSeats = document.getElementById("event-seats");
  const eventPrice = document.getElementById("event-price");
  const formErrors = document.getElementById("form-errors");
  formErrors.innerHTML = "";
  formErrors.classList.add("is-hidden");

  let errors = [];

  // Validation de base event
  if (eventTitle.value.trim() === "")
    errors.push("Le titre de l'événement est requis.");

  if (eventImage.value.trim() === "") {
    errors.push("L'image de l'événement est requise.");
  } else {
    try {
      new URL(eventImage.value);
    } catch {
      errors.push("L'image doit être une URL valide.");
    }
  }

  if (
    eventSeats.value.trim() === "" ||
    isNaN(eventSeats.value) ||
    Number(eventSeats.value) <= 0
  ) {
    errors.push("Le nombre de places doit être un nombre positif.");
  }

  if (
    eventPrice.value.trim() === "" ||
    isNaN(eventPrice.value) ||
    Number(eventPrice.value) < 0
  ) {
    errors.push("Le prix doit être un nombre supérieur ou égal à 0.");
  }

  // Si erreurs de base
  if (errors.length > 0) {
    showErrors(formErrors, errors);
    return;
  }

  // Création de l'objet Event
  const newEvent = {
    id: state.events.length + 1,
    title: eventTitle.value.trim(),
    image: eventImage.value.trim(),
    seats: Number(eventSeats.value),
    price: Number(eventPrice.value),
    variants: [],
  };

  // Validation des Variants
  const variantRows = document.querySelectorAll(".variant-row");
  variantRows.forEach((row) => {
    const nameVariant = row.querySelector(".variant-row__name");
    const qtyVariant = row.querySelector(".variant-row__qty");
    const valueVariant = row.querySelector(".variant-row__value");
    const typeVariant = row.querySelector(".variant-row__type");

    if (nameVariant.value.trim() === "") {
      errors.push("Le titre de variante est requis.");
    }

    if (
      qtyVariant.value.trim() === "" ||
      isNaN(qtyVariant.value) ||
      Number(qtyVariant.value) <= 0
    ) {
      errors.push("La quantité doit être un nombre positif.");
    }

    if (Number(qtyVariant.value) > Number(eventSeats.value)) {
      errors.push(
        "La quantité doit être inférieure ou égale au nombre de places."
      );
    }

    if (typeVariant.value === "percentage") {
      if (
        valueVariant.value.trim() === "" ||
        isNaN(valueVariant.value) ||
        Number(valueVariant.value) <= 0 ||
        Number(valueVariant.value) > 100
      ) {
        errors.push("Le pourcentage doit être entre 0 et 100%.");
      }
    }

    if (typeVariant.value === "fixed") {
      if (
        valueVariant.value.trim() === "" ||
        isNaN(valueVariant.value) ||
        Number(valueVariant.value) <= 0
      ) {
        errors.push("La valeur fixe doit être un nombre positif.");
      }

      if (Number(valueVariant.value) >= Number(eventPrice.value)) {
        errors.push("La valeur fixe doit être inférieure au prix de base.");
      }
    }

    // Ajouter le variant
    newEvent.variants.push({
      name: nameVariant.value.trim(),
      qty: Number(qtyVariant.value),
      type: typeVariant.value,
      value: Number(valueVariant.value),
    });
  });

  // Si erreurs variants
  if (errors.length > 0) {
    showErrors(formErrors, errors);
    return;
  }

  // Sauvegarde
  addEvent(newEvent);
  saveData();

  formErrors.innerHTML = "Événement ajouté avec succès !";
  formErrors.classList.remove("is-hidden");

  e.target.reset();
}

// Fonction pour afficher les erreurs
function showErrors(container, errors) {
  container.innerHTML = "";
  const ul = document.createElement("ul");
  errors.forEach((err) => {
    const li = document.createElement("li");
    li.innerText = err;
    ul.appendChild(li);
  });
  container.appendChild(ul);
  container.classList.remove("is-hidden");

  setTimeout(() => {
    container.classList.add("is-hidden");
    container.innerHTML = "";
  }, 5000);
}

// document.getElementById('event-form').addEventListener('submit', handleFormSubmit)

function addVariantRow() {
  const variants = document.getElementById("variants-list");
  variants.innerHTML += ` <div class="variant-row">
                            <input type="text" class="input variant-row__name" placeholder="Variant name (e.g., 'Early Bird')" />
                            <input type="number" class="input variant-row__qty" placeholder="Qty" min="1" />
                            <input type="number" class="input variant-row__value" placeholder="Value" step="0.01" />
                            <select class="select variant-row__type">
                                <option value="fixed">Fixed Price</option>
                                <option value="percentage">Percentage Off</option>
                            </select>
                        <button type="button" class="btn btn--danger btn--small variant-row__remove" onclick="removeVariantRow(this)">Remove</button>
                        </div>`;

  // 2. Append to #variants-list
  // 3. Add remove listener to new row's remove button
}

// document.getElementById('btn-add-variant').addEventListener('click', addVariantRow)

function removeVariantRow(button) {
  button.closest(".variant-row").remove();
}

// ============================================
// EVENTS LIST SCREEN
// ============================================

function renderEventsTable(eventList, page = 1, perPage = 10) {
  // TODO:
  const tbodyTable = document.querySelector(".table__body");
  let html = "";
  eventList.forEach((event, i) => {
    html += `
    <tr class="table__row" data-event-id="1">

      <td>${i + 1}</td>
      <td>${event.title}</td>
      <td>${event.seats}</td>
      <td>$${event.price}</td>
      <td><span class="badge">${event.variants
        .map(
          (variant) =>
            `  <ul>
            <li>Name : ${variant.name} hhh</li>
            <li>QTY : ${variant.qty}</li>
            <li>Value : ${variant.value} ${
              variant.type === "percentage" ? "%" : "$"
            }</li>
        </ul>`
        )
        .join("")}</span></td>
      <td>
        <button class="btn btn--small" data-action="details" data-event-id="${
          event.id
        }" onclick="showEventDetails(${event.id})">Details</button>
        <button class="btn btn--small" data-action="edit" data-event-id="${
          event.id
        }" onclick="editEvent(${event.id})">Edit</button>
        <button class="btn btn--danger btn--small" data-action="archive" data-event-id="${
          event.id
        }" onclick="archiveEvent(${event.id})">Delete</button>
      </td>
    </tr>`;
  });
  tbodyTable.innerHTML = html;
  1; // 1. Paginate eventList by page and perPage
  // 2. Generate table rows for each event
  // 3. Add data-event-id to each row
  // 4. Inject into #events-table tbody
  // 5. Call renderPagination()
}

// function renderPagination(totalItems, currentPage, perPage) {
//   // TODO:
//   // Calculate total pages
//   const totalPages = Math.ceil(totalItems / perPage);
//   const pagination = document.getElementById("events-pagination");

//   // Generate pagination buttons
//   // Prev button
//   const prevBtn = document.createElement("button");
//   prevBtn.textContent = "Prev";
//   prevBtn.disabled = currentPage === 1;
//   prevBtn.className = currentPage === 1 ? "is-disabled" : "";
//   prevBtn.addEventListener("click", () =>
//     renderPagination(totalItems, currentPage - 1, perPage)
//   );
//   pagination.appendChild(prevBtn);

//   // Page buttons
//   for (let i = 1; i <= totalPages; i++) {
//     const btn = document.createElement("button");
//     btn.textContent = i;
//     btn.className = i === currentPage ? "is-active" : "";
//     btn.addEventListener("click", () =>
//       renderPagination(totalItems, i, perPage)
//     );
//     pagination.appendChild(btn);
//   }
//   // Next button
//   const nextBtn = document.createElement("button");
//   nextBtn.textContent = "Next";
//   nextBtn.disabled = currentPage === totalPages;
//   nextBtn.className = currentPage === totalPages ? "is-disabled" : "";
//   nextBtn.addEventListener("click", () =>
//     renderPagination(totalItems, currentPage + 1, perPage)
//   );
//   pagination.appendChild(nextBtn);
// }

// function handleTableActionClick(e) {
//   const target = e.target;

//   // 1. Check if target has data-action attribute
//   const action = target.getAttribute("data-action");
//   if (!action) return;

//   // 2. Get event ID
//   const eventId = target.getAttribute("data-event-id");
//   if (!eventId) return;

//   // 3. Call appropriate function
//   if (action === "details") {
//     showEventDetails(eventId);
//   } else if (action === "edit") {
//     editEvent(eventId);
//   } else if (action === "archive") {
//     archiveEvent(eventId);
//   }
// }
// document.getElementById('events-table').addEventListener('click', handleTableActionClick)
// function Find(list, id) {
//   let resulta = null;
//   for (let i = 0; i < list.length; i++) {
//     if (list[i].id === Number(id)) {
//       resulta = list[i];
//       break;
//     }
//   }
//   return resulta;
// }
// function Filter(list, id) {
//   let newArray = [];
//   for (let index = 0; index < list.length; index++) {
//     if (Number(list[index].id) !== Number(id)) {
//       newArray.push(list[index]);
//     }
//   }
//   return newArray;
// }
// function showEventDetails(eventId) {
//   // TODO:
//   // 1. Find event by id in events array
//   let event = Find(state.events, eventId);
//   if (!event) return;
//   // 2. Populate #modal-body with event details
  
//   const content = `
//     <p><strong>Seats:</strong> ${event.seats}</p>
//     <p><strong>Price:</strong>${event.price}</p>
//     <p><strong>Variants:</strong></p>
//     <ul>${event.variants.map(v => `
//         <li>
//           Name: ${v.name} | QTY:${v.qty} | Value: ${v.value} ${v.type === "percentage" ? "%" : "$"}
//         </li>
//       `).join("")}
//     </ul>
//   `;

//   openModal(event.title, content);
//   // 3. Remove .is-hidden from #event-modal
// //   const modal = document.getElementById("event-modal");
// //   modal.classList.remove("is-hidden");
// }

// function editEvent(eventId) {
//   // TODO:
//   // 1. Find event by id
//   let event = Find(state.events, eventId);
//   if (!event) return;
//   // 2. Populate form fields with event data
//   document.getElementById("event-title").value = event.title;
//   document.getElementById("event-seats").value = event.seats;
//   document.getElementById("event-price").value = event.price;

//   // 3. Switch to 'add' screen
//   document.getElementById("form-screen").classList.remove("is-hidden");
//   // Store editing ID in a global state if needed
//   state.editingEventId = event.id;
//   // 4. On submit, update existing event instead of creating new
// }

// function archiveEvent(eventId) {
//   // TODO:
//   // 1. Find event by id in events
//   let event = Find(state.events, eventId);
//   if (!event) return;
//   // 2. Move to archive array
//   state.archive.push(event);
//   // 3. Remove from events array
//   let newStateEvents = Filter(state.events, eventId);
//   state.events = newStateEvents;
//   // 4. Save data
//   saveData();
//   // 5. Re-render table
//   renderEventsTable(state.events);
// }

// ============================================
// ARCHIVE SCREEN
// ============================================

// function renderArchiveTable(archivedList) {
//   // TODO:
//   // Similar to renderEventsTable but read-only
//   // Show "Restore" button instead of "Edit"/"Delete"
//   const tbodyTable = document.querySelector(".table__body2");
//   let html = "";

//   archivedList.forEach((event, i) => {
//     html += `
//       <tr class="table__row" data-event-id="event.id">
//         <td>${i + 1}</td>
//         <td>${event.title}</td>
//         <td>${event.seats}</td>
//         <td>${event.price}</td>
//         <td>
//           <button class="btn btn-success btn-small" onclick="restoreEvent(${
//             event.id
//           })" data-action="restore" data-event-id="${event.id}">
//             Restore
//           </button>
//         </td>
//       </tr>
//     `;
//   });
//   tbodyTable.innerHTML = html;
// }

// function restoreEvent(eventId) {
//   // TODO:
//   // 1. Find event by id in archive
//   let archive = Find(state.archive, eventId); // 2. Move back to events array
//   state.events.push(archive);
//   console.log(state.events);
//   // 3. Remove from archive
//   let newStateArchive = Filter(state.archive, eventId);
//   state.archive = newStateArchive;
//   console.log(state.archive);
//   saveData();
//   renderArchiveTable(state.archive);
//   // 4. Save data
//   // 5. Re-render both tables
// }

// ============================================
// MODAL
// ============================================

// function openModal(title, content) {
//   // TODO:

//   // 1. Set #modal-title

//   const modalTitle = document.getElementById("modal-title");
//   // 2. Set #modal-body content

//   const modalBody = document.getElementById("modal-body");

//   const modal = document.getElementById("event-modal");

//   modalTitle.textContent = title;
//   modalBody.innerHTML = content;
//   // 3. Remove .is-hidden from #event-modal

//   modal.classList.remove("is-hidden");
// }


// function closeModal() {
//   // TODO:
//   // Add .is-hidden to #event-modal
//   document.getElementById("event-modal").classList.add("is-hidden");
   
// }

// Listen to close button and overlay click
document.getElementById('event-modal').addEventListener('click', (e) => {
    if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
        closeModal()
    }
})

// ============================================
// SEARCH & SORT
// ============================================

function searchEvents(query) {
  // TODO:
  // Filter events by title (case-insensitive)
  const eventQuery = state.events.filter(event => event.title.toLowerCase().includes(query.toLowerCase()));
  // Return filtered array
  return eventQuery;
}

function Sort(list,selectby,type){
     for (let index = 0; index < list.length; index++) {
            for (let j = index+1; j < list.length; j++) {
                let a = (selectby === "title" ? list[index].title.toLowerCase():
                    selectby === "price" ? Number(list[index].price) :
                    selectby === "seats" ? Number(list[index].seats) : "")
                let b = (selectby === "title" ? list[j].title.toLowerCase():
                    selectby === "price" ? Number(list[j].price) :
                    selectby === "seats" ? Number(list[j].seats) : ""
            )
                if((type === "asc" && a>b) || (type === "desc" && a<b)){
                    let temp = list[index]
                    list[index] = list[j]
                    list[j] = temp
                }
                
            }
            
        }
        return list;
}
function sortEvents(eventList, sortType) {
  // TODO:
  // Sort by: title-asc, title-desc, price-asc, price-desc, seats-asc
    if(sortType === "title-asc"){
       eventList = Sort(eventList,"title","asc")
    }
    if(sortType === "title-desc"){
       eventList =Sort(eventList,"title","desc")
    }
    if(sortType === "price-asc"){
       eventList =Sort(eventList,"price","asc")
    }
    if(sortType === "price-desc"){
       eventList =Sort(eventList,"price","desc")
    }
    if(sortType === "seats-asc"){
       eventList=Sort(eventList,"seats","asc")
    }
  return eventList;
}

// Listen to search and sort changes
document.getElementById('search-events').addEventListener('input', (e) => {
    const filtered = searchEvents(e.target.value)
    renderEventsTable(filtered)
})

document.getElementById('sort-events').addEventListener('change', (e) => {
    const sorted = sortEvents(state.events, e.target.value)
    console.log(sorted)
    renderEventsTable(sorted)
})

// ============================================
// INITIALIZATION
// ============================================

function init() {
  // TODO:
  // 1. Load data from localStorage
  // 2. Render initial screen (statistics)
  // 3. Set up all event listeners
  // 4. Call renderStats(), renderEventsTable(), renderArchiveTable()
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  saveData();
//   renderStats();
  const form = document.getElementById("event-form");
  form.addEventListener("submit", handleFormSubmit);
  renderEventsTable(state.events, 1, 10);
//   renderArchiveTable(state.archive);
});
