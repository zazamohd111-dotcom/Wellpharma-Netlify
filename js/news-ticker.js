(async function () {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  // Category tag colors (matching WellPharma brand palette)
  const TAG_COLORS = {
    'GLP-1 & Weight': '#2e7d5e',
    'Hormones':       '#7b5ea7',
    'Compounding':    '#2a6496',
    'Peptides':       '#c0692a',
    'Maryland Health':'#1a7a3c',
  };

  let articles = [];

  try {
    const res  = await fetch('/api/news.json');
    const data = await res.json();
    articles   = (data.articles || []).filter(a => a.title && a.link);
  } catch (e) {
    // Silently fail — fallback message shown below
  }

  if (articles.length === 0) {
    track.innerHTML =
      '<span class="ticker-item">' +
      '<a href="blog.html">Visit our blog for the latest health updates from WellPharma Pharmacy.</a>' +
      '</span>';
    // No animation needed for single static item
    track.style.animation = 'none';
    return;
  }

  function buildItem(article) {
    const color = TAG_COLORS[article.category] || 'rgba(0,0,0,0.3)';
    const safeTitle = article.title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    return (
      '<span class="ticker-item">' +
        '<span class="ticker-tag" style="background:' + color + '">' +
          article.category +
        '</span>' +
        '<a href="' + article.link + '" target="_blank" rel="noopener noreferrer">' +
          safeTitle +
        '</a>' +
      '</span>' +
      '<span class="ticker-sep" aria-hidden="true">·</span>'
    );
  }

  // Duplicate content for seamless infinite loop
  const html = articles.map(buildItem).join('');
  track.innerHTML = html + html;

  // Set animation duration based on content length (~150px per second)
  // We use half of scrollWidth because content is duplicated
  function calibrate() {
    const halfWidth = track.scrollWidth / 2;
    const duration  = Math.max(30, halfWidth / 90); // 90px/s
    track.style.animationDuration = duration + 's';
  }

  // Wait a tick for the DOM to paint, then calibrate
  requestAnimationFrame(calibrate);
})();
