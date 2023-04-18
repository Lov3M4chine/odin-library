const newBookBtn = document.getElementById("new-book-btn");
const newBookModal = document.getElementById("new-book-modal");
const closeNewBookModal = document.getElementById("close-new-book-modal");
const searchBtn = document.getElementById("search-btn");
const searchModal = document.getElementById("search-modal");
const manualBtn = document.getElementById("manual-btn");
const closeSearchModal = document.getElementById("close-search-modal");
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
let library = JSON.parse(localStorage.getItem("library")) || [];
console.log("Initial library:", library);
const readingList = JSON.parse(localStorage.getItem("readingList")) || [];
const libraryData = localStorage.getItem("library");
const readingListLink = document.querySelector("#reading-list-link");
let activeLink = "libraryActive";
const libraryLink = document.querySelector("#library-link");
const wishList = JSON.parse(localStorage.getItem("wishList")) || [];
const wishListLink = document.querySelector("#wish-list-link");

// *****Load initial library*****
loadData();

// *****Add to lists functions*****
// These functions add the respective books to their respective libraries - then resets the page to show accurate content

function addBookToReadingList(book) {
  const { isbn } = book;
  if (readingList.some((item) => item.isbn === isbn)) {
    alert(`${book.title} is already in the reading list`);
    return;
  }
  readingList.push(book);
  localStorage.setItem("readingList", JSON.stringify(readingList));
  loadData();
}

function addBookToLibrary(book) {
  const { isbn } = book;
  if (library.some((item) => item.isbn === isbn)) {
    alert(`${book.title} is already in the library`);
    return;
  } else if (activeLink === "wishListActive") {
    library.push(book);
    localStorage.setItem("library", JSON.stringify(library));
    deleteBook(book);
    loadData();
  } else {
    library.push(book);
    localStorage.setItem("library", JSON.stringify(library));
    loadData();
  }
}

function addBookToWishlist(book) {
  const { isbn } = book;
  if (wishList.some((item) => item.isbn === isbn)) {
    alert(`${book.title} is already in the wish list`);
    return;
  } else if (library.some((item) => item.isbn === isbn)) {
    alert(`${book.title} is already in the library`);
    return;
  }
  wishList.push(book);
  localStorage.setItem("wishList", JSON.stringify(wishList));
  loadData();
}

// *****Remove from lists functions*****

function deleteBook(isbn) {
  if (activeLink === "libraryActive") {
    let bookIndex = library.findIndex((book) => book.isbn === isbn);
    if (bookIndex !== -1) {
      library.splice(bookIndex, 1);
      localStorage.setItem("library", JSON.stringify(library));
      loadData();
    }

    const readingListIndex = readingList.findIndex(
      (book) => book.isbn === isbn
    );
    if (readingListIndex !== -1) {
      readingList.splice(readingListIndex, 1);
      localStorage.setItem("readingList", JSON.stringify(readingList));
      loadData();
    }
  } else if (activeLink === "readingListActive") {
    const bookIndex = readingList.findIndex((book) => book.isbn === isbn);
    if (bookIndex !== -1) {
      readingList.splice(bookIndex, 1);
      localStorage.setItem("readingList", JSON.stringify(readingList));
      loadData();
    }
  } else if (activeLink === "wishListActive") {
    const bookIndex = wishList.findIndex((book) => book.isbn === isbn);
    if (bookIndex !== -1) {
      wishList.splice(bookIndex, 1);
      localStorage.setItem("wishList", JSON.stringify(wishList));
      loadData();
    }
  }
}


// *****Create Manual Input & Edit Form*****

// Creates the form element for manual inputs and book editting
function createFormElement(
  elementType,
  labelText,
  inputType,
  inputValue,
  inputName
) {
  const formElement = document.createElement(elementType);
  const label = document.createElement("label");
  const input =
    elementType === "textarea"
      ? document.createElement(elementType)
      : document.createElement("input");

  label.textContent = labelText;
  label.classList.add("block", "mb-1");

  input.type = inputType;
  input.name = inputName;
  input.value = inputValue;
  input.classList.add(
    "w-full",
    "p-1",
    "border",
    "border-gray-300",
    "rounded-md"
  );

  formElement.appendChild(label);
  formElement.appendChild(input);
  formElement.classList.add("mb-4");

  return formElement;
}

function createCloseButton() {
  const closeButton = document.createElement("button");
  closeButton.classList.add(
    "absolute",
    "top-2",
    "right-2",
    "text-red-600",
    "hover:text-red-900"
  );
  closeButton.innerHTML = "&times;";
  return closeButton;
}

function createSubmitButton(book) {
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.classList.add(
    "px-4",
    "py-2",
    "bg-blue-500",
    "text-white",
    "font-medium",
    "rounded-md",
    "hover:bg-blue-600",
    "transition-colors"
  );
  submitButton.textContent = book ? "Update Book" : "Add Book";
  return submitButton;
}

// Provides defaults if the user does not input a value
function displayForm(book) {
  overlay.classList.remove("hidden");
  const formContainer = createFormContainer();
  const form = createForm();

  const titleInput = createFormElement(
    "div",
    "Title",
    "text",
    book ? book.title : "Unknown",
    "title"
  );
  const authorInput = createFormElement(
    "div",
    "Author",
    "text",
    book ? book.author : "Unknown",
    "author"
  );
  const genreInput = createFormElement(
    "div",
    "Genre",
    "text",
    book ? book.genre : "Unknown",
    "genre"
  );
  const descriptionInput = createFormElement(
    "textarea",
    "Description",
    "",
    book ? book.description : "No description available",
    "description"
  );
  const coverInput = createFormElement(
    "div",
    "Cover URL",
    "text",
    book
      ? book.coverURL
      : "https://via.placeholder.com/128x197?text=No%20Image",
    "coverURL"
  );
  const isbnInput = createFormElement(
    "div",
    "ISBN #",
    "number",
    book ? book.isbn : generateUniqueIdentifier(),
    "isbn"
  );
  const totalPagesInput = createFormElement(
    "div",
    "Page Count",
    "text",
    book ? book.totalPages : "",
    "totalPages"
  );
  const pagesReadInput = createFormElement(
    "div",
    "Pages Read",
    "number",
    book ? book.pagesRead : "0",
    "pagesRead"
  );
  const isReadInput = createFormElement(
    "div",
    "Is Read?",
    "checkbox",
    book ? book.isRead : false,
    "isRead"
  );

  const closeButton = createCloseButton();
  closeButton.addEventListener("click", () => {
    formContainer.remove();
    overlay.classList.add("hidden");
  });

  const submitButton = createSubmitButton(book);

  appendFormElements(form, [
    titleInput,
    authorInput,
    genreInput,
    descriptionInput,
    coverInput,
    isbnInput,
    totalPagesInput,
    pagesReadInput,
    isReadInput,
    closeButton,
    submitButton,
  ]);
  formContainer.appendChild(form);
  document.body.appendChild(formContainer);

  form.addEventListener("submit", (event) => {
    event.preventDefault;
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const title = formData.get("title");
      const author = formData.get("author");
      const genre = formData.get("genre");
      const description = formData.get("description");
      const coverURL = formData.get("coverURL");
      const isbn = parseInt(formData.get("isbn"));
      const totalPages = formData.get("totalPages");
      const parsedTotalPages =
        totalPages === "Unknown" || totalPages === ""
          ? "Unknown"
          : parseInt(totalPages);
      const pagesRead = parseInt(formData.get("pagesRead"));
      const isRead = formData.get("isRead") === "on";

      if (book) {
        updateBookInLibrary(book, {
          title,
          author,
          genre,
          description,
          coverURL,
          isbn,
          totalPages: parsedTotalPages,
          pagesRead,
          isRead,
        });
      } else {
        addBookToLibrary({
          title,
          author,
          genre,
          description,
          coverURL,
          isbn,
          totalPages: parsedTotalPages,
          pagesRead,
          isRead,
        });
      }
      formContainer.remove();
      overlay.classList.add("hidden");
    });
  });
}

// Creates container holding the form (for positioning)
function createFormContainer() {
  const formContainer = document.createElement("div");
  formContainer.classList.add(
    "fixed",
    "z-50",
    "inset-0",
    "flex",
    "justify-center",
    "items-center"
  );
  return formContainer;
}

// Creates the actual form outline
function createForm() {
  const form = document.createElement("form");
  form.classList.add(
    "bg-white",
    "p-6",
    "rounded-md",
    "shadow-lg",
    "max-w-md",
    "w-full",
    "w-96",
    "relative"
  );
  return form;
}

function appendFormElements(form, elements) {
  elements.forEach((element) => form.appendChild(element));
}

// A unique identifier is needed to add and delete books from libraries. The ISBN is used for this purpose but when ISBN is not available, it generates a unique time stamp of the current date in milliseconds. 
function generateUniqueIdentifier() {
  return Date.now();
}

// Creates the form input and provides placeholders depending on default values vs current values (in the case of editting)
function createFormInput(labelText, inputType, defaultValue, name) {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.classList.add("block", "font-semibold", "mb-2");

  const input = document.createElement("input");
  input.type = inputType;
  input.classList.add(
    "border",
    "border-gray-400",
    "p-3",
    "rounded",
    "w-full",
    "h-10"
  );
  input.placeholder = defaultValue || "";
  input.required = false;
  input.name = name || "";

  if (defaultValue !== undefined && inputType !== "checkbox") {
    input.value = defaultValue;
  }

  input.addEventListener("focus", () => {
    if (input.value === defaultValue) {
      input.value = "";
    }
  });

  input.addEventListener("blur", () => {
    if (input.value === "") {
      input.value = defaultValue || "";
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

// ***** API Search Functions *****

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

  books.forEach((element) => {
    const title = element.volumeInfo.title;
    const authors = element.volumeInfo.authors
      ? element.volumeInfo.authors.join(", ")
      : "Unknown";
    const totalPages = element.volumeInfo.totalPages || "Unknown";
    const genre = element.volumeInfo.categories
      ? element.volumeInfo.categories.join(", ")
      : "Unknown";
    const description = element.volumeInfo.description
      ? element.volumeInfo.description
      : "No description available";
    const bookImage =
      element.volumeInfo.imageLinks?.thumbnail ||
      "https://via.placeholder.com/128x197?text=No%20Image";
    let isbn = "Unknown";
    if (element.volumeInfo.industryIdentifiers) {
      for (const identifier of element.volumeInfo.industryIdentifiers) {
        if (identifier.type === "ISBN_13" || identifier.type === "ISBN_10") {
          isbn = identifier.identifier;
          break;
        }
      }
    }

    const book = {
      isbn: isbn,
      title: title,
      author: authors,
      totalPages: totalPages,
      genre: genre,
      description: description,
      coverURL: bookImage,
      pagesRead: 0,
      isRead: false,
    };

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
    detailsContainer.append(
      titleElement,
      authorsElement,
      totalPagesElement,
      genreElement
    );

    const imageDetailsContainer = document.createElement("div");
    imageDetailsContainer.className = "flex items-start";
    imageDetailsContainer.append(image, detailsContainer);

    const libraryButton = document.createElement("button");
    libraryButton.className =
      "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-min h-20 add-library";
    libraryButton.dataset.book = JSON.stringify(book);
    libraryButton.textContent = "Library";

    const readingListButton = document.createElement("button");
    readingListButton.className =
      "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-min h-20 add-reading-list";
    readingListButton.dataset.book = JSON.stringify(book);
    readingListButton.textContent = "Reading List";

    const wishlistButton = document.createElement("button");
    wishlistButton.className =
      "bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-min h-20 add-wishlist";
    wishlistButton.dataset.book = JSON.stringify(book);
    wishlistButton.textContent = "Wishlist";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-end items-start";
    buttonContainer.append(libraryButton, readingListButton, wishlistButton);

    result.append(imageDetailsContainer, buttonContainer);
    searchResults.appendChild(result);
  });

  const libraryButtons = searchResults.querySelectorAll(".add-library");
  const readingListButtons =
    searchResults.querySelectorAll(".add-reading-list");
  const wishlistButtons = searchResults.querySelectorAll(".add-wishlist");

  libraryButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const book = JSON.parse(e.target.dataset.book);
      addBookToLibrary(book);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  readingListButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const book = JSON.parse(e.target.dataset.book);
      addBookToReadingList(book);
      addBookToLibrary(book);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });

  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const book = JSON.parse(e.target.dataset.book);
      addBookToWishlist(book);
      overlay.classList.add("hidden");
      searchModal.classList.add("hidden");
    });
  });
}

// *****Table Creation Functions*****

function createRow(book) {
  let row = document.createElement("tr");
  row.dataset.isbn = book.isbn;
  row.classList.add("text-white", "border-gray-600", "border-b");
  return row;
}

function createButtonContainer(row) {
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("flex", "gap-2", "ml-5");
  row.querySelector(".justify-between").appendChild(btnContainer);
  return btnContainer;
}

function createReadingListBtn(book, row, btnContainer, activeLink) {
  if (activeLink === "libraryActive") {
    const addToReadingListBtn = document.createElement("button");
    addToReadingListBtn.className = "bg-green-600 text-white px-2 py-1 rounded";
    addToReadingListBtn.textContent = "Reading List";
    btnContainer.appendChild(addToReadingListBtn);
    addToReadingListBtn.addEventListener("click", () => {
      addBookToReadingList(book);
    });
  } else {
    return;
  }
}

function createAddToLibrarybtn(book, row, btnContainer, activeLink) {
  if (activeLink === "wishListActive") {
    const addToLibraryBtn = document.createElement("button");
    addToLibraryBtn.className = "bg-green-600 text-white px-2 py-1 rounded";
    addToLibraryBtn.textContent = "Add to Library";
    btnContainer.appendChild(addToLibraryBtn);
    addToLibraryBtn.addEventListener("click", () => {
      deleteBook(book);
      addBookToLibrary(book);
    });
  } else {
    return;
  }
}

function createEditBtn(book, row, btnContainer, activeLink) {
  const editButton = document.createElement("button");
  editButton.className = "bg-yellow-600 text-white px-2 py-1 rounded";
  editButton.textContent = "Edit";
  btnContainer.appendChild(editButton);
  editButton.addEventListener("click", () => {
    displayForm(book);
  });
}

function createDeleteBtn(book, row, btnContainer, activeLink) {
  const deleteButton = document.createElement("button");
  deleteButton.className = "bg-red-600 text-white px-2 py-1 rounded";
  deleteButton.textContent = "Delete";
  btnContainer.appendChild(deleteButton);
  deleteButton.addEventListener("click", () => {
    deleteBook(book.isbn);
  });
}

function createTitleCell(book, row) {
  const titleCell = document.createElement("td");
  titleCell.textContent = book.title;
  titleCell.classList.add(
    "px-2",
    "py-4",
    "border-gray-600",
    "border-r",
    "flex",
    "justify-between"
  );
  row.appendChild(titleCell);
}

function createAuthorCell(book, row) {
  const authorCell = document.createElement("td");
  authorCell.textContent = book.author;
  authorCell.classList.add("px-2", "py-4", "border-gray-600", "border-r");
  row.appendChild(authorCell);
}

function createGenreCell(book, row) {
  const genreCell = document.createElement("td");
  genreCell.textContent = book.genre;
  genreCell.classList.add("px-2", "py-4", "border-gray-600", "border-r");
  row.appendChild(genreCell);
}

function createPagesReadCell(book, row) {
  const pagesRead = document.createElement("td");
  pagesRead.classList.add("text-center");
  const pagesReadInput = document.createElement("input");
  pagesReadInput.type = "number";
  pagesReadInput.value = book.pagesRead;
  pagesReadInput.classList.add("bg-blue-900", "w-16", "text-white");
  pagesReadInput.addEventListener("input", () => {
    if (parseInt(pagesReadInput.value) > parseInt(totalPagesCell.textContent)) {
      pagesReadInput.value = totalPagesCell.textContent;
    }
  });
  pagesRead.appendChild(pagesReadInput);
  row.appendChild(pagesRead);
}

function createTotalPagesCell(book, row) {
  const totalPagesCell = document.createElement("td");
  totalPagesCell.textContent = book.totalPages;
  totalPagesCell.classList.add(
    "text-center",
    "px-2",
    "py-4",
    "border-gray-600",
    "border-r"
  );
  row.appendChild(totalPagesCell);
}

// Also adds an event listener to the Read cell so that when it is clicked the pages read will automatically adjust to the total pages
function createReadCell(book, row) {
  const readCell = document.createElement("td");
  const readCheckbox = document.createElement("input");
  readCheckbox.type = "checkbox";
  readCell.classList.add(
    "text-center",
    "px-2",
    "py-4",
    "border-gray-600",
    "border-r"
  );
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
  row.appendChild(readCell);
}

// Row counter is used for coloring every other row for readability
function initializeRowCounter(row) {
  createRow.rowCounter = createRow.rowCounter ? createRow.rowCounter + 1 : 1;

  if (createRow.rowCounter % 2 === 0) {
    row.classList.add("bg-blue-800");
  } else {
    row.classList.add("bg-blue-700");
  }
}

function createLibraryRow(book, activeLink) {
  const row = createRow(book);
  createCells(book, row);
  createButtons(book, row, activeLink);
  initializeRowCounter(row);
  return row;
}

function createCells(book, row) {
  createTitleCell(book, row);
  createAuthorCell(book, row);
  createGenreCell(book, row);
  createPagesReadCell(book, row);
  createTotalPagesCell(book, row);
  createReadCell(book, row);
}

function createButtons(book, row, activeLink) {
  const btnContainer = createButtonContainer(row);
  createReadingListBtn(book, row, btnContainer, activeLink);
  createAddToLibrarybtn(book, row, btnContainer, activeLink);
  createEditBtn(book, row, btnContainer, activeLink);
  createDeleteBtn(book, row, btnContainer, activeLink);
}

// *****Card Creation Fucntions*****

function truncateDescription(book) {
  const MAX_DESCRIPTION_LENGTH = 100;
  const description = book.description
    ? book.description.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
    : "No description available";
  return description;
}

function createCardHTML(book, description) {
  const cardHTML = document.createElement("div");
  cardHTML.classList.add(
    "card-container",
    "bg-white",
    "border",
    "border-gray-300",
    "rounded-lg",
    "p-4",
    "flex",
    "flex-col",
    "justify-between"
  );

  cardHTML.innerHTML = `
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
        <div class="button-container flex justify-between mt-4" id="card-button-container">
        </div>
      `;

  return cardHTML;
}

function createCardElement(book, cardHTML) {
  const card = document.createElement("div");
  card.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-stretch",
    "bg-white",
    "rounded",
    "shadow-lg",
    "p-4",
    "m-4",
    "w-64"
  );
  card.appendChild(cardHTML);
  const cardBtns = createCardBtns();
  const buttonContainer = card.querySelector(".button-container");
  buttonContainer.appendChild(cardBtns);
  return card;
}

// Determines which buttons get added depending on which page/link we are on (Reading List, Library,or Wishlist)
function createCardBtns() {
  const buttonWrapper = document.createElement("div");

  if (activeLink === "libraryActive") {
    const addToReadingListBtn = document.createElement("button");
    addToReadingListBtn.classList.add(
      "add-to-reading-list-button",
      "bg-green-600",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md",
      "font-semibold",
      "hover:bg-green-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-green-500",
      "focus:ring-offset-2"
    );
    addToReadingListBtn.innerText = "Add to Reading List";
    buttonWrapper.appendChild(addToReadingListBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(
      "delete-card-button",
      "bg-red-600",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md",
      "font-semibold",
      "hover:bg-red-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-red-500",
      "focus:ring-offset-2"
    );
    deleteBtn.innerText = "Delete";
    buttonWrapper.appendChild(deleteBtn);

  } else if (activeLink === "readingListActive") {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(
      "delete-card-button",
      "bg-red-600",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md",
      "font-semibold",
      "hover:bg-red-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-red-500",
      "focus:ring-offset-2"
    );
    deleteBtn.innerText = "Delete";
    buttonWrapper.appendChild(deleteBtn);

  } else if (activeLink === "wishListActive") {
    const addToLibraryBtn = document.createElement("button");
    addToLibraryBtn.classList.add(
      "add-to-library-button",
      "bg-green-600",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md",
      "font-semibold",
      "hover:bg-green-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-green-500",
      "focus:ring-offset-2"
    );
    addToLibraryBtn.innerText = "Add to Library";
    buttonWrapper.appendChild(addToLibraryBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(
      "delete-card-button",
      "bg-red-600",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md",
      "font-semibold",
      "hover:bg-red-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-red-500",
      "focus:ring-offset-2"
    );
    deleteBtn.innerText = "Delete";
    buttonWrapper.appendChild(deleteBtn);
  }

  return buttonWrapper;
}

function initializeCardReadingListBtn(book, card) {
  const addToReadingListBtn = card.querySelector(".add-to-reading-list-button");
  addToReadingListBtn.addEventListener("click", () => {
    addBookToReadingList(book);
  });
}

function initializeCardAddToLibraryBtn(book, card) {
  const addToLibraryBtn = card.querySelector(".add-to-library-button");
  addToLibraryBtn.addEventListener("click", () => {
    addToLibrary(book);
  });
}

function initializeCardDeleteBtn(book, card) {
  const deleteBtn = card.querySelector(".delete-card-button");
  deleteBtn.addEventListener("click", () => {
    deleteBook(book.isbn);
  });
}

// Used to add the appropriate event listener to the buttons since different buttons are used depending on the context
function initializeCardBtns(book, card) {
  if (activeLink === "libraryActive") {
    initializeCardReadingListBtn(book, card);
    initializeCardDeleteBtn(book, card);
  } else if (activeLink === "readingListActive") {
    initializeCardDeleteBtn(book, card);
  } else if (activeLink === "wishListActive") {
    initializeCardAddToLibraryBtn(book, card);
    initializeCardDeleteBtn(book, card);
  }
}

function createCard(book) {
  const description = truncateDescription(book);
  const cardHTML = createCardHTML(book, description);
  const card = createCardElement(book, cardHTML);
  initializeCardBtns(book, card);
  return card;
}

// Load the data from the libraries and display in table or cards
function loadData() {
  let data;
  const cardContainer = document.getElementById("card-container");

  if (cardContainer) {
    cardContainer.innerHTML = "";
  }
  if (tbody) {
    tbody.innerHTML = "";
  }

  if (activeLink === "readingListActive") {
    data = readingList;
  } else if (activeLink === "libraryActive") {
    data = library;
  } else if (activeLink === "wishListActive") {
    data = wishList;
  }

  data.forEach((book) => {
    const card = createCard(book);
    cardContainer.appendChild(card);

    const newRow = createLibraryRow(book, activeLink);
    tbody.appendChild(newRow);
  });
}

// *****Event Listeners*****

searchInput.addEventListener('input', () => {
  const searchText = searchInput.value.trim().toLowerCase();
  const bookList = document.querySelectorAll(`#${activeLink} tbody tr`);
  bookList.forEach((book) => {
      const title = book.querySelector('td:nth-child(1)').textContent.toLowerCase();
      const author = book.querySelector('td:nth-child(2)').textContent.toLowerCase();
      const genre = book.querySelector('td:nth-child(3)').textContent.toLowerCase();
      if (title.includes(searchText) || author.includes(searchText) || genre.includes(searchText)) {
          book.style.display = 'table-row';
      } else {
          book.style.display = 'none';
      }
  });
});

manualBtn.addEventListener("click", () => {
  displayForm();
  newBookModal.classList.add("hidden");
});

readingListLink.addEventListener("click", () => {
  activeLink = "readingListActive";
  loadData();
  console.log("Initial readingList:", readingList);
});

libraryLink.addEventListener("click", () => {
  activeLink = "libraryActive";
  loadData();
  console.log("Initial library:", library);
});

wishListLink.addEventListener("click", () => {
  activeLink = "wishListActive";
  loadData();
  console.log("Initial wishList:", wishList);
});

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
  searchModal.classList.remove("hidden");
  newBookModal.classList.add("hidden");
  searchModal.querySelector(".bg-white").appendChild(searchResults);
});

closeSearchModal.addEventListener("click", () => {
  overlay.classList.add("hidden");
  searchModal.classList.add("hidden");
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});
