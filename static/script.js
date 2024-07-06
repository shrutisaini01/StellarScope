document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.buttons button');
    const handleClick = (e) => {
        const buttonId = e.target.id; // Get the ID of the clicked button
        const targetSectionId = buttonId + '1'; // Form the corresponding section ID

        // Hide all sections by default
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the clicked section
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    };

    // Attach click event listeners to all buttons
    buttons.forEach(btn => {
        btn.addEventListener('click', handleClick);
    });

    // Chatbot button functionality
    const chatButton = document.getElementById('openChat');
    const chatWindow = document.getElementById('chatWindow');

    chatButton.addEventListener('click', () => {
        chatWindow.style.display = 'block';
    });

    // Close chatbot window when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && e.target !== chatButton) {
            chatWindow.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('openChat');
    const chatWindow = document.getElementById('chatWindow');
    const userInput = document.getElementById('user-input');

    chatButton.addEventListener('click', () => {
        chatWindow.style.display = 'block';
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

async function sendMessage() {
    let userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') {
        return;
    }

    // Append user message to chat box
    appendMessage('user', userInput);

    // Clear input field
    document.getElementById('user-input').value = '';

    try {
        // Fetch bot response from Flask backend
        let botResponse = await getBotResponse(userInput);
        appendMessage('bot', botResponse);
    } catch (error) {
        console.error('Error fetching response from Flask backend:', error);
        appendMessage('bot', 'Sorry, something went wrong.');
    }
}

async function getBotResponse(input) {
    try {
        const response = await fetch('/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: input })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response from Flask backend');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        throw error;
    }
}

function appendMessage(sender, message) {
    let messageElement = document.createElement('div');
    messageElement.classList.add('message');
    let messageContent = document.createElement('div');
    messageContent.textContent = message;

    if (sender === 'user') {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('bot-message');
    }

    messageElement.appendChild(messageContent);
    document.getElementById('chat-box').appendChild(messageElement);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}
