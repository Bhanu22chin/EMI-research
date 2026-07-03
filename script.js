interestRateInput.addEventListener('input', function () {
    let value = this.value;

    // Allow only up to 2 digits before the decimal and optional decimals
    const match = value.match(/^(\d{0,2})(\.\d*)?$/);

    if (match) {
        this.value = match[1] + (match[2] || '');
    } else {
        this.value = value.slice(0, -1);
    }
});
