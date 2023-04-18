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
const table = document.querySelector("table");
const tbody = document.querySelector("tbody");
const tableViewBtn = document.getElementById("table-view-btn");
const cardViewBtn = document.getElementById("card-view-btn");
const cardContainer = document.getElementById("card-container");
const library = JSON.parse(localStorage.getItem("library")) || [];
console.log("Initial library:", library);
const readingList = JSON.parse(localStorage.getItem("readingList")) || [];
const libraryData = localStorage.getItem("library");
const readingListLink = document.querySelector("#reading-list-link");


document.addEventListener('DOMContentLoaded', () => {

loadData();

function loadData() {
  console.log("Loading library:", library);
  library.forEach((book) => {
    console.log("Creating row and card for book:", book);
    let row = createRow(book);
    tbody.appendChild(row);

    const card = createCard(book, row); // Pass the row element as an argument
    const cardContainer = document.getElementById("card-container");
    cardContainer.appendChild(card);
  });
}
  
  
  // Call loadData at the beginning of your script


manualBtn.addEventListener("click", () => {
const formContainer = document.createElement("div");
formContainer.classList.add("fixed", "z-50", "inset-0", "flex", "justify-center", "items-center");

const form = document.createElement("form");
form.classList.add("bg-white", "p-6", "rounded-md", "shadow-lg", "max-w-md", "w-full", "w-96", "relative");
  
  const titleInput = createFormInput("Title", "text", "Unknown", "title");
  const authorInput = createFormInput("Author", "text", "Unknown", "author");
  const genreInput = createFormInput("Genre", "text", "Unknown", "genre");
  const descriptionInput = createFormInput("Description", "textarea", "No description available", "description");
  const coverInput = createFormInput("Cover URL", "text", "https://via.placeholder.com/128x197?text=No%20Image", "coverURL");
  const isbnInput = createFormInput("ISBN #", "number", generateUniqueIdentifier(), "isbn");
  const totalPagesInput = createFormInput("Page Count", "text", "Unknown", "totalPages");
  const pagesReadInput = createFormInput("Pages Read", "number", "0", "pagesRead");
  const isReadInput = createFormInput("Is Read?", "checkbox", false, "isRead");

  const closeButton = document.createElement("button");
  closeButton.classList.add("absolute", "top-2", "right-2", "text-red-600", "hover:text-red-900");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", () => {
    formContainer.remove();
    overlay.classList.add("hidden");
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.classList.add("px-4", "py-2", "bg-blue-500", "text-white", "font-medium", "rounded-md", "hover:bg-blue-600", "transition-colors");
  submitButton.textContent = "Add Book";

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("flex", "justify-between", "mt-4");
  buttonContainer.append(
    closeButton,
    submitButton,
  );

  form.append(closeButton, titleInput, authorInput, genreInput, descriptionInput, coverInput, isbnInput, totalPagesInput, pagesReadInput, isReadInput, buttonContainer);
  formContainer.appendChild(form);

  overlay.classList.remove("hidden");
  newBookModal.classList.add("hidden");
  document.body.appendChild(formContainer);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");
    const author = formData.get("author");
    const genre = formData.get("genre");
    const description = formData.get("description");
    const coverURL = formData.get("coverURL");
    const isbn = formData.get("isbn") || generateUniqueIdentifier();
    const totalPages = formData.get("totalPages");
    const pagesRead = formData.get("pagesRead");
    const isRead = formData.get("isRead");
    const parsedtotalPages = isNaN(totalPages) ? "Unknown" : parseInt(totalPages);
    addBookToLibrary(isbn, title, author, genre, parsedtotalPages, description, coverURL, pagesRead, isRead);
    formContainer.remove();
    overlay.classList.add("hidden");
  });
  
});

function generateUniqueIdentifier() {
  return Date.now();
}
    

function createFormInput(labelText, inputType, defaultValue, name) {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.classList.add("block", "font-semibold", "mb-2");

  const input = document.createElement("input");
  input.type = inputType;
  input.classList.add("border", "border-gray-400", "p-3", "rounded", "w-full", "h-10");
  input.placeholder = defaultValue || "";
  input.required = false;
  input.name = name || "";

  input.addEventListener("focus", () => {
    if (input.value === defaultValue) {
      input.value = "";
    }
  });

  input.addEventListener("blur", () => {
    if (input.value === "") {
      input.value = defaultValue;
    }
  });

  if (inputType === "number") {
    input.addEventListener("input", () => {
      const value = parseInt(input.value);
      if (isNaN(value)) {
        input.setCustomValidity("Please enter a number");
      } else {
        input.setCustomValidity("");
      }
    });
  }

  const container = document.createElement("div");
  container.appendChild(label);
  container.appendChild(input);

  return container;
}




tableViewBtn.addEventListener("click", () => {
  table.classList.remove("hidden");
  cardContainer.style.display = "none";
});

cardViewBtn.addEventListener("click", () => {
  table.classList.add("hidden");
  cardContainer.style.display = "flex";
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
    const totalPages = book.volumeInfo.totalPages || "Unknown";
    const genre = book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "Unknown";
    const description = book.volumeInfo.description ? book.volumeInfo.description : "No description available";
    const bookImage = book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x197?text=No%20Image";
    let isbn = "Unknown";
      if (book.volumeInfo.industryIdentifiers) {
      for (const identifier of book.volumeInfo.industryIdentifiers) {
        if (identifier.type === "ISBN_13" || identifier.type === "ISBN_10") {
          isbn = identifier.identifier;
          break;
        }
      }
      }


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

    const totalPagesElement = document.createElement("p");
    totalPagesElement.textContent = `${totalPages} pages`;

    const genreElement = document.createElement("p");
    genreElement.textContent = `Genre: ${genre}`;

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "flex flex-col";
    detailsContainer.append(titleElement, authorsElement, totalPagesElement, genreElement);

    const imageDetailsContainer = document.createElement("div");
    imageDetailsContainer.className = "flex items-start";
    imageDetailsContainer.append(image, detailsContainer);

    const libraryButton = document.createElement("button");
    libraryButton.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-min h-20 add-library";
    libraryButton.dataset.title = title;
    libraryButton.dataset.author = authors;
    libraryButton.dataset.totalPages = totalPages;
    libraryButton.dataset.genre = genre;
    libraryButton.dataset.description = description;
    libraryButton.dataset.coverurl = bookImage;
    libraryButton.dataset.isbn = isbn;
    libraryButton.textContent = "Library";

    const readingListButton = document.createElement("button");
    readingListButton.className = "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-min h-20 add-reading-list";
    libraryButton.dataset.title = title;
    libraryButton.dataset.author = authors;
    libraryButton.dataset.totalPages = totalPages;
    libraryButton.dataset.genre = genre;
    libraryButton.dataset.description = description;
    libraryButton.dataset.coverurl = bookImage;
    libraryButton.dataset.isbn = isbn;
    readingListButton.textContent = "Reading List";

    const wishlistButton = document.createElement("button");
    wishlistButton.className = "bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-min h-20 add-wishlist";
    libraryButton.dataset.title = title;
    libraryButton.dataset.author = authors;
    libraryButton.dataset.totalPages = totalPages;
    libraryButton.dataset.genre = genre;
    libraryButton.dataset.description = description;
    libraryButton.dataset.coverurl = bookImage;
    libraryButton.dataset.isbn = isbn;
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
      const totalPages = e.target.dataset.totalPages;
      const description = e.target.dataset.description;
      const coverURL = e.target.dataset.coverurl;
      const isbn = e.target.dataset.isbn;
      addBookToLibrary(isbn, title, author, genre, totalPages, description, coverURL);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  readingListButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const author = e.target.dataset.author;
      const genre = e.target.dataset.genre;
      const totalPages = e.target.dataset.totalPages;
      const description = e.target.dataset.description;
      const coverURL = e.target.dataset.coverurl;
      const isbn = e.target.data.isbn;
      addBookToReadingList(isbn, title, author, genre, totalPages, description, coverURL);
      addBookToLibrary(isbn, title, author, genre, totalPages, description, coverURL);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.target.dataset.title;
      const author = e.target.dataset.author;
      const genre = e.target.dataset.genre;
      const totalPages = e.target.dataset.totalPages;
      const description = e.target.dataset.description;
      const coverURL = e.target.dataset.coverurl;
      const isbn = e.target.data.isbn;
      addBookToWishlist(isbn, title, author, genre, totalPages, description, coverURL);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });
}

function addBookToLibrary(isbn, title, author, genre, totalPages, description, coverURL, pagesRead, isRead) {
  console.log(title, author, genre, totalPages, description, coverURL, pagesRead, isRead);
  
  const book = {
    isbn: isbn,
    title: title,
    author: author,
    totalPages: totalPages,
    genre: genre,
    description: description,
    coverURL: coverURL,
    pagesRead: pagesRead,
    isRead: isRead
  };

  // Add the book to the library
  library.push(book);

  // Update localStorage
  localStorage.setItem("library", JSON.stringify(library));

  const newRow = createRow(book);
  const newCard = createCard(book); // Create a card for the card view

  // // Add event listeners for add-to-reading-list and delete buttons on the card
  // newCard.querySelector(".bg-green-600").addEventListener("click", () => {
  //   addBookToReadingList(book);
  //   const filteredLibrary = filterByReadingList();
  //   renderTable(filteredLibrary, tbody);
  // });

  newCard.querySelector(".bg-red-600").addEventListener("click", () => {
    // Remove book from the library
    deleteBookFromLibrary(newRow);
  
    // // Remove book from the reading list
    // readingList = readingList.filter((b) => b !== book);
  
    // Update localStorage
    localStorage.setItem("readingList", JSON.stringify(readingList));
  });

//   // Render the table initially
// const filteredLibrary = filterByReadingList();
// renderTable(filteredLibrary, tbody);

  // Add the generated card to the card container
  cardContainer.appendChild(newCard);

  // Add the new row to the table
  tbody.appendChild(newRow);

  tbody.addEventListener("click", (event) => {
    if (event.target.matches(".bg-red-600")) {
      console.log("delete button clicked");
      deleteBookFromLibrary(event.target.closest("tr"));
    }
  });

  // Add event listener to the checkbox to toggle the isRead property
  const checkbox = newRow.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", (event) => {
    book.isRead = event.target.checked;
    localStorage.setItem("library", JSON.stringify(library));
  });
}

function createRow(book) {
  const row = document.createElement("tr");
  console.log("Created row:", row);
  row.classList.add("text-white", "border-gray-600", "border-b");

  const titleCell = document.createElement("td");
  titleCell.textContent = book.title;
  titleCell.classList.add("px-2", "py-4", "border-gray-600", "border-r", "flex", "justify-between");

  const authorCell = document.createElement("td");
  authorCell.textContent = book.author;
  authorCell.classList.add("px-2", "py-4", "border-gray-600", "border-r");

  const genreCell = document.createElement("td");
  genreCell.textContent = book.genre;
  genreCell.classList.add("px-2", "py-4", "border-gray-600", "border-r");

  const pagesRead = document.createElement("td");
  pagesRead.classList.add("text-center");
  const pagesReadInput = document.createElement("input");
  pagesReadInput.type = "number";
  pagesReadInput.value = book.pagesRead; // Set the value from the book object
  pagesReadInput.classList.add("bg-blue-900", "w-16", "text-white");
  pagesReadInput.addEventListener("input", () => {
    if (parseInt(pagesReadInput.value) > parseInt(totalPagesCell.textContent)) {
      pagesReadInput.value = totalPagesCell.textContent;
    }
  });
  pagesRead.appendChild(pagesReadInput);

  const totalPagesCell = document.createElement("td");
  totalPagesCell.textContent = book.totalPages;
  totalPagesCell.classList.add("text-center", "px-2", "py-4", "border-gray-600", "border-r");

  const readCell = document.createElement("td");
  const readCheckbox = document.createElement("input");
  readCheckbox.type = "checkbox";
  readCell.classList.add("text-center", "px-2", "py-4", "border-gray-600", "border-r");
  readCheckbox.addEventListener("change", () => {
    if (!book.isRead) {
      pagesReadInput.value = book.totalPages;
      book.pagesRead = book.totalPages;
    } else {
      book.pagesRead = pagesReadInput.value;
    }
    book.isRead = !book.isRead;
    localStorage.setItem("library", JSON.stringify(library));
  });
  readCheckbox.checked = book.isRead;
  readCell.appendChild(readCheckbox);

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("flex", "gap-2", "ml-5");
  titleCell.appendChild(btnContainer);

  const addToReadingListBtn = document.createElement("button");
  if (!readingList.some((readingBook) => readingBook.title === book.title && readingBook.author === book.author)) {
    addToReadingListBtn.className = "bg-green-600 text-white px-2 py-1 rounded";
    addToReadingListBtn.textContent = "Reading List";
    btnContainer.appendChild(addToReadingListBtn);
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "bg-red-600 text-white px-2 py-1 rounded";
  deleteButton.textContent = "Delete";
  btnContainer.appendChild(deleteButton);

  deleteButton.addEventListener("click", () => {
    deleteBookFromLibrary(row);
  });
  

  row.appendChild(titleCell);
  row.appendChild(authorCell);
  row.appendChild(genreCell);
  row.appendChild(pagesRead);
  row.appendChild(totalPagesCell);
  row.appendChild(readCell);

  // Increment a counter variable to determine the row number
  createRow.rowCounter = createRow.rowCounter ? createRow.rowCounter + 1 : 1;

  // Use the counter to set the background color for even/odd rows
  console.log("Row before setting the background color:", row);
  if (createRow.rowCounter % 2 === 0) {
    row.classList.add("bg-blue-800");
  } else {
    row.classList.add("bg-blue-700");
  }
  
  return row;
}

function createCard(book, row) {
  const MAX_DESCRIPTION_LENGTH = 100; // Set the maximum length for the description
  
  const card = document.createElement("div");
  card.classList.add("flex", "flex-col", "items-center", "justify-stretch", "bg-white", "rounded", "shadow-lg", "p-4", "m-4", "w-64");
  
  

  // Limit the description to a maximum length
  const description = book.description ? book.description.slice(0, MAX_DESCRIPTION_LENGTH) + "..." : "No description available";
  
  card.innerHTML = `
    <div class="card-container bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between">
      <div class="book-cover flex items-center justify-center">
        <img class="rounded-md object-contain h-48 w-full" src="${book.coverURL}" alt="${book.title}">
      </div>
      <div class="book-details">
        <h3 class="text-xl font-semibold mb-2">${book.title}</h3>
        <h4 class="text-lg font-medium mb-2">${book.author}</h4>
        <p class="text-gray-700 mb-2">${book.genre}</p>
        <p class="text-gray-700 mb-2">${description}</p>
        <p class="text-gray-700 mb-2">${book.totalPages} pages</p>
      </div>
      <div class="button-container flex justify-between mt-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Add to Reading List</button>
        <button id="delete-card-button" class="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Delete</button>
      </div>
    </div>
`;

const deleteCardButton = card.querySelector("#delete-card-button");
deleteCardButton.addEventListener("click", () => {
  deleteBookFromLibrary(row); // Make sure to pass the corresponding row element from the table
});

return card;

}

function addBookToReadingList(isbn, title, author, genre, totalPages, description, coverURL, pagesRead, isRead) {
  const book = {
    isbn: isbn,
    title: title,
    author: author,
    genre: genre,
    totalPages: totalPages,
    description: description,
    coverURL: coverURL,
    pagesRead: pagesRead,
    isRead: isRead
  };
  readingList.push(book);
}

function addBookToWishlist(title, author, totalPages) {
  // Add the book to the wishlist (You can create a separate list and display it in your UI)
  console.log(`Book added to Wishlist: ${title}`);
}

function deleteBookFromLibrary(row) {
  const isbn = row.dataset.isbn;
  
  // Find the index of the book to be removed
  const bookIndex = library.findIndex((book) => book.isbn === isbn);

  // Remove the book from the library array using splice method
  library.splice(bookIndex, 1);

  // Update localStorage
  localStorage.setItem("library", JSON.stringify(library));

  // Remove the row from the table
  row.remove();
  location.reload();
  console.log("row removed");
}

// function filterByReadingList() {
//   const filteredLibrary = library.filter((book) => {
//     return readingList.some((readingBook) => {
//       return readingBook.title === book.title && readingBook.author === book.author;
//     });
//   });
//   return filteredLibrary;
// }

// function renderTable(libraryData, tbody) {
//   tbody.innerHTML = "";

//   for (const book of libraryData) {
//     const newRow = createRow(book);
//     tbody.appendChild(newRow);
//   }
// }

// // Render the initial state of the table and card view
// const filteredLibrary = filterByReadingList();
// renderTable(filteredLibrary, tbody);
// library.forEach(book => cardContainer.appendChild(createCard(book)));

});
