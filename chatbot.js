class ChatbotUESC {
  constructor() {
    this.isTyping = false;
    this.sessionId = "teste10";
    this.apiUrl = "http://127.0.0.1:8000/api/conversa/";

    // Inicializar
    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  init() {
    const avatar = document.getElementById("chatbot-avatar");
    const closeBtn = document.getElementById("chatbot-close");
    const form = document.getElementById("chatbot-form");

    avatar?.addEventListener("click", () => this.toggleChat());
    closeBtn?.addEventListener("click", () => this.closeChat());
    form?.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  toggleChat() {
    const window = document.getElementById("chatbot-window");
    const isHidden = window.classList.contains("chatbot-hidden");

    if (isHidden) {
      window.classList.remove("chatbot-hidden");
      document.getElementById("chatbot-input")?.focus();
    } else {
      window.classList.add("chatbot-hidden");
    }
  }

  closeChat() {
    document.getElementById("chatbot-window").classList.add("chatbot-hidden");
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.isTyping) return;

    const input = document.getElementById("chatbot-input");
    const message = input.value.trim();
    if (!message) return;

    // Adicionar mensagem do usuário
    this.addMessage(message, "user");
    input.value = "";

    // Mostrar indicador de digitação
    this.showTyping();

    try {
      const response = await this.callAPI(message);
      this.hideTyping();
      this.addMessage(response, "bot");
    } catch (error) {
      this.hideTyping();
      this.addMessage("Erro ao conectar. Tente novamente.", "bot");
      console.error(error);
    }
  }

  addMessage(text, sender) {
    const messages = document.getElementById("chatbot-messages");
    const div = document.createElement("div");
    div.className = `chatbot-message ${sender}`;
    div.innerHTML = `<div class="message-content"><span>${text}</span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  showTyping() {
    this.isTyping = true;
    const messages = document.getElementById("chatbot-messages");
    const div = document.createElement("div");
    div.className = "chatbot-message bot typing-message";
    div.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  hideTyping() {
    this.isTyping = false;
    document.querySelector(".typing-message")?.remove();
  }

  async callAPI(message) {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        session_id: this.sessionId,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return data.response || data.message || data.reply || "Resposta recebida";
  }

  // Métodos de configuração
  setAPIUrl(url) {
    this.apiUrl = url;
  }
  setSessionId(id) {
    this.sessionId = id;
  }
}

// Inicializar
const chatbotUESC = new ChatbotUESC();

// Para configurar:
console.log("Chatbot carregado! Configure com:");
console.log('chatbotUESC.setAPIUrl("sua-url-aqui");');
console.log('chatbotUESC.setSessionId("sua-sessao");');
