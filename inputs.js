
function validateFormData() {
    let validationErrors = [];

    const name = document.getElementById("name").value.trim();
    const unitPrice = parseFloat(document.getElementById("unit_price").value);
    const qty = parseInt(document.getElementById("qty").value, 10);
    const pricingMode = document.getElementById("pricing_mode").value;

    if (!name) {
        validationErrors.push("Name must not be empty.");
    }

    if (isNaN(unitPrice) || unitPrice <= 0) {
        validationErrors.push("Unit price must be greater than 0.");
    }

    if (isNaN(qty) || qty < 0) {
        validationErrors.push("Quantity must be 0 or greater.");
    }

    const validModes = ["standard", "bulk", "clearance"];

    if (!validModes.includes(pricingMode)) {
        validationErrors.push("Invalid pricing mode.");
    }

    if (pricingMode === "bulk" && qty < 5) {
        validationErrors.push("Bulk pricing requires a minimum quantity of 5.");
    }
    
    return validationErrors;
}

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("unit_price").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("pricing_mode").value = "standard";
}