/**
 * youtube-videos.js
 * Fetches and renders relevant YouTube videos for WellPharma service pages.
 * API key is restricted to wellpharmapharmacy.com via Google Cloud Console.
 */

(function () {
  const API_KEY = 'AIzaSyBkvnQyxJGhWLhv3KBDupWeMinuJVuMDtY';
  const API_URL = 'https://www.googleapis.com/youtube/v3/search';

  // Inject styles once
  const style = document.createElement('style');
  style.textContent = `
    .yt-section {
      padding: 3rem 0;
      background: #f8fbf9;
    }
    .yt-section-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .yt-section-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .yt-section-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2e2e2e;
      margin-bottom: 0.4rem;
    }
    .yt-section-header p {
      color: #777;
      font-size: 0.95rem;
    }
    .yt-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    @media (max-width: 900px) { .yt-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 580px) { .yt-grid { grid-template-columns: 1fr; } }
    .yt-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      transition: box-shadow 0.2s;
    }
    .yt-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
    .yt-thumb {
      position: relative;
      cursor: pointer;
      background: #000;
      aspect-ratio: 16/9;
      overflow: hidden;
    }
    .yt-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: opacity 0.2s;
    }
    .yt-thumb:hover img { opacity: 0.85; }
    .yt-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .yt-play svg { filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4)); }
    .yt-card iframe {
      width: 100%;
      aspect-ratio: 16/9;
      border: none;
      display: block;
    }
    .yt-info {
      padding: 0.85rem 1rem;
    }
    .yt-title {
      font-size: 0.88rem;
      font-weight: 600;
      color: #2e2e2e;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 0.3rem;
    }
    .yt-channel {
      font-size: 0.78rem;
      color: #999;
    }
    .yt-fallback {
      text-align: center;
      padding: 2rem;
      color: #777;
    }
    .yt-fallback a {
      color: rgb(77,123,107);
      font-weight: 600;
      text-decoration: none;
    }
    .yt-fallback a:hover { text-decoration: underline; }
  `;
  document.head.appendChild(style);

  // Play video on click (replaces thumbnail with embedded iframe)
  window._ytPlay = function (btn, videoId) {
    const thumb = btn.parentElement;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    thumb.replaceWith(iframe);
  };

  function buildCard(item) {
    const videoId = item.id.videoId;
    const title   = item.snippet.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const channel = item.snippet.channelTitle.replace(/</g, '&lt;');
    const thumb   = item.snippet.thumbnails.medium
                  ? item.snippet.thumbnails.medium.url
                  : item.snippet.thumbnails.default.url;
    return `
      <div class="yt-card">
        <div class="yt-thumb" onclick="window._ytPlay(this,'${videoId}')" role="button" aria-label="Play: ${title}">
          <img src="${thumb}" alt="${title}" loading="lazy">
          <div class="yt-play">
            <svg width="64" height="44" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/>
              <path d="M45 24 27 14v20" fill="white"/>
            </svg>
          </div>
        </div>
        <div class="yt-info">
          <div class="yt-title">${title}</div>
          <div class="yt-channel">${channel}</div>
        </div>
      </div>`;
  }

  window.loadYouTubeVideos = async function (query, containerId, heading, subheading) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const params = new URLSearchParams({
        part:               'snippet',
        q:                  query,
        type:               'video',
        maxResults:         3,
        relevanceLanguage:  'en',
        safeSearch:         'strict',
        videoEmbeddable:    'true',
        key:                API_KEY,
      });

      const res  = await fetch(API_URL + '?' + params);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data.items || data.items.length === 0) throw new Error('No results');

      container.innerHTML = `
        <div class="yt-section-header">
          <h2>${heading || 'Watch &amp; Learn'}</h2>
          <p>${subheading || 'Educational videos to help you understand your options.'}</p>
        </div>
        <div class="yt-grid">
          ${data.items.map(buildCard).join('')}
        </div>`;

    } catch (err) {
      container.innerHTML = `
        <div class="yt-fallback">
          <p>Browse educational videos about this topic.</p>
          <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}"
             target="_blank" rel="noopener noreferrer">Search on YouTube →</a>
        </div>`;
    }
  };
})();
