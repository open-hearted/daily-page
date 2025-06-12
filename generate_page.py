from datetime import datetime
import os

today = datetime.now().strftime("%Y-%m-%d")
affirmation = "今日も一歩前へ進もう"

os.makedirs("logs", exist_ok=True)
with open(f"logs/{today}.html", "w", encoding="utf-8") as f:
    f.write(f"""
    <html><body>
    <h1>{today}</h1>
    <p>{affirmation}</p>
    </body></html>
    """)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(f"""
    <html><body>
    <h1>{today}</h1>
    <p>{affirmation}</p>
    <p><a href="logs/{today}.html">この日の記録を見る</a></p>
    </body></html>
    """)
