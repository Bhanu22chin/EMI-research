// Restrict interest rate to a maximum of 99 (2 digits before decimal)
interestRateInput.addEventListener('input', function () {
    let value = this.value;

    // Remove invalid characters
    value = value.replace(/[^0-9.]/g, '');

    // Allow only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit integer part to 2 digits
    const [integerPart, decimalPart] = value.split('.');
    let newValue = integerPart.slice(0, 2);

    if (decimalPart !== undefined) {
        newValue += '.' + decimalPart;
    }

    this.value = newValue;
});
