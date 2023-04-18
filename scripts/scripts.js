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
let isReadingListActive = false;
const libraryLink = document.querySelector("#library-link");

document.addEventListener("DOMContentLoaded", () => {

  loadData();

  readingListLink.addEventListener("click", () => {
    isReadingListActive = true;
    loadData();
    console.log("Initial readingList:", readingList)
  });

  libraryLink.addEventListener("click", () => {
    isReadingListActive = false;
    loadData();
    console.log("Initial library:", library)
  });
  
  function loadData() {
    // Get the container element for the cards and table
    const cardContainer = document.querySelector("#card-container");
  
    // Clear the existing cards and table rows
    if (cardContainer) {
      cardContainer.innerHTML = "";
    }
    tbody.innerHTML = "";
  
    // Get the data to load
    const data = isReadingListActive ? readingList : library;
  
    // Loop through the data and create cards and table rows for each book
    data.forEach((book) => {
      const card = createCard(book);
      cardContainer.appendChild(card);
  
      const row = createRow(book);
      tbody.appendChild(row);
    });
  }
  
   
  

  manualBtn.addEventListener("click", () => {
    const formContainer = document.createElement("div");
    formContainer.classList.add(
      "fixed",
      "z-50",
      "inset-0",
      "flex",
      "justify-center",
      "items-center"
    );

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

    const titleInput = createFormInput("Title", "text", "Unknown", "title");
    const authorInput = createFormInput("Author", "text", "Unknown", "author");
    const genreInput = createFormInput("Genre", "text", "Unknown", "genre");
    const descriptionInput = createFormInput(
      "Description",
      "textarea",
      "No description available",
      "description"
    );
    const coverInput = createFormInput(
      "Cover URL",
      "text",
      "https://via.placeholder.com/128x197?text=No%20Image",
      "coverURL"
    );
    const isbnInput = createFormInput(
      "ISBN #",
      "number",
      generateUniqueIdentifier(),
      "isbn"
    );
    const totalPagesInput = createFormInput(
      "Page Count",
      "text",
      "Unknown",
      "totalPages"
    );
    const pagesReadInput = createFormInput(
      "Pages Read",
      "number",
      "0",
      "pagesRead"
    );
    const isReadInput = createFormInput(
      "Is Read?",
      "checkbox",
      false,
      "isRead"
    );

    const closeButton = document.createElement("button");
    closeButton.classList.add(
      "absolute",
      "top-2",
      "right-2",
      "text-red-600",
      "hover:text-red-900"
    );
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      formContainer.remove();
      overlay.classList.add("hidden");
    });

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
    submitButton.textContent = "Add Book";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex", "justify-between", "mt-4");
    buttonContainer.append(closeButton, submitButton);

    form.append(
      closeButton,
      titleInput,
      authorInput,
      genreInput,
      descriptionInput,
      coverInput,
      isbnInput,
      totalPagesInput,
      pagesReadInput,
      isReadInput,
      buttonContainer
    );
    formContainer.appendChild(form);

    overlay.classList.remove("hidden");
    newBookModal.classList.add("hidden");
    document.body.appendChild(formContainer);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const title = formData.get("title") || "Unknown";
      const author = formData.get("author") || "Unknown";
      const genre = formData.get("genre") || "Unknown";
      const description = formData.get("description") || "Unknown";
      const coverURL =
        formData.get("coverURL") ||
        "https://via.placeholder.com/128x197?text=No%20Image";
      const isbn = formData.get("isbn") || generateUniqueIdentifier();
      const totalPages = formData.get("totalPages") || "Unknown";
      const pagesRead = formData.get("pagesRead") || 0;
      const isRead = formData.get("isRead") || false;
      const parsedtotalPages =
        totalPages === "Unknown" ? "Unknown" : parseInt(totalPages);
      addBookToLibrary(book);
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
      result.className =
        "flex justify-between p-2 border-b border-gray-300 g-5";
  
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
    const readingListButtons = searchResults.querySelectorAll(".add-reading-list");
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
    
  

  function addBookToLibrary(book) {
    library.push(book);

    localStorage.setItem("library", JSON.stringify(library));

    const newRow = createRow(book);
    const newCard = createCard(book); // Create a card for the card view


    newCard.querySelector(".bg-red-600").addEventListener("click", () => {
      deleteBook(book.isbn);
      localStorage.setItem("readingList", JSON.stringify(readingList));
    });

    cardContainer.appendChild(newCard);

    tbody.appendChild(newRow);

    tbody.addEventListener("click", (event) => {
      if (event.target.matches(".bg-red-600")) {
        deleteBook(book.isbn);
      }
    });

    const checkbox = newRow.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", (event) => {
      book.isRead = event.target.checked;
      localStorage.setItem("library", JSON.stringify(library));
    });
  }

  function createRow(book) {
    const row = document.createElement("tr");
    row.dataset.isbn = book.isbn;
    row.classList.add("text-white", "border-gray-600", "border-b");

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
    pagesReadInput.value = book.pagesRead; 
    pagesReadInput.classList.add("bg-blue-900", "w-16", "text-white");
    pagesReadInput.addEventListener("input", () => {
      if (
        parseInt(pagesReadInput.value) > parseInt(totalPagesCell.textContent)
      ) {
        pagesReadInput.value = totalPagesCell.textContent;
      }
    });
    pagesRead.appendChild(pagesReadInput);

    const totalPagesCell = document.createElement("td");
    totalPagesCell.textContent = book.totalPages;
    totalPagesCell.classList.add(
      "text-center",
      "px-2",
      "py-4",
      "border-gray-600",
      "border-r"
    );

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

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("flex", "gap-2", "ml-5");
    titleCell.appendChild(btnContainer);

    const addToReadingListBtn = document.createElement("button");
      addToReadingListBtn.className =
        "bg-green-600 text-white px-2 py-1 rounded";
      addToReadingListBtn.textContent = "Reading List";
      btnContainer.appendChild(addToReadingListBtn);
      addToReadingListBtn.addEventListener("click", () => {
        addBookToReadingList(book);
      })

    const deleteButton = document.createElement("button");
    deleteButton.className = "bg-red-600 text-white px-2 py-1 rounded";
    deleteButton.textContent = "Delete";
    btnContainer.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
      deleteBook(book.isbn);
    });

    row.appendChild(titleCell);
    row.appendChild(authorCell);
    row.appendChild(genreCell);
    row.appendChild(pagesRead);
    row.appendChild(totalPagesCell);
    row.appendChild(readCell);

    createRow.rowCounter = createRow.rowCounter ? createRow.rowCounter + 1 : 1;

    if (createRow.rowCounter % 2 === 0) {
      row.classList.add("bg-blue-800");
    } else {
      row.classList.add("bg-blue-700");
    }

    return row;
  }

  function createCard(book, row) {
    const MAX_DESCRIPTION_LENGTH = 100;

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

    const description = book.description
      ? book.description.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
      : "No description available";

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
      deleteBook(book.isbn); 
    });

    return card;
  }

  function addBookToReadingList(book) {
    const { isbn } = book;
    if (readingList.some(item => item.isbn === isbn)) {
      console.log("Book is already in the reading list");
      return;
    }
    readingList.push(book);
    localStorage.setItem("readingList", JSON.stringify(readingList));
  }
  
  

  function addBookToWishlist(book) {
    console.log(`Book added to Wishlist: ${title}`);
  }

  function deleteBook(isbn) {
    if (isReadingListActive) {
      const bookIndex = readingList.findIndex((book) => book.isbn === isbn);
      if (bookIndex !== -1) {
        readingList.splice(bookIndex, 1);
        localStorage.setItem("readingList", JSON.stringify(readingList));
        loadData();
      }
    } else {
      let bookIndex = library.findIndex((book) => book.isbn === isbn);
      if (bookIndex !== -1) {
        library.splice(bookIndex, 1);
        localStorage.setItem("library", JSON.stringify(library));
        loadData();
      }
      bookIndex = readingList.findIndex((book) => book.isbn === isbn);
      if (bookIndex !== -1) {
        readingList.splice(bookIndex, 1);
        localStorage.setItem("readingList", JSON.stringify(readingList));
        loadData();
      }
    }
  }
})
