#!/usr/bin/env python3
"""Append official USDA FNDDS Indian foods to the seed. Never invents values."""

from __future__ import annotations

import json
from pathlib import Path

NUT_BY_NUMBER = {
    "208": "energyKcal",
    "1008": "energyKcal",
    "203": "proteinG",
    "1003": "proteinG",
    "205": "carbohydrateG",
    "1005": "carbohydrateG",
    "204": "fatG",
    "1004": "fatG",
    "291": "fiberG",
    "1079": "fiberG",
    "269": "sugarG",
    "2000": "sugarG",
    "301": "calciumMg",
    "1087": "calciumMg",
    "303": "ironMg",
    "1089": "ironMg",
    "304": "magnesiumMg",
    "1090": "magnesiumMg",
    "305": "phosphorusMg",
    "1091": "phosphorusMg",
    "306": "potassiumMg",
    "1092": "potassiumMg",
    "307": "sodiumMg",
    "1093": "sodiumMg",
    "309": "zincMg",
    "1095": "zincMg",
    "320": "vitaminAMcg",
    "1106": "vitaminAMcg",
    "401": "vitaminCMg",
    "1162": "vitaminCMg",
    "328": "vitaminDMcg",
    "1114": "vitaminDMcg",
    "323": "vitaminEMg",
    "1109": "vitaminEMg",
    "430": "vitaminKMcg",
    "1185": "vitaminKMcg",
    "404": "thiaminMg",
    "1165": "thiaminMg",
    "405": "riboflavinMg",
    "1166": "riboflavinMg",
    "406": "niacinMg",
    "1167": "niacinMg",
    "415": "vitaminB6Mg",
    "1175": "vitaminB6Mg",
    "435": "folateMcg",
    "1177": "folateMcg",
    "418": "vitaminB12Mcg",
    "1178": "vitaminB12Mcg",
}

EMPTY = {
    "energyKcal": None,
    "proteinG": None,
    "carbohydrateG": None,
    "fatG": None,
    "fiberG": None,
    "sugarG": None,
    "calciumMg": None,
    "ironMg": None,
    "magnesiumMg": None,
    "phosphorusMg": None,
    "potassiumMg": None,
    "sodiumMg": None,
    "zincMg": None,
    "vitaminAMcg": None,
    "vitaminCMg": None,
    "vitaminDMcg": None,
    "vitaminEMg": None,
    "vitaminKMcg": None,
    "thiaminMg": None,
    "riboflavinMg": None,
    "niacinMg": None,
    "vitaminB6Mg": None,
    "folateMcg": None,
    "vitaminB12Mcg": None,
}

# Telugu names as unicode escapes so this file stays ASCII-safe.
META = {
    2708346: {
        "id": "idli",
        "nameEn": "Idli",
        "nameTe": "\u0c07\u0c21\u0c4d\u0c32\u0c40",
        "category": "prepared",
        "subcategory": "breakfast",
        "state": "steamed",
        "search": ["idly", "idli"],
        "default": "1 item",
    },
    2708347: {
        "id": "dosa-plain",
        "nameEn": "Dosa, plain",
        "nameTe": "\u0c26\u0c4b\u0c36",
        "category": "prepared",
        "subcategory": "breakfast",
        "state": "cooked",
        "search": ["dose", "dosa"],
        "default": "1 small",
    },
    2709129: {
        "id": "dosa-filled",
        "nameEn": "Dosa, with filling",
        "nameTe": "\u0c2e\u0c38\u0c3e\u0c32\u0c3e \u0c26\u0c4b\u0c36",
        "category": "prepared",
        "subcategory": "breakfast",
        "state": "cooked",
        "search": ["masala dosa"],
        "default": "1 medium",
    },
    2709128: {
        "id": "upma",
        "nameEn": "Upma",
        "nameTe": "\u0c09\u0c2a\u0c4d\u0c2e\u0c3e",
        "category": "prepared",
        "subcategory": "breakfast",
        "state": "cooked",
        "search": ["uppma", "upma"],
        "default": "1 cup, cooked",
    },
    2709130: {
        "id": "vada",
        "nameEn": "Vada",
        "nameTe": "\u0c35\u0c21",
        "category": "prepared",
        "subcategory": "breakfast",
        "state": "fried",
        "search": ["wada", "medu vada", "vada"],
        "default": "1 item, any size",
    },
    2707714: {
        "id": "poori",
        "nameEn": "Poori / puri",
        "nameTe": "\u0c2a\u0c42\u0c30\u0c40",
        "category": "prepared",
        "subcategory": "bread",
        "state": "fried",
        "search": ["puri", "poori"],
        "default": '1 puri (approx 4-4/5" dia)',
    },
    2707713: {
        "id": "roti-chapati",
        "nameEn": "Chapati / roti",
        "nameTe": "\u0c1a\u0c2a\u0c3e\u0c24\u0c40 / \u0c30\u0c4b\u0c1f\u0c40",
        "category": "prepared",
        "subcategory": "bread",
        "state": "cooked",
        "search": ["roti", "chapathi", "chappati", "phulka"],
        "default": '1 medium chappatti or roti (7")',
    },
    2707715: {
        "id": "paratha",
        "nameEn": "Paratha",
        "nameTe": "\u0c2a\u0c30\u0c4b\u0c1f\u0c3e",
        "category": "prepared",
        "subcategory": "bread",
        "state": "cooked",
        "search": ["parotta", "paratha"],
        "default": "1 paratha",
    },
    2707613: {
        "id": "naan",
        "nameEn": "Naan",
        "nameTe": "\u0c28\u0c3e\u0c28\u0c4d",
        "category": "bakery",
        "subcategory": "bread",
        "state": "cooked",
        "search": ["nan", "naan"],
        "default": '1 piece (1/4 of 10" dia)',
    },
    2708730: {
        "id": "samosa",
        "nameEn": "Samosa",
        "nameTe": "\u0c38\u0c2e\u0c4b\u0c38\u0c3e",
        "category": "prepared",
        "subcategory": "snack",
        "state": "fried",
        "search": ["samosa"],
        "default": "1 regular/large",
    },
    2707427: {
        "id": "dal",
        "nameEn": "Dal",
        "nameTe": "\u0c2a\u0c2a\u0c4d\u0c2a\u0c41",
        "category": "prepared",
        "subcategory": "pulse-dish",
        "state": "boiled",
        "search": ["pappu", "dal"],
        "default": "1 cup",
    },
    2708985: {
        "id": "vegetable-biryani",
        "nameEn": "Vegetable biryani",
        "nameTe": "\u0c15\u0c42\u0c30\u0c17\u0c3e\u0c2f\u0c32 \u0c2c\u0c3f\u0c30\u0c4d\u0c2f\u0c3e\u0c28\u0c40",
        "category": "prepared",
        "subcategory": "rice-dish",
        "state": "cooked",
        "search": ["biryani", "veg biryani"],
        "default": "1 cup",
    },
}


def nutrition_from(food: dict) -> dict:
    nuts = dict(EMPTY)
    for item in food.get("foodNutrients", []):
        nutrient = item.get("nutrient") or {}
        key = NUT_BY_NUMBER.get(str(nutrient.get("number") or ""))
        if key and item.get("amount") is not None:
            nuts[key] = item["amount"]
    return nuts


def portions_from(food: dict) -> list[dict]:
    out = []
    for portion in food.get("foodPortions", []):
        grams = portion.get("gramWeight")
        if grams is None:
            continue
        label = portion.get("portionDescription") or portion.get("modifier") or "portion"
        if label.lower().startswith("quantity not specified"):
            continue
        if "surface inch" in label.lower():
            continue
        out.append(
            {
                "labelEn": label,
                "grams": grams,
                "amount": 1.0,
                "modifier": portion.get("modifier") or label,
            }
        )
    return out


def unverified(food_id: str, name_en: str, name_te: str, search: list[str], note: str) -> dict:
    return {
        "id": food_id,
        "nameEn": name_en,
        "nameTe": name_te,
        "category": "prepared",
        "subcategory": "breakfast",
        "state": "cooked",
        "searchTerms": search,
        "usdaDescription": None,
        "scientificName": None,
        "fdcId": None,
        "ndbNumber": None,
        "publicationDate": None,
        "usdaCategory": None,
        "nutritionAvailable": False,
        "confidence": "UNVERIFIED",
        "nutrition": dict(EMPTY),
        "portions": [],
        "serving": {"defaultAmount": 100, "unit": "g", "basis": "per_100g", "commonLabelEn": "100 g"},
        "source": {
            "organization": "National Institute of Nutrition, Indian Council of Medical Research",
            "database": "Indian Food Composition Tables (IFCT)",
            "reference": "Longvah T, Ananthan R, Bhaskarachary K, Venkaiah K. Indian Food Composition Tables. NIN, ICMR, Hyderabad, 2017.",
            "year": 2017,
            "country": "India",
            "dataBasis": "per 100 g",
            "verifiedDate": None,
            "url": "https://www.nin.res.in/",
            "importStatus": note,
        },
    }


def main() -> int:
    raw_path = Path("/tmp/usda-indian-foods.json")
    seed_path = Path(__file__).resolve().parents[1] / "src/data/foods/usda-sr-legacy-seed.json"
    raw = json.loads(raw_path.read_text(encoding="utf-8"))
    by_id = {food["fdcId"]: food for food in raw}
    records = []
    for fdc_id, meta in META.items():
        food = by_id[fdc_id]
        portions = portions_from(food)
        default_label = meta["default"]
        default_g = next((item["grams"] for item in portions if item["labelEn"] == default_label), None)
        if default_g is None and portions:
            default_g = portions[0]["grams"]
            default_label = portions[0]["labelEn"]
        if default_g is None:
            default_g = 100
            default_label = "100 g"
        records.append(
            {
                "id": meta["id"],
                "nameEn": meta["nameEn"],
                "nameTe": meta["nameTe"],
                "category": meta["category"],
                "subcategory": meta["subcategory"],
                "state": meta["state"],
                "searchTerms": meta["search"],
                "usdaDescription": food.get("description"),
                "scientificName": None,
                "fdcId": fdc_id,
                "ndbNumber": food.get("foodCode"),
                "publicationDate": food.get("publicationDate"),
                "usdaCategory": (food.get("wweiaFoodCategory") or {}).get("wweiaFoodCategoryDescription"),
                "nutritionAvailable": True,
                "confidence": "HIGH",
                "nutrition": nutrition_from(food),
                "portions": portions,
                "serving": {
                    "defaultAmount": default_g,
                    "unit": "g",
                    "basis": "per_100g",
                    "commonLabelEn": default_label,
                },
                "source": {
                    "organization": "U.S. Department of Agriculture, Agricultural Research Service",
                    "database": "USDA FoodData Central, Survey (FNDDS)",
                    "reference": f"FDC ID {fdc_id}",
                    "year": 2024,
                    "country": "United States",
                    "dataBasis": "per 100 g",
                    "verifiedDate": "2026-08-16",
                    "url": f"https://fdc.nal.usda.gov/food-details/{fdc_id}/nutrients",
                    "importStatus": "Copied from official USDA FNDDS. Homemade recipes vary; values are not invented.",
                },
            }
        )
    records.append(
        unverified(
            "pesarattu",
            "Pesarattu",
            "\u0c2a\u0c46\u0c38\u0c30\u0c1f\u0c4d\u0c1f\u0c41",
            ["pesarattu", "pesa attu", "green gram dosa"],
            "No official USDA prepared-food record was found. Values are not invented. Log boiled mung beans if you need a verified estimate.",
        )
    )
    records.append(
        unverified(
            "ragi-java",
            "Ragi java / ragi porridge",
            "\u0c30\u0c3e\u0c17\u0c3f \u0c1c\u0c3e\u0c35\u0c3e",
            ["ragi java", "ragi javva", "ragi malt", "ragi porridge"],
            "No official USDA prepared-food record was found. Finger millet grain is catalogued separately without invented values.",
        )
    )

    seed = json.loads(seed_path.read_text(encoding="utf-8"))
    existing = {food["id"] for food in seed["foods"]}
    added = []
    for record in records:
        if record["id"] in existing:
            continue
        if record["nutritionAvailable"] and record["nutrition"]["energyKcal"] is None:
            raise SystemExit(f"Missing energy for {record['id']}")
        seed["foods"].append(record)
        added.append(record["id"])
    seed["foodDatabaseVersion"] = "2026.2"
    seed["note"] = (
        "Nutrition values are copied from USDA SR Legacy or USDA FNDDS. "
        "Unavailable Indian catalog items have null nutrients. Homemade recipes vary."
    )
    seed["dataset"] = "USDA FoodData Central SR Legacy (April 2018) and Survey FNDDS records accessed 2026-08-16"
    seed_path.write_text(json.dumps(seed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("added", added)
    print("total", len(seed["foods"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
