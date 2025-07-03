
const searchBox= document.querySelector('.searchBox');
const searchBtn= document.querySelector('.searchBtn');
const recipeContainer= document.querySelector('.recipe-container');
const recipeDetailsContent= document.querySelector('.recipe-details-content');
const recipeCloseBtn= document.querySelector('.recipe-close-btn');

//function to get recipes
const fetchRecipes= async (query) => {
    recipeContainer.innerHTML="<h2>Fetching Recipes...</h2>";
    try{

    
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

    const response = await data.json();
    recipeContainer.innerHTML= "";

    if (!response.meals) {
        recipeContainer.innerHTML = "<h2>No recipes found!</h2>";
        return;
      }
  


   response.meals.forEach(meal => {
     const recipeDiv = document.createElement('div');
     recipeDiv.classList.add('recipe');
     recipeDiv.innerHTML=`
     <img src="${meal.strMealThumb}">
     <h3> ${meal.strMeal}</h3>
      <p><span> ${meal.strArea}</span> Dish</p>
       <p>Belongsto <span> ${meal.strCategory}</span> Category</p>
     `;
     //view recipe button
     const button = document.createElement('button');
      button.textContent="View Recipe"; 
      recipeDiv.appendChild(button);

     // adding EventListener to recipe button
     button.addEventListener('click', ()=>{
            openRecipePopup(meal);
     });
     // Add to Favourites button
     const favButton = document.createElement('button');
     favButton.textContent = "❤️ Add to Favourites";
     favButton.classList.add('favourite-btn');
     favButton.addEventListener('click', () => {
       addToFavourites(meal);
     });
     recipeDiv.appendChild(favButton);

     recipeContainer.appendChild(recipeDiv);
  });
}
catch(error){
    recipeContainer.innerHTML="<h2>Error in fetching recipes..</h2>";
}
}
//function to fetch ingredients and measurement 
const fetchIngredients=(meal)=>{
 let ingredientsList="";
 for(let i=1;i<=20;i++){
const ingredient =meal[`strIngredient${i}`];
if(ingredient){
    const measure = meal[`strMeasure${i}`];
    ingredientsList+=`<li>${measure} ${ingredient}</li>`
}
else{
    break;
}
 }
 return ingredientsList;
}
const openRecipePopup =(meal) =>{

    saveToRecentlyViewed(meal);

 recipeDetailsContent.innerHTML=`
 <h2 class="recipeName">${meal.strMeal}</h2>
 <h3>Ingredients:</h3>   
 <ul class="ingredientList">${fetchIngredients(meal)}</ul>
 <div class="recipeInstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>  
      </div>
 
 `
 
 recipeDetailsContent.parentElement.style.display="block";
}



recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none"; // Hide the popup
});



searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();//page refresh nhi hoga
    const searchInput = searchBox.value.trim();
    if(!searchInput){
       recipeContainer.innerHTML=`<h2>Type your recipe in search box</h2>`;
       return;
    }
    fetchRecipes(searchInput);
    //console.log("button clicked")
}); 
// Dark Mode Toggle
const toggleBtn = document.querySelector('.dark-mode-toggle');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Change icon 🌙/☀️
    if (document.body.classList.contains('dark-mode')) {
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }
});


function updateOnlineStatus() {
    const offlineMessage = document.getElementById("offline-message");
    if (!navigator.onLine) {
      offlineMessage.style.display = "block";
    } else {
      offlineMessage.style.display = "none";
    }
  }
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Run on load
  updateOnlineStatus();



  
const saveToRecentlyViewed = (meal) => {
  let recent = JSON.parse(localStorage.getItem("recentRecipes")) || [];

  // Remove duplicates
  recent = recent.filter(r => r.idMeal !== meal.idMeal);

  // Add current at the start
  recent.unshift({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb
  });

  // Keep only 5 recent
  recent = recent.slice(0, 5);

  localStorage.setItem("recentRecipes", JSON.stringify(recent));
  displayRecentlyViewed(); // Update the UI
};


//create recently viewed function

const displayRecentlyViewed = () => {
    const container = document.getElementById("recentlyViewedRecipes");
    const recent = JSON.parse(localStorage.getItem("recentRecipes")) || [];
  
    if (recent.length === 0) {
      container.innerHTML = "<p>No recipes viewed recently.</p>";
      return;
    }
  
    container.innerHTML = ""; // Clear previous
  
    recent.forEach(meal => {
      const div = document.createElement('div');
      div.classList.add('recipe');
  
      div.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h4>${meal.strMeal}</h4>
      `;
  
      div.addEventListener('click', async () => {
        // Fetch full meal data and show popup
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        const res = await data.json();
        openRecipePopup(res.meals[0]);
      });
  
      container.appendChild(div);
    });
  };

  //call when page loads
  window.addEventListener('load', () => {
    displayRecentlyViewed();
  });
 
  //go back to home page button 
  function goToHome() {
    // Clear recipe details popup if it's open
    document.querySelector('.recipe-details').style.display = 'none';
  
    // Optionally, reset the search box and reload trending or initial recipes
    document.querySelector('.searchBox').value = '';
    recipeContainer.innerHTML = '<h2>Type your recipe in search box</h2>';
  }
  
  /* new function for favourite */
  const favouritesContainer = document.querySelector('.favourites-container');
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

function addToFavourites(meal) {
  if (favourites.some(fav => fav.idMeal === meal.idMeal)) {
    alert("Already in favourites!");
    return;
  }
  favourites.push(meal);
  localStorage.setItem('favourites', JSON.stringify(favourites));
  renderFavourites();
}

function renderFavourites() {
  favouritesContainer.innerHTML = "";
  favourites.forEach(meal => {
    const favDiv = document.createElement('div');
    favDiv.classList.add('recipe');
    favDiv.innerHTML = `
      <img src="${meal.strMealThumb}">
      <h3>${meal.strMeal}</h3>
      <p><span>${meal.strArea}</span> Dish</p>
      <p>Belongs to <span>${meal.strCategory}</span> Category</p>
    `;
    const viewBtn = document.createElement('button');
    viewBtn.textContent = "View Recipe";
    viewBtn.addEventListener('click', () => openRecipePopup(meal));
    favDiv.appendChild(viewBtn);

    favouritesContainer.appendChild(favDiv);
  });
}

/* call this func on page load */
window.addEventListener("DOMContentLoaded", renderFavourites);
