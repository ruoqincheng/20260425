let seaweeds = [];
let bubbles = [];
let bubblesScene2 = [];
let creatures = [];
let scene = 0; // 0 代表水下場景，1 代表下一個畫面
let iframeElement; // 用於存放作品一的視窗
const seaweedColors = ['#dad7cd', '#a3b18a', '#588157', '#3a5a40', '#344e41'];
const creatureColors = ['#f2dfd7', '#fef9ff', '#d4c1ec', '#9f9fed', '#736ced'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  initElements();

  // 初始化作品一的 iframe
  iframeElement = createElement('iframe');
  iframeElement.attribute('src', 'https://ruoqincheng.github.io/20260323/');
  iframeElement.style('border', '4px solid #023e8a');
  iframeElement.style('border-radius', '15px');
  iframeElement.style('box-shadow', '0 10px 30px rgba(0,0,0,0.5)');
  updateIframeLayout();
  iframeElement.hide();
}

function initElements() {
  // 清空舊資料，確保重新填滿
  seaweeds = [];
  bubbles = [];
  bubblesScene2 = [];
  creatures = [];

  // 初始化水草資料：位置、長度、顏色及擺動隨機位移
  for (let i = 0; i < 100; i++) {
    seaweeds.push({
      x: random(width),
      len: random(100, 350), // 調整水草最大高度
      col: random(seaweedColors),
      offset: random(1000)
    });
  }

  // 初始化泡泡資料
  for (let i = 0; i < 50; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      size: random(5, 25),
      speed: random(0.5, 2),
      opacity: random(50, 180)
    });
  }

  // 初始化第二面的海洋生物（水母）
  for (let i = 0; i < 8; i++) {
    creatures.push({
      x: random(width),
      y: random(height * 0.5, height * 0.8), // 移至波浪區域（中下部）
      size: random(30, 60),
      col: random(creatureColors),
      offset: random(1000),
      speedX: random(0.5, 1.5) // 增加水平移動速度
    });
  }

  // 初始化第二面的泡泡資料 (其中 5 個是大顆的)
  const labels = ["作品一", "作品二", "作品三"];
  for (let i = 0; i < 40; i++) {
    let isLarge = i < 15; // 將大泡泡數量增加到 15 個
    bubblesScene2.push({
      x: random(width),
      y: random(height),
      size: isLarge ? random(80, 120) : random(10, 30), 
      speed: random(0.8, 2.5),
      opacity: random(40, 120),
      // 讓大泡泡循環顯示 作品一、二、三
      label: isLarge ? labels[i % labels.length] : null 
    });
  }
}

function draw() {
  if (scene === 0) {
    // --- 場景 0：原本的水下場景 ---
  background('#caf0f8');

  for (let s of seaweeds) {
    drawSeaweed(s);
  }

  for (let b of bubbles) {
    drawBubble(b);
  }

  // 繪製中央標題
  push();
  textAlign(CENTER, CENTER);
  fill('#023e8a'); // 深藍色字體
  noStroke();
  textSize(min(width, height) * 0.1); // 根據視窗大小動態調整字體大小
  textStyle(BOLD);
  text("期中報告", width / 2, height * 0.45);

  // 新增學號和姓名
  textSize(min(width, height) * 0.035); // 較小的字體大小
  text("414730761 鄭若芹", width / 2, height * 0.52); // 調整位置在期中報告下方
  pop();
  } else {
    // --- 場景 1：下一個畫面 ---
    background('#a2d2ff'); // 設置為指定的藍色

    // 繪製第二面的泡泡
    for (let b of bubblesScene2) {
      drawBubble(b);
    }

    // 繪製海洋生物 (水母)
    for (let c of creatures) {
      drawJellyfish(c);
    }

    // 繪製波動的波浪
    fill(255, 255, 255, 100); // 半透明白色
    noStroke();
    beginShape();
    let waveSpeed = frameCount * 0.005; // 控制波浪移動速度

    // 起始點
    vertex(0, map(noise(0 * 0.008 + waveSpeed), 0, 1, height * 0.4, height * 0.5));

    // 繪製波浪曲線
    for (let x = 0; x <= width; x += 10) {
      let y = map(noise(x * 0.008 + waveSpeed), 0, 1, height * 0.4, height * 0.5); // 調整波浪高度和位置
      curveVertex(x, y);
    }
    vertex(width, map(noise(width * 0.008 + waveSpeed), 0, 1, height * 0.4, height * 0.5)); // 結束點
    vertex(width, height); // 連接到右下角
    vertex(0, height); // 連接到左下角
    endShape(CLOSE); // 封閉形狀並填充
  }
}

function mousePressed() {
  // 只有在第一個場景 (0) 按左鍵才會切換到下一個
  if (mouseButton === LEFT && scene === 0) {
    scene = 1;
  } else if (mouseButton === LEFT && scene === 1) {
    // 遍歷所有泡泡，檢查是否點擊到作品一、二或三
    for (let b of bubblesScene2) {
      if (b.label === "作品一" || b.label === "作品二" || b.label === "作品三") {
        let d = dist(mouseX, mouseY, b.x, b.y);
        if (d < b.size / 2) {
          // 根據點擊的作品標籤，切換對應的 iframe 網址
          if (b.label === "作品一") {
            iframeElement.attribute('src', 'https://ruoqincheng.github.io/20260323/');
          } else if (b.label === "作品二") {
            iframeElement.attribute('src', 'https://ruoqincheng.github.io/20260316/');
          } else if (b.label === "作品三") {
            // 這裡預留作品三的連結，目前先設為與作品二相同或你可以自行替換
            iframeElement.attribute('src', 'https://ruoqincheng.github.io/20260316/'); 
          }
          iframeElement.show();
          break; // 點擊到其中一個就開啟視窗並跳出迴圈
        }
      }
    }
  }
}

function keyPressed() {
  // 在第二個場景 (1) 按下「左箭頭」才會返回前一頁
  if (keyCode === LEFT_ARROW && scene === 1 && iframeElement.style('display') === 'none') {
    scene = 0;
  }
  // 按下 ESC 鍵或空白鍵隱藏作品視窗，回到第二畫面
  if (keyCode === ESCAPE || key === ' ') {
    iframeElement.hide();
  }
}

function drawSeaweed(s) {
  fill(s.col);
  noStroke();
  
  beginShape();
  // 繪製海草右側向上的曲線
  for (let i = 0; i <= 8; i++) {
    let y = map(i, 0, 8, height, height - s.len);
    let xBase = s.x + map(noise(s.offset + frameCount * 0.01 + i * 0.1), 0, 1, -60, 60);
    let w = map(i, 0, 8, 15, 2); // 底部寬度 15，頂部縮小到 2
    let x = xBase + w;
    if (i === 0) curveVertex(x, y); // 起點控制點
    curveVertex(x, y);
  }
  
  // 繪製海草左側向下的曲線回到起點，形成封閉填充形狀
  for (let i = 8; i >= 0; i--) {
    let y = map(i, 0, 8, height, height - s.len);
    let xBase = s.x + map(noise(s.offset + frameCount * 0.01 + i * 0.1), 0, 1, -60, 60);
    let w = map(i, 0, 8, 15, 2);
    let x = xBase - w;
    curveVertex(x, y);
    if (i === 0) curveVertex(x, y); // 終點控制點
  }
  endShape(CLOSE);
}

function drawBubble(b) {
  noStroke();
  // 使用白色加上隨機透明度
  fill(255, 255, 255, b.opacity);
  circle(b.x, b.y, b.size);

  // 如果有標籤，則繪製文字
  if (b.label) {
    push();
    fill(2, 62, 138); // 使用與標題相近的深藍色
    textAlign(CENTER, CENTER);
    textSize(b.size * 0.25); // 根據泡泡大小縮放字體
    text(b.label, b.x, b.y);
    pop();
  }

  // 泡泡向上漂移
  b.y -= b.speed;

  // 如果泡泡飄出頂部，重置到畫面下方
  if (b.y < -b.size) {
    b.y = height + b.size;
    b.x = random(width);
  }
}

function drawJellyfish(j) {
  push();
  // 更新水平位置讓水母移動
  j.x += j.speedX;
  // 如果游出螢幕，從左邊回來
  if (j.x > width + j.size) j.x = -j.size;

  let xMove = map(noise(j.offset + frameCount * 0.01), 0, 1, -20, 20);
  let yMove = map(sin(frameCount * 0.02 + j.offset), -1, 1, -10, 10);
  translate(j.x + xMove, j.y + yMove);

  // 繪製觸手
  stroke(j.col);
  strokeWeight(2);
  noFill();
  for (let i = -j.size / 3; i <= j.size / 3; i += j.size / 3) {
    beginShape();
    for (let y = 0; y < j.size; y += 5) {
      let x = sin(y * 0.1 + frameCount * 0.05) * 5;
      curveVertex(i + x, y);
    }
    endShape();
  }

  // 繪製身體
  noStroke();
  fill(j.col);
  arc(0, 0, j.size, j.size * 0.8, PI, TWO_PI, CHORD);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initElements(); // 當視窗大小改變時，重新產生元素以填滿畫面
  updateIframeLayout();
}

function updateIframeLayout() {
  if (iframeElement) {
    // 設定 iframe 佔據畫面中央 80% 的大小
    let w = width * 0.8;
    let h = height * 0.8;
    iframeElement.size(w, h);
    iframeElement.position((width - w) / 2, (height - h) / 2);
  }
}
