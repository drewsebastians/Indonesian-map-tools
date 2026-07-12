# Boundary Source Research

Research date: 2026-06-18

## Summary decision

Recommended production geometry: geoBoundaries Indonesia ADM2 simplified GeoJSON, enriched with HDX COD-AB tabular metadata where matching is unambiguous.

Reason: it is openly published, downloadable as GeoJSON, carries an explicit CC BY-IGO lineage, works in a static Cloudflare Workers app, and avoids committing official Indonesian government data whose redistribution terms were not confirmed in this session.

## Comparison

| Source | Publisher | Level | Format | Feature count | Date/year | License status | Result |
|---|---|---:|---|---:|---|---|---|
| geoBoundaries IDN ADM2 | geoBoundaries | ADM2 | GeoJSON, TopoJSON, ZIP | 519 | boundary year 2020, build Dec 12 2023 | CC BY 3.0 IGO reported by API | Selected production geometry |
| Indonesia COD-AB | HDX/OCHA | ADM0-ADM4 | XLSX, SHP, geodatabase, EMF | ADM2 workbook rows 522 | dataset date 2020-04-08 to 2025-01-13; metadata modified 2025-11-13 | CC BY-IGO | Selected metadata reference; large SHP download timed out |
| BPS / Badan Pusat Statistik | Government of Indonesia | Administrative reference | publications and codes | varies | current references vary by publication | redistribution terms not fully assessed | Authority lineage/reference only |
| Kemendagri PELITA | Ministry of Home Affairs | administrative spatial data | web portal/service | not verified | current official source likely | license not confirmed | Not committed; document as preferred official reference |
| Badan Informasi Geospasial / Ina-Geoportal | Government of Indonesia | authoritative geospatial services | portal services | not verified | varies | license not confirmed | Not committed without explicit reuse terms |
| Satu Data Indonesia | Government of Indonesia | open data portal | portal/API | not verified | varies | dataset-specific | Candidate for future update |

## Source details used

geoBoundaries API endpoint: https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM2/

The API reported:

- Boundary ID: `IDN-ADM2-22746128`
- Boundary name: Indonesia
- Boundary type: ADM2
- Canonical type: regency, city
- Boundary source: Badan Pusat Statistik, World Food Programme, OCHA ROAP
- Boundary year represented: 2020
- Source data update date: Thu Jan 19 07:31:04 2023
- Build date: Dec 12, 2023
- Feature count: 519
- License: Creative Commons Attribution 3.0 Intergovernmental Organisations
- Source URL: https://data.humdata.org/dataset/indonesia-administrative-boundary-polygons-lines-and-places-levels-0-4b
- Simplified GeoJSON URL: https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM2/geoBoundaries-IDN-ADM2_simplified.geojson

HDX metadata was queried through the public CKAN API. The matching package was `cod-ab-idn` / "Indonesia - Subnational Administrative Boundaries".

The HDX package reported:

- Package URL: https://data.humdata.org/dataset/cod-ab-idn
- License title: Creative Commons Attribution for Intergovernmental Organisations (CC BY-IGO)
- Dataset date range: 2020-04-08 to 2025-01-13
- Metadata modified: 2025-11-13
- Resources: ADM123 tabular XLSX, ADM4 tabular XLSX, SHP archives, candidate geodatabase archives, EMF archive

## Licensing assessment

The selected production data is redistributable under a CC BY-IGO license lineage. Attribution is included in `ATTRIBUTION.md`, the app about section, exported SVG/PNG, and `data/README.md`.

The project MIT License applies only to original application code. It does not relicense geographic data.

Official Indonesian government portals may contain more current or authoritative boundaries, especially for post-2020 Papua provinces, but those files were not committed because explicit public redistribution and modification permissions were not confirmed here.

