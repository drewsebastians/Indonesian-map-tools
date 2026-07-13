(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MatchingEngine = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const REGISTRY_VERSION = "IDN-ADM-REGISTRY-v1-2025-06-23";
  const INDEX_VERSION = `${REGISTRY_VERSION}:matching-v2`;

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/\b(KABUPATEN|KAB\.?|KAB|KOTA ADMINISTRASI|KOTA|CITY|REGENCY)\b/g, " ")
      .replace(/[^A-Z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeExact(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeCode(value) {
    const raw = String(value || "").trim().toUpperCase().replace(/^IDN?[-\s]?/i, "");
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return raw;
  }

  function codeVariants(value) {
    const normalized = normalizeCode(value);
    if (!normalized) return [];
    const noDot = normalized.replace(/\./g, "");
    return Array.from(new Set([normalized, noDot, `ID${noDot}`, `ID-${noDot}`].filter(Boolean)));
  }

  function canonicalRegionId(feature) {
    const props = feature.properties || {};
    const sourceId = props.geometry_source_id || props.region_id || "";
    return `idn-adm2-gb-${String(sourceId).toLowerCase()}`;
  }

  function addBucket(map, key, value) {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(value);
  }

  function uniqueRecords(records) {
    const seen = new Set();
    return records.filter((record) => {
      if (seen.has(record.id)) return false;
      seen.add(record.id);
      return true;
    });
  }

  function aliasParts(text) {
    return String(text || "")
      .split(";")
      .flatMap((part) => part.split(/\s+\|\s+/).length >= 2 ? [part] : part.split("|"))
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function parseAlternativeNames(text) {
    return String(text || "")
      .split(";")
      .map((entry) => {
        const parts = entry.split("|").map((part) => part.trim()).filter(Boolean);
        return {
          name: parts[0] || "",
          province: parts[1] || "",
          code: parts[2] || ""
        };
      })
      .filter((entry) => entry.name);
  }

  function recordFromFeature(feature) {
    const props = feature.properties || {};
    const regionType = props.region_type || "";
    const canonicalName = props.official_current_name_verified || props.region_name || props.geometry_source_name || props.display_name || "";
    const displayName = props.display_name || [regionType, canonicalName].filter(Boolean).join(" ") || canonicalName;
    return {
      id: props.region_id,
      canonicalRegionId: canonicalRegionId(feature),
      feature,
      displayName,
      regionName: canonicalName,
      regionType,
      province: props.province_name || props.geometry_snapshot_province || "",
      officialCode: props.official_code || props.official_code_normalized || "",
      matchStatus: props.match_status || "",
      aliases: parseAlternativeNames(props.alternative_names || "")
    };
  }

  function buildIndexes(features) {
    const records = (features || []).map(recordFromFeature).filter((record) => record.id);
    const byId = new Map();
    const byCanonicalId = new Map();
    const byCode = new Map();
    const byExactNameProvince = new Map();
    const byAliasProvince = new Map();
    const byNormalizedNameProvince = new Map();
    const byNameOnly = new Map();
    records.forEach((record) => {
      byId.set(record.id, record);
      byCanonicalId.set(record.canonicalRegionId, record);
      codeVariants(record.officialCode).forEach((code) => addBucket(byCode, code, record));
      record.aliases.forEach((alias) => codeVariants(alias.code).forEach((code) => addBucket(byCode, code, record)));

      const provinceExact = normalizeExact(record.province);
      const provinceNormalized = normalizeText(record.province);
      const names = Array.from(new Set([
        record.regionName,
        record.displayName,
        record.feature.properties && record.feature.properties.geometry_source_name
      ].filter(Boolean)));
      names.forEach((name) => {
        addBucket(byExactNameProvince, `${provinceExact}|${normalizeExact(name)}`, record);
        addBucket(byNormalizedNameProvince, `${provinceNormalized}|${normalizeText(name)}`, record);
        addBucket(byNameOnly, normalizeText(name), record);
      });
      record.aliases.forEach((alias) => {
        const aliasProvinceExact = normalizeExact(alias.province || record.province);
        const aliasProvinceNormalized = normalizeText(alias.province || record.province);
        addBucket(byAliasProvince, `${aliasProvinceExact}|${normalizeExact(alias.name)}`, record);
        addBucket(byNormalizedNameProvince, `${aliasProvinceNormalized}|${normalizeText(alias.name)}`, record);
        addBucket(byNameOnly, normalizeText(alias.name), record);
      });
    });
    return {
      indexVersion: INDEX_VERSION,
      registryVersion: REGISTRY_VERSION,
      records,
      byId,
      byCanonicalId,
      byCode,
      byExactNameProvince,
      byAliasProvince,
      byNormalizedNameProvince,
      byNameOnly
    };
  }

  function cellsFromRoles(rawRow, roles) {
    const get = (role) => roles[role] ? String(rawRow.cells[roles[role]] || "").trim() : "";
    return {
      regionCode: get("regionCode"),
      regionName: get("regionName"),
      province: get("province"),
      numericValue: get("numericValue"),
      category: get("category"),
      source: get("source"),
      period: get("period")
    };
  }

  function result(status, rawRow, record, evidence, candidates = []) {
    return {
      status,
      rowId: rawRow.rowId,
      rowNumber: rawRow.rowNumber,
      matched: record ? { id: record.id, feature: record.feature, canonicalRegionId: record.canonicalRegionId } : null,
      candidates: uniqueRecords(candidates).slice(0, 20).map((candidate) => ({
        id: candidate.id,
        canonicalRegionId: candidate.canonicalRegionId,
        displayName: candidate.displayName,
        province: candidate.province,
        regionType: candidate.regionType,
        officialCode: candidate.officialCode
      })),
      evidence: Object.assign({
        registryVersion: REGISTRY_VERSION,
        indexVersion: INDEX_VERSION
      }, evidence || {})
    };
  }

  function pickStatus(bucket, successStatus, rawRow, evidence) {
    const candidates = uniqueRecords(bucket || []);
    if (candidates.length === 1) return result(successStatus, rawRow, candidates[0], evidence);
    if (candidates.length > 1) return result("ambiguous", rawRow, null, Object.assign({}, evidence, { candidateIds: candidates.map((item) => item.id) }), candidates);
    return null;
  }

  function matchRawRow(rawRow, roles, indexes, resolutions = {}) {
    const record = cellsFromRoles(rawRow, roles);
    const resolution = resolutions[rawRow.rowId];
    if (resolution && resolution.action === "ignore") {
      return Object.assign(result("ignored", rawRow, null, { decision: resolution }), { record });
    }
    if (resolution && resolution.action === "resolve") {
      const resolved = indexes.byId.get(resolution.targetId) || indexes.byCanonicalId.get(resolution.targetId);
      if (resolved && resolution.registryVersion === indexes.registryVersion) {
        return Object.assign(result("user-resolved", rawRow, resolved, { decision: resolution }), { record });
      }
    }
    const rowErrors = (rawRow.issues || []).filter((issue) => issue.severity === "error");
    if (rowErrors.length) return Object.assign(result("invalid", rawRow, null, { issues: rowErrors }), { record });
    if (!record.regionCode && !record.regionName) return Object.assign(result("invalid", rawRow, null, { reason: "missing-region" }), { record });

    const code = normalizeCode(record.regionCode);
    if (code) {
      const codeMatch = pickStatus(indexes.byCode.get(code) || indexes.byCode.get(code.replace(/\./g, "")), "exact-code", rawRow, { keyType: "official-code", key: code });
      if (codeMatch) return Object.assign(codeMatch, { record });
    }
    if (record.province && record.regionName) {
      const exactKey = `${normalizeExact(record.province)}|${normalizeExact(record.regionName)}`;
      const exactMatch = pickStatus(indexes.byExactNameProvince.get(exactKey), "exact-name-province", rawRow, { keyType: "canonical-name-province", key: exactKey });
      if (exactMatch) return Object.assign(exactMatch, { record });
      const aliasMatch = pickStatus(indexes.byAliasProvince.get(exactKey), "exact-alias-province", rawRow, { keyType: "alias-province", key: exactKey });
      if (aliasMatch) return Object.assign(aliasMatch, { record });
      const normalizedKey = `${normalizeText(record.province)}|${normalizeText(record.regionName)}`;
      const normalizedMatch = pickStatus(indexes.byNormalizedNameProvince.get(normalizedKey), "normalized-name-province", rawRow, { keyType: "normalized-name-province", key: normalizedKey });
      if (normalizedMatch) return Object.assign(normalizedMatch, { record });
    }
    if (record.regionName) {
      const candidates = uniqueRecords(indexes.byNameOnly.get(normalizeText(record.regionName)) || []);
      if (candidates.length) return Object.assign(result("ambiguous", rawRow, null, { keyType: "name-only", reason: "province-required" }, candidates), { record });
    }
    return Object.assign(result("unmatched", rawRow, null, { reason: "no-deterministic-match" }), { record });
  }

  function matchParsedRows(parsed, indexes, mapping, options = {}) {
    const roles = Object.assign({}, mapping.roles || {});
    const resolutions = options.resolutions || {};
    const rows = parsed.rows.map((row) => matchRawRow(row, roles, indexes, resolutions));
    const targetCounts = new Map();
    rows.forEach((row) => {
      if (!row.matched || ["ignored", "invalid"].includes(row.status)) return;
      targetCounts.set(row.matched.id, (targetCounts.get(row.matched.id) || 0) + 1);
    });
    return rows.map((row) => {
      if (row.matched && targetCounts.get(row.matched.id) > 1 && row.status !== "ignored") {
        return Object.assign({}, row, {
          status: "duplicate-target",
          evidence: Object.assign({}, row.evidence, { duplicateTargetId: row.matched.id })
        });
      }
      return row;
    });
  }

  return {
    REGISTRY_VERSION,
    INDEX_VERSION,
    normalizeText,
    normalizeExact,
    normalizeCode,
    buildIndexes,
    matchParsedRows,
    matchRawRow
  };
});
