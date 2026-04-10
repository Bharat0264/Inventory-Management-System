# IMS — Inventory Management System

**You have a spreadsheet. We have opinions about it.**

IMS is a small Flask app that turns a boring CSV into something you can actually use: who’s low on stock, what’s about to expire, a quick revenue chart, and a dead-simple “what happens next?” forecast trained on *your* numbers—not a demo dataset from 2019.

No login circus. No enterprise sales deck. Upload a file, poke around, train a model when you feel brave.

---

## Why bother?

Because “I’ll check the inventory later” is how shelves go empty and yogurt goes legendary (in a bad way). IMS gives you:

- **Home** — KPIs at a glance + drag-and-drop CSV upload  
- **Inventory** — restock nudges and expiry radar  
- **Analytics** — revenue by row, top/bottom movers, a real chart (not fake placeholder months)  
- **Forecast** — three recent stock levels in, one educated guess out (scikit-learn under the hood)

Ship it locally or on Vercel; paths adapt when the cloud gods set `VERCEL`.

---

## Quick start (the part you actually run)

```bash
git clone <your-fork-or-repo-url>
cd Inventory-Management-System
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open **http://127.0.0.1:5000** and feed it `data_set/data.csv` or your own file with the same kind of columns.

Optional extras for local experiments (not required for the web UI): `pip install -r requirements-ml.txt`

---

## Environment knobs

| Variable | What it does |
|----------|----------------|
| `APP_NAME` | Short label in the header (default: **IMS**) |
| `APP_FULL_NAME` | Long name next to the mark (default: **Inventory Management System**) |
| `VERCEL` | Set on Vercel; data/model scratch space uses `/tmp` |

---

## Project map (treasure hunt edition)

| Path | Purpose |
|------|---------|
| `app.py` | Routes, JSON API, your new best friend |
| `paths.py` | “Am I on a laptop or a postage-stamp server?” |
| `Prediction.py` | Training pipeline for the forecast |
| `public/static/` | CSS + JS (Vercel-friendly `public/`) |
| `templates/` | Jinja + `base.html` layout |
| `data_set/data.csv` | Sample loot for testing |

---

## License

This project is released under the **MIT License**. That means: use it, break it, fix it, ship it—just keep the copyright notice and license text with your copies.

Full legalese lives in [LICENSE](LICENSE) (Copyright (c) 2024 Jonathan Thota).

---

## Contributing

Pull requests and issues are welcome. If you’re about to open a PR:

1. **Fork** the repo and branch from `main` with a name that hints at the change (`fix/upload-timeout`, `feat/dark-mode`, you get it).  
2. **Keep scope tight** — one logical change per PR beats a kitchen-sink diff.  
3. **Smoke-test** the flows you touched: upload, inventory table, analytics chart, forecast + train.  
4. **Describe what & why** in the PR body so reviewers can nod instead of squint.

Bug reports: include OS, Python version, and what you clicked before the world ended.

---

*Now go count some boxes. Responsibly.*
