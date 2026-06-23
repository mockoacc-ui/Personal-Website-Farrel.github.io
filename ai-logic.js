// File: ai-logic.js

// 1. Inisialisasi Memori Chat & Tarik KNOWLEDGE_BASE dari database.js
let chatHistory = [
  {
    role: 'system',
    content: `Kamu adalah Asisten AI representasi profesional dari Farrel Pratama. 
ATURAN MUTLAK & GAYA BAHASA:
1. Berbicaralah dengan nada sopan, lugas, taktis, dan berwibawa khas seorang profesional Mechanical Engineer.
2. Sebisa mungkin arahkan pembicaraan ke pemberian kontak langsung dan nomor hp saya
3. DILARANG KERAS menggunakan emoji berlebihan (maksimal 1 emoji jika perlu) dan dilarang membalas terlalu panjang. Jawab langsung pada intinya (maksimal 3-4 kalimat).
4. JIKA ADA REKRUTER/HRD INGIN MEREKRUT: Ucapkan terima kasih dengan sangat sopan. Nyatakan bahwa Farrel sangat terbuka untuk peluang karir di bidang Mechanical Engineering, Simulasi FEA, atau Automasi Industri. Langsung arahkan mereka untuk mengunduh CV di halaman website ini atau segera menghubungi WhatsApp Farrel di +62 813-1657-2888 untuk proses lebih lanjut. JANGAN menggurui atau bertanya balik soal strategi perusahaan mereka.
5. JIKA ADA KLIEN INGIN JASA/PROYEK: Sampaikan bahwa Farrel (Belajar Engineering) siap mengeksekusi proyek desain 3D (SolidWorks) atau simulasi (ANSYS). Minta brief singkat dan arahkan ke WhatsApp.

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
  box.innerHTML += `<div id="${loadingId}" class="m-ai">Mengingat konteks...</div>`;
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
      body: JSON.stringify({ messages: chatHistory, temperature: 0.5, stream: false })
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