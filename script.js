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

// Save/load from localStorage
// async function loadData() {
//     const dataEvents = localStorage.getItem("events");
//     const dataArchive = localStorage.getItem("archive");
//     if (dataEvents) state.events = JSON.parse(dataEvents);
//     if (dataArchive) state.archive = JSON.parse(dataArchive);
//     const res = await fetch(dataurl);
//     const data = await res.json();
//     state.archive = data.archive;
//     state.events = data.events;
// }

// function saveData() {
//     localStorage.setItem("events", JSON.stringify(state.events));
//     localStorage.setItem("archive", JSON.stringify(state.archive));
// }

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
//     // TODO:
//     // Calculate from events array:
//     const totalEvents = events.length;
//     const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
//     const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);

//     // Update DOM:
//     document.getElementById("stat-total-events").textContent = totalEvents;
//     document.getElementById("stat-total-seats").textContent = totalSeats;
//     document.getElementById("stat-total-price").textContent =
//         "$" + totalPrice.toFixed(2);
// }

// ============================================
// ADD EVENT FORM
// ============================================

// function addEvent(newEvent){
//     let events = JSON.parse(localStorage.getItem("events"));
//     events.push(newEvent);
// }

// function handleFormSubmit(e) {
//     e.preventDefault();

//     const eventTitle = document.getElementById("event-title");
//     const eventImage = document.getElementById("event-image");
//     const eventSeats = document.getElementById("event-seats");
//     const eventPrice = document.getElementById("event-price");
//     const formErrors = document.getElementById("form-errors");
//     formErrors.innerHTML = "";

//     let errors = [];

//     if (eventTitle.value.trim() === "") {
//         errors.push("Le titre de l'événement est requis.");
//     }
//     if (eventImage.value.trim() === "") {
//         errors.push("L'image de l'événement est requise.");
//     } else {
//         try {
//             new URL(eventImage.value);
//         } catch (e) {
//             errors.push("L'image doit être une URL valide.");
//         }
//     }
//     if (
//         eventSeats.value.trim() === "" || isNaN(eventSeats.value) || Number(eventSeats.value) <= 0
//     ) {
//         errors.push("Le nombre de places doit être un nombre positif.");
//     }
//     if (
//         eventPrice.value.trim() === "" || isNaN(eventPrice.value) || Number(eventPrice.value) < 0
//     ) {
//         errors.push("Le prix doit être un nombre supérieur ou égal à 0.");
//     }
    
//     if (errors.length > 0) {
//         const ul = document.createElement("ul");
//         errors.forEach((err) => {
//             const li = document.createElement("li");
//             li.innerText = err;
//             ul.appendChild(li);
//         });
//         formErrors.appendChild(ul);
//         formErrors.classList.remove("is-hidden");
        
//         setTimeout(() => {
//             formErrors.classList.add("is-hidden");
//             formErrors.innerHTML = "";
//         }, 5000);
//         return;
//     }
    
//     const newEvent = {
//         title: eventTitle.value.trim(),
//         image: eventImage.value.trim(),
//         seats: Number(eventSeats.value),
//         price: Number(eventPrice.value),
//     };

    
//     addEvent(newEvent);
//     saveData();
//     e.target.reset();
//     formErrors.innerHTML = "Événement ajouté avec succès !";
// }

// document.getElementById('event-form').addEventListener('submit', handleFormSubmit)

function addVariantRow() {
    // TODO:
    // 1. Clone .variant-row template
    // 2. Append to #variants-list
    // 3. Add remove listener to new row's remove button
}

// document.getElementById('btn-add-variant').addEventListener('click', addVariantRow)

function removeVariantRow(button) {
    // TODO:
    // Find closest .variant-row and remove it
}

// ============================================
// EVENTS LIST SCREEN
// ============================================

function renderEventsTable(eventList, page = 1, perPage = 10) {
    // TODO:
    // 1. Paginate eventList by page and perPage
    // 2. Generate table rows for each event
    // 3. Add data-event-id to each row
    // 4. Inject into #events-table tbody
    // 5. Call renderPagination()
}

function renderPagination(totalItems, currentPage, perPage) {
    // TODO:
    // Calculate total pages
    // Generate pagination buttons
    // Add .is-active to current page
    // Add .is-disabled to prev/next if at boundary
    // Inject into #events-pagination
}

function handleTableActionClick(e) {
    // TODO:
    // 1. Check if e.target is [data-action]
    // 2. Get action and eventId from attributes
    // 3. Call appropriate function (showDetails, editEvent, archiveEvent)
    // Use event delegation on #events-table
}

// document.getElementById('events-table').addEventListener('click', handleTableActionClick)

function showEventDetails(eventId) {
    // TODO:
    // 1. Find event by id in events array
    // 2. Populate #modal-body with event details
    // 3. Remove .is-hidden from #event-modal
}

function editEvent(eventId) {
    // TODO:
    // 1. Find event by id
    // 2. Populate form fields with event data
    // 3. Switch to 'add' screen
    // 4. On submit, update existing event instead of creating new
}

function archiveEvent(eventId) {
    // TODO:
    // 1. Find event by id in events
    // 2. Move to archive array
    // 3. Remove from events array
    // 4. Save data
    // 5. Re-render table
}

// ============================================
// ARCHIVE SCREEN
// ============================================

function renderArchiveTable(archivedList) {
    // TODO:
    // Similar to renderEventsTable but read-only
    // Show "Restore" button instead of "Edit"/"Delete"
}

function restoreEvent(eventId) {
    // TODO:
    // 1. Find event by id in archive
    // 2. Move back to events array
    // 3. Remove from archive
    // 4. Save data
    // 5. Re-render both tables
}

// ============================================
// MODAL
// ============================================

function openModal(title, content) {
    // TODO:
    // 1. Set #modal-title
    // 2. Set #modal-body content
    // 3. Remove .is-hidden from #event-modal
}

function closeModal() {
    // TODO:
    // Add .is-hidden to #event-modal
}

// Listen to close button and overlay click
// document.getElementById('event-modal').addEventListener('click', (e) => {
//     if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
//         closeModal()
//     }
// })

// ============================================
// SEARCH & SORT
// ============================================

function searchEvents(query) {
    // TODO:
    // Filter events by title (case-insensitive)
    // Return filtered array
}

function sortEvents(eventList, sortType) {
    // TODO:
    // Sort by: title-asc, title-desc, price-asc, price-desc, seats-asc
    // Return sorted array
}

// Listen to search and sort changes
// document.getElementById('search-events').addEventListener('input', (e) => {
//     const filtered = searchEvents(e.target.value)
//     renderEventsTable(filtered)
// })

// document.getElementById('sort-events').addEventListener('change', (e) => {
//     const sorted = sortEvents(events, e.target.value)
//     renderEventsTable(sorted)
// })

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

// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("event-form");
//     form.addEventListener("submit", handleFormSubmit);
// });
