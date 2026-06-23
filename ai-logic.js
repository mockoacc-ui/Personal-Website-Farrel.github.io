// File: ai-logic.js

// 1. Inisialisasi Memori Chat & Tarik KNOWLEDGE_BASE dari database.js
let chatHistory = [
  {
    role: 'system',
    content: `Kamu adalah AI Digital Twin dari Farrel Pratama. 
ATURAN MUTLAK (WAJIB DIIKUTI):
1. JADILAH TEGAS, DINGIN, DAN SANGAT PROFESIONAL. Tunjukkan wibawa seorang engineer.
2. DILARANG KERAS menggunakan emoji, basa-basi, salam yang panjang, atau kalimat bertele-tele.
3. JAWAB MAKSIMAL DALAM 3 KALIMAT. Langsung to the point ke inti pertanyaan.
4. JIKA KLIEN BERTANYA (jasa/3D/FEA/Joki): Konfirmasi bahwa "Belajar Engineering" sanggup mengeksekusinya. Langsung arahkan untuk kirim brief ke WA +62 813-1657-2888. JANGAN tawarkan bantuan lain.
5. JIKA HRD/REKRUTER BERTANYA: Nyatakan kesiapan kerja. Arahkan untuk melihat portofolio di website ini atau hubungi WA +62 813-1657-2888. JANGAN bertanya balik.

DATA FARREL:
${KNOWLEDGE_BASE}`
  }
];

// 2. Fungsi Utama Chat
async function sendMsg() {
  const inp = document.getElementById('userInput');
  const box = document.getElementById('chatbox');
  const txt = inp.value.trim();
  if (!txt) return;

  // Tampilkan pesan user
  box.innerHTML += `<div class="m-user">${txt}</div>`;
  inp.value = '';
  
  const loadingId = 'load-' + Date.now();
  box.innerHTML += `<div id="${loadingId}" class="m-ai">Memproses data...</div>`;
  box.scrollTop = box.scrollHeight;

  // Simpan ke memori
  chatHistory.push({ role: 'user', content: txt });

  try {
    const res = await fetch('https://yodel-roman-deviate.ngrok-free.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      // KUNCI KETEGASAN: Temperature diturunkan jadi 0.2
      body: JSON.stringify({ messages: chatHistory, temperature: 0.2, stream: false })
    });
    
    const data = await res.json();
    document.getElementById(loadingId).remove();
    
    const aiResponse = data.choices[0].message.content;
    box.innerHTML += `<div class="m-ai">${aiResponse}</div>`;
    
    // Simpan balasan AI ke memori
    chatHistory.push({ role: 'assistant', content: aiResponse });

  } catch(e) {
    document.getElementById(loadingId).remove();
    box.innerHTML += `<div class="m-ai" style="color:#ff4444">Error: Koneksi server AI terputus. Pastikan LM Studio dan Ngrok aktif.</div>`;
    chatHistory.pop(); 
  }
  box.scrollTop = box.scrollHeight;
}

// 3. Event Listener Tombol Enter
document.getElementById('userInput').addEventListener('keypress', e => { 
    if (e.key === 'Enter') sendMsg(); 
});