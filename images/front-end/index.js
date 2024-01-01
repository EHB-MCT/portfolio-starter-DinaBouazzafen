// Function to handle WebSocket messages
function setupWebSocket() {
    console.log("happening")
    const websocket = new WebSocket('ws://localhost:8080');
    const colorInput = document.getElementById('color');

    websocket.onmessage = function(event) {
        console.log("something")
        const data = JSON.parse(event.data);
        if (data.color) {
            colorInput.value = data.color;
        }
    };

    websocket.onerror = function(error) {
        console.log('WebSocket Error:', error);
    };
}

// Function to handle form submission
function setupFormSubmission() {
    const form = document.querySelector('#questions form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const brandName = document.getElementById('brandName').value;
        const productName = document.getElementById('productName').value;
        const color = document.getElementById('color').value;

        const makeupProduct = {
            name: productName,
            brand: brandName,
            color: color
        };

        try {
            const response = await fetch('http://localhost:3000/api/makeup-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(makeupProduct),
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log('Success:', responseData);
            } else {
                console.error('Error:', responseData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Initialize everything once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setupWebSocket();
    setupFormSubmission();
});

