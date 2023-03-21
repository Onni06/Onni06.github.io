// select modal-btn,modal-overlay,close-btn
const modalBtn = document.querySelector(".modal-btn");
const modal = document.querySelector(".modal-overlay");
const closeBtn = document.querySelector(".close-btn");
// listen for click events on modal-btn and close-btn
modalBtn.addEventListener("click", function () {
  // when user clicks modal-btn add .open-modal to modal-overlay
  modal.classList.add("open-modal");
});
// when user clicks close-btn remove .open-modal from modal-overlay
closeBtn.addEventListener("click", function () {
  modal.classList.remove("open-modal");
});
