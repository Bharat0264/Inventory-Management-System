/**
 * Stockdesk UI — upload, dashboard KPIs, forecast, train.
 */

class InventoryApp {
  constructor() {
    this.uploadForm = document.getElementById("uploadForm");
    this.predictionForm = document.getElementById("predictionForm");
    this.fileInput = document.getElementById("fileInput");
    this.dropzone = document.querySelector(".dropzone");
    this.trainBtn = document.getElementById("trainModelBtn");
    this.homeTrainBtn = document.getElementById("homeTrainBtn");
    this.modelStatus = document.getElementById("modelStatus");

    this.bindUpload();
    this.bindPrediction();
    this.bindTrain();
    this.bindDropzone();

    if (document.getElementById("totalProducts")) {
      this.loadDashboardData();
    }

    if (this.modelStatus && window.location.pathname === "/predict") {
      this.initModelStatus();
    }
  }

  bindUpload() {
    if (!this.uploadForm) return;
    this.uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleUpload();
    });
    if (this.fileInput) {
      this.fileInput.addEventListener("change", (e) => {
        const f = e.target.files[0];
        if (f) this.showFilePreview(f);
      });
    }
  }

  bindDropzone() {
    if (!this.dropzone || !this.fileInput) return;
    ["dragover", "dragenter"].forEach((ev) => {
      this.dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        this.dropzone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      this.dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        this.dropzone.classList.remove("is-dragover");
      });
    });
    this.dropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files.length && (files[0].type === "text/csv" || files[0].name.endsWith(".csv"))) {
        this.fileInput.files = files;
        this.showFilePreview(files[0]);
      } else {
        this.notify("Use a .csv file", "error");
      }
    });
  }

  bindPrediction() {
    if (!this.predictionForm) return;
    this.predictionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handlePrediction();
    });
  }

  bindTrain() {
    const run = () => this.runTrain();
    if (this.trainBtn) this.trainBtn.addEventListener("click", run);
    if (this.homeTrainBtn) this.homeTrainBtn.addEventListener("click", run);
  }

  initModelStatus() {
    if (this.trainBtn) this.trainBtn.disabled = false;
    if (this.modelStatus) this.modelStatus.textContent = "Train or run a prediction.";
  }

  showFilePreview(file) {
    const preview = document.getElementById("filePreview");
    if (!preview) return;
    preview.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
  }

  formatFileSize(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${["B", "KB", "MB", "GB"][i]}`;
  }

  async handleUpload() {
    if (!this.fileInput || !this.fileInput.files.length) {
      this.notify("Choose a CSV file.", "error");
      return;
    }
    const fd = new FormData();
    fd.append("file", this.fileInput.files[0]);
    try {
      const res = await fetch("/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        this.notify(data.message || "Uploaded.", "success");
        this.uploadForm.reset();
        const preview = document.getElementById("filePreview");
        if (preview) preview.textContent = "";
        await this.loadDashboardData();
      } else {
        this.notify(data.error || "Upload failed.", "error");
      }
    } catch (err) {
      console.error(err);
      this.notify("Network error.", "error");
    }
  }

  async handlePrediction() {
    const q1 = parseFloat(document.getElementById("quantity1")?.value);
    const q2 = parseFloat(document.getElementById("quantity2")?.value);
    const q3 = parseFloat(document.getElementById("quantity3")?.value);
    if ([q1, q2, q3].some((x) => Number.isNaN(x))) {
      this.notify("Enter three numbers.", "error");
      return;
    }
    if (q1 < 0 || q2 < 0 || q3 < 0) {
      this.notify("Values must be ≥ 0.", "error");
      return;
    }
    try {
      const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity1: q1, quantity2: q2, quantity3: q3 }),
      });
      const data = await res.json();
      const box = document.getElementById("predictionResult");
      const val = document.getElementById("predictionValue");
      if (!data.success) {
        this.notify(data.error || "Prediction failed.", "error");
        return;
      }
      let line = `Next level (estimate): <strong>${Number(data.prediction).toFixed(2)}</strong>`;
      if (data.method) line += ` <span class="muted">(${data.method})</span>`;
      if (val) val.innerHTML = line;
      if (box) {
        box.hidden = false;
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      this.notify("Done.", "success");
    } catch (err) {
      console.error(err);
      this.notify("Network error.", "error");
    }
  }

  async runTrain() {
    if (this.trainBtn) {
      this.trainBtn.disabled = true;
    }
    if (this.homeTrainBtn) this.homeTrainBtn.disabled = true;
    if (this.modelStatus) this.modelStatus.textContent = "Training…";
    try {
      const res = await fetch("/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        this.notify(data.message || "Trained.", "success");
        if (this.modelStatus) this.modelStatus.textContent = "Model updated.";
      } else {
        this.notify(data.error || "Training failed.", "error");
        if (this.modelStatus) this.modelStatus.textContent = "Training failed.";
      }
    } catch (err) {
      console.error(err);
      this.notify("Network error.", "error");
      if (this.modelStatus) this.modelStatus.textContent = "Error.";
    } finally {
      if (this.trainBtn) this.trainBtn.disabled = false;
      if (this.homeTrainBtn) this.homeTrainBtn.disabled = false;
    }
  }

  async loadDashboardData() {
    try {
      const res = await fetch("/api/inventory-summary");
      const data = await res.json();
      if (!data.metrics) return;
      const m = data.metrics;
      this.setText("totalProducts", this.fmtNum(m.total_products));
      this.setText("lowStockCount", this.fmtNum(m.low_stock_count));
      this.setText("totalRevenue", this.fmtMoney(m.total_revenue));
      this.setText("nearExpiryCount", this.fmtNum(m.near_expiry_count));
    } catch (e) {
      console.warn("Dashboard KPI fetch failed", e);
    }
  }

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  fmtNum(n) {
    return new Intl.NumberFormat("en-US").format(n ?? 0);
  }

  fmtMoney(n) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n ?? 0);
  }

  notify(message, type = "info") {
    document.querySelectorAll(".notification").forEach((n) => n.remove());
    const div = document.createElement("div");
    div.className = `notification notification--${type === "error" ? "error" : type === "success" ? "success" : "info"}`;
    div.setAttribute("role", "status");
    const safe =
      typeof message === "string"
        ? message.replace(/[<>]/g, "").slice(0, 240)
        : "Notice";
    div.textContent = safe;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.inventoryApp = new InventoryApp();
});
