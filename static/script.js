console.log("script.js loaded successfully");

// Smooth scroll to section
window.scrollToSection = function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  console.log("Scrolling to section:", sectionId); // Add this line to debug
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Toggle Category Field based on Credit/Debit selection
document.getElementById("type").addEventListener("change", function () {
  const categoryField = document.getElementById("category-field");
  categoryField.style.display = this.value === "Debit" ? "block" : "none";
});

// Handle Expense Form Submission
document
  .getElementById("expense-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const type = document.getElementById("type").value;
    const category =
      type === "Debit" ? document.getElementById("category").value : "N/A";
    const amount = parseFloat(document.getElementById("amount").value);

    const expense = { name, type, category, amount };

    // Save to LocalStorage
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Update Table and Pie Chart
    addExpenseToTable(expense);
    renderPieChart(); // Re-render the pie chart with the updated data

    // Reset Form
    this.reset();
    document.getElementById("category-field").style.display = "none";
  });

// Load Historical Expenses and Pie Chart on Page Load
window.onload = function () {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.forEach((expense) => addExpenseToTable(expense));
  renderPieChart();
};

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

// Function to aggregate spending data from localStorage for the pie chart
function calculateSpendingData() {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const spendingByCategory = {
    Food: 0,
    Transport: 0,
    Rent: 0,
    Entertainment: 0,
    Other: 0,
  };

  expenses.forEach((expense) => {
    if (expense.type === "Debit") {
      spendingByCategory[expense.category] += expense.amount;
    }
  });

  const data = Object.values(spendingByCategory);

  // Handle the case where no expenses are present
  if (data.every((value) => value === 0)) {
    return {
      labels: ["No Data"],
      data: [1], // Display a default 'No Data' pie chart slice
    };
  }

  return {
    labels: Object.keys(spendingByCategory),
    data: Object.values(spendingByCategory),
  };
}

// Function to render pie chart with dynamic data
function renderPieChart() {
  const spendingData = calculateSpendingData();

  const ctx = document.getElementById("spendingChart").getContext("2d");
  new Chart(ctx, {
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
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

// Sliders for Time Horizon and Risk Appetite
document.getElementById("time_horizon").addEventListener("input", function () {
  document.getElementById("time_value").textContent = this.value;
});

document.getElementById("risk_appetite").addEventListener("input", function () {
  document.getElementById("risk_value").textContent = this.value;
});

// Set "Debit" as the default option on load
window.onload = function () {
  document.getElementById("type").value = "Debit"; // Set Debit as default
  document.getElementById("category-field").style.display = "block"; // Show category field by default

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.forEach((expense) => addExpenseToTable(expense));
  renderPieChart();
};

// Toggle Category Field based on Credit/Debit selection
document.getElementById("type").addEventListener("change", function () {
  const categoryField = document.getElementById("category-field");
  categoryField.style.display = this.value === "Debit" ? "block" : "none";
});
