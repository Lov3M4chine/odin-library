function Book(title, author, isbn, pages, read ) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
};

let theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, "not read yet");
