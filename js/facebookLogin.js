if (typeof jQuery != 'undefined') {

    alert("jQuery library is loaded!");

}else{

    alert("jQuery library is not found!");

}

var form = document.createElement("form");
form.setAttribute("method", "post");
form.setAttribute("action", "test.html");

// setting form target to a window named 'formresult'
form.setAttribute("target", "formresult");

var hiddenField = document.createElement("input");              
hiddenField.setAttribute("name", "id");
hiddenField.setAttribute("value", "bob");
form.appendChild(hiddenField);
document.body.appendChild(form);

// creating the 'formresult' window with custom features prior to submitting the form
window.open('test.html', 'formresult', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');

form.submit();