import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("member-form");
const input = document.getElementById("username-input");
const result = document.getElementById("member-result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = input.value.trim().toLowerCase();
  if (!username) return;

  result.innerHTML = `<p class="center">Lagi ngecek ke kebun... 🌱</p>`;

  try {
    const snap = await getDoc(doc(db, "members", username));

    if (snap.exists() && snap.data().status === "verified") {
      const m = snap.data();
      result.innerHTML = `
        <div class="id-card">
          <div class="id-icon">${m.emoji || "🌿"}</div>
          <span class="badge">ID Card</span>
          <h3>${m.namaSayur || username}</h3>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Jenis:</strong> ${m.jenis || "-"}</p>
          <p><strong>Bergabung sejak:</strong> ${m.joinedDate || "-"}</p>
          ${m.catatan ? `<p class="accent-script">"${m.catatan}"</p>` : ""}
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="msg error center">
          Username <strong>${username}</strong> belum terverifikasi / belum lolos seleksi.
          Coba cek lagi penulisan username kamu, atau hubungi caretakers ya.
        </div>
      `;
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = `<div class="msg error center">Ada gangguan pas ngecek data. Coba lagi sebentar ya.</div>`;
  }
});
