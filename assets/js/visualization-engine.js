(function () {
  const VERSION = "IDN-VIS-v1";
  const PALETTE_VERSION = "IDN-PALETTE-v1";
  const palettes = {
    qualitative: {
      "safe-default": ["#0072B2", "#E69F00", "#009E73", "#CC79A7", "#56B4E9", "#D55E00", "#F0E442", "#332288", "#88CCEE", "#44AA99", "#DDCC77", "#AA4499"]
    },
    sequential: {
      "blue": ["#F0F7FF", "#C6DBEF", "#9ECAE1", "#6BAED6", "#3182BD", "#08519C", "#08306B"]
    },
    diverging: {
      "blue-orange": ["#2166AC", "#67A9CF", "#D1E5F0", "#F7F7F7", "#FDDBC7", "#EF8A62", "#B2182B"]
    }
  };

  function clampClasses(value, min = 2, max = 7) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : min;
  }

  function normalizeCategory(value) {
    return String(value == null ? "" : value).trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").toLocaleUpperCase("id-ID");
  }

  function parseNumber(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    const text = String(value == null ? "" : value).trim();
    if (!text || /^[=+@]/.test(text)) return null;
    const percent = /%$/.test(text);
    const clean = text.replace(/%$/, "").replace(/\s/g, "");
    const normalized = clean.includes(",") && clean.includes(".") ? (clean.lastIndexOf(",") > clean.lastIndexOf(".") ? clean.replace(/\./g, "").replace(",", ".") : clean.replace(/,/g, "")) : clean.replace(/,/g, ".");
    const number = Number(normalized);
    return Number.isFinite(number) ? (percent ? number / 100 : number) : null;
  }

  function paletteFor(method, paletteName, reverse) {
    const family = method === "categorical" ? "qualitative" : method === "diverging" ? "diverging" : "sequential";
    const choices = palettes[family] || palettes.sequential;
    const colors = (choices[paletteName] || Object.values(choices)[0]).slice();
    return reverse ? colors.reverse() : colors;
  }

  function makeRows(rows) {
    return (rows || []).map((row) => ({
      rowId: String(row.rowId || ""),
      rowNumber: Number(row.rowNumber || 0),
      matchedId: row.matchedId || null,
      category: normalizeCategory(row.record && row.record.category),
      categoryLabel: String((row.record && row.record.category) || "").trim(),
      value: parseNumber(row.numericValue != null ? row.numericValue : row.record && row.record.numericValue),
      status: row.matchStatus || "unmatched",
      errors: Array.isArray(row.errors) ? row.errors : []
    }));
  }

  function validRows(rows) {
    return rows.filter((row) => row.matchedId && !["ignored", "unmatched", "ambiguous", "duplicate-target", "invalid"].includes(row.status));
  }

  function categoryClass(rows, options) {
    const colors = paletteFor("categorical", options.palette, options.reverse);
    const categories = Array.from(new Set(rows.map((row) => row.category || "TANPA KATEGORI"))).sort((a, b) => a.localeCompare(b, "id"));
    const warnings = [];
    if (categories.length > colors.length) warnings.push(`There are ${categories.length} categories. Extra colors were added in a consistent order so no categories quietly share a color.`);
    const colorFor = (index) => colors[index] || `hsl(${(index * 137.508) % 360} 58% 45%)`;
    const assignments = {};
    categories.forEach((category, index) => { assignments[category] = { label: category === "TANPA KATEGORI" ? "No category" : category, color: colorFor(index), index }; });
    const legend = categories.map((category) => ({ label: assignments[category].label, color: assignments[category].color, key: category }));
    return { assignments, legend, warnings, values: rows.map((row) => ({ rowId: row.rowId, matchedId: row.matchedId, classKey: row.category || "TANPA KATEGORI", color: assignments[row.category || "TANPA KATEGORI"].color })) };
  }

  function numericClass(rows, options, mode) {
    const values = rows.filter((row) => row.value != null).slice().sort((a, b) => a.value - b.value || String(a.matchedId).localeCompare(String(b.matchedId)) || String(a.rowId).localeCompare(String(b.rowId)));
    const warnings = [];
    if (!values.length) return { assignments: {}, legend: [], warnings: ["No numeric values are ready to map. Your current map is safe. Check the value column, then try again."], values: [] };
    if (mode === "equal-interval") return equalInterval(values, options, warnings);
    if (mode === "quantile") return quantile(values, options, warnings);
    return manualBreaks(values, options, warnings);
  }

  function equalInterval(values, options, warnings) {
    const classes = clampClasses(options.classes);
    const min = values[0].value; const max = values[values.length - 1].value;
    if (min === max) {
      const color = paletteFor("sequential", options.palette, options.reverse)[0];
      return { assignments: {}, legend: [{ label: formatNumber(min, options.numberFormat), color }], warnings: warnings.concat("All values are the same, so one color group was used."), values: values.map((row) => ({ rowId: row.rowId, matchedId: row.matchedId, classKey: "0", color })) };
    }
    const colors = paletteFor("sequential", options.palette, options.reverse).slice(0, classes);
    const step = (max - min) / classes;
    const breaks = Array.from({ length: classes }, (_, index) => index === classes - 1 ? max : min + step * (index + 1));
    const legend = breaks.map((upper, index) => {
      const lower = index === 0 ? min : breaks[index - 1];
      return { label: `${formatNumber(lower, options.numberFormat)}–${formatNumber(upper, options.numberFormat)}`, color: colors[index % colors.length], key: String(index) };
    });
    return { assignments: {}, legend, breaks, warnings, values: values.map((row) => { const index = breaks.findIndex((upper) => row.value <= upper); return { rowId: row.rowId, matchedId: row.matchedId, classKey: String(index), color: colors[index % colors.length] }; }) };
  }

  function quantile(values, options, warnings) {
    const requested = clampClasses(options.classes);
    const colors = paletteFor("sequential", options.palette, options.reverse).slice(0, requested);
    const breaks = [];
    for (let index = 1; index < requested; index += 1) {
      const at = Math.min(values.length - 1, Math.ceil(index * values.length / requested) - 1);
      if (!breaks.length || breaks[breaks.length - 1] !== values[at].value) breaks.push(values[at].value);
    }
    const classes = breaks.length + 1;
    if (classes < requested) warnings.push(`Repeated values reduced the number of color groups to ${classes}. Equal values stay in the same group.`);
    const boundaries = breaks.concat([Infinity]);
    const legend = boundaries.map((upper, index) => ({ label: index === 0 ? `≤ ${formatNumber(upper, options.numberFormat)}` : index === boundaries.length - 1 ? `> ${formatNumber(boundaries[index - 1], options.numberFormat)}` : `${formatNumber(boundaries[index - 1], options.numberFormat)}–${formatNumber(upper, options.numberFormat)}`, color: colors[index % colors.length], key: String(index) }));
    return { assignments: {}, legend, breaks, warnings, values: values.map((row) => { const index = breaks.findIndex((upper) => row.value <= upper); return { rowId: row.rowId, matchedId: row.matchedId, classKey: String(index < 0 ? breaks.length : index), color: colors[Math.min(index < 0 ? breaks.length : index, colors.length - 1)] }; }) };
  }

  function manualBreaks(values, options, warnings) {
    const raw = String(options.breaks || "").split(/[;,\s]+/).filter(Boolean).map(Number);
    if (!raw.length || raw.some((value) => !Number.isFinite(value)) || raw.some((value, index) => index && value <= raw[index - 1])) throw new Error("Manual break values must be unique numbers in increasing order. Your current map is safe. Check the values and try again.");
    const colors = paletteFor("sequential", options.palette, options.reverse);
    const legend = raw.concat([Infinity]).map((upper, index) => ({ label: index === 0 ? `≤ ${formatNumber(upper, options.numberFormat)}` : upper === Infinity ? `> ${formatNumber(raw[index - 1], options.numberFormat)}` : `${formatNumber(raw[index - 1], options.numberFormat)}–${formatNumber(upper, options.numberFormat)}`, color: colors[index % colors.length], key: String(index) }));
    return { assignments: {}, legend, breaks: raw, warnings, values: values.map((row) => { const index = raw.findIndex((upper) => row.value <= upper); const classIndex = index < 0 ? raw.length : index; return { rowId: row.rowId, matchedId: row.matchedId, classKey: String(classIndex), color: colors[classIndex % colors.length] }; }) };
  }

  function diverging(rows, options) {
    const center = Number.isFinite(Number(options.center)) ? Number(options.center) : 0;
    const values = rows.filter((row) => row.value != null);
    const classes = Math.max(3, clampClasses(options.classes));
    const odd = classes % 2 ? classes : classes + 1;
    const colors = paletteFor("diverging", options.palette, options.reverse).slice(0, odd);
    const below = values.filter((row) => row.value < center); const above = values.filter((row) => row.value > center);
    const maxBelow = below.length ? Math.max(...below.map((row) => center - row.value)) : 0;
    const maxAbove = above.length ? Math.max(...above.map((row) => row.value - center)) : 0;
    const sideClasses = Math.floor(odd / 2); const warnings = [];
    if (!below.length || !above.length) warnings.push("All values are on one side of the center. The other side is shown as no data.");
    const assignments = {}; const legend = [];
    for (let index = 0; index < sideClasses; index += 1) legend.push({ label: `≤ ${formatNumber(center - (maxBelow * (sideClasses - index) / sideClasses), options.numberFormat)}`, color: colors[index], key: `below-${index}` });
    legend.push({ label: `= ${formatNumber(center, options.numberFormat)}`, color: colors[sideClasses], key: "center" });
    for (let index = 0; index < sideClasses; index += 1) legend.push({ label: `> ${formatNumber(center + (maxAbove * index / sideClasses), options.numberFormat)}`, color: colors[sideClasses + 1 + index], key: `above-${index}` });
    const result = values.map((row) => {
      if (row.value === center) return { rowId: row.rowId, matchedId: row.matchedId, classKey: "center", color: colors[sideClasses] };
      if (row.value < center) { const index = maxBelow ? Math.min(sideClasses - 1, Math.floor(((center - row.value) / maxBelow) * sideClasses)) : 0; return { rowId: row.rowId, matchedId: row.matchedId, classKey: `below-${index}`, color: colors[index] }; }
      const index = maxAbove ? Math.min(sideClasses - 1, Math.floor(((row.value - center) / maxAbove) * sideClasses)) : 0; return { rowId: row.rowId, matchedId: row.matchedId, classKey: `above-${index}`, color: colors[sideClasses + 1 + index] };
    });
    return { assignments: {}, legend, warnings, values: result, center };
  }

  function formatNumber(value, format) {
    if (!Number.isFinite(Number(value))) return "—";
    const number = Number(value); const options = format === "integer" ? { maximumFractionDigits: 0 } : format === "decimal-2" ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 3 };
    return new Intl.NumberFormat(format === "id-ID" ? "id-ID" : "en-US", options).format(number);
  }

  function classify(rawRows, options = {}) {
    const method = ["categorical", "equal-interval", "quantile", "manual", "diverging"].includes(options.method) ? options.method : "categorical";
    const rows = makeRows(rawRows); const usable = validRows(rows); let result;
    if (method === "categorical") result = categoryClass(usable, options);
    else if (method === "diverging") result = diverging(usable, options);
    else result = numericClass(usable, options, method);
    const assigned = new Map(result.values.map((item) => [item.matchedId, item]));
    const noData = rows.filter((row) => !assigned.has(row.matchedId));
    return { version: VERSION, paletteVersion: PALETTE_VERSION, method, options: Object.assign({ classes: options.classes || 5, palette: options.palette || (method === "categorical" ? "safe-default" : method === "diverging" ? "blue-orange" : "blue"), reverse: Boolean(options.reverse), numberFormat: options.numberFormat || "id-ID", noDataColor: options.noDataColor || "#D9E0E6" }, options), assignments: Object.fromEntries(result.values.map((item) => [item.matchedId, item])), legend: result.legend.concat(noData.length ? [{ label: "No data", color: options.noDataColor || "#D9E0E6", key: "no-data" }] : []), warnings: result.warnings.concat(noData.length ? [`${noData.length} rows were not colored because they do not have a valid value or region match. Your current map is safe. Check these rows before you continue.`] : []), rows, noData: noData.map((row) => row.rowId), center: result.center == null ? null : result.center };
  }

  window.VisualizationEngine = { VERSION, PALETTE_VERSION, palettes, classify, formatNumber, normalizeCategory };
})();
