// Load table in input
document.addEventListener('DOMContentLoaded', () =>{
    displayCartItems();
})


// Change table value in input
document.querySelectorAll('.item-quantity').forEach(input => {
    input.addEventListener('input', handleQuantityChange);
});


function handleQuantityChange(event) {
    
    // Picking the input card & getting the name,qty,price,unit

    const card = event.target.closest('.card');
    const itemName = card.querySelector('.item-name').textContent;
    let itemQuantity = parseFloat(card.querySelector('.item-quantity').value);
    const itemPrice = parseFloat(card.querySelector('.product-details').dataset.price);
    const unitSelect = card.querySelector('.unit-selection');
    
    // Validating whether the qty value

    if (isNaN(itemQuantity) || itemQuantity <= 0) {
        removeFromCart(itemName);
    } else {
        let unit = "";
        let quantityInKg = itemQuantity;
        let showUnit = false;

        // Checking whether a unit is available
        if (unitSelect) {
            const selectedRadio = card.querySelector('input[type="radio"]:checked');
            // If Unit availabe convert value to Kg
            if (selectedRadio) {
                unit = selectedRadio.value;
                quantityInKg = unit === "grams" ? itemQuantity / 1000 : itemQuantity;
                showUnit = true;
            }
        }

        // Creating a item Object
        const item = {
            name: itemName,
            quantity: itemQuantity,
            price: itemPrice,
            unit: unit,
            showUnit: showUnit,
            totalPrice: (quantityInKg * itemPrice).toFixed(2)
        };

        updateCart(item);
    }

    displayCartItems();
}

// Updating the cart
function updateCart(item) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex] = item;
    } else {
        cart.push(item);
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Removing a item from table if qty = NaN or qty <= 0
function removeFromCart(itemName) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.filter(cartItem => cartItem.name !== itemName);
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Display items to the table 
function displayCartItems() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const tableBody = document.querySelector('#cart-table tbody');
    tableBody.innerHTML = '';

    let totalCost = 0;

    cart.forEach(item => {
        const quantityWithUnit = item.showUnit ? 
            (item.unit === 'grams' ? `${item.quantity} g` : `${item.quantity} kg`) : 
            `${item.quantity}`;
        const newRow = document.createElement('tr');
        newRow.classList.add('fade-in-row');
        newRow.innerHTML = `
            <td>${item.name}</td>
            <td>${quantityWithUnit}</td>
            <td>Rs. ${item.totalPrice}</td>
        `;
        tableBody.appendChild(newRow);
        totalCost += parseFloat(item.totalPrice);

        newRow.addEventListener('animationend', () => {
            newRow.classList.remove('fade-in-row');
        });
    });

    // Add the total cost row
    if (cart.length > 0) {
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="2"><h3>Total Cost</h3></td>
            <td><h3>Rs. ${totalCost.toFixed(2)}</h3></td>
        `;
        tableBody.appendChild(totalRow);
    }
}

// Storing sessionstorage cart in localStorage Favourite
document.querySelector('.add-to-fav-btn').addEventListener('click', function() {
    localStorage.setItem("Favourite", sessionStorage.getItem('cart') || "");
    alert("The listed products have been added to the Favourites list.");
});


// Storing localStorage Favourite in sessionStorage cart
document.querySelector('.apply-fav-btn').addEventListener('click', function() {
    const favouriteItems = JSON.parse(localStorage.getItem("Favourite"));
    if (favouriteItems) {
        sessionStorage.setItem('cart', JSON.stringify(favouriteItems));
        displayCartItems();
    } else {
        alert("No favourite items found.");
    }
});


const form = document.querySelector('form');
const submitButton = document.querySelector('.pay-btn');

// Validating every input box in form & resetting it
submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    let isFormValid = true;

    const requiredInputs = form.querySelectorAll('input[required], select[required]');

    for (const input of requiredInputs) {
        if (!input.value.trim()) {
            isFormValid = false;
            input.classList.add('error');
            alert(`${input.previousElementSibling.textContent} is required.`);
            break;
        } else {
            input.classList.remove('error');
        }
    }

    if (isFormValid) {
        const date = deliveryDate();
        alert('Dear Customer,\nYour\'e purchase is successfully! ' + `\nYour delivery date is on ${date}` + "\nThank You for buying from Fresh Glow Grocery");
        sessionStorage.removeItem('cart');
        displayCartItems();
        form.reset();
    }
});


// Calculating the delivery date
function deliveryDate(){
    const today = new Date();

    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const day = String(today.getDate()+2).padStart(2, '0');
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate



}
