// ===== Select DOM elements for search input, buttons, and content containers =====

const search = document.getElementById("search");

const submit = document.getElementById("submit");

const random = document.getElementById("random");

const resultHeading = document.getElementById("meal-result-heading");

const mealsElement = document.getElementById("meals");

const singleMealElement = document.getElementById("single-meal-container");

// Function to truncate text
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

// ============= function to fetch the API data===============
function findMeal(e) {
  e.preventDefault();
  const item = search.value;
  //   console.log(item);
  if (item.trim()) {
    // fetch the API data & display in Browser
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        resultHeading.innerHTML = `Search result for ${item}`;

        //Condition for non-existent products
        if (data.meals === null) {
          resultHeading.innerHTML = `🙁 Oops, no result for meal: ${item}`;
        } else {
          //   alert("There is meal name");
          mealsElement.innerHTML = data.meals
            .map(
              (meal) => `<div class="meal">
         <img src="${meal.strMealThumb}" alt="${meal.strMeal} "/>
         <div class="meal-info" data-mealId="${meal.idMeal}">
       <h3>${truncateText(meal.strMeal, 20)}</h3>
          </div>
          </div>`
            )
            .join("");
        }
      });

    //clear input field
    search.value = "";
  } else {
    alert("🔎 Input required: enter a meal name!");
  }
}
//function to get de meal ID
function getSingleItemId(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const meal = data.meals[0];
      console.log(meal);
      addMealToDOM(meal);
    });
}
//function to get  random meals
function getRandomMeal() {
  //clear result data and heading
  mealsElement.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const meal = data.meals[0];
      // console.log(meal);
      addMealToDOM(meal);
    });
}

//function to add meals to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `
      );
    } else {
      break;
    }
  }
  // console.log(ingredients);
  singleMealElement.innerHTML = `<div class="single-meal">
  <h1>${meal.strMeal}</h1>
    <div class="single-meal-info">
    ${
      meal.strCategory
        ? `
    <p>${meal.strCategory}</p>
    `
        : ""
    } ${
    meal.strArea
      ? `
    <p>${meal.strArea}</p>
    `
      : ""
  }
  </div>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
  <div class="main">
  <h2>🥄Ingredients</h2>
  <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
  </ul>
  <h2>📝Instructions</h2>
  <p>${meal.strInstructions}</p>
</div>
</div>
`;
}
submit.addEventListener("submit", findMeal);
//random meals on click
random.addEventListener("click", getRandomMeal);

// Show single meal details on click

mealsElement.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((single_item) => {
    // console.log(single_item);
    if (single_item.classList) {
      return single_item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  // console.log(mealInfo);
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealId");
    // console.log(mealID);
    getSingleItemId(mealID);
  }
});
