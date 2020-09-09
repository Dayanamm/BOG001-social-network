import { showPostUser, saveDataPost } from "./post.js";
//import { hideHamburguerBeforePost, showHamburgerAfterLogin } from "./menu.js";

const USER_PROFILE_COLLECTION = "userProfileCollection";
const USER_POSTS_COLLECTION = "userPostsCollection";
const sectionTimeline = document.getElementById("sectionTimeline");
const sectionMyProfile = document.getElementById("sectionMyProfile");
const formPost = document.getElementById("formPost");
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const userId = localStorage.getItem("userUID");

export const showMyProfile = () => {
  sectionMyProfile.style.display = "flex";
  sectionTimeline.style.display = "none";
  formPost.style.display = "none";
  header.style.display = "none";
  footer.style.display = "none";
  loadMyProfile();
};

export const loadMyProfile = async () => {
  const userId = localStorage.getItem("userUID");
  const querySnapshot = await store
    .collection(USER_POSTS_COLLECTION)
    .where("userId", "==", userId)
    .get();

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
        if (dataProfile.picture) {
          userPhoto = dataProfile.picture;
        }
      }
    });

  sectionMyProfile.innerHTML = ` 
            <div class = "header-profile">
              <img src="img/Logo.png" alt="Logo" class="logo-profile" >
              <h1>Profile</h1>
            </div>
            <div id="userHead" class="user-head-profile"> 
                  <img src="${userPhoto}" alt="profile image" />
                  <span>${userName}</span>
            </div>`;

  let index = 0;
  let displayOff = "display: flex;";
  let displayOn = "display: none;";
  let displayDelete = "display: none;";
  let displayEdit = "display: none;";

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const cardPost = querySnapshot.docs[i].data();
    const likeOnId = "likeOnProfile" + index;
    const likeOffId = "likeOffProfile" + index;
    const crudEditId = "crudProfile" + index;
    const modalId = "openModalProfile" + index;
    const modalEditId = "ModalEdit" + index;
    const modalContainer = "modalContainerId" + index;
    const modalContainerEdit = "modalContainerEditId" + index;
    const cancelId = "cancelModalProfile" + index;
    const editButton = "editButtonProfile" + index;
    const cancelEditId = "cancelModalEdit" + index;
    const deleteButtonId = "deleteButton" + index;
    const editButtonId = "editButton" + index;
    const placeEditPostId = "placeEditPostId" + index;
    const descriptionEditPostId = "descriptionEditPostId" + index;
    const imgPostId = "imgPostIdof" + index;
    const invalidPostId = "invalidPost" + index;
    displayOff = "display: flex;";
    displayOn = "display: none;";
    displayDelete = "display: none;";
    displayEdit = "display: none;";

    for (let i = 0; i < cardPost.like.length; i++) {
      if (cardPost.like[i] == userId) {
        displayOff = "display: none;";
        displayOn = "display: flex;";
        break;
      }
    }

    sectionMyProfile.innerHTML += `
            <div id="cardPostContainer" class="card-post-container-profile">
              <div id="headerCard" class="header-card">
                <img src="${cardPost.url}" alt="Post image" />
                <p>${cardPost.placePost}</p>
              </div>
              <div id="descriptionCard" class="description-card">
                <p id="descriptionCardDate">${cardPost.dateImg}</p>
                <p>${cardPost.descriptionPost}</p>
              <div class="container-like">
                <button id="${likeOffId}" post-id="${querySnapshot.docs[i].id}" style="${displayOff}" class="btn-unlike"><img src="img/LikeOff.png" alt="LikeOff" class="like-off" ></button>
                <button id="${likeOnId}" post-id="${querySnapshot.docs[i].id}" style="${displayOn}" class="btn-like"><img src="img/LikeOn.png" alt="LikeOn" class="like-on" ></button>
                <p>${cardPost.like.length}</p>
                <div class = "button-crud">
                  <button id="${crudEditId}" class="btn-crud"><img src="img/lapiz.png" alt="pencilCRUD" class="pencil-crud"></button>
                  <button id="${modalId}" post-id="${querySnapshot.docs[i].id}" class="delete-button" style="${displayDelete}">Delete</button>
                  <button id="${modalEditId}" post-id="${querySnapshot.docs[i].id}" class="edit-button" style="${displayEdit}">Edit</button>
                </div>   
              </div>  
                    <div id = "${modalContainer}" class = "modal-container">
                      <div class = "modal">
                      <h1>Delete post!</h1>
                        <div class = "modal-button">
                        <button id="${deleteButtonId}" post-id="${querySnapshot.docs[i].id}" class="confirm-button">Confirm</button>
                        <button id="${cancelId}" class="cancel-button">Cancel</button>
                        </div>
                      </div>
                    </div>
                </div>
                <div> 
                  <div id = "${modalContainerEdit}" class = "modal-container-edit">
                    <div class = "modalEdit">
                      <h1>Edit post!</h1>
                      <input
                        id="${placeEditPostId}"
                        class="place-edit-post"
                        type="text"
                        placeholder="Indicate Place "
                        autocomplete="off"
                        required
                        value="${cardPost.placePost}"
                      />
                      <textarea
                        id="${descriptionEditPostId}"
                        class="description-edit-post"
                        type="text"
                        placeholder="Description Place"
                        autocomplete="off"
                        required
                      >${cardPost.descriptionPost}</textarea>
                      <div id="imgChosse">
                        <label class="file">
                          <input
                            id="${imgPostId}"
                            class="img-post"
                            type="file"
                            capture="user"
                            accept="image/*"
                            Choose
                            image
                          />
                          <p id="choose">Change image</p>
                        </label>
                      </div>
                      <div class = "modal-button">
                        <button id="${editButtonId}" post-id="${querySnapshot.docs[i].id}" class="confirm-button">Confirm</button>
                        <button id="${cancelEditId}" post-id="${querySnapshot.docs[i].id}" class="cancel-button">Cancel</button>
                      </div>
                      <p id="${invalidPostId}" class ="invalid-post"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
    index += 1;
  }

  for (let i = 0; i < index; i++) {
    const likeOnId = "likeOnProfile" + i;
    const likeOffId = "likeOffProfile" + i;
    const crudEditId = "crudProfile" + i;
    const modalId = "openModalProfile" + i;
    const modalContainer = "modalContainerId" + i;
    const cancelId = "cancelModalProfile" + i;
    const deleteButtonId = "deleteButton" + i;
    const editButton = "editButtonProfile" + i;
    const modalContainerEdit = "modalContainerEditId" + i;
    const modalEditId = "ModalEdit" + i;
    const cancelEditId = "cancelModalEdit" + i;
    const placeEditPostId = "placeEditPostId" + i;
    const descriptionEditPostId = "descriptionEditPostId" + i;
    const imgPostId = "imgPostIdof" + i;
    const editButtonId = "editButton" + i;
    const invalidPostId = "invalidPost" + i;

    document.getElementById(likeOnId).addEventListener("click", function () {
      unLikePost(likeOnId, likeOffId);
    });
    document.getElementById(likeOffId).addEventListener("click", function () {
      likePost(likeOffId, likeOnId);
    });

    document.getElementById(crudEditId).addEventListener("click", function () {
      document.getElementById(modalId).style.display = "flex";
      document.getElementById(modalEditId).style.display = "flex";
    });

    const modalContainerDOM = document.getElementById(modalContainer);

    document.getElementById(modalId).addEventListener("click", function () {
      modalContainerDOM.style.display = "flex";
      modalContainerDOM.style.opacity = "1";
      modalContainerDOM.style.visibility = "visible";
    });

    document.getElementById(cancelId).addEventListener("click", function () {
      modalContainerDOM.style.display = "none";
    });

    const postId = document
      .getElementById(deleteButtonId)
      .getAttribute("post-id");
    document
      .getElementById(deleteButtonId)
      .addEventListener("click", function () {
        deletePost(postId);
      });

    // EDIT
    const modalContainerEditDOM = document.getElementById(modalContainerEdit);

    document.getElementById(modalEditId).addEventListener("click", function () {
      modalContainerEditDOM.style.display = "flex";
      modalContainerEditDOM.style.opacity = "1";
      modalContainerEditDOM.style.visibility = "visible";
    });

    document
      .getElementById(cancelEditId)
      .addEventListener("click", function () {
        modalContainerEditDOM.style.display = "none";
      });

    document
      .getElementById(editButtonId)
      .addEventListener("click", function () {
        editPost(
          postId,
          imgPostId,
          descriptionEditPostId,
          placeEditPostId,
          invalidPostId
        );
      });
  }
};

async function likePost(likeOffId, likeOnId) {
  const postId = document.getElementById(likeOffId).getAttribute("post-id");
  const userId = localStorage.getItem("userUID");
  await store
    .collection(USER_POSTS_COLLECTION)
    .doc(postId)
    .get()
    .then((post) => {
      let likesContainer = post.data().like;
      likesContainer.push(userId);
      store.collection(USER_POSTS_COLLECTION).doc(postId).update({
        like: likesContainer,
      });
    });
  document.getElementById(likeOffId).style.display = "none";
  document.getElementById(likeOnId).style.display = "flex";
}

async function unLikePost(likeOnId, likeOffId) {
  const postId = document.getElementById(likeOffId).getAttribute("post-id");
  const userId = localStorage.getItem("userUID");
  await store
    .collection(USER_POSTS_COLLECTION)
    .doc(postId)
    .get()
    .then((post) => {
      let likesContainer = post.data().like;
      for (let i = 0; i < likesContainer.length; i++) {
        if (likesContainer[i] == userId) {
          likesContainer.splice(i, 1);
          break;
        }
      }
      store.collection(USER_POSTS_COLLECTION).doc(postId).update({
        like: likesContainer,
      });
    });
  document.getElementById(likeOnId).style.display = "none";
  document.getElementById(likeOffId).style.display = "flex";
}

async function deletePost(postId) {
  const loader = document.querySelector(".loader-gif");
  loader.style.display = "flex";

  await store
    .collection(USER_POSTS_COLLECTION)
    .doc(postId)
    .get()
    .then(async function (sfDoc) {
      if (sfDoc.exists) {
        await store
          .collection(USER_POSTS_COLLECTION)
          .doc(postId)
          .delete()
          .then(async function () {
            console.log("Document successfully deleted!");
            await loadMyProfile();
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      }
    });
  loader.style.display = "none";
}

async function editPost(
  postId,
  imgPostId,
  descriptionEditPostId,
  placeEditPostId,
  invalidPostId
) {
  const imgPost = document.getElementById(imgPostId).value;
  const image = document.getElementById(imgPostId).files[0];
  const descriptionPost = document.getElementById(descriptionEditPostId).value;
  const placePost = document.getElementById(placeEditPostId).value;
  const invalidPost = document.getElementById(invalidPostId);
  // console.log(imgPost)
  // console.log(descriptionPost)
  // console.log(placePost)

  if (placePost == null || placePost.length == 0 || /^\s+$/.test(placePost)) {
    invalidPost.innerHTML = "You must enter a valid place";
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

  if (imgPost) {
    const prueba = "userCollectionMultimedia/" + userId + "/" + image.name;
    const storageRef = storage.ref(prueba);
    const imageRef = storageRef
      .put(image)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        updateDataPost(placePost, descriptionPost, postId, url, image);
      })
      .catch(function (error) {
        console.log("error", error);
      });
  } else {
    updateDataPost(placePost, descriptionPost, postId, null, null);
  }
}

const updateDataPost = (placePost, descriptionPost, postId, url, image) => {
  let data;
  if (url) {
    data = {
      placePost: placePost,
      image: image.name,
      url: url,
      descriptionPost: descriptionPost,
    };
  } else {
    data = {
      placePost: placePost,
      descriptionPost: descriptionPost,
    };
  }

  store
    .collection(USER_POSTS_COLLECTION)
    .doc(postId)
    .update(data)
    .then((docRef) => {
      console.log("Post updated");
      loadMyProfile();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getCardPost = () => store.collection(USER_POSTS_COLLECTION).get();
