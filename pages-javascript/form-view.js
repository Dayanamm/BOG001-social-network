import { showTimelineAfterAuth, loadTimeline } from "./timeline.js";
import { showHamburgerAfterLogin } from "./menu.js";

const sectionLogin = document.getElementById("sectionLogin");
const sectionSignin = document.getElementById("sectionSignin");
const signinView = document.getElementById("signinView");
const loginView = document.getElementById("loginView");
const signin = document.getElementById("signin");
const login = document.getElementById("login");
const warnUser = document.getElementById("warnUser");
const warnNoExist = document.getElementById("warnNoExist");
const signGoogle = document.getElementById("signGoogle");
const loginGoogle = document.getElementById("loginGoogle");
const sectionPost = document.getElementById("formPost");
const sectionTimeline = document.getElementById("sectionTimeline");
// const sectionPost = Document.getElementById("sectionPost");
const sectionMyProfile = document.getElementById("sectionMyProfile");
const userId = localStorage.getItem("userUID");
const USER_PROFILE_COLLECTION = "userProfileCollection";
const header = document.getElementById("header");
const footer = document.getElementById("footer");

// console.log(userId)
if (userId) {
  sectionTimeline.style.display = "flex";
  loadTimeline();
  showHamburgerAfterLogin();
  header.style.display = "none";
  footer.style.display = "none";
} else {
  sectionLogin.style.display = "block";
}

sectionSignin.style.display = "none";
sectionPost.style.display = "none";
sectionMyProfile.style.display = "none";
signinView.addEventListener("click", returnSignin);
loginView.addEventListener("click", changeView);
signin.addEventListener("click", formAuth);
login.addEventListener("click", loginAuth);
signGoogle.addEventListener("click", googleAuth);
loginGoogle.addEventListener("click", googleAuth);

function changeView() {
  sectionSignin.style.display = "block";
  sectionLogin.style.display = "none";
  warnUser.innerHTML = "";
  warnNoExist.innerHTML = "";
}

function returnSignin() {
  sectionSignin.style.display = "none";
  sectionLogin.style.display = "block";
  warnUser.innerHTML = "";
  warnNoExist.innerHTML = "";
}

function formAuth() {
  const user = document.querySelector("#user").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const confirm = document.querySelector("#confirm").value;

  if (user == null || user.length == 0 || /^\s+$/.test(user)) {
    warnUser.innerHTML = "You must enter a valid user name";
    return false;
  }

  if (email == null || email.length == 0 || /^\s+$/.test(email)) {
    warnUser.innerHTML = "You must enter a valid email ";
    return false;
  }

  if (password == null || password.length == 0 || /^\s+$/.test(password)) {
    warnUser.innerHTML = "You must enter a valid password";
    return false;
  }

  if (confirm == null || confirm.length == 0 || /^\s+$/.test(confirm)) {
    warnUser.innerHTML = "You must enter password confirmation";
    return false;
  }

  if (password != confirm) {
    signin.disables = true;
    warnUser.innerHTML = "Passwords don't match";
    return false;
  }

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      warnUser.style.display = "none";
      sectionSignin.style.display = "none";
      sectionLogin.style.display = "none";
      sectionPost.style.display = "none";
      sectionTimeline.style.display = "flex";
      const uid = userCredential.user.uid;
      localStorage.setItem("userUID", uid);
      store
        .collection(USER_PROFILE_COLLECTION)
        .add({
          userId: uid,
          userName: user,
          picture: "",
          //photoURL: photoURL,
        })
        .then((docRef) => {
          showTimelineAfterAuth();
          showHamburgerAfterLogin();
        })
        .catch((error) => {
          console.log(error);
        });
      //console.log("sign up");
    })
    .catch((error) => {
      warnUser.innerHTML = "User already exist";
      // console.log ("warnUser");
    });
}

function loginAuth() {
  const email = document.querySelector("#emailLogin").value;
  const password = document.querySelector("#passwordLogin").value;

  if (email == null || email.length == 0 || /^\s+$/.test(email)) {
    warnNoExist.innerHTML = "You must enter a valid email ";
    return false;
  }

  if (password == null || password.length == 0 || /^\s+$/.test(password)) {
    warnNoExist.innerHTML = "You must enter a valid password";
    return false;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      warnNoExist.innerHTML = " ";
      sectionSignin.style.display = "none";
      sectionLogin.style.display = "none";
      sectionPost.style.display = "none";
      sectionTimeline.style.display = "flex";
      const uid = userCredential.user.uid;
      localStorage.setItem("userUID", uid);
      showTimelineAfterAuth();
      showHamburgerAfterLogin();
      localStorage.setItem("userPhoto", user.photoURL); // Guardamos en el Local Storage la foto
      localStorage.setItem("userName", user.displayName);
      //mostrar gif
      const loader = document.querySelector(".loader-gif");
      loader.style.display = "flex";
      loader.style.display = "none";
    })
    .catch((error) => {
      warnNoExist.innerHTML = "Incorrect password or email";
    });
}

function googleAuth() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.email");

  auth
    .signInWithPopup(provider)
    .then(function (result) {
      const token = result.credential.accesstoken;
      const user = result.user; // Esta variable contiene la data del usuario
      sectionSignin.style.display = "none";
      sectionLogin.style.display = "none";
      sectionPost.style.display = "none";
      sectionTimeline.style.display = "flex";
      const uid = user.uid;
      localStorage.setItem("userUID", uid);
      store
        .collection(USER_PROFILE_COLLECTION)
        .add({
          userId: uid,
          userName: user.displayName,
          picture: user.photoURL,
          //photoURL: photoURL,
        })
        .then((docRef) => {
          showTimelineAfterAuth();
          showHamburgerAfterLogin();
        })
        .catch((error) => {
          console.log(error);
        });
      localStorage.setItem("userPhoto", user.photoURL); // Guardamos en el Local Storage la foto
      localStorage.setItem("userName", user.displayName); // Guardamos en el Local Storage el nombre del usuario
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const errorEmail = error.email;
      const errorCredential = error.credential;

      if (errorCode === "auth/account-exists-with-different-credential") {
        warnUser.innerHTML = "User already exist";
      }
    });
}
