const itemInput = document.querySelector('#itemInput');
const quantityInput = document.querySelector('#quantityInput');
const addItemButton = document.querySelector('#addItemButton');
const speakItemsButton = document.querySelector('#speakItemsButton');
const itemList = document.querySelector('#itemList');
const stopSpeakingButton = document.querySelector('#stopSpeakingButton');

let items = [];

// Function to add item to the list when the add button is clicked
addItemButton.addEventListener('click', () => {
    try {
        const item = itemInput.value.trim();
        const quantity = quantityInput.value.trim();

        if (item && quantity) {
            items.push({ name: item, quantity: quantity });
            updateItemList();
            itemInput.value = ''; // Clear input field
            quantityInput.value = ''; // Clear quantity field
        } else {
            alert('Please enter both item and quantity.');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('An error occurred while adding the item. Please try again.');
    }
});

// Function to update the displayed item list
function updateItemList() {
    try {
        itemList.innerHTML = ''; // Clear existing items
        items.forEach((item, index) => {
            const tr = document.createElement('tr');

            const itemNameTd = document.createElement('td');
            itemNameTd.textContent = item.name;
            tr.appendChild(itemNameTd);

            const itemQuantityTd = document.createElement('td');
            itemQuantityTd.textContent = item.quantity;
            tr.appendChild(itemQuantityTd);

            // Create delete button
            const actionTd = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remove';
            deleteButton.classList.add('remove-button'); 
            deleteButton.addEventListener('click', () => {
                try {
                    items.splice(index, 1); // Remove item from array
                    updateItemList(); // Update displayed list
                } catch (error) {
                    console.error('Error removing item:', error);
                    alert('An error occurred while removing the item. Please try again.');
                }
            });
            actionTd.appendChild(deleteButton);
            tr.appendChild(actionTd);

            itemList.appendChild(tr);
        });
    } catch (error) {
        console.error('Error updating item list:', error);
        alert('An error occurred while updating the item list. Please try again.');
    }
}

// Function to speak the items when the speak button is clicked
speakItemsButton.addEventListener('click', () => {
    try {
        if (items.length > 0) {
            const itemListToSpeak = items.map(item => `${item.name}, Quantity: ${item.quantity}`).join(', ');
            const utterance = new SpeechSynthesisUtterance(itemListToSpeak);
            window.speechSynthesis.speak(utterance);
        } else {
            alert('No items to speak!');
        }
    } catch (error) {
        console.error('Error speaking items:', error);
        alert('An error occurred while trying to speak the items. Please try again.');
    }
});

// Function to stop speaking when the stop button is clicked
stopSpeakingButton.addEventListener('click', () => {
    window.speechSynthesis.cancel(); // This will stop any ongoing speech
});