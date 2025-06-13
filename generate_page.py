# generate_pages.py

from datetime import datetime, timezone, timedelta
import os

# --- 日付・曜日・アファメーション設定 ---
JST = timezone(timedelta(hours=9))
now = datetime.now(JST)
date_str     = now.strftime("%Y-%m-%d")
weekday_list = ["月","火","水","木","金","土","日"]
weekday_str  = weekday_list[now.weekday()]
affirmation  = "今日も一歩前へ進もう"

# --- logs ディレクトリ作成 ---
os.makedirs("logs", exist_ok=True)

# --- 日付ページの HTML を生成 ---
daily_html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>{date_str} {weekday_str}</title>
  <style>
    .container {{ display: flex; align-items: flex-start; gap: 20px; }}
    .video-area {{ flex: 0 0 auto; }}
    .action-area {{ display: flex; flex-direction: column; gap: 8px; }}
    #log-button {{ padding: 8px 16px; font-size: 1rem; }}
    #last-click {{ font-weight: bold; }}
    /* 記録リスト用 */
    #records {{ list-style: none; padding: 0; margin-top: 20px; }}
    #records li {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 8px;
    }}
    .del-btn {{
      background: #e74c3c;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 3px;
      cursor: pointer;
    }}
  </style>
</head>
<body>
  <h1>{date_str} {weekday_str}</h1>
  <p>{affirmation}</p>

  <div class="container">
    <div class="video-area">
      <iframe
        width="360" height="640"
        src="https://www.youtube.com/embed/BUYUN3gXtd8?mute=1&loop=1&playlist=BUYUN3gXtd8"
        frameborder="0"
        allow="encrypted-media; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    </div>

    <div class="action-area">
      <button id="log-button">記録を追加</button>
      <div>最終送信時刻：<span id="last-click">まだ送信されていません</span></div>
      <ul id="records"></ul>
    </div>
  </div>

  <script>
    const STORAGE_KEY = 'dailyPageRecords_{date_str}';
    let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const btn    = document.getElementById('log-button');
    const last   = document.getElementById('last-click');
    const listEl = document.getElementById('records');

    function render() {{
      listEl.innerHTML = '';
      records.forEach((rec, idx) => {{
        const li = document.createElement('li');
        li.innerHTML = `
          <span>№${{rec.count}} — ${{rec.time}}</span>
          <button class="del-btn" data-idx="${{idx}}">削除</button>
        `;
        listEl.appendChild(li);
      }});
      document.querySelectorAll('.del-btn').forEach(b => {{
        b.addEventListener('click', e => {{
          const i = parseInt(e.currentTarget.dataset.idx, 10);
          records.splice(i, 1);
          saveAndRender();
        }});
      }});
    }}

    function saveAndRender() {{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      render();
    }}

    btn.addEventListener('click', () => {{
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const ts  = `${{now.getFullYear()}}-${{pad(now.getMonth()+1)}}-${{pad(now.getDate())}} ` +
                  `${{pad(now.getHours())}}:${{pad(now.getMinutes())}}:${{pad(now.getSeconds())}}`;
      records.push({{ count: records.length + 1, time: ts }});
      last.textContent = ts;
      saveAndRender();
    }});

    // 初期表示
    render();
  </script>
</body>
</html>
"""

with open(f"logs/{date_str}.html", "w", encoding="utf-8") as f:
    f.write(daily_html)

# --- index.html を生成・更新 ---
files = sorted(fn for fn in os.listdir("logs") if fn.endswith(".html"))
links = "\n".join(f'    <li><a href="logs/{fn}">{fn[:-5]}</a></li>' for fn in files)

index_html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Daily Pages</title>
  <style>
    body {{ font-family: sans-serif; padding: 20px; }}
    ul {{ list-style: none; padding: 0; }}
    li {{ margin-bottom: 6px; }}
  </style>
</head>
<body>
  <h1>Daily Pages</h1>
  <ul>
{links}
  </ul>
</body>
</html>
"""
with open("index.html", "w", encoding="utf-8") as f:
    f.write(index_html)

print(f"Generated logs/{date_str}.html and updated index.html with {len(files)} links.")
