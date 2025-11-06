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


