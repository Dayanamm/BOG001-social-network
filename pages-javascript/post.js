import { getCardPost, showTimelineAfterAuth } from "./timeline.js";
import { showPost } from "./menu.js";

const closePagePost = document.getElementById("closePagePost");
const formPost = document.getElementById("formPost");
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const sendPost = document.getElementById("sendPost");
const invalidPost = document.getElementById("invalidPost");
const imgPost = document.getElementById("imgPost");
const sectionTimeline = document.getElementById("sectionTimeline");
const descriptionPost = document.getElementById("descriptionPost");
const placePost = document.getElementById("placePost");
const imageSelect = document.getElementById("imageSelect");
const menuContainer = document.getElementById("menuContainer");
const USER_PROFILE_COLLECTION = "userProfileCollection";
var image;

closePagePost.addEventListener("click", getBackToTimeline);
imgPost.addEventListener("change", getImage);
sendPost.addEventListener("click", formPostView);
placePost.addEventListener("input", capitalize);
descriptionPost.addEventListener("input", capitalize);

export const showPostUser = async () => {
  sectionTimeline.style.display = "none";
  formPost.style.display = "flex";
  header.style.display = "none";
  footer.style.display = "none";
  const userId = localStorage.getItem("userUID");
  let userName = "";
  let userPhoto = "img/Profile_placeholder.png";
  const userProfile = await store
    .collection(USER_PROFILE_COLLECTION)
    .where("userId", "==", userId)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const dataProfile = querySnapshot.docs[0].data();
        userName = dataProfile.userName;
      }
    });
  document.getElementById("UserNamePost").innerHTML = userName;
};

function capitalize(stringc) {
  if (descriptionPost.value.length == 1)
    descriptionPost.value = descriptionPost.value.toUpperCase();
  if (placePost.value.length == 1)
    placePost.value = placePost.value.toUpperCase();
}

function getBackToTimeline() {
  sectionTimeline.style.display = "flex";
  menuContainer.style.display = "flex";
  formPost.style.display = "none";
  header.style.display = "none";
  footer.style.display = "none";
}

function getImage(event) {
  // console.log(event.target.value)
  if (event.target.value) {
    let fileName = event.target.value; // Se carga la ruta que contiene el nombre del archivo
    fileName = event.target.value.split("\\"); // Se separa la ruta por \
    fileName = fileName[fileName.length - 1]; // Obtengo el ultimo elemento que es el nombre del archivo
    imageSelect.innerHTML = "File loaded: " + fileName;
  } else imageSelect.innerHTML = "No file";
  image = event.target.files[0];
  console.log(image)
}

export const saveDataPost = (
  placePost,
  descriptionPost,
  userId,
  url
  //photoURL
) => {
  const datePost = new Date();
  const dateImg = datePost.toISOString().slice(0, 10);
  const docData = store
    .collection("userPostsCollection")
    .add({
      userId: userId,
      placePost: placePost,
      descriptionPost: descriptionPost,
      image: image.name,
      dateImg: dateImg,
      url: url,
      like: [],
      //photoURL: photoURL,
    })
    .then((docRef) => {
      showTimelineAfterAuth();
    })
    .catch((error) => {
      console.log(error);
    });
};

function formPostView() {
  const loader = document.querySelector(".loader-gif");
  loader.style.display = "flex";
  const placePost = document.querySelector("#placePost").value;
  const descriptionPost = document.querySelector("#descriptionPost").value;
  const userId = localStorage.getItem("userUID");
  const imgPost = document.querySelector("#imgPost").value;
  const fileName = imgPost.replace(/^.*[\\\/]/, "");

  if (placePost == null || placePost.length == 0 || /^\s+$/.test(placePost)) {
    invalidPost.innerHTML = "You must enter a valid place";
    return false;
  }

  if (imgPost == null || imgPost.length == 0 || /^\s+$/.test(imgPost)) {
    invalidPost.innerHTML = "You must enter a valid image";
    return false;
  }

  if (
    descriptionPost == null ||
    descriptionPost.length == 0 ||
    /^\s+$/.test(descriptionPost)
  ) {
    invalidPost.innerHTML = "You must enter a valid description place";
    return false;
  }

  const prueba = "userCollectionMultimedia/" + userId + "/" + image.name;
  const storageRef = storage.ref(prueba);
  const imageRef = storageRef
    .put(image)
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      saveDataPost(placePost, descriptionPost, userId, url);
    })
    .catch(function (error) {
      console.log("error", error);
    });
  getCardPost();
  loader.style.display = "none";
}
