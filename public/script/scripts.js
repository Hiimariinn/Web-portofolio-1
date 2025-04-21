const articleContainer = document.querySelector(".article-container");
const container = document.getElementById("cardContainer");
const toggleButton = document.getElementById("toggle-lang");

// Ambil bahasa terakhir yang dipilih dari localStorage atau default ke "en"
let currentLang = localStorage.getItem("lang") || "en";

AOS.init({
  duration: 800, // Durasi animasi dalam ms
  easing: "ease-in-out",
  once: false, // Animasi hanya terjadi sekali
});

// Fungsi untuk memuat artikel berdasarkan bahasa
function loadArticles(lang) {
  fetch("/script/object/article.json")
    .then((response) => response.json())
    .then((data) => {
      articleContainer.innerHTML = ""; // Hapus artikel lama sebelum memuat yang baru
      const articles = data[lang]; // Ambil artikel sesuai bahasa

      articles.forEach((article) => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article-item");

        articleElement.innerHTML = `
        <div class="left-side-description">
          <h2>Medium</h2>
          <div class="article-title">
            <a href="${article.link}" target="_blank">${article.title}</a>
          </div>
          <div class="article-description">${article.description}</div>
        </div>
        <div class="article-image">
          <img src="${article.image}" alt="${article.title}">
        </div>
        `;

        articleContainer.appendChild(articleElement);
      });
    })
    .catch((error) => console.error("Error fetching articles:", error));
}

// Fungsi untuk memuat teks lokal berdasarkan bahasa
function loadLanguage(lang) {
  fetch("/script/object/locales.json")
    .then((response) => response.json())
    .then((data) => {
      if (data[lang]) {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          if (data[lang][key]) {
            el.innerHTML = data[lang][key]; // Gunakan innerHTML agar tag <strong> bekerja
          }
        });
      }
    })
    .catch((error) => console.error("Error loading localization:", error));
}

// Fungsi untuk memuat proyek berdasarkan bahasa
function loadProjects(lang) {
  fetch("/script/object/project.json")
    .then((response) => response.json())
    .then((data) => {
      container.innerHTML = ""; // Hapus proyek lama sebelum memuat yang baru
      const projects = data[lang]; // Ambil proyek sesuai bahasa

      projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.classList.add("card", index % 2 === 0 ? "even" : "odd");
        card.setAttribute("data-aos", "fade-up");
        card.innerHTML = `
          <img src="${project.image}" alt="${
          project.title
        }" class="image-project">
          <div class="right-description">
            <h2>${project.title}</h2>
            <p class="description">${project.description}</p>
            <h3>${lang === "en" ? "More?" : "Selengkapnya?"}</h3>
            <a href="${project.doc}" target="_blank" class="doc-link">
              <img src="/svg/pdf-icon.svg" alt="Download">
              <p>${
                lang === "en"
                  ? "Look at Project Documentation"
                  : "Lihat Dokumentasi Proyek"
              }</p>
            </a>
            <div class="custom-alert">${
              lang === "en"
                ? "Sorry, documentation is not available yet!"
                : "Maaf, dokumentasi belum tersedia!"
            }</div>
          </div>
        `;

        const link = card.querySelector(".doc-link");
        const alertBox = card.querySelector(".custom-alert");

        link.addEventListener("click", function (event) {
          if (!project.doc || project.doc === "#") {
            event.preventDefault();
            showAlert(alertBox, link);
          }
        });

        container.appendChild(card);
        // AOS.refresh(); // Perbarui AOS setelah menambahkan elemen
      });
    })
    .catch((error) => console.error("Error fetching projects:", error));
}

// Fungsi menampilkan alert jika dokumentasi tidak tersedia
function showAlert(alertBox, link) {
  console.log("showAlert called!");

  let rect = link.getBoundingClientRect();
  console.log("Link position:", rect);

  alertBox.style.position = "absolute";
  // alertBox.style.top = `${rect.top + window.scrollY + 5}px`; // Tambahkan scrollY dan margin kecil
  // alertBox.style.left = `${rect.left + window.scrollX + rect.width + 10}px`; // Tambahkan scrollX dan sedikit jarak
  alertBox.style.display = "block";

  function closeAlert(event) {
    console.log("Close alert triggered");
    if (!alertBox.contains(event.target) && event.target !== link) {
      console.log("Hiding alert");
      alertBox.style.display = "none";
      document.removeEventListener("click", closeAlert);
    }
  }

  setTimeout(() => {
    console.log("Adding close event listener");
    document.addEventListener("click", closeAlert);
  }, 100);
}

// Fungsi utama untuk mengganti bahasa
function toggleLanguage() {
  currentLang = currentLang === "en" ? "id" : "en";
  localStorage.setItem("lang", currentLang);
  loadLanguage(currentLang);
  loadArticles(currentLang);
  loadProjects(currentLang);
}

// Event listener untuk tombol toggle bahasa
toggleButton.addEventListener("click", toggleLanguage);

// Muat data saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
  loadArticles(currentLang);
  loadProjects(currentLang);
});
