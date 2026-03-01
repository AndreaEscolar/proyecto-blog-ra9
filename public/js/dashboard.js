const root = document.getElementById("stats-root");

if (!root) {
  throw new Error("stats-root no encontrado (no se inyectaron stats en el HTML)");
}

const raw = root.dataset.stats;
if (!raw) {
  throw new Error("data-stats vacío");
}

const stats = JSON.parse(raw);

// Chart 1: Longitud media del body por usuario
new Chart(document.getElementById("postsByUserChart"), {
  type: "bar",
  data: {
    labels: stats.avgPostBodyLenByUser.map(x => x.label),
    datasets: [{ label: "Media LENGTH(body)", data: stats.avgPostBodyLenByUser.map(x => x.value) }],
  },
});

// Chart 2: Top posts por longitud del título (horizontal)
new Chart(document.getElementById("topPostsByCommentsChart"), {
  type: "bar",
  data: {
    labels: stats.topPostsByTitleLen.map(x => x.label),
    datasets: [{ label: "LENGTH(title)", data: stats.topPostsByTitleLen.map(x => x.value) }],
  },
  options: { indexAxis: "y" },
});