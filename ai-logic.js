// File: ai-logic.js

async function kirimPesan() {
    const inputField = document.getElementById('userInput');
    const chatbox = document.getElementById('chatbox');
    const userText = inputField.value.trim();

    if (!userText) return;

    // 1. Tampilkan chat user di layar (Warna Hijau)
    chatbox.innerHTML += `
        <div class="flex justify-end mb-4">
            <div class="bg-emerald-600 text-white text-sm p-3 rounded-xl rounded-tr-sm shadow-sm max-w-[85%]">
                ${userText}
            </div>
        </div>
    `;
    inputField.value = '';
    chatbox.scrollTop = chatbox.scrollHeight;

    // 2. Munculkan animasi loading AI
    const loadingId = 'loading-' + Date.now();
    chatbox.innerHTML += `
        <div id="${loadingId}" class="flex justify-start mb-4">
            <div class="bg-white text-gray-500 text-sm p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-200 max-w-[85%] flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                <span>Typing...</span>
            </div>
        </div>
    `;
    chatbox.scrollTop = chatbox.scrollHeight;

    // 3. Rangkai instruksi rahasia ke AI
    const finalPrompt = `
    Kamu adalah asisten AI profesional di profil LinkedIn milik Farel. 
    Tugasmu adalah menjawab pertanyaan rekruter atau pengunjung secara akurat HANYA berdasarkan DATA PENGETAHUAN di bawah ini. 
    Jawablah dengan gaya bahasa yang profesional, sopan, namun tetap luwes (menggunakan Bahasa Indonesia).

    DATA PENGETAHUAN:
    ${KNOWLEDGE_BASE}

    PERTANYAAN PENGUNJUNG:
    ${userText}
    `;

    try {
        // 4. Tembak data ke LM Studio Lokal
        const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: finalPrompt }],
                temperature: 0.6,
                max_tokens: -1,
                stream: false
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        // 5. Hapus loading dan tampilkan jawaban AI (Warna Putih/Abu)
        document.getElementById(loadingId).remove();
        chatbox.innerHTML += `
            <div class="flex justify-start mb-4">
                <div class="bg-white text-gray-800 text-sm p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-200 max-w-[85%] leading-relaxed whitespace-pre-wrap">
                    ${aiReply}
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById(loadingId).remove();
        chatbox.innerHTML += `
            <div class="flex justify-start mb-4">
                <div class="bg-red-50 text-red-600 text-sm p-3 rounded-lg rounded-tl-none border border-red-200 max-w-[85%]">
                    <strong>Error:</strong> Failed to connect to Local AI. Please ensure LM Studio server is running at 127.0.0.1:1234.
                </div>
            </div>
        `;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
}

document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') kirimPesan();
});