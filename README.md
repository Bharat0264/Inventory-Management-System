# Stockdesk

Flask app for local CSV inventory: upload a file, review low stock and expiry rows, chart revenue, and run a simple stock-level forecast (scikit-learn regressor trained from your data).

## Requirements

- Python 3.12+ recommended  
- Dependencies: `pip install -r requirements.txt`

Optional ML-only deps (not used by the web app): `pip install -r requirements-ml.txt`

## Run

```bash
python app.py
```

Open `http://127.0.0.1:5000` (or `http://localhost:5000`).

## Environment

| Variable   | Description                          |
|-----------|--------------------------------------|
| `APP_NAME` | Title in the header (default: `Stockdesk`) |
| `VERCEL`   | Set by Vercel; uses `/tmp` for writes      |

## Project layout

- `app.py` — routes and API  
- `paths.py` — local vs serverless paths  
- `Prediction.py` — training pipeline  
- `public/static/` — CSS and JS (served by Flask and compatible with Vercel `public/`)  
- `templates/` — Jinja templates (`base.html` shared layout)  
- `data_set/data.csv` — sample data  

## License

See [LICENSE](LICENSE).
