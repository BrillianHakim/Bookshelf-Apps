(() => {
  // Array untuk menyimpan daftar buku
  let books = [];

  // Fungsi untuk menambahkan buku baru
  function addBook(event) {
    event.preventDefault(); // Mencegah halaman refresh setelah submit form

    // Mengambil nilai dari input form
    const titleInput = document.querySelector("#inputBookTitle");
    const authorInput = document.querySelector("#inputBookAuthor");
    const yearInput = document.querySelector("#inputBookYear");
    const isCompleteInput = document.querySelector("#inputBookIsComplete");

    // Validasi input
    if (!titleInput.value || !authorInput.value || !yearInput.value) {
      alert("Semua kolom harus diisi!");
      return;
    }

    // Membuat objek buku baru dengan memastikan year adalah number
    const newBook = {
      id: +new Date(), // ID unik berdasarkan timestamp
      title: titleInput.value,
      author: authorInput.value,
      year: parseInt(yearInput.value),
      isComplete: isCompleteInput.checked,
    };

    console.log(newBook); // Log buku baru ke console
    books.push(newBook); // Tambahkan buku ke array books
    document.dispatchEvent(new Event("bookChanged")); // Trigger event 'bookChanged'
  }

  // Fungsi untuk mencari buku berdasarkan judul
  function searchBook(event) {
    event.preventDefault(); // Mencegah halaman refresh setelah submit form

    // Mengambil nilai pencarian dari input
    const searchInput = document.querySelector("#searchBookTitle");
    const query = searchInput.value;

    if (query) {
      updateBookList(
        books.filter((book) =>
          book.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      updateBookList(books); // Jika query kosong, tampilkan semua buku
    }
  }

  // Fungsi untuk menandai buku sebagai selesai dibaca
  function markAsComplete(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books[bookIndex].isComplete = true;
      document.dispatchEvent(new Event("bookChanged")); // Trigger event 'bookChanged'
    }
  }

  // Fungsi untuk menandai buku sebagai belum selesai dibaca
  function markAsIncomplete(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books[bookIndex].isComplete = false;
      document.dispatchEvent(new Event("bookChanged")); // Trigger event 'bookChanged'
    }
  }

  // Fungsi untuk menghapus buku dari daftar
  function deleteBook(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event("bookChanged")); // Trigger event 'bookChanged'
    }
  }

  // Fungsi untuk memperbarui tampilan daftar buku
  function updateBookList(booksToUpdate) {
    const incompleteBookList = document.querySelector(
      "#incompleteBookshelfList"
    );
    const completeBookList = document.querySelector("#completeBookshelfList");

    // Kosongkan elemen daftar buku
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    for (const book of booksToUpdate) {
      // Buat elemen artikel untuk setiap buku
      const bookElement = document.createElement("article");
      bookElement.classList.add("book_item");

      const titleElement = document.createElement("h2");
      titleElement.innerText = book.title;

      const authorElement = document.createElement("p");
      authorElement.innerText = "Penulis: " + book.author;

      const yearElement = document.createElement("p");
      yearElement.innerText = "Tahun: " + book.year;

      // Tambahkan elemen ke artikel buku
      bookElement.appendChild(titleElement);
      bookElement.appendChild(authorElement);
      bookElement.appendChild(yearElement);

      const actionContainer = document.createElement("div");
      actionContainer.classList.add("action");

      if (book.isComplete) {
        // Jika buku selesai dibaca, tambahkan ke daftar selesai
        const incompleteButton = document.createElement("button");
        incompleteButton.id = book.id;
        incompleteButton.innerText = "Belum Selesai dibaca";
        incompleteButton.classList.add("green");
        incompleteButton.addEventListener("click", markAsIncomplete);

        const deleteButton = document.createElement("button");
        deleteButton.id = book.id;
        deleteButton.innerText = "Hapus buku";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", deleteBook);

        actionContainer.appendChild(incompleteButton);
        actionContainer.appendChild(deleteButton);

        bookElement.appendChild(actionContainer);
        completeBookList.appendChild(bookElement);
      } else {
        // Jika buku belum selesai dibaca, tambahkan ke daftar belum selesai
        const completeButton = document.createElement("button");
        completeButton.id = book.id;
        completeButton.innerText = "Selesai dibaca";
        completeButton.classList.add("green");
        completeButton.addEventListener("click", markAsComplete);

        const deleteButton = document.createElement("button");
        deleteButton.id = book.id;
        deleteButton.innerText = "Hapus buku";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", deleteBook);

        actionContainer.appendChild(completeButton);
        actionContainer.appendChild(deleteButton);

        bookElement.appendChild(actionContainer);
        incompleteBookList.appendChild(bookElement);
      }
    }
  }

  // Fungsi untuk menyimpan daftar buku ke localStorage dan memperbarui tampilan
  function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
    updateBookList(books);
  }

  // Event listener untuk memuat daftar buku dari localStorage saat halaman dimuat
  window.addEventListener("load", () => {
    books = JSON.parse(localStorage.getItem("books")) || [];
    updateBookList(books);

    const addBookForm = document.querySelector("#inputBook");
    const searchBookForm = document.querySelector("#searchBook");

    // Event listener untuk form tambah buku
    addBookForm.addEventListener("submit", addBook);

    // Event listener untuk form cari buku
    searchBookForm.addEventListener("submit", searchBook);

    // Event listener untuk event 'bookChanged'
    document.addEventListener("bookChanged", saveBooks);
  });
})();
