import { showMyProfile } from "./my-profile.js";
import { showTimelineAfterAuth } from "./timeline.js";

const menuContainer = document.querySelector("#menuContainer");
const sectionTimeline = document.querySelector("#sectionTimeline");
const formPost = document.querySelector("#formPost");
const sectionSignin = document.querySelector("#sectionSignin");
const sectionLogin = document.querySelector("#sectionLogin");
const sectionMyProfile = document.getElementById("sectionMyProfile");
const hamburger = document.querySelector(".hamburger");
const menu = document.getElementById("menuUList");
const USER_PROFILE_COLLECTION = "userProfileCollection";

export const showHamburgerAfterLogin = () => {
  menuContainer.style.display = "flex";
  sectionSignin.style.display = "none";
  sectionLogin.style.display = "none";
};

export const hideHamburguerBeforePost = () => {
  menuContainer.style.display = "none";
  formPost.style.display = "flex";
  sectionTimeline.style.display = "none";
};

export const showHamburguerAfterPost = () => {
  menuContainer.style.display = "flex";
  formPost.style.display = "none";
  sectionTimeline.style.display = "flex";
};

hamburger.addEventListener("click", menuHamburguer);

function menuHamburguer() {
  hamburger.classList.toggle("is-active");
  /*  document.html.style.backgroundColor = "red"; */
  /* document.getElementById("sectionBackground").style.backgroundColor =
    "lightblue"; */
}

document.addEventListener("DOMContentLoaded", function (event) {
  document
    .getElementById("timelineButton")
    .addEventListener("click", showTimelineAfterAuth);
  document
    .getElementById("logOutButton")
    .addEventListener("click", function () {
      localStorage.removeItem("userUID");
      location.reload();
    });
  document.getElementById("postButton").addEventListener("click", showPost);
  document
    .getElementById("myProfileButton")
    .addEventListener("click", showMyProfile);
  document
    .querySelector(".menu-container")
    .addEventListener("click", function () {
      if (menu.classList[0] === "showing") {
        document.getElementById("menuUList").classList.remove("showing");
      } else {
        document.getElementById("menuUList").className = "showing";
      }
    });

  document.querySelectorAll('li[name="menuItem"').forEach((item) => {
    item.addEventListener("click", function () {
      document.getElementById("menuUList").classList.remove("showing");
    });
  });
});

export async function showPost() {
  // export function showPost() {
  let mediaqueryList = window.matchMedia("(max-width: 500px)");
  sectionTimeline.style.display = "none";
  formPost.style.display = "flex";
  sectionMyProfile.style.display = "none";
  header.style.display = "none";
  if(mediaqueryList.matches) {
    footer.style.display = "none";
    console.log("entra");
  }
  else {
    footer.style.display = "block";
    console.log("sale");
  }
  
  hideHamburguerBeforePost();

  const userId = localStorage.getItem("userUID");
  let userName = "";
  let userPhoto = "/img/Profile_placeholder.png";
  const userProfile = await store
    .collection(USER_PROFILE_COLLECTION)
    .where("userId", "==", userId)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const dataProfile = querySnapshot.docs[0].data();
        userName = dataProfile.userName;
        if (dataProfile.picture) {
          userPhoto = dataProfile.picture;
        }
      }
    });
  document.getElementById("UserNamePost").innerHTML = userName;
  document.getElementById("imagePostUser").src = userPhoto;
}
