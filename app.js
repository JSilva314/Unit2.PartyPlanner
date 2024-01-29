const COHORT = "2311-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");
const addPartiesForm = document.querySelector("#addParties");

// Sync state with the API and rerender

async function render() {
  await getParties();
  renderParties();
}
render();

//Update state with parties from API

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

// Render Parties from State

function renderParties() {
  if (state.parties.length < 1) {
    partiesList.innerHTML = "<div>No Parties.</div>";
    return;
  }
  partiesList.innerHTML = "";
  state.parties.map((party) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${party.name}</h3>
      <p>${party.date}</p>
      <p>${party.location}</p>
      <p>${party.description}</p>
      <button class="delete-button" data-party-id="${party.id}">Delete</button>`;

    partiesList.appendChild(div);

    const deleteButton = div.querySelector(".delete-button");
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      deleteParty(party.id);
    });
  });
}

async function pushToApi(party) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(party),
    });
  } catch (error) {
    console.error(error);
  }
}

async function addParties() {
  const party = {
    name: addPartiesForm.name.value,
    date: new Date(addPartiesForm.datetime.value).toISOString(),
    location: addPartiesForm.location.value,
    description: addPartiesForm.description.value,
  };

  await pushToApi(party);
  render();
}
async function deleteParty(partyId) {
  try {
    const response = await fetch(`${API_URL}/${partyId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // If the deletion is successful, update the state and re-render
      await getParties();
      renderParties();
    } else {
      console.error("Failed to delete party");
    }
  } catch (error) {
    console.error(error);
  }
}

addPartiesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addParties();
});
