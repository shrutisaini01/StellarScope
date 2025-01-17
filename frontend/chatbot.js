document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendMsg');
    const clearButton = document.getElementById('clearChat');
    const userInput = document.getElementById('userInput');
    const chatArea = document.querySelector('.chatArea');

    // Function to add a message to the chat area
    const addMessage = (message, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender); // 'user' or 'ai'

        // Format message content with appropriate styling
        if (sender === 'ai') {
            // Handling bold text and headings using regular expressions
            messageDiv.innerHTML = message.split('\n').map(line => {
                // Bold text
                line = line.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

                // Headings
                if (line.startsWith('##') && line.endsWith('##')) {
                    return `<h2>${line.replace(/##(.*?)##/, '$1')}</h2>`;
                } else {
                    return `<p>${line}</p>`;
                }
            }).join('');
        } else {
            messageDiv.innerHTML = `<div class="user-message"><p>${message}</p></div>`;
        }

        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight; // Auto-scroll
    };

    // Function to clear chat
    clearButton.addEventListener('click', () => {
        chatArea.innerHTML = '';
    });

    // Function to display 'Loading' while AI is processing
    const displayLoading = () => {
        chatArea.innerHTML = '<div class="message ai"><span>Loading...</span></div>';
    };

    // Function to send a message
    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (!message) return; // Do nothing if input is empty

        addMessage(message, 'user'); // Display user message
        userInput.value = ''; // Clear input field

        // Display loading while fetching AI response
        displayLoading();

        // Send the message to the backend
        try {
            const response = await fetch('http://localhost:8000/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            addMessage(data.response || 'Sorry, I could not understand that.', 'ai'); // Display AI response
        } catch (error) {
            console.error('Error:', error);
            addMessage('Error communicating with AI.', 'ai'); // Display error message
        }
    };

    // Add event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
