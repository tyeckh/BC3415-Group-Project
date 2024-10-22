// Smooth scroll to section
function scrollToSection(id) {
    // Scroll to the section
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}


// Toggle Category Field based on Credit/Debit selection
document.getElementById('type').addEventListener('change', function() {
    const categoryField = document.getElementById('category-field');
    if (this.value === 'Debit') {
        categoryField.style.display = 'block';
    } else {
        categoryField.style.display = 'none';
    }
});

// Handle Expense Form Submission
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const category = type === 'Debit' ? document.getElementById('category').value : 'N/A';
    const amount = parseFloat(document.getElementById('amount').value);

    const expense = { name, type, category, amount };

    // Save to LocalStorage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update Table
    addExpenseToTable(expense);

    // Reset Form
    this.reset();
    document.getElementById('category-field').style.display = 'none';
});

// Load Historical Expenses on Page Load
window.onload = function() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach(expense => addExpenseToTable(expense));
}

// Function to Add Expense to Table
function addExpenseToTable(expense) {
    const tableBody = document.getElementById('history-table-body');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = expense.name;
    row.appendChild(nameCell);

    const typeCell = document.createElement('td');
    typeCell.textContent = expense.type;
    row.appendChild(typeCell);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = expense.category;
    row.appendChild(categoryCell);

    const amountCell = document.createElement('td');
    amountCell.textContent = expense.amount.toFixed(2);
    row.appendChild(amountCell);

    tableBody.appendChild(row);
}

// Spending Pie Chart
const ctx = document.getElementById('spendingChart').getContext('2d');
const data = {
    labels: ['Food', 'Transport', 'Rent', 'Entertainment', 'Other'],
    datasets: [{
        label: 'Spending Categories',
        data: [30, 15, 25, 20, 10], // Replace with actual values
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
};

new Chart(ctx, {
    type: 'pie',
    data: data,
});

// Handle Savings Strategy Generation
document.getElementById('generate-savings').addEventListener('click', async function() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const debits = expenses.filter(exp => exp.type === 'Debit');
    
    // Calculate Spending Habits
    const categoryTotals = {};
    let totalSpending = 0;
    debits.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        totalSpending += exp.amount;
    });

    // Prepare Data for AI
    const spendingHabits = Object.keys(categoryTotals).map(category => ({
        category,
        percentage: ((categoryTotals[category] / totalSpending) * 100).toFixed(2)
    }));

    // Example: Sending data to Gemini API (Replace with actual API details)
    const response = await fetch('https://api.gemini-ai.com/generate-saving-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spendingHabits })
    });

    const data = await response.json();

    // Display Savings Strategy
    document.getElementById('savings-result').innerHTML = `
        <h3>Your Savings Strategy</h3>
        <p>${data.strategy}</p>
    `;
});

// Handle Financial Planning Form Submission
document.getElementById('planning-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const goals = document.getElementById('goals').value;
    const timeline = document.getElementById('timeline').value;

    // Example: Sending data to Gemini API (Replace with actual API details)
    const response = await fetch('https://api.gemini-ai.com/generate-financial-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals, timeline })
    });

    const data = await response.json();

    // Display Financial Plan
    document.getElementById('planning-result').innerHTML = `
        <h3>Your Financial Plan</h3>
        <p><strong>Risk Profile:</strong> ${data.riskProfile}</p>
        <p><strong>Investment Strategy:</strong> ${data.investmentStrategy}</p>
    `;
});

// Sliders for Time Horizon and Risk Appetite
document.getElementById('time-horizon').addEventListener('input', function() {
    document.getElementById('time-value').textContent = this.value;
});

document.getElementById('risk-appetite').addEventListener('input', function() {
    document.getElementById('risk-value').textContent = this.value;
});

// Handle Financial Plan Generation (AI Simulation)
document.getElementById('generate-plan').addEventListener('click', async function() {
    const goal = document.getElementById('goal').value;
    const timeHorizon = document.getElementById('time-horizon').value;
    const riskAppetite = document.getElementById('risk-appetite').value;

    // Example API call to generative AI (replace with actual call)
    const response = await fetch('https://api.gemini-ai.com/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, timeHorizon, riskAppetite })
    });

    const data = await response.json();

    // Display the AI-generated financial plan
    document.getElementById('planning-result').innerHTML = `
        <h3>Your Plan</h3>
        <p><strong>Goal:</strong> ${goal}</p>
        <p><strong>Time Horizon:</strong> ${timeHorizon} years</p>
        <p><strong>Risk Appetite:</strong> ${riskAppetite}%</p>
        <p><strong>AI's Advice:</strong> ${data.plan}</p>
    `;
});
