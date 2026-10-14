/* blocked.js - Restricts usage strictly to mobile/Android viewports */
(function () {
  function verifyDevice() {
    const isDesktopWidth = window.innerWidth > 900;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window);

    if (isDesktopWidth || hasFinePointer) {
      document.documentElement.innerHTML = `
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Restricted</title>
          <style>
            body {
              margin: 0;
              background-color: #121212;
              color: #e0e0e0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 24px;
              box-sizing: border-box;
              text-align: center;
            }
            .card {
              max-width: 400px;
              background: #1e1e1e;
              padding: 36px 24px;
              border-radius: 28px;
              border: 1px solid #333;
              box-shadow: 0 12px 32px rgba(0,0,0,0.5);
            }
            .android-icon {
              width: 64px;
              height: 64px;
              fill: #3ddc84;
              margin-bottom: 20px;
            }
            h1 { font-size: 1.4rem; margin-bottom: 12px; color: #ffffff; }
            p { font-size: 0.95rem; line-height: 1.6; color: #a0a0a0; margin-bottom: 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <svg class="android-icon" viewBox="0 0 24 24">
              <path d="M16.6 6.4L18 4.7c.2-.2.2-.6 0-.8-.2-.2-.6-.2-.8 0l-1.5 1.8C14.4 5.3 13.2 5 12 5s-2.4.3-3.7.7L6.8 3.9c-.2-.2-.6-.2-.8 0-.2.2-.2.6 0 .8l1.4 1.7C5.4 7.6 4 10.1 4 13h16c0-2.9-1.4-5.4-3.4-6.6zM9 10.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM4 14.5v5c0 .8.7 1.5 1.5 1.5H7v3c0 .6.4 1 1 1s1-.4 1-1v-3h6v3c0 .6.4 1 1 1s1-.4 1-1v-3h1.5c.8 0 1.5-.7 1.5-1.5v-5H4z"/>
            </svg>
            <h1>Mobile Device Only</h1>
            <p>This Bible application is crafted exclusively as a native Android-format reader. Please open this web address on an Android device or phone.</p>
          </div>
        </body>`;
      throw new Error("Desktop access prevented by blocked.js");
    }
  }

  verifyDevice();
  window.addEventListener('resize', verifyDevice);
})();
