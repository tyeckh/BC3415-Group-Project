console.log("script.js loaded successfully");

// Smooth scroll to section
window.scrollToSection = function (sectionId) {
  const section = document.getElementById(sectionId);
  console.log("Scrolling to section:", sectionId);
  if (section) section.scrollIntoView({ behavior: "smooth" });
};

// Event listener for Generate Character and "I'm Feeling Lucky!" buttons
["generate-character", "feeling-lucky"].forEach((id) => {
  document.getElementById(id).addEventListener("click", fetchCharacterImage);
});

function fetchCharacterImage() {
  fetch("/generate-character")
    .then((response) => response.blob())
    .then((imageBlob) => {
      const imageUrl = URL.createObjectURL(imageBlob);
      document.getElementById(
        "character-result"
      ).innerHTML = `<img src="${imageUrl}" alt="Generated Character" />`;
    })
    .catch((error) => {
      console.error("Error fetching character image:", error);
      document.getElementById(
        "character-result"
      ).innerHTML = `<p>Error generating character. Please try again later.</p>`;
    });
}

// Set "Debit" as the default option and load expenses on page load
window.onload = function () {
  document.getElementById("type").value = "Debit";
  toggleCategoryField();
  loadExpenses();
  renderPieChart();
  showSlide(0); // Show the first slide in the carousel
};

// Toggle Category Field based on Credit/Debit selection
document.getElementById("type").addEventListener("change", toggleCategoryField);

function toggleCategoryField() {
  const categoryField = document.getElementById("category-field");
  categoryField.style.display =
    document.getElementById("type").value === "Debit" ? "block" : "none";
}

// Handle Expense Form Submission
document
  .getElementById("expense-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const expense = {
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      category:
        document.getElementById("type").value === "Debit"
          ? document.getElementById("category").value
          : "N/A",
      amount: parseFloat(document.getElementById("amount").value),
    };

    saveExpense(expense);
    addExpenseToTable(expense);
    renderPieChart();
    this.reset();
    toggleCategoryField();
  });

function saveExpense(expense) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.forEach(addExpenseToTable);
}

// Function to Add Expense to Table
function addExpenseToTable(expense) {
  const tableBody = document.getElementById("history-table-body");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${expense.name}</td>
    <td>${expense.type}</td>
    <td>${expense.category}</td>
    <td>${expense.amount.toFixed(2)}</td>
  `;
  tableBody.appendChild(row);
}

// Function to aggregate spending data for the pie chart
function calculateSpendingData() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const spendingByCategory = {
    Food: 0,
    Transport: 0,
    Rent: 0,
    Entertainment: 0,
    Other: 0,
  };

  expenses.forEach((expense) => {
    if (
      expense.type === "Debit" &&
      spendingByCategory[expense.category] !== undefined
    ) {
      spendingByCategory[expense.category] += expense.amount;
    }
  });

  return {
    labels: Object.keys(spendingByCategory),
    data: Object.values(spendingByCategory),
  };
}

// Function to render pie chart with dynamic data
let pieChart;

function renderPieChart() {
  const spendingData = calculateSpendingData();
  const ctx = document.getElementById("spendingChart").getContext("2d");

  if (pieChart) {
    pieChart.destroy();
  }

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: spendingData.labels,
      datasets: [
        {
          label: "Spending Categories",
          data: spendingData.data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } },
    },
  });
}

document
  .getElementById("generate-savings")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default button behavior

    // Create a new FormData object
    const formData = new FormData();

    // Get expenses from localStorage and append to FormData
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    formData.append("spending_habits", JSON.stringify(expenses));

    // Send the form data via fetch
    fetch("/generate_savings_strategy", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("savings_result").innerHTML = `<p>${
          data.savings_strategy || "No data received"
        }</p>`;
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById(
          "savings_result"
        ).innerHTML = `<p>Error generating savings strategy. Please try again later.</p>`;
      });
  });

// Financial Planning and Carousel Functionality
let currentSlide = 0;
let startX = 0; // Touch start position
let endX = 0; // Touch end position
const carouselContainer = document.querySelector(".carousel-container");
carouselContainer.addEventListener("touchstart", handleTouchStart, false);
carouselContainer.addEventListener("touchend", handleTouchEnd, false);

function handleTouchStart(event) {
  startX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  endX = event.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance for a swipe to be considered

  if (startX - endX > swipeThreshold) {
    // Swipe left
    moveSlide(1);
  } else if (endX - startX > swipeThreshold) {
    // Swipe right
    moveSlide(-1);
  }
}

function moveSlide(direction) {
  const slides = document.querySelectorAll(".carousel-slide");
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  showSlide(currentSlide);
}

document
  .querySelector(".left-arrow")
  .addEventListener("click", () => moveSlide(-1));
document
  .querySelector(".right-arrow")
  .addEventListener("click", () => moveSlide(1));

function showSlide(index) {
  currentSlide = index;
  const carousel = document.querySelector(".carousel-container");
  carousel.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentSlide].classList.add("active");
}

// AJAX form submission
document
  .getElementById("financial-plan-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);

    // Show the loading spinner and move to the result slide
    document.getElementById("loading-spinner").style.display = "block";
    showSlide(1);

    // AJAX request using fetch API
    fetch("/generate_financial_plan", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        // Hide the loading spinner
        document.getElementById("loading-spinner").style.display = "none";
        // Update the result slide with the financial plan text
        document.getElementById(
          "planning_result"
        ).innerHTML = `<p>${data.financial_plan}</p>`;
      })
      .catch((error) => {
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("planning_result").innerHTML =
          "<p>Error: Could not generate the financial plan.</p>";
        console.error("Error:", error);
      });
  });

document.addEventListener("DOMContentLoaded", () => {
  showSlide(0); // Show the first slide on load
});

console.log("script.js loaded successfully");

//Email Function
function sendEmail() {
  let parms = {
      contact_name: document.getElementById("contact_name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
  };
  
  emailjs.send('service_0uo416r', 'template_rqk459a', parms).then(alert("Email Sent!"));
}
