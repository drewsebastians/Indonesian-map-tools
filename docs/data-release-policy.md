# Data Release Policy

## Ownership and cadence

The project owner is responsible for approving production data releases. Review the data lineage at least quarterly, and sooner when any of these stale-data triggers occur:

- Kemendagri, BPS, BIG, Ina-Geoportal, Satu Data Indonesia, HDX, or geoBoundaries publishes a materially newer boundary or administrative-code source.
- A province, kabupaten/kota, official code, or public boundary reference changes.
- A source license, access condition, or attribution requirement changes.
- A user-project migration issue reveals an ID, split, merge, retirement, or ambiguity not covered by fixtures.

## Version and change policy

- Do not change stable IDs for display-name changes alone.
- Do not replace a boundary artifact without a new boundary version.
- Do not update canonical administrative metadata without a registry version/change note.
- Split, merge, retirement, or unresolved rows require crosswalk rows and project migration fixtures.
- Checksum changes require source inventory, license manifest, changelog, and data diff review.
- Unresolved records must stay unresolved until explicit row-level evidence is committed.

## Migration policy

Every boundary or registry release must preserve old project compatibility where possible. Future migrations must include:

- old ID to new canonical ID crosswalk;
- added/removed/changed feature summary;
- unresolved or ambiguous region handling;
- project fixture coverage for unchanged, renamed, split, merged, retired, missing, and unsupported-version cases;
- user-visible migration report behavior.

## License-review checklist

Before any dataset, asset, font, icon, library, or package becomes production-approved, confirm:

- exact source URL or immutable reference;
- source owner/publisher;
- access/retrieval date;
- version or effective period;
- local snapshot path or explicit non-redistributed-reference status;
- SHA-256 for every local file;
- media type;
- license ID;
- commercial-use status;
- modification/simplification status;
- redistribution status;
- attribution requirement and exact attribution text;
- reviewer, review status, and review date;
- production approval status;
- source/version migration review when the source or checksum changed.

Public availability is not approval. The pipeline must fail closed when a required field is missing or unclear.

## Transformation log

Current Batch 1 transformations:

- geoBoundaries/HDX ADM2 2020 geometry was validated as 519 Polygon/MultiPolygon features.
- HDX tabular metadata was matched only where normalized ADM2 names were unique.
- 53 ambiguous same-name geometry rows remain unresolved and reviewable.
- Canonical province registry v1 records 38 current provinces while leaving official code fields blank pending row-level lampiran audit.
- Canonical region IDs were generated without renaming existing geometry IDs in place.
- Simplified production geometry was created from the detailed local geometry with Douglas-Peucker per ring at tolerance `0.018`.
- Stable-ID fixtures and crosswalks preserve project compatibility.
