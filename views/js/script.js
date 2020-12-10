//script.js

function showNav() {
  var nav = document.querySelector(".hiddenNav");
  if (nav.style.display === "" || nav.style.display === "none") {
    nav.style.display = "block";
  } else {
    nav.style.display = "none";
  }
}

function closeNav() {
  var nav = document.querySelector(".hiddenNav");
  nav.style.display = "none";
}

function openForm() {
  var form = document.querySelector(".searchForm");
  if (form.style.display === "" || form.style.display === "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

function closeForm() {
  var form = document.querySelector(".searchForm");
  form.style.display = "none";
}

var numOfGuest = document.querySelector("#guests");
function incrementGuest() {
  var value = parseInt(numOfGuest.value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  numOfGuest.value = value;
  console.log(numOfGuest.value);
}

function decrementGuest() {
  var value = parseInt(numOfGuest.value, 10);
  value = isNaN(value) ? 0 : value;
  if (value > 0) {
    value--;
  } else {
    value = 0;
  }
  numOfGuest.value = value;
  console.log(numOfGuest.value);
  calculateSubtotal();
}


function closeSignupForm() {
  var signupform = document.querySelector(".signup-container");
  signupform.style.display = "none";
  var form = document.forms["signup"];
  form.reset();
  clearErrorMessages();
}

function closeSigninForm() {
  var signinform = document.querySelector(".signin-container");
  signinform.style.display = "none";
  var form = document.forms["signin"];
  form.reset();
  clearErrorMessages();
}

function openSignupForm() {
  closeSigninForm();
  closeNav();
  var signupform = document.querySelector(".signup-container");
  if (signupform.style.display === "" || signupform.style.display === "none") {
    signupform.style.display = "block";
  } else {
    signupform.style.display = "none";
  }
}

function openSigninForm() {
  closeSignupForm();
  closeNav();
  var signinform = document.querySelector(".signin-container");
  if (signinform.style.display === "" || signinform.style.display === "none") {
    signinform.style.display = "block";
  } else {
    signinform.style.display = "none";
  }
}

var searchBtn = document.querySelector("#searchBtn");
searchBtn.addEventListener("click", openForm);

/********************************************************** */

//FORM VALIDATION//

var signinform = document.forms["signin"];
var signupform = document.forms["signup"];

//signin inputs
var uname = signinform["username"];
var pw = signinform["password"];

//signup inputs
var email = signupform["email"];
var fname = signupform["fname"];
var lname = signupform["lname"];
var password = signupform["password"];
var pwConfirm = signupform["passwordConfirm"];
var bday = signupform["birthday"];

//signin error messages
var uerr = document.getElementById("uerr");
var pwerr = document.getElementById("pwerr");

//signup error messages
var emailerr = document.getElementById("emailerr");
var fnerr = document.getElementById("fnerr");
var lnerr = document.getElementById("lnerr");
var passworderr = document.getElementById("passworderr");
var pwConfirmerr = document.getElementById("pwConfirmerr");
var bdayerr = document.getElementById("bdayerr");

//regex pattern
var namePattern = "^[a-zA-Z].*"; //only letter
var pwPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
//at least one number, one lower, one upper, 6-16chars

//signin validation
function validateSignInForm() {
  var uerr = document.getElementById("uerr");
  var pwerr = document.getElementById("pwerr");
  if (uname.value == null || pw.value == null || uname.value == "" || pw.value == "") {
    if (!uerr && !pwerr) {
      var div1 = document.createElement("div");
      var p1 = document.createElement("p");
      var node1 = document.createTextNode("* User name must be filled out");
      p1.appendChild(node1);
      div1.appendChild(p1);
      div1.setAttribute("id", "uerr");
      div1.setAttribute("class", "errormsg");
      signinform.appendChild(div1);

      var div2 = document.createElement("div");
      var p2 = document.createElement("p");
      var node2 = document.createTextNode("* Password must be filled out");
      p2.appendChild(node2);
      div2.appendChild(p2);
      div2.setAttribute("id", "pwerr");
      div2.setAttribute("class", "errormsg");
      signinform.appendChild(div2);
    }
    return false;
  }
  if (!pw.value.match(pwPattern))//if the values are not null
  {
    //password check with pattern
    var div3 = document.createElement("div");
    var p3 = document.createElement("p");
    var node3 = document.createTextNode("* Password - 6-16 characters. At least 1 lower, uppercase and number");
    p3.appendChild(node3);
    div3.appendChild(p3);
    div3.setAttribute("id", "pwDetailerr");
    div3.setAttribute("class", "errormsg");
    let x = document.getElementById("uerr");
    let y = document.getElementById("pwerr");
    let z = document.getElementById("pwDetailerr");
    signinform.appendChild(div3);
    if (uerr)
      x.parentNode.removeChild(x);
    if (pwerr)
      y.parentNode.removeChild(y);
    if (pwDetailerr)
      z.parentNode.removeChild(z);
    return false;
  }
  else {
    let x = document.getElementById("uerr");
    let y = document.getElementById("pwerr");
    let z = document.getElementById("pwDetailerr");
    if (uerr)
      x.parentNode.removeChild(x);
    if (pwerr)
      y.parentNode.removeChild(y);
    if (pwDetailerr)
      z.parentNode.removeChild(z);
  }
}

//validate signup form
function validateSignUpForm() {//checking nulls

  var flag = document.getElementById("flag");

  if (email.value == null || fname.value == null || lname.value == null ||
    password.value == null || pwConfirm.value == null ||
    email.value == "" || password.value == "" || pwConfirm.value == "" ||
    birthday.value == "") {
    if (!flag) {
      var div1 = document.createElement("div");
      var div2 = document.createElement("div");
      var div3 = document.createElement("div");
      var div4 = document.createElement("div");
      var div5 = document.createElement("div");
      var div6 = document.createElement("div");
      var p1 = document.createElement("p");
      var p2 = document.createElement("p");
      var p3 = document.createElement("p");
      var p4 = document.createElement("p");
      var p5 = document.createElement("p");
      var p6 = document.createElement("p");

      p1.textContent = "* Email must be filled out";
      p2.textContent = "* First name must be filled out";
      p3.textContent = "* Last name must be filled out";
      p4.textContent = "* Password must be filled out";
      p5.textContent = "* Password Confirm must be filled out";
      p6.textContent = "* Birthday must be filled out";

      div1.appendChild(p1);
      div2.appendChild(p2);
      div3.appendChild(p3);
      div4.appendChild(p4);
      div5.appendChild(p5);
      div6.appendChild(p6);

      div1.setAttribute("class", "errormsg");
      div2.setAttribute("class", "errormsg");
      div3.setAttribute("class", "errormsg");
      div4.setAttribute("class", "errormsg");
      div5.setAttribute("class", "errormsg");
      div6.setAttribute("class", "errormsg");
      div6.setAttribute("id", "flag");

      signupform.appendChild(div1);
      signupform.appendChild(div2);
      signupform.appendChild(div3);
      signupform.appendChild(div4);
      signupform.appendChild(div5);
      signupform.appendChild(div6);
    }
    return false;
  }
  else {
    clearErrorMessages();
  }
}


//fname validation {a-zA-Z}
function fnameValidation() {
  var fnerr = document.getElementById("fnerr");
  if (!fname.value.match(namePattern)) {
    if (!fnerr) {
      var div = document.createElement("div");
      var p = document.createElement("p");
      var node = document.createTextNode("* Only letters allowed for the first name");
      p.appendChild(node);
      div.appendChild(p);
      signupform.appendChild(div);
      div.setAttribute("class", "eacherror");
      div.setAttribute("id", "fnerr");
    }
    return false;
  }
  else {
    var x = document.getElementById("fnerr");
    x.parentNode.removeChild(x);
  }
}
//lanme validation {a-zA-Z}
function lnameValidation() {
  var lnerr = document.getElementById("lnerr");
  if (!lname.value.match(namePattern)) {
    if (!lnerr) {
      var div = document.createElement("div");
      var p = document.createElement("p");
      var node = document.createTextNode("* Only letters allowed for the last name");
      p.appendChild(node);
      div.appendChild(p);
      signupform.appendChild(div);
      div.setAttribute("class", "eacherror");
      div.setAttribute("id", "lnerr");
    }
    return false;
  }
  else {
    var x = document.getElementById("lnerr");
    x.parentNode.removeChild(x);
  }
}
//password validdation {at least one lower,upper,digit; 6-16chars}
function pwValidation() {
  var passworderr = document.getElementById("passworderr");
  if (!password.value.match(pwPattern)) {
    if (!passworderr) {
      var div = document.createElement("div");
      var p1 = document.createElement("p");
      p1.textContent = "* Password - 6-16 characters. At least 1 lower, uppercase and number";
      div.appendChild(p1);
      div.setAttribute("id", "passworderr");
      div.setAttribute("class", "eacherror");
      signupform.appendChild(div);
    }
    return false;
  }
  else {
    var x = document.getElementById("passworderr");
    x.parentNode.removeChild(x);
  }
}
//password confirm validation {match with password}
function pwConfirmValidation() {
  var pwConfirmerr = document.getElementById("pwConfirmerr");
  if (passwordConfirm.value != password.value || passwordConfirm == "" || passwordConfirm == null) {
    if (!pwConfirmerr) {
      var div = document.createElement("div");
      var p = document.createElement("p");
      p.textContent = "* Password Confirm must match with the password";
      div.appendChild(p);
      signupform.appendChild(div);
      div.setAttribute("id", "pwConfirmerr");
      div.setAttribute("class", "eacherror");
    }
    return false;
  }
  else {
    var x = document.getElementById("pwConfirmerr");
    x.parentNode.removeChild(x);
  }
}

//bday validation {max: before today}
function bdayValidation() {
  var bday = document.getElementById("birthday");
  var yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
  var dd = yesterday.getDate();
  var mm = yesterday.getMonth() + 1;
  var yyyy = yesterday.getFullYear();
  if (dd < 10)
    dd = '0' + dd;
  if (mm < 10)
    mm = '0' + mm;
  yesterday = [yyyy, mm, dd].join('-');


  bday.setAttribute("max", yesterday);
  var x = document.getElementById("birthday").max;

}



//clear error messages
function clearErrorMessages() {
  // var eacherror = document.getElementsByClassName("eacherror");
  var errmsgs = document.getElementsByClassName("errormsg");
  while (errmsgs.length > 0) {
    errmsgs[0].parentNode.removeChild(errmsgs[0]);
  }
  // while(eacherror.length > 0)
  // {
  //   eacherror[0].parentNode.removeChild(eacherror[0]);
  // }
}

function clearEachErrorMessages() {
  var eacherror = document.getElementsByClassName("eacherror");

  while (eacherror.length > 0) {
    eacherror[0].parentNode.removeChild(eacherror[0]);
  }
}

function calculateSubtotal() {
  var subtotal = 0;
  var pricePerNight = document.querySelector("#pricePerNight");
  var pricePerNightValue = pricePerNight.value;

  var checkindate = new Date(document.querySelector("#checkin").value);
  var checkoutdate = new Date(document.querySelector("#checkout").value);
  var numOfDays = checkoutdate.getTime() - checkindate.getTime();
  numOfDays = numOfDays / (1000 * 3600 * 24);

  console.log(`numOfDays: ${numOfDays}`);


  subtotal = pricePerNightValue * numOfDays;
  console.log(`subtotal: $${subtotal}`)

  var subtotalinput = document.querySelector("#subtotal");
  subtotalinput.value = subtotal;

  calculateTax(subtotal);

}

function calculateTax(subtotal) {
  var calculatedTax = subtotal * 0.13;
  var taxinput = document.querySelector("#tax");
  taxinput.value = calculatedTax.toFixed(2);

  console.log(`calculated tax: ${calculatedTax}`);
  calculateTotal(subtotal, calculatedTax);
}

function calculateTotal(subtotal, tax) {
  var total = subtotal + tax + 20;
  console.log(`${subtotal} + ${tax} + ${cleaningfee.value}`);
  var totalinput = document.querySelector("#total");
  totalinput.value = total;
  console.log(`total: $${total}`);

}