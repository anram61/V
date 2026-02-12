// ---------- PAGE 1: store a "user gesture" flag when YES is clicked ----------
(() => {
  const yes = document.getElementById("goYes");
  if (!yes) return;

  yes.addEventListener("click", () => {
    // This helps Page 2 know navigation came from a click (gesture)
    sessionStorage.setItem("fromYesClick", "1");
  });
})();

// ---------- PAGE 1: "No" button dodges ----------
(() => {
  const noBtn = document.getElementById("noBtn");
  if (!noBtn) return;

  const move = () => {
    const pad = 16;
    const maxX = window.innerWidth - noBtn.offsetWidth - pad;
    const maxY = window.innerHeight - noBtn.offsetHeight - pad;

    const x = Math.max(pad, Math.floor(Math.random() * maxX));
    const y = Math.max(pad, Math.floor(Math.random() * maxY));

    noBtn.style.position = "fixed";
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  };

  noBtn.addEventListener("mouseenter", move);
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); move(); }, { passive:false });
})();

// ---------- PAGE 2: YouTube Player (All of Me) ----------
let ytPlayer = null;

// Change this if you want a different YouTube upload of the song
const YT_VIDEO_ID = "450p7goxZqg";

function onYouTubeIframeAPIReady() {
  const mount = document.getElementById("ytPlayer");
  if (!mount) return;

  ytPlayer = new YT.Player("ytPlayer", {
    height: "0",
    width: "0",
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      playsinline: 1,
      loop: 1,
      playlist: YT_VIDEO_ID
    },
    events: {
      onReady: () => {
        // Start muted first (some browsers allow autoplay only if muted)
        safeMuteAndPlay();

        // If we came from a real click on YES, try to unmute + play right away
        const fromYes = sessionStorage.getItem("fromYesClick") === "1";
        if (fromYes) {
          // Clear it so refreshing doesn't keep forcing attempts
          sessionStorage.removeItem("fromYesClick");
          setTimeout(() => {
            tryUnmuteAndPlay();
          }, 350);
        }
      }
    }
  });
}

function safeMuteAndPlay() {
  if (!ytPlayer) return;
  try {
    ytPlayer.mute();
    ytPlayer.playVideo();
  } catch (_) {}
}

function tryUnmuteAndPlay() {
  if (!ytPlayer) return;
  try {
    ytPlayer.unMute();
    ytPlayer.setVolume(80);
    ytPlayer.playVideo();
  } catch (_) {}
}

// Button to guarantee music starts on tap
(() => {
  const playBtn = document.getElementById("playSong");
  if (!playBtn) return;

  playBtn.addEventListener("click", () => {
    tryUnmuteAndPlay();

    // Toggle label (simple)
    playBtn.textContent = "🎶 Playing… (tap again to pause)";
    playBtn.dataset.playing = playBtn.dataset.playing === "1" ? "0" : "1";

    if (playBtn.dataset.playing === "0") {
      try { ytPlayer.pauseVideo(); } catch (_) {}
      playBtn.textContent = "🎵 Tap to Play “All of Me”";
    } else {
      tryUnmuteAndPlay();
    }
  });
})();

// ---------- PAGE 2: rose shower ----------
(() => {
  const btn = document.getElementById("makeRoses");
  if (!btn) return;

  function dropRose() {
    const rose = document.createElement("div");
    rose.textContent = "🌹";
    rose.style.position = "fixed";
    rose.style.left = Math.floor(Math.random() * 100) + "vw";
    rose.style.top = "-40px";
    rose.style.fontSize = (18 + Math.random() * 22) + "px";
    rose.style.zIndex = "9999";
    rose.style.filter = "drop-shadow(0 10px 14px rgba(0,0,0,.25))";
    rose.style.transition = "transform 3.2s linear, opacity 3.2s ease";
    document.body.appendChild(rose);

    requestAnimationFrame(() => {
      const drift = (Math.random() * 60 - 30);
      rose.style.transform = `translate(${drift}px, 120vh) rotate(${Math.random()*240-120}deg)`;
      rose.style.opacity = "0";
    });

    setTimeout(() => rose.remove(), 3300);
  }

  btn.addEventListener("click", () => {
    for (let i = 0; i < 24; i++) {
      setTimeout(dropRose, i * 70);
    }
  });
})();
