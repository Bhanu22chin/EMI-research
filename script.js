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
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTenureInput = document.getElementById('loanTenure');
    const tenureTypeSelect = document.getElementById('tenureType');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Error Elements
    const amountError = document.getElementById('loanAmountError');
    const interestError = document.getElementById('interestRateError');
    const tenureError = document.getElementById('loanTenureError');

    // Display Output Elements
    const monthlyEMIResult = document.getElementById('monthlyEMI');
    const totalInterestResult = document.getElementById('totalInterest');
    const totalPaymentResult = document.getElementById('totalPayment');

    // Summary Elements
    const summaryAmount = document.getElementById('summaryLoanAmount');
    const summaryRate = document.getElementById('summaryInterestRate');
    const summaryTenure = document.getElementById('summaryTenure');
    const summaryEMI = document.getElementById('summaryEMI');
    const summaryInterest = document.getElementById('summaryInterest');
    const summaryPayment = document.getElementById('summaryPayment');

    const amortizationTableBody = document.querySelector('#amortizationTable tbody');

    // Format Currency Helper (Rupee formatting)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Form Validator
    const validateInputs = () => {
        let isValid = true;

        // Reset errors
        amountError.textContent = '';
        interestError.textContent = '';
        tenureError.textContent = '';

        if (!loanAmountInput.value || parseFloat(loanAmountInput.value) <= 0) {
            amountError.textContent = 'Please enter a valid loan amount greater than 0.';
            isValid = false;
}

        // Adjust final payment to remove rounding errors
        if (month === months) {
            principalPaid = balance;
      
const interestRate = parseFloat(interestRateInput.value);

if (
 !interestRateInput.value ||
 isNaN(interestRate) ||
 interestRate < 0 ||
 interestRate > 99
) {
 interestError.textContent = 'Interest rate must be between 0 and 99%.';
 isValid = false;
}
        if (!loanTenureInput.value || parseInt(loanTenureInput.value) <= 0) {
            tenureError.textContent = 'Please enter a valid tenure greater than 0.';
            isValid = false;
}

        balance -= principalPaid;

        if (balance < 0) {
            balance = 0;
        return isValid;
    };

    // Calculate Loan Logic
    const calculateLoan = () => {
        if (!validateInputs()) return;

        const principal = parseFloat(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const tenureValue = parseInt(loanTenureInput.value);
        const tenureType = tenureTypeSelect.value;

        // Convert tenure strictly to total months
        const totalMonths = tenureType === 'years' ? tenureValue * 12 : tenureValue;
        
        // Monthly interest rate calculation
        const monthlyRate = (annualRate / 100) / 12;

        let emi = 0;
        
        // Handle zero interest condition safely
        if (monthlyRate === 0) {
            emi = principal / totalMonths;
        } else {
            // Standard EMI Formula: [P x R x (1+R)^N]/[(1+R)^N - 1]
            emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                  (Math.pow(1 + monthlyRate, totalMonths) - 1);
}

        const row = `
            <tr>
                <td>${month}</td>
        const totalPayment = emi * totalMonths;
        const totalInterest = totalPayment - principal;

        // Update UI Display Elements
        monthlyEMIResult.textContent = formatCurrency(emi);
        totalInterestResult.textContent = formatCurrency(totalInterest);
        totalPaymentResult.textContent = formatCurrency(totalPayment);

        // Update Table Summary Elements
        summaryAmount.textContent = formatCurrency(principal);
        summaryRate.textContent = `${annualRate}%`;
        summaryTenure.textContent = `${totalMonths} Months (${tenureValue} ${tenureType})`;
        summaryEMI.textContent = formatCurrency(emi);
        summaryInterest.textContent = formatCurrency(totalInterest);
        summaryPayment.textContent = formatCurrency(totalPayment);

        // Build Amortization Schedule Data
        generateAmortizationSchedule(principal, monthlyRate, emi, totalMonths);
    };

    // Generate Breakup Rows
    const generateAmortizationSchedule = (principal, monthlyRate, emi, totalMonths) => {
        amortizationTableBody.innerHTML = ''; // Wipe out previous rows
        let balance = principal;

        for (let i = 1; i <= totalMonths; i++) {
            let interestPayment = balance * monthlyRate;
            let principalPayment = emi - interestPayment;

            // Handle potential final minor rounding overflow
            if (i === totalMonths) {
                principalPayment = balance;
                interestPayment = emi - principalPayment;
                balance = 0;
            } else {
                balance -= principalPayment;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i}</td>
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

                <td>${formatCurrency(principalPayment)}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(Math.max(0, balance))}</td>
            `;
            amortizationTableBody.appendChild(row);
        }
    };

    // Reset Function
    const resetCalculator = () => {
        loanAmountInput.value = '';
        interestRateInput.value = '';
        loanTenureInput.value = '';
        tenureTypeSelect.value = 'years';

        amountError.textContent = '';
        interestError.textContent = '';
        tenureError.textContent = '';

        monthlyEMIResult.textContent = '₹0.00';
        totalInterestResult.textContent = '₹0.00';
        totalPaymentResult.textContent = '₹0.00';

        summaryAmount.textContent = '₹0.00';
        summaryRate.textContent = '0%';
        summaryTenure.textContent = '0 Months';
        summaryEMI.textContent = '₹0.00';
        summaryInterest.textContent = '₹0.00';
        summaryPayment.textContent = '₹0.00';

        amortizationTableBody.innerHTML = '';
    };

    // Event Listeners
    calculateBtn.addEventListener('click', calculateLoan);
    resetBtn.addEventListener('click', resetCalculator);
});
```
