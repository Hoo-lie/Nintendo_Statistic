import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three-gltf-loader@1.111.0/index.min.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";


// GRAPHIQUE 1 : ventes de nes
const ctx = document.getElementById('myChart').getContext('2d');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const rows = data.ventes_nes.filter(r => r.Période !== 'total');  // Filtre les lignes pour enlever les totaux
    const labels = rows.map(r => r.Période);  // Récupère les labels pour l'axe X (périodes)
    const regions = Object.keys(rows[0]).filter(k => k !== 'Période');  // Récupère les colonnes à afficher
    const colours = ['#ec4949ff', '#4959ecff', '#5cec49ff'];  // Couleurs pour les barres

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: regions.map((r, i) => ({
          label: r,
          data: rows.map(row => row[r] || 0), // Valeurs pour chaque région
          backgroundColor: colours[i % colours.length], // Couleur de la barre
        }))
      },
      options: {
        scales: {
          x: { grid: { color: 'rgba(0,255,0,0.1)' }, ticks: { color: '#00ff00', font: { family: 'monospace' } } },
          y: { grid: { color: 'rgba(0,255,0,0.1)' }, ticks: { color: '#00ff00', font: { family: 'monospace' } } }
        },
        plugins: {
          legend: { labels: { color: '#00ff00', font: { family: 'monospace' } } },
          title: {
            display: true,          // Affiche le titre
            text: 'Ventes mondiale de la NES', // Le texte du titre
            color: '#00ff00',       // Couleur du texte
            font: {
              family: 'monospace',
              weight: 'normal'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            titleColor: '#00ff00',
            bodyColor: '#00ff00',
            borderColor: '#00ff00',
            borderWidth: 1,
            titleFont: { family: 'monospace', weight: 'normal' },
            bodyFont: { family: 'monospace' },
            cornerRadius: 0
          }
        }
      }
    });
  })
  .catch(err => console.error(err));


// GRAPHIQUE 2 : podium des consoles portables
fetch("data.json")
  .then(res => res.json())
  .then(json => {

    const rows = json.ventes_consoles_portables;

    const data = rows.map(r => ({
      nom: r.console,
      valeur: Number(r["ventes totales"].replace(/\s+/g, "")) // Nettoie les espaces et convertit en nombre
    }));

    const top3 = data.slice(0, 3);  // Top 3
    const rest = data.slice(3); // Le reste
    const max = top3[0].valeur; // Valeur max pour normaliser les barres

    // dimensions podium
    const w = 350;
    const h = 350;

    // SVG 1 : PODIUM
    let podiumSVG = `
   <svg class="svg_podium" viewBox="0 0 350 250">
      <text x="0" y="20">Top consoles portables</text>
    `;

    // Position verticale de base, largeur des barres et espacement
    const baseY = 180;
    const barWidth = 50;
    const space = 100;

    // Ordre 
const podiumOrder = [1, 0, 2]; // indices du top3

podiumOrder.forEach((idx, i) => {
  const item = top3[idx];
  const barHeight = (item.valeur / max) * 100;

  const x = 50 + i * space;
  const y = baseY - barHeight;

  const podiumNumber = idx === 0 ? 1 : idx === 1 ? 2 : 3;

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

    <text x="${x + barWidth / 2}" y="${y + barHeight / 2}"
          text-anchor="middle" font-size="24" font-weight="bold" class="text_podium">
      ${podiumNumber}
    </text>
  `;
});

    podiumSVG += `</svg>`;

    // CLASSEMENT
    const rankingDiv = document.getElementById("liste_classement");
    rankingDiv.innerHTML = ""; // vide la div avant d’ajouter

    rest.forEach((item, i) => {
      const barWidthPercent = (item.valeur / max) * 100;

      // Container de l'item
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

    // Ajouter le podium
    document.getElementById("podium").innerHTML = podiumSVG;

  })
  .catch(err => console.error(err));


// GRAPHIQUE 3 : La guerre des consôles
const ctx3 = document.getElementById('nintendovssony').getContext('2d');

fetch('data.json')
  .then(res => res.json())
  .then(json => {
    const rows = json.NintendovsSony;

    const labels = rows.map(r => r.Année);
    const nintendoData = rows.map(r => r.Nintendo);
    const sonyData = rows.map(r => r.Sony);

    new Chart(ctx3, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Nintendo',
            data: nintendoData,
            borderColor: 'rgba(236,73,73,1)',
            backgroundColor: 'rgba(236,73,73,0.3)',
            fill: true,        // remplit sous la courbe
            tension: 0.3,       // courbes lissées

            // points carrés
            pointStyle: "rect",
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(236,73,73,1)',
            pointBorderColor: 'rgba(236,73,73,0.3)',
            pointBorderWidth: 0,
          },
          {
            label: 'Sony',
            data: sonyData,
            borderColor: 'rgba(73,89,236,1)',
            backgroundColor: 'rgba(73,89,236,0.3)',
            fill: true,
            tension: 0.3,

            // points carrés
            pointStyle: "rect",
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(73,89,236,1)',
            pointBorderColor: 'rgba(73,89,236,0.3)',
            pointBorderWidth: 0,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#00ff00', font: { family: 'monospace' } }
          },
          title: {
            display: true,          // Affiche le titre
            text: 'Ventes de consoles Nintendo vs Sony', // Le texte du titre
            color: '#00ff00',       // Couleur du texte
            font: {
              family: 'monospace',
              weight: 'normal'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            titleColor: '#00ff00',
            bodyColor: '#00ff00',
            borderColor: '#00ff00',
            borderWidth: 1,
            titleFont: { family: 'monospace', weight: 'normal' },
            bodyFont: { family: 'monospace' },
            cornerRadius: 0,
          }
        },
        scales: {
          x: {
            ticks: { color: '#00ff00', font: { family: 'monospace' } },
            grid: { color: 'rgba(0,255,0,0.1)' }
          },
          y: {
            ticks: { color: '#00ff00', font: { family: 'monospace' } },
            grid: { color: 'rgba(0,255,0,0.1)' }
          }
        }
      }
    });
  })
  .catch(err => console.error(err));


// GRAPHIQUE 4 : Profits de Nintendo
fetch("data.json")
  .then(res => res.json())
  .then(json => {

    const rows = json.profit;
    const years = rows.map(r => r["Année"]);
    const values = rows.map(r => r["Profit net (en million de yen)"]);
    const euroValues = rows.map(r => r["Profit net (en euro)"]);

    // Découper en deux courbes
    const index2014 = years.indexOf(2014);
    const years1 = years.slice(0, index2014 + 1);
    const values1 = values.slice(0, index2014 + 1);

    const years2 = years.slice(index2014);
    const values2 = values.slice(index2014);

    // Dimensions SVG
    const w = 600;
    const h = 300;
    const padding = 40;

    // seulement years1
    let minYear = Math.min(...years1);
    let maxYear = Math.max(...years1);

    // seulement values1
    let minVal = Math.min(...values1);
    let maxVal = Math.max(...values1);

    // Fonctions de conversion années/valeurs
    let x = yr => padding + ((yr - minYear) / (maxYear - minYear)) * (w - padding * 2);
    let y = val => h - padding - ((val - minVal) / (maxVal - minVal)) * (h - padding * 2);

    // Génère un path SVG
    function generatePath(yrs, vals) {
      return yrs.map((yr, i) =>
        `${i === 0 ? "M" : "L"} ${x(yr)} ${y(vals[i])}`
      ).join(" ");
    }

    const path1 = generatePath(years1, values1);
    const path2 = generatePath(years2, values2);

    // svg path1 (créer à l'aide d'un tutoriel libre de droit)
    const svg = `
<svg id="profit_svg" width="100%" viewBox="0 0 ${w} ${h}" style="overflow: visible;">

  <!-- GRID VERTICALE -->
  ${years1.map(yr => `
    <line class="xgrid"
      x1="${x(yr)}" y1="${padding}"
      x2="${x(yr)}" y2="${h - padding}"
      stroke="rgba(0,255,0,0.12)"
      stroke-width="1"
    />
  `).join("")}

  <!-- GRID HORIZONTALE -->
  ${[0, 0.25, 0.5, 0.75, 1].map(p => {
      const val = minVal + p * (maxVal - minVal);
      return `
      <line class="ygrid"
        x1="${padding}" y1="${y(val)}"
        x2="${w - padding}" y2="${y(val)}"
        stroke="rgba(0,255,0,0.12)"
        stroke-width="1"
      />
    `;
    }).join("")}

  <!-- TITRE -->
  <text x="${w / 2}" y="25" text-anchor="middle" fill="#00ff00" font-size="18" font-family="monospace">
    Profit net de Nintendo
  </text>

  <!-- LABELS AXE X (initial = seulement years1) -->
  ${years1.map(yr => `
    <text class="xLabel"
      x="${x(yr)}" y="${h - 5}"
      text-anchor="middle"
      fill="#00ff00"
      font-size="12" font-family="monospace">
      ${yr}
    </text>
  `).join("")}

  <!-- LABELS AXE Y -->
  ${[0, 0.5, 1].map(f => {
      const val = minVal + f * (maxVal - minVal);
      return `
      <text class="yLabel"
        x="5"
        y="${y(val) + 4}"
        fill="#00ff00"
        font-size="12"
        font-family="monospace"
        data-factor="${f}">
        ${Math.round(val)}
      </text>
    `;
    }).join("")}

  <!-- COURBE 1 -->
  <path id="p1" d="${path1}" stroke="#ff0000ff" fill="none" stroke-width="3"/>

  <!-- COURBE 2 -->
  <path id="p2" d="${path2}" stroke="#0077ffff" fill="none" stroke-width="3"/>

  <!-- POINTS -->
  ${years.map((yr, i) => `
    <circle class="profit-point"
      cx="${x(yr)}"
      cy="${y(values[i])}"
      r="10"
      fill="transparent"
      data-year="${yr}"
      data-yen="${values[i]}"
      data-euro="${euroValues[i]}"
      style="cursor:pointer;"
    />
  `).join("")}

</svg>
`;

    document.getElementById("profit").innerHTML = svg;

    // tooltip
    const tooltip = document.getElementById("profitTooltip");
    const points = document.querySelectorAll(".profit-point");

    points.forEach(pt => {
      pt.addEventListener("mouseenter", e => {
        const year = pt.dataset.year;
        const yen = pt.dataset.yen;
        const euro = pt.dataset.euro;

        tooltip.innerHTML = `
          <b>${year}</b><br>
          ${yen} M¥<br>
          ${Number(euro).toLocaleString()} €
        `;
        tooltip.style.opacity = 1;
        tooltip.style.borderRadius = "0";

      });

      pt.addEventListener("mouseleave", () => {
        tooltip.style.opacity = 0;
      });

      pt.addEventListener("mousemove", e => {
        tooltip.style.left = e.clientX + "px";
        tooltip.style.top = e.clientY + "px";
      });
    });

    // animation des paths
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");

    const len1 = p1.getTotalLength();
    const len2 = p2.getTotalLength();

    p1.style.strokeDasharray = len1;
    p1.style.strokeDashoffset = len1;

    p2.style.strokeDasharray = len2;
    p2.style.strokeDashoffset = len2;

    // dléchanchement animation
    const obs1 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          p1.style.transition = "stroke-dashoffset 2s linear";
          p1.style.strokeDashoffset = "0";
          obs1.disconnect();
        }
      });
    });
    obs1.observe(document.getElementById("profit_svg"));

    // fonction update
    function updateYAxisAndPaths() {
      const newY = val =>
        h - padding - ((val - minVal) / (maxVal - minVal)) * (h - padding * 2);

      // labels Y
      document.querySelectorAll("#profit_svg .yLabel").forEach(el => {
        const f = Number(el.dataset.factor);
        const val = minVal + f * (maxVal - minVal);
        el.textContent = Math.round(val);
        el.setAttribute("y", newY(val) + 4);
      });

      // Grid horizontale
      document.querySelectorAll("#profit_svg .ygrid").forEach((el, i) => {
        const val = minVal + i * (maxVal - minVal) / 4;
        const yy = newY(val);
        el.setAttribute("y1", yy);
        el.setAttribute("y2", yy);
      });

      // Labels X
      const svgEl = document.getElementById("profit_svg");
      document.querySelectorAll(".xLabel").forEach(el => el.remove());
      years.forEach(yr => {
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.classList.add("xLabel");
        txt.setAttribute("x", x(yr));
        txt.setAttribute("y", h - 5);
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("fill", "#00ff00");
        txt.setAttribute("font-size", "12");
        txt.setAttribute("font-family", "monospace");
        txt.textContent = yr;
        svgEl.appendChild(txt);
      });

      // Grid verticale
      document.querySelectorAll(".xgrid").forEach(el => el.remove());
      years.forEach(yr => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.classList.add("xgrid");
        line.setAttribute("x1", x(yr));
        line.setAttribute("y1", padding);
        line.setAttribute("x2", x(yr));
        line.setAttribute("y2", h - padding);
        line.setAttribute("stroke", "rgba(0,255,0,0.12)");
        line.setAttribute("stroke-width", 1);
        svgEl.insertBefore(line, svgEl.firstChild);
      });

      // update des paths
      const rebuildPath = (yrs, vals) =>
        vals.map((v, i) => `${i === 0 ? "M" : "L"} ${x(yrs[i])} ${newY(v)}`).join(" ");

      p1.setAttribute("d", rebuildPath(years1, values1));
      p2.setAttribute("d", rebuildPath(years2, values2));

      //update update
      document.querySelectorAll(".profit-point").forEach((pt, i) => {
        const yr = years[i];
        const val = values[i];
        pt.setAttribute("cx", x(yr));
        pt.setAttribute("cy", newY(val));
      });
    }

    // déclanchement animation path2
    let svgIsOnScreen = false;
    let path1Finished = false;
    let path2Played = false;

    p1.addEventListener("transitionend", () => {
      path1Finished = true;
      tryPlayPath2();
    });

    const obs2 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          svgIsOnScreen = true;
        }
      });
    });
    obs2.observe(document.getElementById("profit_svg"));

    window.addEventListener("scroll", tryPlayPath2);

    function tryPlayPath2() {
      if (path2Played || !svgIsOnScreen || !path1Finished) return;

      const rect = document.getElementById("profit_svg").getBoundingClientRect();
      const svgMiddle = rect.top + rect.height / 2;
      const screenMiddle = window.innerHeight / 2;

      if (svgMiddle < screenMiddle) {
        minYear = Math.min(...years);
        maxYear = Math.max(...years);
        minVal = Math.min(...values);
        maxVal = Math.max(...values);

        updateYAxisAndPaths();

        p2.style.transition = "stroke-dashoffset 2.2s linear";
        p2.style.strokeDashoffset = "0";
        path2Played = true;
      }

      
    }

  })
  .catch(err => console.error(err));


// GRAPHIQUE 5 : ventes consoles Nintendo
const ctx5 = document.getElementById("ventesConsoles").getContext("2d");

fetch("data.json")
  .then(res => res.json())
  .then(json => {

    const rows = json.ventes_nintendo;
    const labels = rows.map(r => r.Année);
    const consoles = [
      "NES", "Game Boy", "SNES", "Nintendo 64",
      "Game Boy Advance", "NintendoGameCube",
      "Nintendo DS", "Wii", "Nintendo 3DS",
      "Wii U", "Nintendo Switch"
    ];
    const baseColors = [
      "rgba(236,73,73,",
      "rgba(73,89,236,",
      "rgba(73,236,89,",
      "rgba(236,219,73,",
      "rgba(236,73,210,",
      "rgba(73,236,210,",
      "rgba(180,73,236,",
      "rgba(236,140,73,",
      "rgba(140,236,73,",
      "rgba(73,236,162,",
      "rgba(161,73,236,"
    ];

    const datasets = consoles.map((consoleName, i) => {
      const data = rows.map(r => r[consoleName] ?? NaN);

      if (data.every(v => isNaN(v))) return null;

      return {
        label: consoleName,
        data,
        baseColor: baseColors[i] + "1)",
        dimColor: baseColors[i] + "0.4)",
        borderWidth: 1,

        borderColor: baseColors[i] + "1)",
        tension: 0,

        // points carrés
        pointStyle: "rect",
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: baseColors[i] + "1)",
        pointBorderColor: baseColors[i] + "1)",
        pointBorderWidth: 0,
      };
    }).filter(ds => ds !== null);


    // création du graph
    const chart = new Chart(ctx5, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,

        interaction: {
          mode: "nearest",
          intersect: true
        },

        plugins: {
          title: {
            position: "top",
            display: true,
            text: 'Ventes des consoles Nintendo',
            color: '#00ff00',
            font: {
              family: 'monospace',
              weight: 'normal'
            }
          },

          legend: {
            position: "right",
            labels: {
              color: "#00ff00",
              font: { family: "monospace" },
              usePointStyle: true,
              pointStyle: "rect"
            },

            // survol légende
            onHover(e, legendItem, legend) {
              legend.chart.canvas.style.cursor = 'pointer';

              const index = legendItem.datasetIndex;

              legend.chart.data.datasets.forEach((ds, i) => {
                ds.borderColor = i === index ? ds.baseColor : ds.dimColor;
                ds.pointBackgroundColor = i === index ? ds.baseColor : ds.dimColor;
                ds.borderWidth = i === index ? 3 : 1;
              });

              legend.chart.update("none");
            },

            onLeave(e, legendItem, legend) {
              legend.chart.canvas.style.cursor = 'default';

              legend.chart.data.datasets.forEach((ds) => {
                ds.borderColor = ds.baseColor;
                ds.pointBackgroundColor = ds.baseColor;
                ds.borderWidth = 1;
                
              });

              legend.chart.update("none");
            },

            onClick: (evt, legendItem, legend) => {
              const datasetIndex = legendItem.datasetIndex;
              const dataset = legend.chart.data.datasets[datasetIndex];
              openModal(dataset.label, dataset);
            },
          },

          tooltip: {
            callbacks: {
              label: function (item) {
                return `${item.dataset.label}: ${item.raw.toLocaleString()} unités`;
              }
            },
            backgroundColor: 'rgba(0,0,0,0.9)',
            titleColor: '#00ff00',
            bodyColor: '#00ff00',
            borderColor: '#00ff00',
            borderWidth: 1,
            titleFont: { family: 'monospace', weight: 'normal' },
            bodyFont: { family: 'monospace' },
            cornerRadius: 0
          }
        },

        // hover d'une courbe
        onHover: (event, activeElements) => {
          const chartInstance = event.chart;
          const canvas = chartInstance.canvas;

          canvas.style.cursor = activeElements.length > 0 ? "pointer" : "default";

          if (activeElements.length > 0) {
            const idx = activeElements[0].datasetIndex;

            chartInstance.data.datasets.forEach((ds, i) => {
              ds.borderWidth = i === idx ? 3 : 1;
              ds.pointRadius = i === idx ? 7 : 4;
              ds.borderColor = i === idx ? ds.baseColor : ds.dimColor;
              ds.pointBackgroundColor = i === idx ? ds.baseColor : ds.dimColor;
            });
          } else {
            chartInstance.data.datasets.forEach((ds) => {
              ds.borderWidth = 1;
              ds.pointRadius = 4;
              ds.borderColor = ds.baseColor;
              ds.pointBackgroundColor = ds.baseColor;
            });
          }

          chartInstance.update("none");
        },

        onClick: (evt, activeElements) => {
          if (activeElements.length > 0) {
            const chartInstance = evt.chart;
            const datasetIndex = activeElements[0].datasetIndex;
            const dataset = chartInstance.data.datasets[datasetIndex];
            openModal(dataset.label, dataset);
          }
        },

        scales: {
          x: {
            ticks: { color: "#00ff00", font: { family: "monospace" } },
            grid: { color: "rgba(0,255,0,0.1)" }
          },
          y: {
            ticks: { color: "#00ff00", font: { family: "monospace" } },
            grid: { color: "rgba(0,255,0,0.1)" }
          }
        }
      }

    });


      // Modèles 3D
let scene, camera, renderer, console3D;
let animationId = null;

function init(modelName) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#111");


    // caméra
    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        5000
    );
    camera.position.set(0, 0, 10);

    // lumière
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // textures
    const envTexture = new THREE.CubeTextureLoader().load([
        "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
        "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
        "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
        "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
        "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
        "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg"
    ]);
    scene.environment = envTexture;

    //render
    renderer = new THREE.WebGLRenderer({ antialias: true });

    const modalD = document.querySelector(".modalD");
    const rect = modalD.getBoundingClientRect();

    // Attendre que le modal ait une vraie taille
    if (rect.width === 0 || rect.height === 0) {
        setTimeout(() => init(modelName), 50);
        return;
    }

    modalD.appendChild(renderer.domElement);
    renderer.setSize(rect.width, rect.height);

    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();

    // charger le modèle
    const loader = new GLTFLoader();
    loader.load(
        `models3D/${modelName}.gltf`,
        (gltf) => {
            console3D = gltf.scene;

            console3D.scale.set(0.3, 0.3, 0.3);
            console3D.position.set(0, 0, 0);

            console3D.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.metalness = 0.2;
                    child.material.roughness = 0;
                    child.material.envMapIntensity = 0.8;
                    child.material.clearcoat = 0.2;
                    child.material.clearcoatRoughness = 0.1;
                    child.material.needsUpdate = true;
                }
            });

            scene.add(console3D);
            startAnimation();
        },
        undefined,
        (err) => console.error("Erreur chargement modèle :", err)
    );

    window.addEventListener("resize", onWindowResize);
}

// adapte la taille de la fenêtre
function onWindowResize() {
    const modalD = document.querySelector(".modalD");
    const rect = modalD.getBoundingClientRect();

    if (!renderer) return;

    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();

    renderer.setSize(rect.width, rect.height);
}

// animation
function startAnimation() {
    function animate3D() {
        animationId = requestAnimationFrame(animate3D);

        if (console3D) {
            console3D.rotation.y += 0.005;
            console3D.rotation.x = 0.5;
        }

        renderer.render(scene, camera);
    }

    animate3D();
}

function stopAnimation() {
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
}

// ouverture modal
function openModal(name, dataset) {
    const info = json.infos_consoles.find((c) => c.console === name);
    const modelName = info.model3D;

    document.getElementById("modalTitle").innerText = name;

    document.getElementById("modalContent").innerText =
        "Total des ventes : " +
        dataset.data.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0).toLocaleString() +
        " unités";

    document.getElementById("modalDescrition").innerText =
        "Année de sortie : " + info.annee;

    document.getElementById("modalGames").innerText =
        "Jeux phares : " + info.jeux;

    const modal = document.getElementById("consoleModal");
    modal.style.display = "flex";

    const modalD = document.querySelector(".modalD");

    // Supprimer ancien canvas + animation
    const oldCanvas = modalD.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();
    stopAnimation();

    // délai pour que le modal se rende correctement
    setTimeout(() => {
        init(modelName);
    }, 50);
}

      const modal = document.getElementById("consoleModal");
      function closeModal() {
        modal.style.display = "none";
      }

      const btn_modal = document.getElementById("btn_modal");
      btn_modal.addEventListener("click", function (event) {
        closeModal();
      });

      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          closeModal();
        }
      });
    window.addEventListener('resize', () => {
      chart.resize();
    });
  })
  .catch(err => console.error(err));


// background
const grid = document.querySelector('.grid-layer');
let targetY = 0;
let currentY = 0;

window.addEventListener('scroll', () => {
  targetY = -window.scrollY * 0.1; // delay
});

function animateBackground() {
  currentY += (targetY - currentY) * 0.03;
  grid.style.backgroundPosition = `0 ${currentY}px`;
  requestAnimationFrame(animateBackground);
}

animateBackground();


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


// tv animation
const body = document.body;
const tvContainer = document.querySelector('#container_tv');
const tvSprite = document.querySelector('.anim-tv .tv');

// Bloquer le scroll au départ
body.style.overflow = 'hidden';

// Créer l'image finale
const CadreTv = document.createElement('img');
const EcranTv = document.createElement('img');
CadreTv.src = 'img/tv/cadre_tv.webp';
EcranTv.src = 'img/tv/ecran_tv.webp'
CadreTv.classList.add('tv-final');
EcranTv.classList.add('tv-final');
EcranTv.classList.add('ecran_tv');
tvContainer.appendChild(CadreTv);
tvContainer.appendChild(EcranTv);

tvSprite.addEventListener('animationend', () => {
  document.addEventListener('click', () => {
    body.style.overflow = '';        // débloque le scroll
    tvSprite.style.display = 'none'; // cache la sprite
    EcranTv.style.display = 'block';
    CadreTv.style.display = 'block';
  }, { once: true }); // un seul clic
});

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});


