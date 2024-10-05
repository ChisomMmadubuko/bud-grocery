// ****** select items **********
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

let editElement = null;
let editFlag = false;
let editID = "";

// ****** event listeners **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = editFlag ? editID : new Date().getTime().toString();

  if (value) {
    if (!editFlag) {
      createListItem(id, value);
      displayAlert("Item added", "success");
      addToLocalStorage(id, value);
    } else {
      editElement.textContent = value;
      displayAlert("Value changed", "success");
      editLocalStorage(id, value);
    }
    container.classList.add("show-container");
    setBackToDefault();
  } else {
    displayAlert("Please enter value", "danger");
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => alert.classList.remove(`alert-${action}`), 1000);
}

function clearItems() {
  list.innerHTML = "";
  container.classList.remove("show-container");
  displayAlert("List cleared", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

function deleteItem(e) {
  const element = e.target.closest(".grocery-item");
  const id = element.dataset.id;
  list.removeChild(element);
  if (!list.children.length) container.classList.remove("show-container");
  displayAlert("Item removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element = e.target.closest(".grocery-item");
  editElement = element.querySelector(".title");
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Submit";
}

// ****** local storage **********
function addToLocalStorage(id, value) {
  const items = getLocalStorage();
  items.push({ id, value });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("list")) || [];
}

function removeFromLocalStorage(id) {
  const items = getLocalStorage().filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  const items = getLocalStorage().map((item) =>
    item.id === id ? { ...item, value } : item
  );
  localStorage.setItem("list", JSON.stringify(items));
}

// ****** setup items **********
function setupItems() {
  const items = getLocalStorage();
  if (items.length) {
    items.forEach((item) => createListItem(item.id, item.value));
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  element.dataset.id = id;
  element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      <button class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>`;

  element.querySelector(".delete-btn").addEventListener("click", deleteItem);
  element.querySelector(".edit-btn").addEventListener("click", editItem);
  list.appendChild(element);
}
