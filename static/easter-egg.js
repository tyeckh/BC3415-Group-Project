// easter-egg.js
let clickCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  const flipContainer = document.querySelector(".flip-card");

  flipContainer.addEventListener("click", () => {
    clickCount++;
    if (clickCount === 3) {
      // Add the flipped class to trigger the animation
      document.querySelector('.flip-card').classList.toggle('flipped');

      // Reset click count after flipping
      clickCount = 0;
    }
  });
});
