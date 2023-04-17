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
    result.className = "flex justify-between p-2 border-b border-gray-300";
    result.innerHTML = `
    <div class="flex items-start">
      <img src="${bookImage}" alt="${title}" class="w-16 h-24 mr-4">
      <div>
        <h3>${title}</h3>
        <p>${authors}</p>
        <p>${pageCount} pages</p>
      </div>
    </div>
    <div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 add-library" data-title="${title}" data-author="${authors}" data-pagecount="${pageCount}">Library</button>
      <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 add-reading-list" data-title="${title}" data-author="${authors}" data-pagecount="${pageCount}">Reading List</button>
      <button class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 add-wishlist" data-title="${title}" data-author="${authors}" data-pagecount="${pageCount}">Wishlist</button>
    </div>
  `;
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
  row.innerHTML = `
    <td class="border p-2">${title}</td>
    <td class="border p-2">${author}</td>
    <td class="text-center border p-2">0</td>
    <td class="text-center border p-2">${pageCount}</td>
    <td class="text-center border p-2"><input type="checkbox"></td>
  `;
  table.appendChild(row);
}

function addBookToReadingList(title, author, pageCount) {
  // Add the book to the library
  addBookToLibrary(title, author, pageCount);
  
  // Add the book to the reading list (You can create a separate list and display it in your UI)
  console.log(`Book added to Reading List: ${title}`);
}

function addBookToWishlist(title, author, pageCount) {
  // Add the book to the wishlist (You can create a separate list and display it in your UI)
  console.log(`Book added to Wishlist: ${title}`);
}

