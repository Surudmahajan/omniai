const API_URL = "https://surudmahajan12-omniai.hf.space/omniai";

const chatContainer = document.getElementById("chatContainer");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let isProcessing = false;

// Enter key support
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

sendBtn.addEventListener("click", sendMessage);

// Add message bubble
function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.classList.add("message", type);

    if (type === "bot") {
        msg.innerHTML = marked.parse(text);
    } else {
        msg.innerText = text;
    }

    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing animation
function addTypingIndicator() {
    const typing = document.createElement("div");
    typing.classList.add("message", "bot");
    typing.id = "typingIndicator";
    typing.innerHTML = "<span class='dot'></span><span class='dot'></span><span class='dot'></span>";
    chatContainer.appendChild(typing);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Main send function
async function sendMessage() {
    if (isProcessing) return;

    const userText = input.value.trim();
    if (!userText) return;

    isProcessing = true;
    input.disabled = true;
    sendBtn.disabled = true;

    addMessage(userText, "user");
    input.value = "";

    addTypingIndicator();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_message: userText,
                engine_context: null
            })
        });

        const data = await response.json();

        document.getElementById("typingIndicator")?.remove();

        if (response.ok) {
            addMessage(data.response || "No response received.", "bot");
        } else {
            addMessage("AI service error. Please try again.", "bot");
        }

    } catch (error) {
        document.getElementById("typingIndicator")?.remove();
        addMessage("Connection error. Please check network and try again.", "bot");
    }

    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
    isProcessing = false;
}
