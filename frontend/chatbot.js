document.addEventListener('DOMContentLoaded',() => {
    const chatArea=document.querySelector('.chatArea');
    const userInput=document.querySelector('#userInput');
    const send=document.querySelector('#sendMsg');
    const clear=document.querySelector('#clearChat');
    const url="";

    const sendMessage = () => {
        const message=userInput.value.trim();
        if(message!=""){
            const userMessageElement=document.createElement('div');
            userMessageElement.textContent=message;
            userMessageElement.classList.add('userMessage');
            chatArea.appendChild(userMessageElement);
            chatArea.scrollTop=chatArea.scrollHeight;
            receiveMessage(message);
            userInput.value='';
        }
    }

    send.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown',function(e){
        if(e.key=='Enter'){
            sendMessage();
        }
    });

    const receiveMessage = async() => {
        try{
            const response=fetch(url);
            if(!response.ok){
                throw new Error("Response was not defined by the server!");
            }
            const data=(await response).json();
            data.messages.foreach(msg => {
                const botMessageElement=document.createElement('div');
                botMessageElement.textContent=msg;
                botMessageElement.classList.add('botMessage');
                chatArea.appendChild(botMessageElement);
            });
            chatArea.scrollTop=chatArea.scrollHeight;
        }catch(Error){
            console.error("Error receiving messages, Null response!");
        }
    }

    clear.addEventListener('click',function(){
        chatArea.innerHTML='';
    });
});