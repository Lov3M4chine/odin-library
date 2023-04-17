const newBookBtn = document.getElementById("new-book-btn");
const newBookModal = document.getElementById("new-book-modal");
const closeNewBookModal = document.getElementById("close-new-book-modal");
const searchBtn = document.getElementById("search-btn");
const searchModal = document.getElementById("search-modal")
const manualBtn = document.getElementById("manual-btn");
const closeSearchModal = document.getElementById("close-search-modal")
const overlay = document.getElementById("overlay");
const searchInput = document.getElementById("search-input");
const searchCriteria = document.getElementById("search-criteria");
const addBookBtn = document.getElementById("add-book-btn");
const searchResults = document.createElement("div");
searchResults.id = "search-results";
searchResults.className = "mt-4";
const API_KEY = "AIzaSyBSPf38Eaiajtj2gKFGxCuXCQjJPVC6_pQ";
const table = document.querySelector("table tbody");


table.addEventListener("click", (event) => {
  if (event.target.matches(".bg-red-600")) {
    console.log("delete button clicked");
    deleteBookFromLibrary(event.target.closest("tr"));
  }
});


newBookBtn.addEventListener("click", () => {
  overlay.classList.remove("hidden");
  newBookModal.classList.remove("hidden");
});

closeNewBookModal.addEventListener("click", () => {
  overlay.classList.add("hidden");
  newBookModal.classList.add("hidden");
});

searchBtn.addEventListener("click", () => {
  searchModal.classList.remove("hidden")
  newBookModal.classList.add("hidden");
});

closeSearchModal.addEventListener("click", () => {
  overlay.classList.add("hidden");
  searchModal.classList.add("hidden");
})

manualBtn.addEventListener("click", () => {
  // Handle manual button click event
});

searchBtn.addEventListener("click", () => {
  searchModal.classList.remove("hidden");
  newBookModal.classList.add("hidden");
  searchModal.querySelector('.bg-white').appendChild(searchResults);
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value;
  const criteria = searchCriteria.value.toLowerCase();
  const url = `https://www.googleapis.com/books/v1/volumes?q=${criteria}:${query}&key=${API_KEY}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.items);
    });
}

function displayResults(books) {
  searchResults.innerHTML = "";
  
  books.forEach((book) => {
    const title = book.volumeInfo.title;
    const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown";
    const pageCount = book.volumeInfo.pageCount || "Unknown";
    const bookImage = book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x197?text=No%20Image";

    const result = document.createElement("div");
    result.className = "flex justify-between p-2 border-b border-gray-300 g-5";

    const image = document.createElement("img");
    image.src = bookImage;
    image.alt = title;
    image.className = "w-16 h-24 mr-4";

    const titleElement = document.createElement("h3");
    titleElement.textContent = title;

    const authorsElement = document.createElement("p");
    authorsElement.textContent = authors;

    const pageCountElement = document.createElement("p");
    pageCountElement.textContent = `${pageCount} pages`;

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "flex flex-col";
    detailsContainer.append(titleElement, authorsElement, pageCountElement);

    const imageDetailsContainer = document.createElement("div");
    imageDetailsContainer.className = "flex items-start";
    imageDetailsContainer.append(image, detailsContainer);

    const libraryButton = document.createElement("button");
    libraryButton.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-min h-20 add-library";
    libraryButton.dataset.title = title;
    libraryButton.dataset.author = authors;
    libraryButton.dataset.pagecount = pageCount;
    libraryButton.textContent = "Library";

    const readingListButton = document.createElement("button");
    readingListButton.className = "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-min h-20 add-reading-list";
    readingListButton.dataset.title = title;
    readingListButton.dataset.author = authors;
    readingListButton.dataset.pagecount = pageCount;
    readingListButton.textContent = "Reading List";

    const wishlistButton = document.createElement("button");
    wishlistButton.className = "bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-min h-20 add-wishlist";
    wishlistButton.dataset.title = title;
    wishlistButton.dataset.author = authors;
    wishlistButton.dataset.pagecount = pageCount;
    wishlistButton.textContent = "Wishlist";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-end items-start";
    buttonContainer.append(libraryButton, readingListButton, wishlistButton);

    result.append(imageDetailsContainer, buttonContainer);
    searchResults.appendChild(result);
  });
  // Set up the event listeners for the new buttons
  const libraryButtons = searchResults.querySelectorAll(".add-library");
  const readingListButtons = searchResults.querySelectorAll(".add-reading-list");
  const wishlistButtons = searchResults.querySelectorAll(".add-wishlist");

  libraryButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const author = e.target.dataset.author;
      const pageCount = e.target.dataset.pagecount;
      addBookToLibrary(title, author, pageCount);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  readingListButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const author = e.target.dataset.author;
      const pageCount = e.target.dataset.pagecount;
      addBookToReadingList(title, author, pageCount);
      addBookToLibrary(title, author, pageCount);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const author = e.target.dataset.author;
      const pageCount = e.target.dataset.pagecount;
      addBookToWishlist(title, author, pageCount);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });
}

function addBookToLibrary(title, author, pageCount) {
  const table = document.querySelector("table tbody");
  const row = document.createElement("tr");

  // Add buttons for Reading List and Delete
  const readingListButton = document.createElement("button");
  readingListButton.className = "bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 ml-2";
  readingListButton.textContent = "Reading List";

  const deleteButton = document.createElement("button");
  deleteButton.className = "bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 ml-2";
  deleteButton.textContent = "Delete";

  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.append(readingListButton, deleteButton);

  // Create title span
  const titleSpan = document.createElement("span");
  titleSpan.textContent = title;

  // Add title cell content
  const titleCell = document.createElement("td");
  titleCell.className = "border-solid border-2 border-gray-500 p-2 flex justify-between items-center";
  titleCell.append(titleSpan, buttonContainer);

  row.innerHTML = `
    ${titleCell.outerHTML}
    <td class="border p-2">${author}</td>
    <td class="text-center border p-2">0</td>
    <td class="text-center border p-2">${pageCount}</td>
    <td class="text-center border p-2"><input type="checkbox"></td>
  `;

  // Append the row to the table
  table.appendChild(row);
}


function addBookToReadingList(title, author, pageCount) {
  
  // Add the book to the reading list (You can create a separate list and display it in your UI)
  console.log(`Book added to Reading List: ${title}`);
}

function addBookToWishlist(title, author, pageCount) {
  // Add the book to the wishlist (You can create a separate list and display it in your UI)
  console.log(`Book added to Wishlist: ${title}`);
}

function deleteBookFromLibrary(row) {
  row.remove();
  console.log("row removed");
}
