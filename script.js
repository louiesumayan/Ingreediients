const searchInput = document.getElementById('search');
const buttonEl = document.getElementById('buttonEl');
const result_container = document.getElementById('res-data');
const mealDetails = document.getElementById('meal-details');

function errorData() {
  resultHTML = `
  <div class="item-results error">
         NO RESULT SORRY.
        </div>
 `;
  result_container.innerHTML = resultHTML;
}

async function getMeal() {
  const API_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
  let searcValue = searchInput.value.trim();

  try {
    const res = await axios(API_URL + searcValue);
    const data = await res.data.meals;
    let resultHTML = '';

    function getMealData(meal) {
      resultHTML += `
  <div class="item-results" data-id=${meal.idMeal}>
          <img src="${meal.strMealThumb}" alt="" />
          <div class="title">
            <p class='meal-name'>${meal.strMeal}</p>
            <button class='get-recipe' id="get-recipe">Get Recipe</button>
          </div>
        </div>
 
 `;
      result_container.innerHTML = resultHTML;
    }
    data.forEach((meal) => {
      getMealData(meal);
    });
    searchInput.value = '';
  } catch (error) {
    if (error) {
      errorData();
      searchInput.value = '';
    }
  }
}

buttonEl.addEventListener('click', getMeal);

function showRecipe(meal) {
  console.log(meal);
  meal = meal[0];
  let mealRecipeHTML = `
  <button id="close">x</button>
      <h2 class="recipe-title">${meal.strMeal}</h2>
      <p class="category-title">${meal.strCategory}</p>
      <div class="recipe-instruction">
        <h3>Instructions:</h3>
        <p>
        ${meal.strInstructions}
        </p>
      </div>
      <div class="recipe-img">
        <img src="${meal.strMealThumb}" alt="" />
      </div>
      <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
      </div>
  `;
  mealDetails.innerHTML = mealRecipeHTML;
  mealDetails.classList.add('showRecipe');

  const closeBtn = document.getElementById('close');
  closeBtn.addEventListener('click', () => {
    mealDetails.classList.remove('showRecipe');
  });
}

async function getRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains('get-recipe')) {
    let mealItem = e.target.parentElement.parentElement;
    const resRecipe = await axios(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    );
    showRecipe(resRecipe.data.meals);
  }
}

result_container.addEventListener('click', getRecipe);
