const startRecordBtn = document.querySelector('#start-record-btn');
const groceryList = document.querySelector('#grocery-list');
const manualInput = document.querySelector('#manual-input');
const quantityInput = document.querySelector('#quantity-input');
const addManualBtn = document.querySelector('#add-manual-btn');
const loadingIndicator = document.querySelector('#loading-indicator');
const confirmationMessage = document.querySelector('#confirmation-message');

let items = {}; 
let isListening = false; // Flag to track if voice recognition is active

// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Event handler for when voice recognition starts
recognition.onstart = () => {
    isListening = true;
    startRecordBtn.textContent = 'Stop Listening';
    startRecordBtn.classList.add('listening');
    console.log('Voice recognition activated. Try speaking into the microphone.');
};

// Event handler for when a result is received from voice recognition
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('You said: ', transcript);
    handleVoiceCommand(transcript);
};

// Event handler for errors during voice recognition
recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ' + event.error);
};

// Event handler for when voice recognition ends
recognition.onend = () => {
    isListening = false;
    startRecordBtn.textContent = 'Start Listening';
    startRecordBtn.classList.remove('listening');
    console.log('Voice recognition ended.');
};

// Event listener for the start/stop button
startRecordBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

// Event listener for the manual add button
addManualBtn.addEventListener('click', () => {
    const item = manualInput.value.trim();
    const quantity = parseInt(quantityInput.value.trim(), 10);
    if (item && quantity > 0) {
        showLoadingIndicator();
        addItem(item, quantity);
        manualInput.value = '';
        quantityInput.value = '';
    }
});

// Function to handle voice commands
function handleVoiceCommand(command) {
    const addCommand = command.match(/add (\w+) (\d+)/);
    const removeCommand = command.match(/remove (\w+)/);
    const quantityCommand = command.match(/quantity (\w+) (\d+)/);

    showLoadingIndicator();

    if (addCommand) {
        const item = addCommand[1];
        const quantity = parseInt(addCommand[2], 10);
        addItem(item, quantity);
    } else if (removeCommand) {
        const item = removeCommand[1];
        removeItem(item);
    } else if (quantityCommand) {
        const item = quantityCommand[1];
        const quantity = parseInt(quantityCommand[2], 10);
        updateQuantity(item, quantity);
    } else {
        speak("I didn't understand that command.");
    }
}

// Function to add an item to the grocery list
function addItem(item, quantity) {
    if (items[item]) {
        items[item] += quantity; // Update quantity if item already exists
        speak(`Updated ${item} quantity to ${items[item]}.`);
        showConfirmationMessage(`Updated ${item} quantity to ${items[item]}.`);
    } else {
        items[item] = quantity; // Add new item
        speak(`Added ${item} with quantity ${quantity}.`);
        showConfirmationMessage(`Added ${item} with quantity ${quantity}.`);
    }
    updateGroceryList();
}

// Function to remove an item from the grocery list
function removeItem(item) {
    if (items[item]) {
        delete items[item]; // Remove item from the list
        speak(`Removed ${item} from your grocery list.`);
        showConfirmationMessage(`Removed ${item} from your grocery list.`);
    } else {
        speak(`${item} is not in your grocery list.`);
    }
    updateGroceryList();
}

// Function to update the quantity of an existing item
function updateQuantity(item, quantity) {
    if (items[item]) {
        items[item] = quantity; // Update the quantity of the item
        speak(`Updated ${item} quantity to ${quantity}.`);
        showConfirmationMessage(`Updated ${item} quantity to ${quantity}.`);
    } else {
        speak(`${item} is not in your grocery list.`);
    }
    updateGroceryList();
}

// Function to update the displayed grocery list in the UI
function updateGroceryList() {
    groceryList.innerHTML = '';
    for (const item in items) {
        const li = document.createElement('tr');
        const itemCell = document.createElement('td');
        const quantityCell = document.createElement('td');
        const actionCell = document.createElement('td');
        
        itemCell.textContent = item;
        quantityCell.textContent = items[item];
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeItem(item);
        actionCell.appendChild(removeBtn);
        
        li.appendChild(itemCell);
        li.appendChild(quantityCell);
        li.appendChild(actionCell);
        groceryList.appendChild(li);
    }
    hideLoadingIndicator();
}

// Function to show the loading indicator
function showLoadingIndicator() {
    loadingIndicator.classList.remove('hidden');
}

// Function to hide the loading indicator
function hideLoadingIndicator() {
    loadingIndicator.classList.add('hidden');
}

// Function to show a confirmation message for a short duration
function showConfirmationMessage(message) {
    confirmationMessage.textContent = message;
    confirmationMessage.classList.remove('hidden');
    setTimeout(() => {
        confirmationMessage.classList.add('hidden');
    }, 3000); // Hide after 3 seconds
}

// Function to use the Speech Synthesis API to speak a message
function speak(message) {
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);
}