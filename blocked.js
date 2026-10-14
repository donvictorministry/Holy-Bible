/* blocked.js - Blocks desktop computers */
(function () {
  function checkDevice() {
    const isDesktopWidth = window.innerWidth > 900;
    const isMouseOnly = window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window);

    if (isDesktopWidth || isMouseOnly) {
      document.documentElement.innerHTML = `
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mobile Device Required</title>
          <style>
            body {
              margin: 0;
              background-color: #121212;
              color: #ffffff;
              font-family: -apple-system, Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              padding: 24px;
              box-sizing: border-box;
              text-align: center;
            }
            .card {
              max-width: 380px;
              background: #1e1e1e;
              padding: 32px 24px;
              border-radius: 28px;
              border: 1px solid #333;
            }
            h1 { font-size: 1.4rem; color: #adc6ff; margin-bottom: 12px; }
            p { font-size: 0.95rem; line-height: 1.6; color: #a0a0a0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Mobile Device Only</h1>
            <p>This Bible application is configured exclusively for native mobile phone screens. Please access this page using an Android or mobile device.</p>
          </div>
        </body>`;
      throw new Error("Desktop view blocked.");
    }
  }

  checkDevice();
  window.addEventListener('resize', checkDevice);
})();