document.addEventListener('DOMContentLoaded', () => {
    const chatArea = document.querySelector('.chatArea');
    const userInput = document.querySelector('#userInput');
    const send = document.querySelector('#sendMsg');
    const clear = document.querySelector('#clearChat');
    const url = "/chatbot";  // URL to the Flask backend endpoint

    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (message !== "") {
            // Display user message
            const userMessageElement = document.createElement('div');
            userMessageElement.textContent = message;
            userMessageElement.classList.add('userMessage');
            chatArea.appendChild(userMessageElement);
            chatArea.scrollTop = chatArea.scrollHeight;

            try {
                // Send message to backend
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) {
                    throw new Error("Response was not defined by the server!");
                }

                const data = await response.json();
                
                // Display bot response
                const botMessageElement = document.createElement('div');
                botMessageElement.textContent = data.response;
                botMessageElement.classList.add('botMessage');
                chatArea.appendChild(botMessageElement);
            } catch (error) {
                console.error("Error receiving messages:", error);
                const errorMessageElement = document.createElement('div');
                errorMessageElement.textContent = "Error: " + error.message;
                errorMessageElement.classList.add('botMessage');
                chatArea.appendChild(errorMessageElement);
            }

            // Clear input field
            userInput.value = '';
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    send.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    clear.addEventListener('click', function () {
        chatArea.innerHTML = '';
    });
});
