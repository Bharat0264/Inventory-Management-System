---

## Configuration

Tweak behavior with environment variables — no config files, no drama.

| Variable | Default | What it does |
|---|---|---|
| `APP_NAME` | `IMS` | Short label in the header |
| `APP_FULL_NAME` | `Inventory Management System` | Long name next to the mark |
| `VERCEL` | *(unset)* | Switches data/model scratch space to `/tmp` |

---

## Deploying

**Locally** — the quick start above is all you need.

**Vercel** — set the `VERCEL` environment variable in your project settings and push. The app detects it and reroutes file I/O to `/tmp` automatically.

---

## Contributing

PRs and issues are welcome. A few ground rules before you dive in:

1. **Fork + branch from `main`** with a name that hints at the change — `fix/upload-timeout`, `feat/dark-mode`, that kind of thing.
2. **Keep scope tight.** One logical change per PR beats a kitchen-sink diff every time.
3. **Smoke-test your touches** — upload flow, inventory table, analytics chart, forecast + train.
4. **Describe what *and* why** in the PR body. Reviewers should nod, not squint.

Filing a bug? Include your OS, Python version, and what you clicked before the world ended.

---

## License

Released under the **MIT License** — use it, break it, fix it, ship it. Just keep the copyright notice and license text with your copies.

Full legalese in [LICENSE](LICENSE). Copyright © 2024 Jonathan Thota.

---

## Star History

<a href="https://www.star-history.com/?repos=jonathanrao99%2FInventory-Management-System&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=jonathanrao99/Inventory-Management-System&type=date&theme=dark&legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=jonathanrao99/Inventory-Management-System&type=date&legend=top-left" />
    <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=jonathanrao99/Inventory-Management-System&type=date&legend=top-left" />
  </picture>
</a>

---

*Now go count some boxes. Responsibly.*
