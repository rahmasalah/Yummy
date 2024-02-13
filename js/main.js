/// <reference types="../@types/jquery/"/>

// loaders

$("body").ready(function () {
  $(".loader").fadeOut(1500, function () {
    $(".loading").fadeOut(1000);
    $("body").css("overflow", "auto");
  });
});

function sectionLoad(x) {
  $(".loading").css("z-index", "400");
  $(".loader").fadeIn(0, function () {
    $(".loading").fadeIn(0, function () {
      $("body").css("overflow", "auto");
    });
  });

  // Function to stop loading
  function stopLoading() {
    $("body").css("overflow", "auto");
    $(".loader").fadeOut(850, function () {
      $(".loading").fadeOut(850);
    });
  }

  // Event listener for the "keydown" event
  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      stopLoading();
    }
  });

  $(x).ready(function () {
    $("body").css("overflow", "auto");
    $(".loader").fadeOut(850, function () {
      $(".loading").fadeOut(850);
    });
  });
}

// sideBar

$("#closeMenu").on("click", function () {
  $("#closeMenu").toggleClass("fa-burger fa-x");
  $("#menuList").toggleClass(
    "animate__fadeInBottomLeft animate__fadeOutBottomLeft"
  );
  $("#sideBar").animate({ width: "toggle" }, 800);
});

$("aside a").on("click", function () {
  $("#closeMenu").toggleClass("fa-burger fa-x");
  $("#menuList").toggleClass(
    "animate__fadeInBottomLeft animate__fadeOutBottomLeft"
  );
  $("#sideBar").animate({ width: "toggle" }, 800);
});

// first Page
async function getApi(type, search, depend) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/${type}.php?${search}=${depend}`
  );
  if (response.ok == true) {
    finalResponse = await response.json();
    meals = finalResponse.meals;
    displayMeals(meals);
    displayInfo();
  }
}

getApi("search", "s", "");

function displayMeals(info) {
  let data = info;
  let content = "";
  for (let i = 0; i < data.length; i++) {
    content += `
        <div class="col-md-4 col-lg-3">
                    <div class="imageDetails">
                        <img src="${data[i].strMealThumb}" alt="" class="rounded-2">
                        <div class="layer w-100 h-100 rounded-2 d-flex align-items-center">
                            <h3 class="mealName ps-3">${data[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
        `;
    $("#mainMeals").html(content);
  }
}

// search page

$("#searchPage").on("click", function () {
  sectionLoad("#search");
  $("#NotFound").hide();
});

async function serachMeals(search, depend) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?${search}=${depend}`
  );

  if (response.ok) {
    const data = await response.json();
    let Searches = data.meals;
    if (Searches == null) {
      showSection("#NotFound");
      $("#search").show();
      $("#SearchedMeals").hide();
    } else {
      sectionLoad("#SearchedMeals");
      $("#NotFound").hide();
      $("#SearchedMeals").show();
      displaySearch(Searches);
      displayInfo();
    }
  }
}

function displaySearch(info) {
  let data = info;
  let content = "";
  for (let i = 0; i < data.length; i++) {
    content += `
        <div class="col-md-4 col-lg-3">
                    <div class="imageDetails">
                        <img src="${data[i].strMealThumb}" alt="" class="rounded-2">
                        <div class="layer w-100 h-100 rounded-2 d-flex align-items-center">
                            <h3 class="mealName ps-3">${data[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
        `;
    $("#SearchedMeals").html(content);
  }
}

let NameSearch = document.getElementById("NameSearch");
let letterSearch = document.getElementById("letterSearch");

$(NameSearch).on("click", function () {
  $(NameSearch).on("input", async function () {
    let nameBasket = NameSearch.value;
    await serachMeals("s", `${nameBasket}`);
  });
});

$(letterSearch).on("click", function () {
  $(letterSearch).on("input", async function () {
    let nameBasket = letterSearch.value;
    await serachMeals("f", `${nameBasket}`);
  });
});

// meal descriptions page

function displayInfo() {
  $(".layer").on("click", async function (e) {
    let meal = e.target.innerText;
    for (let i = 0; i < meals.length; i++) {
      if (meals[i].strMeal == meal) {
        $(mealDesc).html(meals[i].strInstructions);
        $("#mealArea").html(meals[i].strArea);
        $("#mealCate").html(meals[i].strCategory);
        $("#mealImage").attr("src", meals[i].strMealThumb);
        $("#mealName").html(meals[i].strMeal);
        mealRecipes(meals[i]);
        $("#tags").html(meals[i].strCategory);
        $(".btn1").attr("href", meals[i].strSource);
        $(".btn2").attr("href", meals[i].strYoutube);
        sectionLoad("#mealDetails");
        showSection("#mealDetails");
      }
    }
  });
}

const recipesList = document.getElementById("recipesList");
function mealRecipes(meals) {
  let ingredients = "";

  for (let j = 1; j <= 20; j++) {
    if (
      meals[`strMeasure${j}`] !== " " &&
      meals[`strMeasure${j}`] !== undefined &&
      meals[`strIngredient${j}`] !== "" &&
      meals[`strIngredient${j}`] !== undefined
    ) {
      ingredients += `<li class="border-1 rounded-2 m-2 py-1 px-2 ingredientsList">${
        meals[`strMeasure${j}`]
      } ${meals[`strIngredient${j}`]}</li>`;
    }
  }

  $(recipesList).html(ingredients);
}

// Category Page

async function getCategory(category) {
  const responseCategory = await fetch(
    `https://www.themealdb.com/api/json/v1/1/${category}.php`
  );
  if (responseCategory.ok == true) {
    let finalResponseCate = await responseCategory.json();
    mealsCate = finalResponseCate.categories;
    displayCategory(mealsCate);
  }
}

function displayCategory(info) {
  let data = info;
  let content = "";
  for (let i = 0; i < data.length; i++) {
    content += `
        <div class="col-md-4 col-lg-3">
            <div class="categoryDetails">
                <img src="${data[i].strCategoryThumb}" alt="" class="rounded-2">
                <div class="layers w-100 h-100 rounded-2 p-2" onclick=getApi('filter','c','${
                  data[i].strCategory
                }')>
                <h2 class='title'>${data[i].strCategory}</h2>
                <p>${truncateWords(data[i].strCategoryDescription, 20)}</p>
            </div>
        </div>
        </div>
        `;

    $("");
    $("#mainCate").html(content);
  }
}

function truncateWords(text, limit) {
  let words = text.split(/\s+/);
  if (words.length > limit) {
    return words.slice(0, limit).join(" ");
  } else {
    return text;
  }
}

$("#categoryPage").on("click", async function () {
  sectionLoad("#categories");
  await getCategory("categories");
  $(".layers").on("click", function () {
    sectionLoad("#home");
    showSection("#home");
  });
});

// Area Page

async function getArea() {
  const responseArea = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  if (responseArea.ok == true) {
    let finalResponseArea = await responseArea.json();
    mealsArea = finalResponseArea.meals;
    displayArea(mealsArea);
  }
}

function displayArea(info) {
  let data = info;
  let content = "";
  for (let i = 0; i < data.length; i++) {
    content += `
        <div class="col-md-4 col-lg-3" onclick=getApi('filter','a','${data[i].strArea}')>
        <div class="areaDetails m-5" role="button">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3 class="my-3">${data[i].strArea}</h3>
        </div>
        </div>
        `;
    $("#mainArea").html(content);
  }
}

$("#areaPage").on("click", async function () {
  sectionLoad("#area");
  await getArea();
  $("#mainArea").on("click", function () {
    showSection("#home");
    sectionLoad("#home");
  });
});

// ingredients Page

async function getIngredients() {
  const responseIngredients = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  if (responseIngredients.ok == true) {
    let finalResponseIngredients = await responseIngredients.json();
    mealsIngredients = finalResponseIngredients.meals;
    displayIngredients(mealsIngredients);
  }
}

function displayIngredients(info) {
  let data = info;
  let content = "";
  for (let i = 0; i < 24; i++) {
    content += `
        <div class="col-md-4 col-lg-3">
                        <div class="ingredientsDetails m-5 text-center overflow-hidden p-2" role="button" onclick=getApi('filter','i','${data[i].strIngredient}')>
                            <i class="fa-solid fa-drumstick-bite"></i>
                            <h3 class="my-2">${data[i].strIngredient}</h3>
                            <p class="my-3 overflow-hidden w-100">${data[i].strDescription}</p>
                        </div>
        </div>
        `;
    $("#mainIngredients").html(content);
  }
}

$("#ingredientsPage").on("click", async function () {
  sectionLoad("#ingredients");
  await getIngredients();
  $("#mainIngredients").on("click", function () {
    showSection("#home");
  });
});

// Contact Page

$("#contactPage").on("click", function () {
  sectionLoad("#contact");
  showSection("#contact");
});

let InputName = document.getElementById("InputName");
let InputEmail = document.getElementById("InputEmail");
let InputPhone = document.getElementById("InputPhone");
let InputAge = document.getElementById("InputAge");
let InputPassword = document.getElementById("InputPassword");
let InputRePassword = document.getElementById("InputRePassword");
let submitButton = document.getElementById("submitButton");

let regexName = /^[A-Z][a-z]{3,8}$/;
let regexEmail = /^\w{10,30}\@(gmail|yahoo)\.com$/;
let regexPassword = /^\w{8,}$/;
let regexPhone = /^01[0|1|2|5]\d{8}$/;
let regexAge = /^\d{2}$/;

function checkRegex(x, y) {
  let inputData = x.value;
  let regex = y;
  if (regex.test(inputData)) {
    $(x).addClass("is-valid");
    $(x).removeClass("is-invalid");
    return true;
  } else {
    $(x).addClass("is-invalid");
    $(x).removeClass("is-valid");
    return false;
  }
}

$(InputName).on("input", function () {
  checkRegex(InputName, regexName);
  if (checkRegex(InputName, regexName) == false) {
    $(".nameAlret").removeClass("d-none");
  } else {
    $(".nameAlret").addClass("d-none");
  }
  checkFormConditions();
});

$(InputEmail).on("input", function () {
  checkRegex(InputEmail, regexEmail);
  if (checkRegex(InputEmail, regexEmail) == false) {
    $(".emailAlret").removeClass("d-none");
  } else {
    $(".emailAlret").addClass("d-none");
  }
  checkFormConditions();
});

$(InputPassword).on("input", function () {
  checkRegex(InputPassword, regexPassword);
  if (checkRegex(InputPassword, regexPassword) == false) {
    $(".passwordAlret").removeClass("d-none");
  } else {
    $(".passwordAlret").addClass("d-none");
  }
  checkFormConditions();
});

$(InputPhone).on("input", function () {
  checkRegex(InputPhone, regexPhone);
  if (checkRegex(InputPhone, regexPhone) == false) {
    $(".phoneAlret").removeClass("d-none");
  } else {
    $(".phoneAlret").addClass("d-none");
  }
  checkFormConditions();
});

$(InputAge).on("input", function () {
  checkRegex(InputAge, regexAge);
  if (checkRegex(InputAge, regexAge) == false) {
    $(".ageAlret").removeClass("d-none");
  } else {
    $(".ageAlret").addClass("d-none");
  }
  checkFormConditions();
});

function checkPassword() {
  let pass1 = InputPassword.value;
  let pass2 = InputRePassword.value;
  if (pass1 == pass2) {
    $(InputRePassword).addClass("is-valid");
    $(InputRePassword).removeClass("is-invalid");
    return true;
  } else {
    $(InputRePassword).addClass("is-invalid");
    $(InputRePassword).removeClass("is-valid");
    return false;
  }
}

$(InputRePassword).on("input", function () {
  checkPassword();
  if (checkPassword() == false) {
    $(".rePasswordAlret").removeClass("d-none");
  } else {
    $(".rePasswordAlret").addClass("d-none");
  }
  checkFormConditions();
});

function checkFormConditions() {
  let isNameValid = checkRegex(InputName, regexName);
  let isEmailValid = checkRegex(InputEmail, regexEmail);
  let isPasswordValid = checkRegex(InputPassword, regexPassword);
  let isPhoneValid = checkRegex(InputPhone, regexPhone);
  let isAgeValid = checkRegex(InputAge, regexAge);
  let isPasswordMatch = checkPassword();

  if (
    isNameValid &&
    isEmailValid &&
    isPasswordValid &&
    isPhoneValid &&
    isAgeValid &&
    isPasswordMatch
  ) {
    $(submitButton).attr("disabled", false);
    $(submitButton).html("Welcome");
  } else {
    $(submitButton).attr("disabled", true);
    $(submitButton).html("Submit");
  }
}

$(document).ready(function () {
  $("section:not(#home)").hide();
  $("#menuList a").on("click", function (e) {
    e.preventDefault();
    const targetSection = $(this).attr("href");
    showSection(targetSection);
  });
});

function showSection(sectionId) {
  $("section").hide();
  $(sectionId).show();
}

showSection("#home");

// https://www.themealdb.com/api/json/v1/1/search.php?s=  // search w awl wa7da
// www.themealdb.com/api/json/v1/1/search.php?f=a        // search bl first letter
// www.themealdb.com/api/json/v1/1/categories.php        // category
// www.themealdb.com/api/json/v1/1/list.php?a=list      // area

// https://www.themealdb.com/api/json/v1/1/${type}.php?${search}=${depend}
