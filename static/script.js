import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js";
//import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyAq7-KBx4OHHOUL_Q10es6EIEsZnsW8mOM";

// Smooth scroll to section
function scrollToSection(sectionId) {
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
    renderPieChart();

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

// Handle Savings Strategy Generation
const generateSavingsButton = document.getElementById("generate-savings");
if (generateSavingsButton) {
  generateSavingsButton.addEventListener("click", async function () {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const debits = expenses.filter((exp) => exp.type === "Debit");

    // Calculate Spending Habits
    const categoryTotals = {};
    let totalSpending = 0;
    debits.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;
      totalSpending += exp.amount;
    });

    const spendingHabits = Object.keys(categoryTotals).map((category) => ({
      category,
      percentage: ((categoryTotals[category] / totalSpending) * 100).toFixed(2),
    }));

    const genAI = new GoogleGenerativeAI(
      "AIzaSyAq7-KBx4OHHOUL_Q10es6EIEsZnsW8mOM"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const prompt =
      "These are my spending habits, generate a comprehensive savings plan for me. Be concise." +
      spendingHabits;
    try {
      // Example: Sending data to Gemini API (Replace with actual API details)
      const result = await model.generateContent(prompt);
      console.log(result.response.text());

      // Display Savings Strategy
      document.getElementById("savings-result").innerHTML = `
            <h3>Your Savings Strategy</h3>
            <p>${
              result.response.text() ||
              "No strategy generated. Please check the API response."
            }</p>
        `;
    } catch (error) {
      console.error("Error fetching from the API:", error);
      document.getElementById("savings-result").innerHTML = `
            <p>Error generating savings strategy. Please try again later.</p>
        `;
    }
  });
}

// Handle Financial Planning Form Submission
document
  .getElementById("planning-section")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const goals = document.getElementById("goal").value;
    const timeline = document.getElementById("timeline").value;

    try {
      // Example: Sending data to Gemini API (Replace with actual API details)
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAq7-KBx4OHHOUL_Q10es6EIEsZnsW8mOM",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goals, timeline }),
        }
      );

      const data = await response.json();

      // Display Financial Plan
      document.getElementById("planning-result").innerHTML = `
            <h3>Your Financial Plan</h3>
            <p><strong>Risk Profile:</strong> ${
              data.riskProfile || "Not available"
            }</p>
            <p><strong>Investment Strategy:</strong> ${
              data.investmentStrategy || "Not available"
            }</p>
        `;
    } catch (error) {
      console.error("Error fetching from the API:", error);
      document.getElementById("planning-result").innerHTML = `
            <p>Error generating financial plan. Please try again later.</p>
        `;
    }
  });

// Sliders for Time Horizon and Risk Appetite
document.getElementById("time-horizon").addEventListener("input", function () {
  document.getElementById("time-value").textContent = this.value;
});

document.getElementById("risk-appetite").addEventListener("input", function () {
  document.getElementById("risk-value").textContent = this.value;
});

// Handle Financial Plan Generation (AI Simulation)
document
  .getElementById("generate-plan")
  .addEventListener("click", async function () {
    const goal = document.getElementById("goal").value;
    const timeHorizon = document.getElementById("time-horizon").value;
    const riskAppetite = document.getElementById("risk-appetite").value;

    try {
      // Example API call to generative AI (replace with actual call)
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAq7-KBx4OHHOUL_Q10es6EIEsZnsW8mOM",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, timeHorizon, riskAppetite }),
        }
      );

      const data = await response.json();
      console.log(data); // Log the response to debug

      // Display the AI-generated financial plan
      document.getElementById("planning-result").innerHTML = `
            <h3>Your Plan</h3>
            <p><strong>Goal:</strong> ${goal}</p>
            <p><strong>Time Horizon:</strong> ${timeHorizon} years</p>
            <p><strong>Risk Appetite:</strong> ${riskAppetite}%</p>
            <p><strong>AI's Advice:</strong> ${
              data.plan || "No advice available"
            }</p>
        `;
    } catch (error) {
      console.error("Error fetching from the API:", error);
      document.getElementById("planning-result").innerHTML = `
            <p>Error generating the financial plan. Please try again later.</p>
        `;
    }
  });
