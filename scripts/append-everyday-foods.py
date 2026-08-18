#!/usr/bin/env python3
"""Append everyday Indian meals, bakery, and snack foods.

Copies official USDA FNDDS and SR Legacy values only. Never invents numbers.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "src/data/foods/usda-sr-legacy-seed.json"
SR = Path("/tmp/usda-foods/sr/FoodData_Central_sr_legacy_food_json_2018-04.json")
FNDDS = Path("/tmp/usda-more-foods.json")

NUT_BY_ID = {
    1008: "energyKcal",
    1003: "proteinG",
    1005: "carbohydrateG",
    1004: "fatG",
    1079: "fiberG",
    2000: "sugarG",
    1087: "calciumMg",
    1089: "ironMg",
    1090: "magnesiumMg",
    1091: "phosphorusMg",
    1092: "potassiumMg",
    1093: "sodiumMg",
    1095: "zincMg",
    1106: "vitaminAMcg",
    1162: "vitaminCMg",
    1114: "vitaminDMcg",
    1109: "vitaminEMg",
    1185: "vitaminKMcg",
    1165: "thiaminMg",
    1166: "riboflavinMg",
    1167: "niacinMg",
    1175: "vitaminB6Mg",
    1177: "folateMcg",
    1178: "vitaminB12Mcg",
}

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

EMPTY = {name: None for name in NUT_BY_ID.values()}

FNDDS_META = {
    2709309: {
        "id": "chutney",
        "nameEn": "Chutney",
        "nameTe": "\u0c1a\u0c1f\u0c4d\u0c28\u0c40",
        "category": "prepared",
        "subcategory": "condiment",
        "state": "cooked",
        "search": ["chutney", "chatni", "pachadi", "coconut chutney"],
    },
    2710168: {
        "id": "ghee",
        "nameEn": "Ghee (clarified butter)",
        "nameTe": "\u0c28\u0c46\u0c2f\u0c4d\u0c2f\u0c3f",
        "category": "oils-fats",
        "subcategory": "ghee",
        "state": "ready",
        "search": ["neyyi", "ghee", "clarified butter"],
    },
    2706437: {
        "id": "chicken-curry",
        "nameEn": "Chicken curry",
        "nameTe": "\u0c15\u0c4b\u0c21\u0c3f \u0c15\u0c30\u0c4d\u0c30\u0c3f",
        "category": "prepared",
        "subcategory": "curry",
        "state": "cooked",
        "search": ["chicken curry", "kodi kura"],
    },
    2706538: {
        "id": "chicken-biryani",
        "nameEn": "Chicken biryani",
        "nameTe": "\u0c15\u0c4b\u0c21\u0c3f \u0c2c\u0c3f\u0c30\u0c4d\u0c2f\u0c3e\u0c28\u0c40",
        "category": "prepared",
        "subcategory": "rice-dish",
        "state": "cooked",
        "search": ["chicken biryani"],
    },
    2706490: {
        "id": "meat-biryani",
        "nameEn": "Meat biryani",
        "nameTe": "\u0c2e\u0c3e\u0c02\u0c38\u0c02 \u0c2c\u0c3f\u0c30\u0c4d\u0c2f\u0c3e\u0c28\u0c40",
        "category": "prepared",
        "subcategory": "rice-dish",
        "state": "cooked",
        "search": ["mutton biryani", "meat biryani"],
    },
    2710067: {
        "id": "vegetable-curry",
        "nameEn": "Vegetable curry",
        "nameTe": "\u0c15\u0c42\u0c30\u0c17\u0c3e\u0c2f \u0c15\u0c42\u0c30",
        "category": "prepared",
        "subcategory": "curry",
        "state": "cooked",
        "search": ["kura", "koora", "sabzi", "vegetable curry"],
    },
    2707431: {
        "id": "lentil-curry",
        "nameEn": "Lentil curry",
        "nameTe": "\u0c2a\u0c2a\u0c4d\u0c2a\u0c41 \u0c15\u0c42\u0c30",
        "category": "prepared",
        "subcategory": "pulse-dish",
        "state": "cooked",
        "search": ["dal curry", "pappu kura"],
    },
    2706413: {
        "id": "mutton-gravy",
        "nameEn": "Lamb or mutton with gravy",
        "nameTe": "\u0c2e\u0c1f\u0c28\u0c4d \u0c17\u0c4d\u0c30\u0c47\u0c35\u0c40",
        "category": "prepared",
        "subcategory": "meat-dish",
        "state": "cooked",
        "search": ["mutton curry", "lamb gravy"],
    },
    2710066: {
        "id": "pakora",
        "nameEn": "Pakora (fried vegetable fritter)",
        "nameTe": "\u0c2a\u0c15\u0c4b\u0c21\u0c3e / \u0c15\u0c42\u0c30\u0c17\u0c3e\u0c2f \u0c35\u0c47\u0c2f\u0c3f\u0c02\u0c1a\u0c3f\u0c28\u0c26\u0c3f",
        "category": "prepared",
        "subcategory": "fried",
        "state": "fried",
        "search": ["pakora", "bajji", "bhaji", "bondalu"],
    },
}

SR_META = {
    173905: {
        "id": "oats-cooked",
        "nameEn": "Oats, cooked in water",
        "nameTe": "\u0c13\u0c1f\u0c4d\u0c38\u0c4d (\u0c09\u0c21\u0c3f\u0c15\u0c3f\u0c02\u0c1a\u0c3f\u0c28\u0c26\u0c3f)",
        "category": "grains",
        "subcategory": "oats",
        "state": "cooked",
        "search": ["oats", "oatmeal"],
    },
    173424: {
        "id": "egg-boiled",
        "nameEn": "Egg, hard-boiled",
        "nameTe": "\u0c09\u0c21\u0c3f\u0c15\u0c3f\u0c28 \u0c17\u0c41\u0c21\u0c4d\u0c21\u0c41",
        "category": "eggs",
        "subcategory": "chicken-egg",
        "state": "boiled",
        "search": ["boiled egg", "guddu"],
    },
    172185: {
        "id": "egg-omelet",
        "nameEn": "Egg omelet",
        "nameTe": "\u0c12\u0c2e\u0c4d\u0c32\u0c46\u0c1f\u0c4d",
        "category": "eggs",
        "subcategory": "chicken-egg",
        "state": "cooked",
        "search": ["omelette", "omelet"],
    },
    174924: {
        "id": "bread-white",
        "nameEn": "White bread",
        "nameTe": "\u0c24\u0c46\u0c32\u0c4d\u0c32 \u0c2c\u0c4d\u0c30\u0c46\u0c21\u0c4d",
        "category": "bakery",
        "subcategory": "bread",
        "state": "ready",
        "search": ["bread", "sandwich bread"],
    },
    169677: {
        "id": "potato-chips",
        "nameEn": "Potato chips, salted",
        "nameTe": "\u0c2c\u0c02\u0c17\u0c3e\u0c33 \u0c1a\u0c3f\u0c2a\u0c4d\u0c38\u0c4d",
        "category": "snacks",
        "subcategory": "chips",
        "state": "fried",
        "search": ["chips", "crisps", "lay's"],
    },
    169264: {
        "id": "french-fries",
        "nameEn": "French fries, oven-heated",
        "nameTe": "\u0c2b\u0c4d\u0c30\u0c46\u0c02\u0c1a\u0c4d \u0c2b\u0c4d\u0c30\u0c48\u0c38\u0c4d",
        "category": "snacks",
        "subcategory": "fried-potato",
        "state": "fried",
        "search": ["fries", "finger chips"],
    },
    167575: {
        "id": "ice-cream-vanilla",
        "nameEn": "Vanilla ice cream",
        "nameTe": "\u0c35\u0c28\u0c3f\u0c32\u0c3e \u0c10\u0c38\u0c4d \u0c15\u0c4d\u0c30\u0c40\u0c2e\u0c4d",
        "category": "snacks",
        "subcategory": "dessert",
        "state": "ready",
        "search": ["ice cream"],
    },
    174852: {
        "id": "cola",
        "nameEn": "Cola, regular",
        "nameTe": "\u0c15\u0c4b\u0c32\u0c3e",
        "category": "snacks",
        "subcategory": "drink",
        "state": "ready",
        "search": ["coke", "pepsi", "soft drink", "soda"],
    },
    172716: {
        "id": "cookie-chocolate-chip",
        "nameEn": "Chocolate chip cookie",
        "nameTe": "\u0c1a\u0c3e\u0c15\u0c4a\u0c32\u0c46\u0c1f\u0c4d \u0c1a\u0c3f\u0c2a\u0c4d \u0c2c\u0c3f\u0c38\u0c4d\u0c15\u0c46\u0c1f\u0c4d",
        "category": "bakery",
        "subcategory": "cookie",
        "state": "baked",
        "search": ["cookie", "biscuit chocolate"],
    },
    174990: {
        "id": "doughnut-plain",
        "nameEn": "Doughnut, plain cake-type",
        "nameTe": "\u0c21\u0c4b\u0c28\u0c1f\u0c4d",
        "category": "bakery",
        "subcategory": "doughnut",
        "state": "fried",
        "search": ["donut", "doughnut"],
    },
    173292: {
        "id": "pizza-cheese",
        "nameEn": "Cheese pizza, regular crust",
        "nameTe": "\u0c1a\u0c40\u0c1c\u0c4d \u0c2a\u0c3f\u0c1c\u0c4d\u0c1c\u0c3e",
        "category": "snacks",
        "subcategory": "pizza",
        "state": "baked",
        "search": ["pizza"],
    },
    170694: {
        "id": "hamburger",
        "nameEn": "Hamburger, with condiments",
        "nameTe": "\u0c39\u0c3e\u0c2e\u0c4d\u0c2c\u0c30\u0c4d\u0c17\u0c30\u0c4d",
        "category": "snacks",
        "subcategory": "burger",
        "state": "ready",
        "search": ["burger", "hamburger"],
    },
    167587: {
        "id": "milk-chocolate",
        "nameEn": "Milk chocolate",
        "nameTe": "\u0c2e\u0c3f\u0c32\u0c4d\u0c15\u0c4d \u0c1a\u0c3e\u0c15\u0c4a\u0c32\u0c47\u0c1f\u0c4d",
        "category": "snacks",
        "subcategory": "chocolate",
        "state": "ready",
        "search": ["chocolate", "dairy milk"],
    },
    167959: {
        "id": "popcorn",
        "nameEn": "Popcorn, air-popped",
        "nameTe": "\u0c2a\u0c3e\u0c2a\u0c4d\u0c15\u0c3e\u0c30\u0c4d\u0c28\u0c4d",
        "category": "snacks",
        "subcategory": "popcorn",
        "state": "ready",
        "search": ["popcorn"],
    },
    172704: {
        "id": "pound-cake",
        "nameEn": "Pound cake",
        "nameTe": "\u0c2a\u0c4c\u0c02\u0c21\u0c4d \u0c15\u0c47\u0c15\u0c4d",
        "category": "bakery",
        "subcategory": "cake",
        "state": "baked",
        "search": ["cake"],
    },
    170472: {
        "id": "mixed-vegetables-cooked",
        "nameEn": "Mixed vegetables, boiled",
        "nameTe": "\u0c2e\u0c3f\u0c36\u0c4d\u0c30\u0c3f\u0c24 \u0c15\u0c42\u0c30\u0c17\u0c3e\u0c2f\u0c32\u0c41 (\u0c09\u0c21\u0c3f\u0c15\u0c3f\u0c28\u0c26\u0c3f)",
        "category": "vegetables",
        "subcategory": "mixed",
        "state": "boiled",
        "search": ["mixed vegetables", "veg mix"],
    },
    171177: {
        "id": "ramen-dry",
        "nameEn": "Instant ramen noodles, dry",
        "nameTe": "\u0c07\u0c02\u0c38\u0c4d\u0c1f\u0c02\u0c1f\u0c4d \u0c28\u0c42\u0c21\u0c3f\u0c32\u0c4d\u0c38\u0c4d",
        "category": "snacks",
        "subcategory": "noodles",
        "state": "dry",
        "search": ["maggi", "ramen", "noodles"],
    },
    174957: {
        "id": "graham-biscuit",
        "nameEn": "Graham cracker / plain biscuit",
        "nameTe": "\u0c2c\u0c3f\u0c38\u0c4d\u0c15\u0c46\u0c1f\u0c4d",
        "category": "bakery",
        "subcategory": "biscuit",
        "state": "ready",
        "search": ["biscuit", "marie", "cracker"],
    },
    170718: {
        "id": "fried-chicken-pieces",
        "nameEn": "Fried chicken pieces",
        "nameTe": "\u0c35\u0c47\u0c2f\u0c3f\u0c02\u0c1a\u0c3f\u0c28 \u0c15\u0c4b\u0c21\u0c3f",
        "category": "snacks",
        "subcategory": "fried-chicken",
        "state": "fried",
        "search": ["fried chicken", "kfc"],
    },
}

UNVERIFIED = [
    (
        "sambar",
        "Sambar",
        "\u0c38\u0c3e\u0c02\u0c2c\u0c3e\u0c30\u0c4d",
        ["sambar", "sambhar"],
        "No official USDA prepared-food record was found. Values are not invented. Log dal or lentil curry for a verified pulse estimate.",
    ),
    (
        "rasam",
        "Rasam",
        "\u0c30\u0c38\u0c02",
        ["rasam", "chaaru", "saaru"],
        "No official USDA prepared-food record was found. Values are not invented.",
    ),
    (
        "pongal",
        "Pongal rice",
        "\u0c2a\u0c4a\u0c02\u0c17\u0c32\u0c3f",
        ["pongal", "ven pongal", "khara pongal"],
        "No official USDA prepared-food record was found. Values are not invented. Log cooked rice plus dal for a verified estimate.",
    ),
    (
        "lemon-rice",
        "Lemon rice",
        "\u0c28\u0c3f\u0c2e\u0c4d\u0c2e\u0c15\u0c3e\u0c2f \u0c05\u0c28\u0c4d\u0c28\u0c02",
        ["lemon rice", "chitrannam", "nimmakaya pulihora"],
        "No official USDA prepared-food record was found. Values are not invented. Log cooked rice for a verified rice estimate.",
    ),
    (
        "vegetable-korma",
        "Vegetable korma / kurma",
        "\u0c15\u0c42\u0c30\u0c17\u0c3e\u0c2f \u0c15\u0c41\u0c30\u0c4d\u0c2e\u0c3e",
        ["kurma", "korma", "poori kurma"],
        "No official USDA korma record was found. Values are not invented. Log vegetable curry for a verified curry estimate.",
    ),
    (
        "vegetable-fry",
        "Vegetable fry / vepudu",
        "\u0c15\u0c42\u0c30\u0c17\u0c3e\u0c2f \u0c35\u0c47\u0c2a\u0c41\u0c21\u0c41",
        ["vepudu", "vegetable fry", "poriyal", "thoran", "koora fry"],
        "No official USDA dry vegetable-fry record was found. Values are not invented. Log vegetable curry or pakora for a verified cooked/fried vegetable estimate.",
    ),
]

SEARCH_EXTRAS = {
    "milk-whole": ["palu", "paalu", "milk"],
    "yogurt-plain-whole": ["perugu", "curd", "dahi"],
    "rice-white-cooked": ["annam", "cooked rice", "rice"],
    "dal": ["pappu", "dal"],
    "egg-whole-raw": ["guddu", "gudlu", "egg"],
    "samosa": ["samosa", "junk food"],
    "oats-dry": ["oats", "oatmeal"],
}


def empty_nutrition() -> dict:
    return dict(EMPTY)


def nutrition_from(food: dict) -> dict:
    nuts = empty_nutrition()
    for item in food.get("foodNutrients", []):
        nutrient = item.get("nutrient") or {}
        key = NUT_BY_ID.get(nutrient.get("id")) or NUT_BY_NUMBER.get(str(nutrient.get("number") or ""))
        if key and item.get("amount") is not None:
            nuts[key] = item["amount"]
    return nuts


def portions_from(food: dict) -> list[dict]:
    out = []
    for portion in food.get("foodPortions") or []:
        grams = portion.get("gramWeight")
        if grams is None:
            continue
        label = portion.get("portionDescription") or portion.get("modifier") or "portion"
        if str(label).lower().startswith("quantity not specified"):
            continue
        if "surface inch" in str(label).lower():
            continue
        amount = portion.get("amount") if portion.get("amount") is not None else 1.0
        out.append(
            {
                "labelEn": str(label),
                "grams": grams,
                "amount": amount,
                "modifier": portion.get("modifier") or str(label),
            }
        )
    return out


def serving_from(portions: list[dict], fallback_label: str = "100 g") -> dict:
    if not portions:
        return {"defaultAmount": 100, "unit": "g", "basis": "per_100g", "commonLabelEn": fallback_label}
    preferred = next((item for item in portions if "cup" in item["labelEn"].lower() or "item" in item["labelEn"].lower() or "medium" in item["labelEn"].lower()), portions[0])
    return {
        "defaultAmount": preferred["grams"],
        "unit": "g",
        "basis": "per_100g",
        "commonLabelEn": preferred["labelEn"],
    }


def source_fndds(fdc_id: int) -> dict:
    return {
        "organization": "U.S. Department of Agriculture, Agricultural Research Service",
        "database": "USDA FoodData Central, Survey (FNDDS)",
        "reference": f"FDC ID {fdc_id}",
        "year": 2024,
        "country": "United States",
        "dataBasis": "per 100 g",
        "verifiedDate": "2026-08-16",
        "url": f"https://fdc.nal.usda.gov/food-details/{fdc_id}/nutrients",
        "importStatus": "Copied from official USDA FNDDS. Homemade recipes vary; values are not invented.",
    }


def source_sr(fdc_id: int) -> dict:
    return {
        "organization": "U.S. Department of Agriculture, Agricultural Research Service",
        "database": "USDA FoodData Central, SR Legacy",
        "reference": f"FDC ID {fdc_id}",
        "year": 2018,
        "country": "United States",
        "dataBasis": "per 100 g",
        "verifiedDate": "2026-08-16",
        "url": f"https://fdc.nal.usda.gov/food-details/{fdc_id}/nutrients",
        "importStatus": "Copied from official USDA SR Legacy. Values are not invented.",
    }


def record_from(food: dict, meta: dict, source: dict) -> dict:
    portions = portions_from(food)
    nuts = nutrition_from(food)
    if nuts["energyKcal"] is None:
        raise SystemExit(f"Missing energy for {meta['id']} FDC {food.get('fdcId')}")
    category = None
    if food.get("wweiaFoodCategory"):
        category = food["wweiaFoodCategory"].get("wweiaFoodCategoryDescription")
    elif food.get("foodCategory"):
        category = food["foodCategory"].get("description") if isinstance(food.get("foodCategory"), dict) else food.get("foodCategory")
    return {
        "id": meta["id"],
        "nameEn": meta["nameEn"],
        "nameTe": meta["nameTe"],
        "category": meta["category"],
        "subcategory": meta["subcategory"],
        "state": meta["state"],
        "searchTerms": meta["search"],
        "usdaDescription": food.get("description"),
        "scientificName": food.get("scientificName"),
        "fdcId": food.get("fdcId"),
        "ndbNumber": food.get("foodCode") or food.get("ndbNumber"),
        "publicationDate": food.get("publicationDate"),
        "usdaCategory": category,
        "nutritionAvailable": True,
        "confidence": "HIGH",
        "nutrition": nuts,
        "portions": portions,
        "serving": serving_from(portions),
        "source": source,
    }


def unverified(food_id: str, name_en: str, name_te: str, search: list[str], note: str) -> dict:
    return {
        "id": food_id,
        "nameEn": name_en,
        "nameTe": name_te,
        "category": "prepared",
        "subcategory": "breakfast" if food_id in {"sambar", "pongal", "lemon-rice"} else "lunch",
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
        "nutrition": empty_nutrition(),
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
    seed = json.loads(SEED.read_text(encoding="utf-8"))
    existing = {food["id"] for food in seed["foods"]}
    records = []

    fndds_foods = {food["fdcId"]: food for food in json.loads(FNDDS.read_text(encoding="utf-8"))}
    for fdc_id, meta in FNDDS_META.items():
        records.append(record_from(fndds_foods[fdc_id], meta, source_fndds(fdc_id)))

    print("Loading SR Legacy...")
    sr_foods = {food["fdcId"]: food for food in json.loads(SR.read_text(encoding="utf-8"))["SRLegacyFoods"]}
    for fdc_id, meta in SR_META.items():
        records.append(record_from(sr_foods[fdc_id], meta, source_sr(fdc_id)))

    for item in UNVERIFIED:
        records.append(unverified(*item))

    added = []
    for record in records:
        if record["id"] in existing:
            continue
        seed["foods"].append(record)
        added.append(record["id"])
        existing.add(record["id"])

    for food in seed["foods"]:
        extra = SEARCH_EXTRAS.get(food["id"])
        if not extra:
            continue
        terms = list(food.get("searchTerms") or [])
        for term in extra:
            if term not in terms:
                terms.append(term)
        food["searchTerms"] = terms

    seed["foodDatabaseVersion"] = "2026.3"
    seed["note"] = (
        "Nutrition values are copied from USDA SR Legacy or USDA FNDDS. "
        "Unavailable Indian catalog items have null nutrients. Homemade recipes vary."
    )
    seed["dataset"] = "USDA FoodData Central SR Legacy (April 2018) and Survey FNDDS records accessed 2026-08-16"
    SEED.write_text(json.dumps(seed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("added", added)
    print("total", len(seed["foods"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
