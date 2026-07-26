// ---------- ambient sky ----------
  const sky = document.getElementById('sky');
  const MOTE_COUNT = 14;
  for(let i=0;i<MOTE_COUNT;i++){
    const m = document.createElement('div');
    m.className = 'mote';
    const size = 6 + Math.random()*16;
    m.style.width = size+'px';
    m.style.height = size+'px';
    m.style.left = (Math.random()*100)+'%';
    m.style.setProperty('--drift', (Math.random()*80-40)+'px');
    m.style.animationDuration = (10 + Math.random()*10)+'s';
    m.style.animationDelay = (Math.random()*14)+'s';
    sky.appendChild(m);
  }

  const GLINT_COUNT = 16;
  for(let i=0;i<GLINT_COUNT;i++){
    const g = document.createElement('div');
    g.className = 'glint';
    const size = 3 + Math.random()*5;
    g.style.width = size+'px';
    g.style.height = size+'px';
    g.style.left = (Math.random()*100)+'%';
    g.style.top = (Math.random()*70)+'%';
    g.style.animationDuration = (2 + Math.random()*3)+'s';
    g.style.animationDelay = (Math.random()*5)+'s';
    sky.appendChild(g);
  }

  const GULL_EMOJIS = ['🕊','🐦'];
  const GULL_COUNT = 3;
  for(let i=0;i<GULL_COUNT;i++){
    const b = document.createElement('div');
    b.className = 'seagull';
    b.textContent = GULL_EMOJIS[i % GULL_EMOJIS.length];
    b.style.top = (8 + Math.random()*30)+'%';
    b.style.animationDuration = (26 + Math.random()*18)+'s';
    b.style.animationDelay = (Math.random()*20)+'s';
    document.body.appendChild(b);
  }

  // ---------- captcha đếm mặt trời ----------
  const captchaSuns = document.getElementById('captchaSuns');
  const captchaInput = document.getElementById('captchaInput');
  const captchaRefresh = document.getElementById('captchaRefresh');
  const DECOY_EMOJIS = ['☁','⭐','🌙'];
  let sunAnswer = 0;

  function generateCaptcha(){
    sunAnswer = 3 + Math.floor(Math.random()*5); // 3-7
    const totalIcons = sunAnswer + 1 + Math.floor(Math.random()*3);
    let icons = [];
    for(let i=0;i<sunAnswer;i++) icons.push('☀');
    while(icons.length < totalIcons){
      icons.push(DECOY_EMOJIS[Math.floor(Math.random()*DECOY_EMOJIS.length)]);
    }
    for(let i=icons.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [icons[i], icons[j]] = [icons[j], icons[i]];
    }
    captchaSuns.textContent = icons.join(' ');
    captchaInput.value = "";
  }
  generateCaptcha();
  captchaRefresh.addEventListener('click', generateCaptcha);

  const websiteHoneypot = document.getElementById('website');

  // ---------- banner ảnh trường ----------
  const schoolBannerImg = document.getElementById('schoolBannerImg');
  const schoolBanner = document.getElementById('schoolBanner');
  // 🏫 Đường dẫn ảnh banner trường bạn — đổi thành tên file ảnh (vd: "school-banner.jpg") hoặc link ảnh trực tiếp.
  const SCHOOL_BANNER_URL = "school-banner.jpg";
  schoolBannerImg.src = SCHOOL_BANNER_URL;
  schoolBannerImg.addEventListener('error', () => {
    schoolBanner.innerHTML = '<div class="banner-placeholder">Thêm ảnh trường bạn vào đây — đổi SCHOOL_BANNER_URL trong index.html</div>';
  });

  // ---------- nhạc nền ----------
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  // 🎵 Đường dẫn tới file nhạc bạn muốn phát nền (tên file cùng thư mục hoặc URL .mp3 trực tiếp).
  const MUSIC_URL = "music.mp3";
  bgMusic.src = MUSIC_URL;
  let isPlaying = false;

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.textContent = "🎵";
      musicToggle.classList.remove('playing');
    } else {
      bgMusic.play().catch(() => {
        showStatus("Không tìm thấy file nhạc — kiểm tra lại MUSIC_URL trong index.html.", false);
      });
      musicToggle.textContent = "⏸";
      musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  // ---------- form logic ----------
  // ⚠️ THAY URL NÀY bằng Web App URL sau khi bạn deploy Google Apps Script (xem SETUP.md)
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaR14CPkIBkeN4qgawIBEgvD6EtUa8WEkMEMFqrcyVSiH2mVdSZebY_aE6MdwtJX2K/exec";

  const contentEl = document.getElementById('content');
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const polaroid = document.getElementById('polaroid');
  const fileLabelText = document.getElementById('fileLabelText');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('status');
  const card = document.getElementById('card');
  const formView = document.getElementById('formView');
  const successView = document.getElementById('successView');
  const againBtn = document.getElementById('againBtn');

  let imageBase64 = "";
  let imageMime = "";

  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showStatus("Ảnh quá lớn (tối đa 5MB).", false);
      imageInput.value = "";
      return;
    }
    imageMime = file.type;
    fileLabelText.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      imageBase64 = e.target.result.split(',')[1];
      preview.src = e.target.result;
      polaroid.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  submitBtn.addEventListener('click', async () => {
    const content = contentEl.value.trim();

    if (websiteHoneypot.value.trim() !== "") {
      showStatus("Có lỗi xảy ra, vui lòng thử lại.", false);
      return;
    }

    if (!content) {
      showStatus("Bạn chưa viết nội dung confession.", false);
      return;
    }

    const userAnswer = parseInt(captchaInput.value, 10);
    if (isNaN(userAnswer) || userAnswer !== sunAnswer) {
      showStatus("Đếm lại số mặt trời ☀ giúp mình nhé.", false);
      generateCaptcha();
      return;
    }

    if (SCRIPT_URL.includes("PASTE_YOUR")) {
      showStatus("Chưa cấu hình SCRIPT_URL trong file index.html.", false);
      return;
    }

    submitBtn.disabled = true;
    showStatus("Đang gửi...", true);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          content: content,
          imageBase64: imageBase64,
          imageMime: imageMime
        }),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
      const data = await res.json();
      if (data.success) {
        card.classList.add('sending');
        setTimeout(() => {
          formView.style.display = 'none';
          successView.style.display = 'block';
          card.classList.remove('sending');
          card.style.transform = 'none';
          card.style.opacity = '1';
          contentEl.value = "";
          imageInput.value = "";
          imageBase64 = "";
          polaroid.style.display = 'none';
          fileLabelText.textContent = "Đính kèm hình ảnh (không bắt buộc)";
          statusEl.textContent = "";
          generateCaptcha();
        }, 550);
      } else {
        showStatus("Có lỗi xảy ra: " + (data.error || "không rõ nguyên nhân"), false);
      }
    } catch (err) {
      showStatus("Không gửi được. Vui lòng thử lại.", false);
    } finally {
      submitBtn.disabled = false;
    }
  });

  againBtn.addEventListener('click', () => {
    successView.style.display = 'none';
    formView.style.display = 'block';
  });

  function showStatus(msg, ok) {
    statusEl.textContent = msg;
    statusEl.className = "status " + (ok ? "ok" : "err");
  }
