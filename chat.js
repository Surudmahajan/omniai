const API_URL = "https://surudmahajan12-omniai.hf.space/omniai";

const chatContainer = document.getElementById("chatContainer");
const input = document.getElementById("userInput");

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.innerText = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    input.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot");
    loadingMsg.innerText = "OmniAI is thinking...";
    chatContainer.appendChild(loadingMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

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

        loadingMsg.remove();
        addMessage(data.response || "No response received.", "bot");

    } catch (error) {
        loadingMsg.remove();
        addMessage("Connection error. Please try again.", "bot");
    }
}
