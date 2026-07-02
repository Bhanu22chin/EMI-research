Create the following two JavaScript files.

### **js/calculator.js**

```javascript
// ==========================
// Loan EMI Calculator Functions
// ==========================

// Format currency (Indian Rupees)
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

// EMI Calculation
function calculateEMI(principal, annualRate, months) {

    if (annualRate === 0) {
        return principal / months;
    }

    const monthlyRate = annualRate / 12 / 100;

    const emi =
        principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months) /
        (Math.pow(1 + monthlyRate, months) - 1);

    return emi;
}

// Total Payment
function calculateTotalPayment(emi, months) {
    return emi * months;
}

// Total Interest
function calculateTotalInterest(totalPayment, principal) {
    return totalPayment - principal;
}

// Generate Amortization Schedule
function generateAmortization(principal, annualRate, months, emi) {

    const tbody = document.querySelector("#amortizationTable tbody");

    tbody.innerHTML = "";

    let balance = principal;
    const monthlyRate = annualRate / 12 / 100;

    for (let month = 1; month <= months; month++) {

        let interest;
        let principalPaid;

        if (annualRate === 0) {
            interest = 0;
            principalPaid = emi;
        } else {
            interest = balance * monthlyRate;
            principalPaid = emi - interest;
        }

        // Adjust final payment to remove rounding errors
        if (month === months) {
            principalPaid = balance;
        }

        balance -= principalPaid;

        if (balance < 0) {
            balance = 0;
        }

        const row = `
            <tr>
                <td>${month}</td>
                <td>${formatCurrency(emi)}</td>
                <td>${formatCurrency(principalPaid)}</td>
                <td>${formatCurrency(interest)}</td>
                <td>${formatCurrency(balance)}</td>
            </tr>
        `;

        tbody.insertAdjacentHTML("beforeend", row);
    }
}
```

---

### **js/app.js**

```javascript
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

// ==========================
// Calculate Button
// ==========================

calculateBtn.addEventListener("click", function () {

    // Clear previous errors
    document.getElementById("loanAmountError").textContent = "";
    document.getElementById("interestRateError").textContent = "";
    document.getElementById("loanTenureError").textContent = "";

    const principal = parseFloat(document.getElementById("loanAmount").value);
    const rate = parseFloat(document.getElementById("interestRate").value);
    let tenure = parseFloat(document.getElementById("loanTenure").value);
    const tenureType = document.getElementById("tenureType").value;

    let valid = true;

    // Validation
    if (isNaN(principal) || principal <= 0) {
        document.getElementById("loanAmountError").textContent =
            "Enter a valid loan amount.";
        valid = false;
    }

    if (isNaN(rate) || rate < 0) {
        document.getElementById("interestRateError").textContent =
            "Enter a valid interest rate.";
        valid = false;
    }

    if (isNaN(tenure) || tenure <= 0) {
        document.getElementById("loanTenureError").textContent =
            "Enter a valid tenure.";
        valid = false;
    }

    if (!valid) return;

    // Convert years to months
    const months = tenureType === "years"
        ? tenure * 12
        : tenure;

    // Calculations
    const emi = calculateEMI(principal, rate, months);
    const totalPayment = calculateTotalPayment(emi, months);
    const totalInterest = calculateTotalInterest(totalPayment, principal);

    // Result Cards
    document.getElementById("monthlyEMI").textContent =
        formatCurrency(emi);

    document.getElementById("totalInterest").textContent =
        formatCurrency(totalInterest);

    document.getElementById("totalPayment").textContent =
        formatCurrency(totalPayment);

    // Summary
    document.getElementById("summaryLoanAmount").textContent =
        formatCurrency(principal);

    document.getElementById("summaryInterestRate").textContent =
        rate.toFixed(2) + "%";

    document.getElementById("summaryTenure").textContent =
        months + " Months";

    document.getElementById("summaryEMI").textContent =
        formatCurrency(emi);

    document.getElementById("summaryInterest").textContent =
        formatCurrency(totalInterest);

    document.getElementById("summaryPayment").textContent =
        formatCurrency(totalPayment);

    // Generate Table
    generateAmortization(principal, rate, months, emi);

});

// ==========================
// Reset Button
// ==========================

resetBtn.addEventListener("click", function () {

    document.getElementById("loanAmount").value = "";
    document.getElementById("interestRate").value = "";
    document.getElementById("loanTenure").value = "";

    document.getElementById("tenureType").value = "years";

    document.getElementById("monthlyEMI").textContent = "₹0.00";
    document.getElementById("totalInterest").textContent = "₹0.00";
    document.getElementById("totalPayment").textContent = "₹0.00";

    document.getElementById("summaryLoanAmount").textContent = "₹0.00";
    document.getElementById("summaryInterestRate").textContent = "0%";
    document.getElementById("summaryTenure").textContent = "0 Months";
    document.getElementById("summaryEMI").textContent = "₹0.00";
    document.getElementById("summaryInterest").textContent = "₹0.00";
    document.getElementById("summaryPayment").textContent = "₹0.00";

    document.querySelector("#amortizationTable tbody").innerHTML = "";

    document.getElementById("loanAmountError").textContent = "";
    document.getElementById("interestRateError").textContent = "";
    document.getElementById("loanTenureError").textContent = "";

});
```
