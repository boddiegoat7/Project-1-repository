// getting dom elements
let zipForm = document.getElementById("zip-code-search");
let searchInput = document.querySelector(".input-group-field");
let gridWrapper = document.querySelector(".grid-x");
let searchInputValue;

getCityByZip = (zipPlaceholder) => {
  const zipOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "8db9a1f828msh32c0111be4e212ep12cef0jsnf8377a6539d3",
      "X-RapidAPI-Host": "us-zip-code-lookup.p.rapidapi.com",
    },
  };

  return fetch(
    `https://us-zip-code-lookup.p.rapidapi.com/getZip?zip=${zipPlaceholder}`,
    zipOptions
  )
    .then((response) => response.json())
    .then((response) => response.Data["0"].City)
    .catch((err) => console.error(err));
};

getBusinessByLocation = (location) => {
  let newLocation = location.split(" ").join("%20");
  console.log(newLocation);

  // get business by locations
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "8db9a1f828msh32c0111be4e212ep12cef0jsnf8377a6539d3",
      "X-RapidAPI-Host": "yelp20.p.rapidapi.com",
    },
  };

  return fetch(
    `https://yelp20.p.rapidapi.com/list?location=${newLocation}&query=dentist&start=0&end=10`,
    options
  )
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
};

zipForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  searchInputValue = parseInt(searchInput.value);

  // fetch city by Zip Code API
  let data = await getCityByZip(searchInputValue);
  console.log(data);
  let businesses;
  if (data) {
    businesses = await getBusinessByLocation(data);
    console.log(Array.isArray(businesses));
    if (Array.isArray(businesses) === true) {
      gridWrapper.innerHTML = "";
      businesses.forEach((business) => {
        let businessCard = ` <div class="cell">
                <div class="card">
                  <img src=${business.image} >
                  <div class="card-section">
                  <h4>${business.name}</h4>
                    <p>Rating: ${business.rating}</p>
                    <p>Phone Number: ${business.phone}</p>
                    <p>Business Review Count: ${business.reviewCount}</p>
                  </div>
                </div>
              </div>`;
        gridWrapper.innerHTML += businessCard;
      });
    } else {
      console.log("no data for this city");
      let modal = ` <div class="cell">
                <div class="card">
            
                  <div class="card-section">
                  <h4> No Data For The City Found, Please Try Again</h4>
                    <img src="./assets/pics/noresults.png" alt="no results">
                  </div>
                </div>
              </div>`;
      gridWrapper.innerHTML += modal;
    }
  }
});
