import { db, auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, doc, setDoc, deleteDoc, updateDoc,
  onSnapshot, query, orderBy, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginSection = document.getElementById("login-section");
const dashSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

const questionsList = document.getElementById("questions-list");
const memberForm = document.getElementById("member-form");
const membersList = document.getElementById("members-list");

// ---------- Auth ----------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = "Login gagal. Cek lagi email/password kamu.";
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    dashSection.style.display = "block";
    listenQuestions();
    loadMembers();
  } else {
    loginSection.style.display = "block";
    dashSection.style.display = "none";
  }
});

// ---------- QnA inbox ----------
function listenQuestions() {
  const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    if (snap.empty) {
      questionsList.innerHTML = `<p class="center" style="opacity:.6;">Belum ada pertanyaan masuk.</p>`;
      return;
    }
    questionsList.innerHTML = "";
    snap.forEach((d) => {
      const data = d.data();
      const div = document.createElement("div");
      div.className = "packet";
      div.style.margin = "14px 0";
      div.innerHTML = `
        <p>${escapeHtml(data.text)}</p>
        <div style="display:flex; gap:10px; align-items:center;">
          <span class="badge">${data.answered ? "✅ sudah dijawab" : "🕓 belum dijawab"}</span>
          <button class="btn outline toggle-btn" data-id="${d.id}" data-answered="${data.answered}">
            ${data.answered ? "Tandai belum" : "Tandai sudah"}
          </button>
          <button class="btn outline delete-q-btn" data-id="${d.id}">Hapus</button>
        </div>
      `;
      questionsList.appendChild(div);
    });

    questionsList.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const current = btn.dataset.answered === "true";
        await updateDoc(doc(db, "questions", id), { answered: !current });
      });
    });
    questionsList.querySelectorAll(".delete-q-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("Hapus pertanyaan ini?")) {
          await deleteDoc(doc(db, "questions", btn.dataset.id));
        }
      });
    });
  });
}

// ---------- Members management ----------
memberForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("m-username").value.trim().toLowerCase();
  if (!username) return;

  await setDoc(doc(db, "members", username), {
    namaSayur: document.getElementById("m-nama").value.trim(),
    jenis: document.getElementById("m-jenis").value.trim(),
    emoji: document.getElementById("m-emoji").value.trim() || "🌿",
    joinedDate: document.getElementById("m-joined").value.trim(),
    catatan: document.getElementById("m-catatan").value.trim(),
    status: "verified"
  });

  memberForm.reset();
  loadMembers();
});

async function loadMembers() {
  const snap = await getDocs(collection(db, "members"));
  membersList.innerHTML = "";
  if (snap.empty) {
    membersList.innerHTML = `<p class="center" style="opacity:.6;">Belum ada member terdaftar.</p>`;
    return;
  }
  snap.forEach((d) => {
    const m = d.data();
    const div = document.createElement("div");
    div.className = "packet";
    div.style.margin = "10px 0";
    div.innerHTML = `
      <strong>${d.id}</strong> — ${m.namaSayur || "-"} (${m.jenis || "-"})
      <button class="btn outline delete-m-btn" data-id="${d.id}" style="margin-left:10px;">Hapus</button>
    `;
    membersList.appendChild(div);
  });

  membersList.querySelectorAll(".delete-m-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (confirm(`Hapus member "${btn.dataset.id}"?`)) {
        await deleteDoc(doc(db, "members", btn.dataset.id));
        loadMembers();
      }
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
