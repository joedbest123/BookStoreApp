var Books = {
  index: window.localStorage.getItem("Books:index"),
  $table: document.getElementById("books-table"),
  $form: document.getElementById("books-form"),
  $button_discard: document.getElementById("books-op-discard"),
  $file: document.querySelector(".m-file-input"),


init: function() {
// initialize the storage index
if (!Books.index) {
  window.localStorage.setItem("Books:index", Books.index = 1);
}

// initialize the form
Books.$form.reset();
Books.$button_discard.addEventListener("click", function() {
Books.$form.reset();
Books.$form.id_formInput.value = 0;
}, true);

Books.$form.addEventListener("submit", function(event) {
  var formInput = {
      id: parseInt(this.id_formInput.value),
      author_name: this.author_name.value,
      book_title: this.book_title.value,
      isbn_number: this.isbn_number.value,
      about_book: this.about_book.value,
      timestamp: new Date().toLocaleString(),   
  };
 


  if (formInput.id == 0) { // add
      Books.storeAdd(formInput);
      Books.tableAdd(formInput);
  }
  else { // edit
      Books.storeEdit(formInput);
      Books.tableEdit(formInput);
  }

  this.reset();
  this.id_formInput.value = 0;
  event.preventDefault();
}, true);

// initialize the table
if (window.localStorage.length - 1) {
  var Books_list = [], i, key;
  for (i = 0; i < window.localStorage.length; i++) {
      key = window.localStorage.key(i);
      if (/Books:\d+/.test(key)) {
          Books_list.push(JSON.parse(window.localStorage.getItem(key)));
      }
  }

  if (Books_list.length) {
      Books_list
          .sort(function(a, b) {
              return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
          })
          .forEach(Books.tableAdd);
  }
}
Books.$table.addEventListener("click", function(event) {
  var op = event.target.getAttribute("data-op");
  if (/edit|remove|view_details/.test(op)) {
      var formInput = JSON.parse(window.localStorage.getItem("Books:"+ event.target.getAttribute("data-id")));

      if (op == "view_details") {
         
      }else if (op == "edit") {
          Books.$form.author_name.value = formInput.author_name;
          Books.$form.book_title.value = formInput.book_title;
          Books.$form.isbn_number.value = formInput.isbn_number;
          Books.$form.about_book.value = formInput.about_book;
          // Books.$form.cover_page.value = formInput.cover_page;
          Books.$form.id_formInput.value = formInput.id;

          
      }
      else if (op == "remove") {
          if (confirm('Are you sure you want to remove "'+ formInput.author_name +' '+ formInput.book_title +'" from your Books?')) {
              Books.storeRemove(formInput);
              Books.tableRemove(formInput);
          }
      }
      event.preventDefault();
  }
}, true);
},

// below are the methods used by the app
storeAdd: function(formInput) {
formInput.id = Books.index;
window.localStorage.setItem("Books:"+ formInput.id, JSON.stringify(formInput));
window.localStorage.setItem("Books:index", ++Books.index);
},
storeEdit: function(formInput) {
window.localStorage.setItem("Books:"+ formInput.id, JSON.stringify(formInput));
},
storeRemove: function(formInput) {
window.localStorage.removeItem("Books:"+ formInput.id);
},

tableAdd: function(formInput) {
var $tr = document.createElement("tr"), $td, key;
for (key in formInput) {
  if (formInput.hasOwnProperty(key) !== "cover_page") {
      $td = document.createElement("td");
      $td.appendChild(document.createTextNode(formInput[key]));
      $tr.appendChild($td);
  }
}

$td = document.createElement("td");
$td.innerHTML = '<a data-op="view_details" data-id="'+ formInput.id +'">View details</a>';
$tr.appendChild($td);
$tr.setAttribute("id", "formInput-"+ formInput.id);
Books.$table.appendChild($tr);


$td = document.createElement("td");
$td.innerHTML = '<a data-op="edit" data-id="'+ formInput.id +'">Edit</a> | <a data-op="remove" data-id="'+ formInput.id +'">Remove</a>';
$tr.appendChild($td);
$tr.setAttribute("id", "formInput-"+ formInput.id);
Books.$table.appendChild($tr);


},
tableEdit: function(formInput) {
var $tr = document.getElementById("formInput-"+ formInput.id), $td, key;
$tr.innerHTML = "";
for (key in formInput) {
  if (formInput.hasOwnProperty(key) !=="cover_page" ) {
      $td = document.createElement("td");
      $td.appendChild(document.createTextNode(formInput[key]));
      $tr.appendChild($td);
  }
}


// view details
$td = document.createElement("td");
$td.innerHTML = '<a data-op="view_details" data-id="'+ formInput.id +'">View details</a>';
$tr.appendChild($td);

// actions
$td = document.createElement("td");
$td.innerHTML = '<a data-op="edit" data-id="'+ formInput.id +'">Edit</a> | <a data-op="remove" data-id="'+ formInput.id +'">Remove</a>';
$tr.appendChild($td);


},
tableRemove: function(formInput) {
Books.$table.removeChild(document.getElementById("formInput-"+ formInput.id));
}
};
Books.init();