(function () {
  function validateAndMatch(text, indexes, options = {}) {
    const parsed = ImportCore.parseTabularInput({
      text,
      sourceType: options.sourceType || "csv",
      sourceLabel: options.sourceLabel || "CSV",
      delimiterOverride: options.delimiterOverride || "auto",
      localeOverride: options.localeOverride || "auto",
      budget: options.budget
    });
    return validateParsed(parsed, indexes, options.mapping || parsed.mapping, {
      locale: options.localeOverride || "auto",
      resolutions: options.resolutions || {}
    });
  }

  function validateParsed(parsed, indexes, mapping, options = {}) {
    const roles = Object.assign({}, mapping.roles || {});
    const seenTargets = new Set();
    const matchedRows = typeof MatchingEngine !== "undefined" && indexes && indexes.matchingEngine
      ? MatchingEngine.matchParsedRows(parsed, indexes.matchingEngine, mapping, { resolutions: options.resolutions || {} })
      : null;
    const all = parsed.rows.map((rawRow, index) => {
      const record = recordFromRoles(rawRow.cells, roles);
      const rowNumber = rawRow.rowNumber;
      const errors = rawRow.issues.filter((issue) => issue.severity === "error").map((issue) => issue.message);
      const warnings = rawRow.issues.filter((issue) => issue.severity !== "error").map((issue) => issue.message);
      const code = ImportCore.normalizeCode(record.regionCode);
      const color = record.color || "#4472C4";
      if (!record.regionCode && !record.regionName) errors.push("Isi kode wilayah atau nama wilayah.");
      if (record.color && !ProjectStorage.isColor(color)) errors.push("Warna tidak valid.");

      let numberResult = null;
      if (roles.numericValue) {
        numberResult = ImportCore.parseLocaleNumber(record.numericValue, { locale: options.locale === "auto" ? "auto" : options.locale });
        if (numberResult.kind === "invalid") errors.push("Nilai numerik tidak valid.");
        if (numberResult.kind === "ambiguous") warnings.push("Format angka ambigu; pilih locale yang tepat.");
      }

      const match = matchedRows ? matchedRows[index] : legacyMatch(record, rawRow, indexes, seenTargets, errors);
      const matched = match && match.matched ? { id: match.matched.id, feature: match.matched.feature } : null;
      const ambiguous = match && match.candidates ? match.candidates : [];
      if (match) {
        if (match.status === "ambiguous") errors.push("Nama wilayah ambigu; pilih kandidat atau tambahkan kode/provinsi yang lebih spesifik.");
        if (match.status === "unmatched") errors.push("Wilayah tidak ditemukan.");
        if (match.status === "invalid") errors.push("Baris tidak valid.");
        if (match.status === "duplicate-target") errors.push("Duplikat target wilayah; pilih satu nilai atau abaikan salah satu baris.");
        if (match.status === "ignored") warnings.push("Baris diabaikan.");
      }
      return { rowId: rawRow.rowId, rowNumber, record, matched, ambiguous, errors, warnings, color, numberResult, matchStatus: match && match.status, matchEvidence: match && match.evidence, candidates: ambiguous };
    });
    return {
      contractVersion: "batch2.importPreview.v1",
      parsed,
      mapping,
      importedSource: parsed.importedSource,
      headers: parsed.headers,
      valid: all.filter((row) => row.matched && !row.errors.length),
      invalid: all.filter((row) => row.errors.length),
      warning: all.filter((row) => row.warnings.length && !row.errors.length),
      all
    };
  }

  function legacyMatch(record, rawRow, indexes, seenTargets, errors) {
    const code = ImportCore.normalizeCode(record.regionCode);
    let matched = null;
    let ambiguous = [];
    if (code && indexes.byCode.has(code)) {
      matched = indexes.byCode.get(code);
    } else if (record.province && record.regionName) {
      const key = ImportCore.normalizeText(record.province) + "|" + ImportCore.normalizeText(record.regionName);
      const candidates = indexes.byProvinceName.get(key) || [];
      if (candidates.length === 1) matched = candidates[0];
      if (candidates.length > 1) ambiguous = candidates;
    } else if (record.regionName && indexes.byName) {
      const candidates = indexes.byName.get(ImportCore.normalizeText(record.regionName)) || [];
      if (candidates.length === 1) matched = candidates[0];
      if (candidates.length > 1) ambiguous = candidates;
    }
    if (!matched && !ambiguous.length && !errors.length) return { status: "unmatched", matched: null, candidates: [], evidence: {} };
    if (ambiguous.length) return { status: "ambiguous", matched: null, candidates: ambiguous, evidence: {} };
    if (matched && seenTargets.has(matched.id)) return { status: "duplicate-target", matched, candidates: [], evidence: {} };
    if (matched) seenTargets.add(matched.id);
    return { status: "exact-code", matched, candidates: [], evidence: {} };
  }

  function recordFromRoles(cells, roles) {
    const get = (role) => roles[role] ? String(cells[roles[role]] || "").trim() : "";
    const colorColumn = Object.keys(cells).find((header) => ["color", "warna"].includes(ImportCore.normalizeHeader(header)));
    return {
      regionCode: get("regionCode"),
      province: get("province"),
      regionName: get("regionName"),
      numericValue: get("numericValue"),
      category: get("category"),
      source: get("source"),
      period: get("period"),
      color: colorColumn ? String(cells[colorColumn] || "").trim() : ""
    };
  }

  function buildErrorCsv(results) {
    const lines = [["Row", "Region_Code", "Province", "Region_Name", "Value", "Errors", "Warnings"].join(",")];
    results.invalid.forEach((item) => {
      const values = [
        item.rowNumber,
        item.record.regionCode,
        item.record.province,
        item.record.regionName,
        item.record.numericValue,
        item.errors.join("; "),
        item.warnings.join("; ")
      ].map((value) => '"' + ImportCore.escapeFormula(value).replace(/"/g, '""') + '"');
      lines.push(values.join(","));
    });
    return lines.join("\n");
  }

  window.CsvImport = {
    validateAndMatch,
    validateParsed,
    buildErrorCsv,
    normalizeText: ImportCore.normalizeText,
    normalizeCode: ImportCore.normalizeCode
  };
})();
