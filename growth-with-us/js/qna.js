import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("qna-form");
const textarea = document.getElementById("qna-text");
const result = document.getElementById("qna-result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = textarea.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, "questions"), {
      text,
      createdAt: serverTimestamp(),
      answered: false
    });
    textarea.value = "";
    result.innerHTML = `<div class="msg success">Terkirim! Pertanyaan kamu cuma bisa dilihat sama caretakers. 🌱</div>`;
  } catch (err) {
    console.error(err);
    result.innerHTML = `<div class="msg error">Gagal terkirim, coba lagi ya.</div>`;
  }
});
