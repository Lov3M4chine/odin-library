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
const tbody = document.querySelector("table tbody");
const table = document.querySelector("table");
const tableViewBtn = document.getElementById("table-view-btn");
const cardViewBtn = document.getElementById("card-view-btn");
const cardContainer = document.getElementById("card-container");
let library = JSON.parse(localStorage.getItem("library")) || [];


tableViewBtn.addEventListener("click", () => {
  table.classList.remove("hidden");
  cardContainer.style.display = "none";
});

cardViewBtn.addEventListener("click", () => {
  table.classList.add("hidden");
  cardContainer.style.display = "flex";
});


tbody.addEventListener("click", (event) => {
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
  searchModal.querySelector('.bg-white').appendChild(searchResults);
});

closeSearchModal.addEventListener("click", () => {
  overlay.classList.add("hidden");
  searchModal.classList.add("hidden");
})

manualBtn.addEventListener("click", () => {
  // Handle manual button click event
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
    const genre = book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "Unknown";
    const description = book.volumeInfo.description ? book.volumeInfo.description : "No description available";
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

    const genreElement = document.createElement("p");
    genreElement.textContent = `Genre: ${genre}`;

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "flex flex-col";
    detailsContainer.append(titleElement, authorsElement, pageCountElement, genreElement);

    const imageDetailsContainer = document.createElement("div");
    imageDetailsContainer.className = "flex items-start";
    imageDetailsContainer.append(image, detailsContainer);

    const libraryButton = document.createElement("button");
    libraryButton.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-min h-20 add-library";
    libraryButton.dataset.title = title;
    libraryButton.dataset.author = authors;
    libraryButton.dataset.pagecount = pageCount;
    libraryButton.dataset.genre = genre;
    libraryButton.dataset.description = description;
    libraryButton.dataset.coverurl = bookImage;
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
      const genre = e.target.dataset.genre;
      const pageCount = e.target.dataset.pagecount;
      const description = e.target.dataset.description;
      const coverURL = e.target.dataset.coverurl;
      addBookToLibrary(title, author, genre, pageCount, description, coverURL);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  readingListButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const author = e.target.dataset.author;
      const genre = e.target.dataset.genre;
      const pageCount = e.target.dataset.pagecount;
      const description = e.target.dataset.description;
      const coverURL = e.target.dataset.coverurl;
      addBookToReadingList(title, author, genre, pageCount, description, coverURL);
      addBookToLibrary(title, author, genre, pageCount, description, coverURL);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const author = e.target.dataset.author;
      const pageCount = e.target.dataset.pagecount;
      const genre = e.target.dataset.genre;
      const description = e.target.dataset.description;
      const coverURL = e.target.dataset.coverurl;
      addBookToWishlist(title, author, genre, pageCount, description, coverURL);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });
}


function addBookToLibrary(title, author, genre, pageCount, description, coverURL) {
  const book = {
    title: title,
    author: author,
    totalPages: pageCount,
    genre: genre,
    description: description,
    coverURL: coverURL
  };

  // Add the book to the library
  library.push(book);

  // Update localStorage
  localStorage.setItem("library", JSON.stringify(library));

  const newRow = createRow(book);
  const newCard = createCard(book); // Create a card for the card view

  // Add event listeners for add-to-reading-list and delete buttons on the card
  newCard.querySelector(".bg-green-600").addEventListener("click", () => addToReadingList(book));
  newCard.querySelector(".bg-red-600").addEventListener("click", () => {
    // Remove book from the library
    library = library.filter((b) => b !== book);

    // Update localStorage
    localStorage.setItem("library", JSON.stringify(library));

    // Update the UI
    newRow.remove();
    newCard.remove();
  });

  // Add the generated card to the card container
  cardContainer.appendChild(newCard);

  // Add the new row to the table
  const tbody = document.querySelector("table tbody");
  tbody.appendChild(newRow);
}





function createRow(book) {
  const row = document.createElement("tr");
  row.classList.add("text-white", "border-gray-600", "border-b");

  const titleCell = document.createElement("td");
  titleCell.textContent = book.title;
  titleCell.classList.add("px-2", "py-4", "border-gray-600", "border-r");

  const authorCell = document.createElement("td");
  authorCell.textContent = book.author;
  authorCell.classList.add("px-2", "py-4", "border-gray-600", "border-r");

  const genreCell = document.createElement("td");
  genreCell.textContent = book.genre;
  genreCell.classList.add("px-2", "py-4", "border-gray-600", "border-r");

  const pagesRead = document.createElement("td");
  pagesRead.textContent = "0";
  pagesRead.classList.add("text-center", "px-2", "py-4", "border-gray-600", "border-r");

  const pageCountCell = document.createElement("td");
  pageCountCell.textContent = book.totalPages;
  pageCountCell.classList.add("text-center", "px-2", "py-4", "border-gray-600", "border-r");

  const readCell = document.createElement("td");
  const readCheckbox = document.createElement("input");
  readCheckbox.type = "checkbox";
  readCell.classList.add("text-center", "px-2", "py-4", "border-gray-600", "border-r");
  readCell.appendChild(readCheckbox);

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "bg-red-600 text-white px-2 py-1 rounded";
  deleteButton.textContent = "Delete";
  deleteCell.classList.add("text-center", "px-2", "py-4");
  deleteCell.appendChild(deleteButton);

  row.appendChild(titleCell);
  row.appendChild(authorCell);
  row.appendChild(genreCell);
  row.appendChild(pagesRead);
  row.appendChild(pageCountCell);
  row.appendChild(readCell);
  row.appendChild(deleteCell);

  // Increment a counter variable to determine the row number
  createRow.rowCounter = createRow.rowCounter ? createRow.rowCounter + 1 : 1;

  // Use the counter to set the background color for even/odd rows
  if (createRow.rowCounter % 2 === 0) {
    row.classList.add("bg-blue-800");
  } else {
    row.classList.add("bg-blue-700");
  }

  return row;
}





function createCard(book) {
  const MAX_DESCRIPTION_LENGTH = 100; // Set the maximum length for the description
  
  const card = document.createElement("div");
  card.classList.add("flex", "flex-col", "items-center", "bg-white", "rounded", "shadow-lg", "p-4", "m-4", "w-64");
  
  // Limit the description to a maximum length
  const description = book.description ? book.description.slice(0, MAX_DESCRIPTION_LENGTH) + "..." : "No description available";
  
  card.innerHTML = `
    <img class="flex justify-center object-cover rounded" src="${book.coverURL}" alt="${book.title}">
    <h3 class="text-xl font-semibold mb-2">${book.title}</h3>
    <h4 class="text-lg font-medium mb-2">${book.author}</h4>
    <p class="text-gray-700 mb-2">${book.genre}</p>
    <p class="text-gray-700 mb-2">${description}</p>
    <p class="text-gray-700 mb-2">${book.totalPages} pages</p>
    <div class="flex justify-between">
      <button class="bg-green-600 text-white px-2 py-1 rounded">Add to Reading List</button>
      <button class="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
    </div>
    `;
  
  return card;
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

