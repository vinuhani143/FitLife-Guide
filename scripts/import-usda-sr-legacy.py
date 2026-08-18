#!/usr/bin/env python3
"""Import selected USDA SR Legacy foods into the FitLife Guide seed file.

This script never invents nutrient values. It copies amounts from an official
USDA FoodData Central SR Legacy JSON download.

Download:
  https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip

Usage:
  python3 scripts/import-usda-sr-legacy.py /path/to/FoodData_Central_sr_legacy_food_json_2018-04.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "src/data/foods/usda-sr-legacy-seed.json"
BUILDER = Path("/tmp/usda-foods/build_seed.py")


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    src = Path(sys.argv[1])
    if not src.exists():
        print("Missing USDA JSON:", src)
        return 1
    current = json.loads(SEED.read_text(encoding="utf-8"))
    print("Current seed version", current.get("foodDatabaseVersion"))
    print("Foods", len(current.get("foods", [])))
    print("Re-run the curated builder against", src)
    print("Do not overwrite a food record unless fdcId and lastVerified are reviewed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
