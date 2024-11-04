// easter-egg.js
let clickCount = 0;
let isFlipped = false;

document.addEventListener("DOMContentLoaded", () => {
  try {
    const flipContainer = document.querySelector(".flip-card");

    flipContainer.addEventListener("click", () => {
      clickCount++;
      if (isFlipped == true) {
        // Add the flipped class to trigger the animation
        document.querySelector('.flip-card').classList.toggle('flipped');
        // Reset click count after flipping
        clickCount = 0;
        isFlipped = false;
      }
      if (clickCount === 5) {
        // Add the flipped class to trigger the animation
        document.querySelector('.flip-card').classList.toggle('flipped');

        // Reset click count after flipping
        clickCount = 0;
        isFlipped = true;
      }
    });
  }
  catch (error) {
    console.error("Error:", error);
  }
});
