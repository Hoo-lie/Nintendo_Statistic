const ctx = document.getElementById('myChart').getContext('2d');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const rows = data.ventes_nes.filter(r => r.Période !== 'total');
    const labels = rows.map(r => r.Période);
    const regions = Object.keys(rows[0]).filter(k => k !== 'Période');
    const colours = ['#ec4949ff','#4959ecff', '#5cec49ff'];

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: regions.map((r,i) => ({
          label: r,
          data: rows.map(row => row[r] || 0),
          backgroundColor: colours[i % colours.length],
        }))
      },
      options: {
    scales: {
      x: { grid: { color: 'rgba(0,255,0,0.1)' }, ticks: { color: '#00ff00', font: { family: 'monospace' } } },
      y: { grid: { color: 'rgba(0,255,0,0.1)' }, ticks: { color: '#00ff00', font: { family: 'monospace' } } }
    },
    plugins: {
      legend: { labels: { color: '#00ff00', font: { family: 'monospace' } } }
    }
  }
    });
  })
  .catch(err => console.error(err));

// -----------------------------
// PODIUM + CLASSEMENT (SVG) — PORTABLE CONSOLES
// -----------------------------

fetch("data.json")
  .then(res => res.json())
  .then(json => {

    const rows = json.ventes_consoles_portables;

    const data = rows.map(r => ({
      nom: r.console,
      valeur: Number(r["ventes totales"].replace(/\s+/g, ""))
    }));

    const top3 = data.slice(0, 3);
    const rest = data.slice(3);
    const max = top3[0].valeur;

    // dimensions communes pour le podium
    const w = 350;
    const h = 350;

    // -----------------------------
    // SVG 1 : PODIUM
    // -----------------------------
    let podiumSVG = `
   <svg class="svg_podium" viewBox="0 0 350 250" style="max-width:100%; height:auto; display:block;">

      <text x="0" y="20">Top consoles portables</text>
    `;

    const baseY = 180;
    const barWidth = 50;
    const space = 100;

    top3.forEach((item, i) => {
      const barHeight = (item.valeur / max) * 100;
      const x = 50 + i * space;
      const y = baseY - barHeight;

      podiumSVG += `
        <rect class="bar-vertical"
              x="${x}" y="${y}"
              width="${barWidth}" height="${barHeight}">
        </rect>

        <text x="${x + barWidth / 2}" y="${baseY + 25}" text-anchor="middle">
          ${item.nom}
        </text>

        <text x="${x + barWidth / 2}" y="${y - 10}" text-anchor="middle">
          ${item.valeur.toLocaleString()}
        </text>
      `;
    });

    podiumSVG += `</svg>`;

    // -----------------------------
    // CLASSEMENT (div responsive)
    // -----------------------------
    const rankingDiv = document.getElementById("liste_classement");
    rankingDiv.innerHTML = ""; // vide au cas où

    rest.forEach((item, i) => {
      const barWidthPercent = (item.valeur / max) * 100;

      // Conteneur de l'item
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("ranking-item");

      // Texte (rank + nom + valeur)
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("ranking-info");
      infoDiv.textContent = `${i + 4}. ${item.nom} - ${item.valeur.toLocaleString()}`;

      // Barre horizontale
      const barDiv = document.createElement("div");
      barDiv.classList.add("ranking-bar");
      barDiv.style.width = barWidthPercent + "%";

      // Assemblage
      itemDiv.appendChild(infoDiv);
      itemDiv.appendChild(barDiv);
      rankingDiv.appendChild(itemDiv);
    });

    // Injecter le podium
    document.getElementById("podium").innerHTML = podiumSVG;

  })
  .catch(err => console.error(err));





// background
const grid = document.querySelector('.grid-layer');
let targetY = 0;
let currentY = 0;  

window.addEventListener('scroll', () => {
  targetY = -window.scrollY * 0.1; // delay
});

function animate() {
  currentY += (targetY - currentY) * 0.03; 
  grid.style.backgroundPosition = `0 ${currentY}px`;
  requestAnimationFrame(animate);
}

animate();


// Character animation
const c = document.querySelector('.character');
let lastScroll = 0;
let lastDir = 'down';
let timeout;

window.addEventListener('scroll', () => {
  const dir = scrollY > lastScroll ? 'down' : 'up';

  if (dir !== lastDir) {
    c.src = `img/Bonhomme/sprite_${dir}.png`;
    lastDir = dir;
  }

  // activate animation
  c.classList.add('walking');

  // goes back to idle
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    c.classList.remove('walking');
    c.style.transform = 'translateX(0px)'; 
  }, 150);

  lastScroll = scrollY;
});
