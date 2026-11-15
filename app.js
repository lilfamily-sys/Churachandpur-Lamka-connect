const SERVICES = [];

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filters = document.getElementById("filters");
  const grid = document.getElementById("directoryGrid");
  const empty = document.getElementById("emptyState");
  const themeToggle = document.getElementById("themeToggle");

  if (!grid || !filters || !empty) return;

  let activeCategory = "All";

  function renderFilters() {
    const categories = [
      "All",
      ...new Set(SERVICES.map(s => s.category).filter(Boolean))
    ];

    filters.innerHTML = categories.map(category => `
      <button class="filter-chip ${
        category === activeCategory ? "active" : ""
      }" type="button" data-category="${category}">
        ${category}
      </button>
    `).join("");

    filters.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderFilters();
        renderServices();
      });
    });
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function renderServices() {
    const query = (searchInput?.value || "").toLowerCase().trim();

    const results = SERVICES.filter(service => {
      const categoryMatch =
        activeCategory === "All" ||
        service.category === activeCategory;

      const searchable = [
        service.name,
        service.category,
        service.description,
        service.address
      ].join(" ").toLowerCase();

      return categoryMatch && searchable.includes(query);
    });

    grid.innerHTML = results.map(service => `
      <article class="service-card">
        <div class="service-icon">${escapeHTML(service.icon || "📍")}</div>
        <div class="category-label">${escapeHTML(service.category)}</div>
        <h3>${escapeHTML(service.name)}</h3>
        <p>${escapeHTML(service.description)}</p>
        ${service.address
          ? `<p>Address: ${escapeHTML(service.address)}</p>`
          : ""}
      </article>
    `).join("");

    empty.hidden = results.length > 0;

    if (SERVICES.length === 0) {
      empty.innerHTML = `
        <h3>Local directory coming soon</h3>
        <p>Verified local services will be added soon.</p>
      `;
    } else if (results.length === 0) {
      empty.innerHTML = `
        <h3>No matching services</h3>
        <p>Try another keyword or category.</p>
      `;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderServices);
  }

  if (themeToggle) {
    if (localStorage.getItem("lamka-theme") === "dark") {
      document.body.classList.add("dark-mode");
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      localStorage.setItem(
        "lamka-theme",
        document.body.classList.contains("dark-mode")
          ? "dark"
          : "light"
      );
    });
  }

  renderFilters();
  renderServices();
});
