"""Extract OFFLINE_COMMANDS from dashboard.html into shared/offline_commands.json."""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(__file__))
HTML = os.path.join(ROOT, "dashboard.html")
OUT = os.path.join(ROOT, "shared", "offline_commands.json")

with open(HTML, encoding="utf-8") as f:
    content = f.read()

match = re.search(
    r"const OFFLINE_COMMANDS\s*=\s*(\[[\s\S]*?\])\s*;",
    content,
)
if not match:
    raise SystemExit("OFFLINE_COMMANDS block not found")

block = match.group(1)
# Evaluate as JavaScript-like object using regex transforms to JSON
block = re.sub(r"(\w+)\s*:", r'"\1":', block)
block = block.replace("'", '"')
data = json.loads(block)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"Wrote {len(data)} commands to {OUT}")