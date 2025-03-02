const searchBtn = document.querySelector('#search-btn');
const mealList = document.querySelector('#meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.querySelector('#recipe-close-btn');
const APIkey = 'f1a6f115b1a741309aa44678494a2fac';

// Event listeners for button clicks
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Get meal list based on user input ingredients
function getMealList() {
    let searchInputTxt = document.querySelector('#search-input').value.trim();
    if (searchInputTxt === "") {
        alert("Please enter an ingredient.");
        return;
    }
    // Fetch meal list from Spoonacular API based on ingredients
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchInputTxt}&apiKey=${APIkey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let html = "";
            if (data.length > 0) {
                data.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.id}">
                            <div class="meal-img">
                                <img src="${meal.image}" alt="${meal.title}">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.title}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching meal list:', error);
            mealList.innerHTML = "An error occurred while fetching the meal list. Please try again later.";
        });
}

// Get recipe of a selected meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information?apiKey=${APIkey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                mealRecipeModal(data);
                // Fetch nutrition facts after the modal is displayed
                fetchNutritionFacts(data.id);
            })
            .catch(error => {
                console.error('Error fetching meal recipe:', error);
                mealDetailsContent.innerHTML = "An error occurred while fetching the recipe. Please try again later.";
                mealDetailsContent.parentElement.classList.add('showRecipe');
            });
    }
}

// Create a modal and display a modal with meal recipe details
function mealRecipeModal(meal) {
    console.log(meal);

    // Extract ingredients and create HTML list
    let ingredientsHtml = meal.extendedIngredients.map(ingredient => `
        <li>${ingredient.original}</li>
    `).join('');

     // Create HTML structure for the recipe modal
    let html = `
        <h2 class="recipe-title">${meal.title}</h2>
        <p class="recipe-category">${meal.cuisines.join(', ')}</p>
        <div class="recipe-ingredients">
            <h3>Ingredients:</h3>
            <ul class="ingredients">${ingredientsHtml}</ul>
        </div>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p class="instructions">${meal.instructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="${meal.title}">
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">View Full Recipe</a>
        </div>
        <div class="nutrition-facts">
            <h3>Nutrition Facts:</h3>
            <ul id="nutrition-list"></ul> 
        </div>
    `;
    
    mealDetailsContent.innerHTML = html; // Set the recipe details
    mealDetailsContent.parentElement.classList.add('showRecipe'); // Show the recipe modal
}

// Fetch nutrition facts for a specific meal
function fetchNutritionFacts(mealId) {
    fetch(`https://api.spoonacular.com/recipes/${mealId}/nutritionWidget.json?apiKey=${APIkey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(nutrition => {
            // Create nutrition facts HTML
            let nutritionHtml = `
                <li>Calories: ${nutrition.calories} kcal</li>
                <li>Protein: ${nutrition.protein}</li>
                <li>Fat: ${nutrition.fat}</li>                
            `;

            // Inject the nutrition facts into the modal
            const nutritionList = document.querySelector('#nutrition-list');
            if (nutritionList) { // Check if the nutrition list exists
                nutritionList.innerHTML = nutritionHtml; // Set the nutrition facts
            } else {
                console.error('Nutrition list element not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching nutrition facts:', error);
            const nutritionList = document.querySelector('#nutrition-list');
            if (nutritionList) {
                nutritionList.innerHTML = `<li>Error fetching nutrition facts. Please try again later.</li>`;
            }
        });
}