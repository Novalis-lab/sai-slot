/*
 * サイ⚪︎スロット 本体プログラム
 * メニューの中身は menu-data.js にあります（このファイルは基本さわらなくてOK）
 */
(function () {
  "use strict";

  // ---------- 画面の部品を取得 ----------
  const budgetInput = document.getElementById("budget");
  const drinkBarCheck = document.getElementById("opt-drinkbar");
  const mainCheck = document.getElementById("opt-main");
  const categoryList = document.getElementById("category-list");
  const spinButton = document.getElementById("spin");
  const messageBox = document.getElementById("message");
  const resultBox = document.getElementById("result");
  const reelsList = document.getElementById("reels");
  const totalText = document.getElementById("total");
  const remainText = document.getElementById("remain");
  const meterBar = document.getElementById("meter-bar");
  const verdictText = document.getElementById("verdict");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- 文字のモザイク ----------
  // class="mosaic" の文字を、小さく描いてからカクカクのまま拡大してモザイクにする
  const MOSAIC_BLOCK = 5; // モザイクの1マスの大きさ（px）。大きいほど読めなくなる

  function applyMosaic(el) {
    const text = el.textContent;
    const style = getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const font = style.fontWeight + " " + fontSize + "px " + style.fontFamily;

    // フォントの読み込みを待ってから描く（待たないと別の字形でモザイクになる）
    const loading = document.fonts ? document.fonts.load(font, text) : Promise.resolve();
    loading.catch(function () {}).then(function () {
      drawMosaic(el, text, style, fontSize, font);
    });
  }

  function drawMosaic(el, text, style, fontSize, font) {
    // 文字の幅を測る
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = font;
    const width = Math.ceil(measure.measureText(text).width + parseFloat(style.letterSpacing || 0) * text.length);
    const height = Math.ceil(fontSize * 1.2);

    // マスの数だけの小さいキャンバスに、縮小して文字を描く
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width / MOSAIC_BLOCK);
    canvas.height = Math.ceil(height / MOSAIC_BLOCK);
    const ctx = canvas.getContext("2d");
    ctx.scale(1 / MOSAIC_BLOCK, 1 / MOSAIC_BLOCK);
    ctx.font = font;
    ctx.fillStyle = style.color;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = style.letterSpacing;
    ctx.fillText(text, 0, height / 2);

    // 元の大きさに引き伸ばして表示（ここでカクカクになる）
    canvas.className = "mosaic-canvas";
    canvas.style.width = canvas.width * MOSAIC_BLOCK + "px";
    canvas.style.height = canvas.height * MOSAIC_BLOCK + "px";
    canvas.setAttribute("aria-hidden", "true");

    // 読み上げソフト用に、元の文字は見えない形で残す
    const hidden = document.createElement("span");
    hidden.className = "visually-hidden";
    hidden.textContent = text;

    el.textContent = "";
    el.appendChild(canvas);
    el.appendChild(hidden);
  }

  document.querySelectorAll(".mosaic").forEach(applyMosaic);

  // ---------- 下準備 ----------
  document.getElementById("menu-version").textContent = MENU_VERSION;
  document.getElementById("drinkbar-price").textContent = "（+" + DRINK_BAR.price + "円）";

  const categoryOrder = CATEGORIES.map(function (c) { return c.name; });
  const mainCategories = CATEGORIES.filter(function (c) { return c.main; }).map(function (c) { return c.name; });

  // カテゴリのチェックボックスを作る
  CATEGORIES.forEach(function (cat) {
    const label = document.createElement("label");
    label.className = "chip";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = cat.name;
    input.checked = cat.defaultOn !== false;
    const span = document.createElement("span");
    span.textContent = cat.emoji + " " + cat.name;
    label.appendChild(input);
    label.appendChild(span);
    categoryList.appendChild(label);
  });

  // ---------- 予算の入力まわり ----------
  function getBudget() {
    const value = Math.floor(Number(budgetInput.value));
    return Number.isFinite(value) ? value : 0;
  }

  function setBudget(value) {
    budgetInput.value = Math.max(0, Math.min(100000, value));
    updatePresetHighlight();
  }

  function updatePresetHighlight() {
    const now = getBudget();
    document.querySelectorAll(".presets button").forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.dataset.budget) === now);
    });
  }

  document.querySelectorAll(".step").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setBudget(getBudget() + Number(btn.dataset.step));
    });
  });
  document.querySelectorAll(".presets button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setBudget(Number(btn.dataset.budget));
    });
  });
  budgetInput.addEventListener("input", updatePresetHighlight);
  updatePresetHighlight();

  // ---------- 組み合わせを作る ----------

  // 配列をランダムに並べ替える
  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function sumPrice(items) {
    return items.reduce(function (sum, item) { return sum + item.price; }, 0);
  }

  /*
   * 1回分の組み合わせを作る
   *  1. メニューをシャッフル
   *  2. （必要なら）主食を1品先に選ぶ
   *  3. シャッフル順に「残りのお金で買えるなら追加」をくり返す
   *  4. 仕上げに「もっと高い品と入れ替えて残りを減らせないか」を試す
   *     → これで予算ぴったりに近づきます
   */
  function buildOnce(pool, money, needMain) {
    const shuffled = shuffle(pool);
    const chosen = [];
    let left = money;

    if (needMain) {
      const main = shuffled.find(function (item) {
        return mainCategories.indexOf(item.category) !== -1 && item.price <= left;
      });
      if (!main) return null;
      chosen.push(main);
      left -= main.price;
    }

    shuffled.forEach(function (item) {
      if (chosen.indexOf(item) === -1 && item.price <= left) {
        chosen.push(item);
        left -= item.price;
      }
    });

    // 入れ替えで残りを減らす
    let improved = true;
    while (improved && left > 0) {
      improved = false;
      for (let i = 0; i < chosen.length && !improved; i++) {
        const current = chosen[i];
        // 主食を入れ替えるときは、主食どうしで入れ替える
        const mustBeMain = needMain && i === 0;
        const candidates = shuffle(pool).filter(function (item) {
          return chosen.indexOf(item) === -1 &&
            item.price > current.price &&
            item.price - current.price <= left &&
            (!mustBeMain || mainCategories.indexOf(item.category) !== -1);
        });
        if (candidates.length > 0) {
          left -= candidates[0].price - current.price;
          chosen[i] = candidates[0];
          improved = true;
        }
      }
    }
    return chosen;
  }

  /*
   * たくさん試して、予算にいちばん近いものの中からランダムに1つ選ぶ
   */
  function pickCombination(pool, money, needMain) {
    const TRIES = 300;
    const TOLERANCE = 30; // ベストから何円差までを「当たり候補」にするか
    const results = [];
    const seen = {};

    for (let t = 0; t < TRIES; t++) {
      const combo = buildOnce(pool, money, needMain);
      if (!combo || combo.length === 0) continue;
      const key = combo.map(function (i) { return i.code + i.name; }).sort().join("|");
      if (seen[key]) continue;
      seen[key] = true;
      results.push({ items: combo, left: money - sumPrice(combo) });
    }
    if (results.length === 0) return null;

    const bestLeft = Math.min.apply(null, results.map(function (r) { return r.left; }));
    const good = results.filter(function (r) { return r.left <= bestLeft + TOLERANCE; });
    return good[Math.floor(Math.random() * good.length)].items;
  }

  // ---------- スロットの演出 ----------

  function yen(n) {
    return n.toLocaleString("ja-JP") + "円";
  }

  function makeReelItem(item) {
    const div = document.createElement("div");
    div.className = "reel-item";
    const name = document.createElement("span");
    name.className = "reel-name";
    const text = document.createElement("span");
    text.className = "reel-text";
    text.textContent = item.name;
    name.appendChild(text);
    const cat = document.createElement("span");
    cat.className = "reel-cat";
    cat.textContent = item.category || "ドリンク";
    name.appendChild(cat);
    const price = document.createElement("span");
    price.className = "reel-price";
    price.textContent = yen(item.price);
    div.appendChild(name);
    div.appendChild(price);
    return div;
  }

  // 1本のリールを作って回す。止まったら resolve する
  function spinReel(finalItem, index, pool) {
    return new Promise(function (resolve) {
      const li = document.createElement("li");
      li.className = "reel" + (finalItem === DRINK_BAR ? " drinkbar" : "");
      const code = document.createElement("div");
      code.className = "reel-code";
      code.textContent = "？";
      const windowEl = document.createElement("div");
      windowEl.className = "reel-window";
      const strip = document.createElement("div");
      strip.className = "reel-strip";

      // ダミーのメニューを並べて、最後に本当の結果を置く
      const dummyCount = reduceMotion ? 2 : 14 + index * 4;
      for (let i = 0; i < dummyCount; i++) {
        strip.appendChild(makeReelItem(pool[Math.floor(Math.random() * pool.length)]));
      }
      strip.appendChild(makeReelItem(finalItem));

      windowEl.appendChild(strip);
      li.appendChild(code);
      li.appendChild(windowEl);
      reelsList.appendChild(li);

      const itemHeight = windowEl.clientHeight;
      const duration = reduceMotion ? 200 : 1100 + index * 350;

      // 次の描画タイミングで動かし始める
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          strip.style.transition = "transform " + duration + "ms cubic-bezier(0.15, 0.7, 0.25, 1.08)";
          strip.style.transform = "translateY(" + (-itemHeight * dummyCount) + "px)";
        });
      });

      setTimeout(function () {
        code.textContent = finalItem.code || "－";
        li.classList.add("stopped");
        resolve();
      }, duration + 50);
    });
  }

  // 数字がカウントアップする演出
  // spinId … 何回目のスロットか。新しく回したら古い演出は止める
  let spinCount = 0;
  function countUp(el, target, spinId) {
    if (reduceMotion) { el.textContent = yen(target); return; }
    const ms = 600;
    let start = null;
    function step(now) {
      if (spinId !== spinCount) return;
      if (start === null) start = now;
      const p = Math.max(0, Math.min(1, (now - start) / ms));
      el.textContent = yen(Math.round(target * p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // 念のため、時間がたったら必ず最終値を表示
    setTimeout(function () {
      if (spinId === spinCount) el.textContent = yen(target);
    }, ms + 100);
  }

  // 予算ぴったりのときの紙吹雪
  function launchConfetti() {
    if (reduceMotion) return; // 動きを減らす設定の人には出さない

    const colors = ["#3fae5a", "#ffffff", "#e5484d", "#e9b949", "#2a5d9f"];
    const layer = document.createElement("div");
    layer.className = "confetti-layer";
    layer.setAttribute("aria-hidden", "true");

    const PIECES = 90; // 紙吹雪の枚数
    for (let i = 0; i < PIECES; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      // 位置・色・大きさ・速さをランダムに決める
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[i % colors.length];
      piece.style.width = 6 + Math.random() * 6 + "px";
      piece.style.height = 10 + Math.random() * 8 + "px";
      piece.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      piece.style.setProperty("--spin", (Math.random() * 1080 - 540) + "deg");
      piece.style.animationDuration = 2.2 + Math.random() * 1.6 + "s";
      piece.style.animationDelay = Math.random() * 0.6 + "s";
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);

    // 降り終わったら片付ける
    setTimeout(function () { layer.remove(); }, 4600);
  }

  function showMessage(text) {
    messageBox.textContent = text;
    messageBox.hidden = !text;
  }

  // ---------- 「スロットを回す」ボタン ----------
  spinButton.addEventListener("click", function () {
    const budget = getBudget();
    const useDrinkBar = drinkBarCheck.checked;
    const needMain = mainCheck.checked;

    const enabledCats = Array.prototype.map.call(
      categoryList.querySelectorAll("input:checked"),
      function (input) { return input.value; }
    );
    const pool = MENU_ITEMS.filter(function (item) {
      return !item.hide && enabledCats.indexOf(item.category) !== -1;
    });

    // 入力チェック
    if (budget <= 0) {
      showMessage("予算を入力してください。");
      return;
    }
    if (pool.length === 0) {
      showMessage("カテゴリが1つも選ばれていません。");
      return;
    }
    if (needMain && !pool.some(function (i) { return mainCategories.indexOf(i.category) !== -1; })) {
      showMessage("主食のカテゴリ（パスタ・ピザ・ドリア・肉料理）がすべて外れています。");
      return;
    }

    let money = budget;
    const fixed = [];
    if (useDrinkBar) {
      fixed.push(DRINK_BAR);
      money -= DRINK_BAR.price;
    }

    const combo = money > 0 ? pickCombination(pool, money, needMain) : null;
    if (!combo) {
      const cheapest = Math.min.apply(null, pool
        .filter(function (i) { return !needMain || mainCategories.indexOf(i.category) !== -1; })
        .map(function (i) { return i.price; }));
      const need = cheapest + (useDrinkBar ? DRINK_BAR.price : 0);
      showMessage("予算が足りません…。この条件だと最低 " + yen(need) + " 必要です。");
      return;
    }
    showMessage("");

    // カテゴリ順に並べる（ドリンクバーは最後）
    combo.sort(function (a, b) {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });
    const finalItems = combo.concat(fixed);
    const total = sumPrice(finalItems);
    const remain = budget - total;

    // 結果エリアをリセット
    reelsList.innerHTML = "";
    totalText.textContent = "…";
    remainText.textContent = "…";
    verdictText.textContent = "";
    meterBar.style.width = "0";
    resultBox.hidden = false;
    spinButton.disabled = true;
    spinButton.textContent = "回転中…";
    resultBox.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    const reels = finalItems.map(function (item, i) {
      return spinReel(item, i, pool);
    });

    spinCount++;
    const thisSpin = spinCount;
    Promise.all(reels).then(function () {
      countUp(totalText, total, thisSpin);
      countUp(remainText, remain, thisSpin);
      meterBar.style.width = Math.min(100, (total / budget) * 100) + "%";
      if (remain === 0) {
        verdictText.textContent = "🎯 予算ぴったり！";
        launchConfetti();
      } else if (remain <= 50) {
        verdictText.textContent = "✨ ほぼぴったり！";
      } else {
        verdictText.textContent = "";
      }
      spinButton.disabled = false;
      spinButton.textContent = "もう一回まわす";
    });
  });
})();
