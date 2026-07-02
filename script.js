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
        if (!interestRateInput.value || parseFloat(interestRateInput.value) < 0) {
            interestError.textContent = 'Please enter a valid annual interest rate.';
            isValid = false;
        }
        if (!loanTenureInput.value || parseInt(loanTenureInput.value) <= 0) {
            tenureError.textContent = 'Please enter a valid tenure greater than 0.';
            isValid = false;
        }

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
