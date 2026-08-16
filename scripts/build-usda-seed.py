#!/usr/bin/env python3
# ASCII-only source. Telugu names are unicode escapes.
import json
from pathlib import Path

SRC = Path("/tmp/usda-foods/sr/FoodData_Central_sr_legacy_food_json_2018-04.json")
OUT = Path(__file__).resolve().parents[1] / "src/data/foods/usda-sr-legacy-seed.json"

NUTRIENT_IDS = {
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

TE = {
    "spinach-raw": "\u0c2a\u0c3e\u0c32\u0c15\u0c42\u0c30",
    "carrot-raw": "\u0c15\u0c4d\u0c2f\u0c3e\u0c30\u0c46\u0c1f\u0c4d",
    "tomato-raw": "\u0c1f\u0c2e\u0c4b\u0c1f\u0c3e",
    "cabbage-raw": "\u0c15\u0c4d\u0c2f\u0c3e\u0c2c\u0c47\u0c1c\u0c40",
    "cauliflower-raw": "\u0c15\u0c3e\u0c32\u0c3f\u0c2b\u0c4d\u0c32\u0c35\u0c30\u0c4d",
    "green-beans-raw": "\u0c2c\u0c40\u0c28\u0c4d\u0c38\u0c4d",
    "eggplant-raw": "\u0c35\u0c02\u0c15\u0c3e\u0c2f",
    "okra-raw": "\u0c2c\u0c46\u0c02\u0c21\u0c15\u0c3e\u0c2f",
    "beet-raw": "\u0c2c\u0c40\u0c1f\u0c4d\u0c30\u0c42\u0c1f\u0c4d",
    "bottle-gourd-raw": "\u0c38\u0c4a\u0c30\u0c15\u0c3e\u0c2f",
    "bitter-gourd-raw": "\u0c15\u0c3e\u0c15\u0c30\u0c15\u0c3e\u0c2f",
    "drumstick-pods-raw": "\u0c2e\u0c41\u0c28\u0c17\u0c15\u0c3e\u0c2f",
    "guava-raw": "\u0c1c\u0c3e\u0c2e",
    "apple-raw": "\u0c06\u0c2a\u0c3f\u0c32\u0c4d",
    "banana-raw": "\u0c05\u0c30\u0c1f\u0c3f\u0c2a\u0c02\u0c21\u0c41",
    "orange-raw": "\u0c28\u0c3e\u0c30\u0c3f\u0c02\u0c1c",
    "papaya-raw": "\u0c2c\u0c4a\u0c2a\u0c4d\u0c2a\u0c3e\u0c2f\u0c3f",
    "pomegranate-raw": "\u0c26\u0c3e\u0c28\u0c3f\u0c2e\u0c4d\u0c2e",
    "watermelon-raw": "\u0c2a\u0c41\u0c1a\u0c4d\u0c1a\u0c15\u0c3e\u0c2f",
    "mango-raw": "\u0c2e\u0c3e\u0c2e\u0c3f\u0c21\u0c3f",
    "grapes-raw": "\u0c26\u0c4d\u0c30\u0c3e\u0c15\u0c4d\u0c37",
    "rice-white-raw": "\u0c2c\u0c3f\u0c2f\u0c4d\u0c2f\u0c02 (\u0c2e\u0c41\u0c21\u0c3f)",
    "rice-white-cooked": "\u0c2c\u0c3f\u0c2f\u0c4d\u0c2f\u0c02 (\u0c35\u0c02\u0c21\u0c3f\u0c28\u0c26\u0c3f)",
    "wheat-flour-whole": "\u0c17\u0c4b\u0c27\u0c41\u0c2e \u0c2a\u0c3f\u0c02\u0c21\u0c3f",
    "wheat-flour-white": "\u0c24\u0c46\u0c32\u0c4d\u0c32 \u0c17\u0c4b\u0c27\u0c41\u0c2e \u0c2a\u0c3f\u0c02\u0c21\u0c3f",
    "oats-dry": "\u0c13\u0c1f\u0c4d\u0c38\u0c4d",
    "proso-millet-raw": "\u0c2a\u0c4d\u0c30\u0c4b\u0c38\u0c4b \u0c2e\u0c3f\u0c32\u0c4d\u0c32\u0c46\u0c1f\u0c4d",
    "proso-millet-cooked": "\u0c2a\u0c4d\u0c30\u0c4b\u0c38\u0c4b \u0c2e\u0c3f\u0c32\u0c4d\u0c32\u0c46\u0c1f\u0c4d (\u0c35\u0c02\u0c21\u0c3f\u0c28\u0c26\u0c3f)",
    "sorghum-grain": "\u0c1c\u0c4a\u0c28\u0c4d\u0c28",
    "lentils-raw": "\u0c2e\u0c38\u0c42\u0c30\u0c4d \u0c2a\u0c2a\u0c4d\u0c2a\u0c41 (\u0c0e\u0c02\u0c21\u0c41)",
    "lentils-cooked": "\u0c2e\u0c38\u0c42\u0c30\u0c4d \u0c2a\u0c2a\u0c4d\u0c2a\u0c41 (\u0c35\u0c02\u0c21\u0c3f\u0c28\u0c26\u0c3f)",
    "chickpeas-raw": "\u0c38\u0c46\u0c28\u0c17\u0c32\u0c41 (\u0c0e\u0c02\u0c21\u0c41)",
    "chickpeas-cooked": "\u0c38\u0c46\u0c28\u0c17\u0c32\u0c41 (\u0c35\u0c02\u0c21\u0c3f\u0c28\u0c35\u0c3f)",
    "mung-raw": "\u0c2a\u0c46\u0c38\u0c32\u0c41 (\u0c0e\u0c02\u0c21\u0c41)",
    "mung-cooked": "\u0c2a\u0c46\u0c38\u0c32\u0c41 (\u0c35\u0c02\u0c21\u0c3f\u0c28\u0c35\u0c3f)",
    "pigeon-peas-raw": "\u0c15\u0c02\u0c26\u0c3f\u0c2a\u0c2a\u0c4d\u0c2a\u0c41 (\u0c0e\u0c02\u0c21\u0c41)",
    "pigeon-peas-cooked": "\u0c15\u0c02\u0c26\u0c3f\u0c2a\u0c2a\u0c4d\u0c2a\u0c41 (\u0c35\u0c02\u0c21\u0c3f\u0c28\u0c26\u0c3f)",
    "soybeans-raw": "\u0c38\u0c4b\u0c2f\u0c3e \u0c17\u0c3f\u0c02\u0c1c\u0c32\u0c41",
    "peanuts-raw": "\u0c35\u0c47\u0c30\u0c41\u0c36\u0c46\u0c28\u0c17",
    "almonds": "\u0c2c\u0c3e\u0c26\u0c02",
    "egg-whole-raw": "\u0c17\u0c41\u0c21\u0c4d\u0c21\u0c41",
    "chicken-breast-raw": "\u0c15\u0c4b\u0c21\u0c3f \u0c2e\u0c3e\u0c02\u0c38\u0c02 (\u0c2e\u0c41\u0c21\u0c3f)",
    "chicken-breast-roasted": "\u0c15\u0c4b\u0c21\u0c3f \u0c2e\u0c3e\u0c02\u0c38\u0c02 (\u0c35\u0c47\u0c2f\u0c3f\u0c02\u0c1a\u0c3f\u0c28\u0c26\u0c3f)",
    "salmon-atlantic-farmed-raw": "\u0c38\u0c3e\u0c32\u0c4d\u0c2e\u0c28\u0c4d \u0c1a\u0c47\u0c2a (\u0c2e\u0c41\u0c21\u0c3f)",
    "milk-whole": "\u0c2a\u0c3e\u0c32\u0c41",
    "yogurt-plain-whole": "\u0c2a\u0c46\u0c30\u0c41\u0c17\u0c41",
    "olive-oil": "\u0c06\u0c32\u0c3f\u0c35\u0c4d \u0c28\u0c42\u0c28\u0c46",
    "peanut-oil": "\u0c35\u0c47\u0c30\u0c41\u0c36\u0c46\u0c28\u0c17 \u0c28\u0c42\u0c28\u0c46",
    "butter-oil-anhydrous": "\u0c35\u0c46\u0c28\u0c4d\u0c28 \u0c28\u0c42\u0c28\u0c46",
    "ragi-raw": "\u0c30\u0c3e\u0c17\u0c3f (\u0c2e\u0c41\u0c21\u0c3f)",
    "bajra-raw": "\u0c38\u0c1c\u0c4d\u0c1c (\u0c2e\u0c41\u0c21\u0c3f)",
    "foxtail-millet-raw": "\u0c15\u0c4a\u0c30\u0c4d\u0c30\u0c32\u0c41 (\u0c2e\u0c41\u0c21\u0c3f)",
    "little-millet-raw": "\u0c38\u0c3e\u0c2e\u0c32\u0c41 (\u0c2e\u0c41\u0c21\u0c3f)",
    "kodo-millet-raw": "\u0c05\u0c30\u0c3f\u0c15\u0c46\u0c32\u0c41 (\u0c2e\u0c41\u0c21\u0c3f)",
    "barnyard-millet-raw": "\u0c0a\u0c26\u0c32\u0c41 (\u0c2e\u0c41\u0c21\u0c3f)",
    "paneer": "\u0c2a\u0c28\u0c40\u0c30\u0c4d",
    "mutton-raw": "\u0c2e\u0c1f\u0c28\u0c4d (\u0c2e\u0c41\u0c21\u0c3f)",
}

META = [
    (168462, "spinach-raw", "Spinach", "vegetables", "leafy", "raw", ["palakura", "palak"]),
    (170393, "carrot-raw", "Carrot", "vegetables", "root", "raw", ["carrot"]),
    (170457, "tomato-raw", "Tomato", "vegetables", "fruit-vegetable", "raw", ["tamota"]),
    (169975, "cabbage-raw", "Cabbage", "vegetables", "cruciferous", "raw", []),
    (169986, "cauliflower-raw", "Cauliflower", "vegetables", "cruciferous", "raw", []),
    (169961, "green-beans-raw", "Green beans", "vegetables", "legume-vegetable", "raw", ["beans", "snap beans"]),
    (169228, "eggplant-raw", "Eggplant / Brinjal", "vegetables", "fruit-vegetable", "raw", ["brinjal", "vankaya"]),
    (169260, "okra-raw", "Okra", "vegetables", "fruit-vegetable", "raw", ["bendakaya", "lady finger", "bhindi"]),
    (169145, "beet-raw", "Beetroot", "vegetables", "root", "raw", ["beet"]),
    (169232, "bottle-gourd-raw", "Bottle gourd (calabash)", "vegetables", "gourd", "raw", ["sorakaya", "lauki", "calabash"]),
    (168393, "bitter-gourd-raw", "Bitter gourd", "vegetables", "gourd", "raw", ["kakarakaya", "karela", "balsam-pear"]),
    (170483, "drumstick-pods-raw", "Drumstick pods", "vegetables", "pod", "raw", ["munagakaya", "moringa pods"]),
    (173044, "guava-raw", "Guava", "fruits", "tropical", "raw", ["jama"]),
    (171688, "apple-raw", "Apple, with skin", "fruits", "pome", "raw", []),
    (173944, "banana-raw", "Banana", "fruits", "tropical", "raw", ["aratipandu"]),
    (169097, "orange-raw", "Orange", "fruits", "citrus", "raw", ["narinja"]),
    (169926, "papaya-raw", "Papaya", "fruits", "tropical", "raw", ["boppayi"]),
    (169134, "pomegranate-raw", "Pomegranate", "fruits", "tropical", "raw", ["danimma"]),
    (167765, "watermelon-raw", "Watermelon", "fruits", "melon", "raw", ["puchchakaya"]),
    (169910, "mango-raw", "Mango", "fruits", "tropical", "raw", ["mamidi"]),
    (174683, "grapes-raw", "Grapes", "fruits", "berry", "raw", ["draksha"]),
    (169756, "rice-white-raw", "White rice, long-grain, unenriched", "grains", "rice", "raw", ["biyyam", "rice raw"]),
    (169757, "rice-white-cooked", "White rice, long-grain, unenriched, cooked without salt", "grains", "rice", "cooked", ["annam", "cooked rice"]),
    (168893, "wheat-flour-whole", "Whole-grain wheat flour", "grains", "wheat", "dry", ["godhuma pindi", "atta"]),
    (169761, "wheat-flour-white", "White wheat flour, unenriched", "grains", "wheat", "dry", ["maida"]),
    (169705, "oats-dry", "Oats", "grains", "oats", "dry", []),
    (169702, "proso-millet-raw", "Proso millet", "millets", "proso", "raw", ["millet raw", "panicum miliaceum"]),
    (168871, "proso-millet-cooked", "Proso millet, cooked", "millets", "proso", "cooked", ["millet cooked"]),
    (169716, "sorghum-grain", "Sorghum grain (jowar)", "millets", "sorghum", "raw", ["jowar", "jonna"]),
    (172420, "lentils-raw", "Lentils, dry", "pulses", "lentil", "dry", ["masoor", "dal dry"]),
    (172421, "lentils-cooked", "Lentils, boiled without salt", "pulses", "lentil", "boiled", ["dal cooked"]),
    (173756, "chickpeas-raw", "Chickpeas, dry", "legumes", "chickpea", "dry", ["chana", "bengal gram", "senagalu"]),
    (173757, "chickpeas-cooked", "Chickpeas, boiled without salt", "legumes", "chickpea", "boiled", []),
    (174256, "mung-raw", "Mung beans (green gram), dry", "pulses", "mung", "dry", ["pesalu", "green gram", "moong"]),
    (174257, "mung-cooked", "Mung beans, boiled without salt", "pulses", "mung", "boiled", []),
    (172436, "pigeon-peas-raw", "Pigeon peas (toor dal), dry", "pulses", "pigeon-pea", "dry", ["toor", "arhar", "kandipappu"]),
    (172437, "pigeon-peas-cooked", "Pigeon peas, boiled without salt", "pulses", "pigeon-pea", "boiled", []),
    (174270, "soybeans-raw", "Soybeans, dry", "legumes", "soy", "dry", ["soy"]),
    (172430, "peanuts-raw", "Peanuts, raw", "nuts-seeds", "peanut", "raw", ["verusenaga", "groundnut"]),
    (170567, "almonds", "Almonds", "nuts-seeds", "almond", "raw", ["badam"]),
    (171287, "egg-whole-raw", "Egg, whole, raw", "eggs", "chicken-egg", "raw", ["guddu"]),
    (171077, "chicken-breast-raw", "Chicken breast, skinless, raw", "chicken", "breast", "raw", ["kodi"]),
    (171477, "chicken-breast-roasted", "Chicken breast, roasted", "chicken", "breast", "roasted", []),
    (175167, "salmon-atlantic-farmed-raw", "Atlantic salmon, farmed, raw", "fish", "salmon", "raw", ["chepa"]),
    (171265, "milk-whole", "Whole milk (3.25% fat, vitamin D added)", "milk-dairy", "milk", "raw", ["paalu"]),
    (171284, "yogurt-plain-whole", "Plain whole-milk yogurt", "milk-dairy", "yogurt", "raw", ["perugu", "curd", "dahi"]),
    (171413, "olive-oil", "Olive oil", "oils-fats", "olive", "raw", []),
    (171410, "peanut-oil", "Peanut oil", "oils-fats", "peanut", "raw", ["groundnut oil"]),
    (173412, "butter-oil-anhydrous", "Butter oil, anhydrous", "oils-fats", "butter-oil", "raw", ["ghee analogue", "butteroil"]),
]

UNAVAILABLE = [
    ("ragi-raw", "Finger millet (ragi), raw", "millets", "finger-millet", "raw", ["ragi", "nachni", "eleusine"]),
    ("bajra-raw", "Pearl millet (bajra), raw", "millets", "pearl-millet", "raw", ["bajra", "sajja"]),
    ("foxtail-millet-raw", "Foxtail millet, raw", "millets", "foxtail", "raw", ["korralu", "kangni"]),
    ("little-millet-raw", "Little millet, raw", "millets", "little", "raw", ["samalu"]),
    ("kodo-millet-raw", "Kodo millet, raw", "millets", "kodo", "raw", ["arikelu", "varagu"]),
    ("barnyard-millet-raw", "Barnyard millet, raw", "millets", "barnyard", "raw", ["oodalu"]),
    ("paneer", "Paneer", "milk-dairy", "paneer", "raw", ["panir"]),
    ("mutton-raw", "Mutton, raw", "meat", "goat-sheep", "raw", ["goat meat"]),
]


def nutrients_of(food):
    out = {k: None for k in NUTRIENT_IDS.values()}
    for n in food.get("foodNutrients", []):
        nid = (n.get("nutrient") or {}).get("id")
        if nid in NUTRIENT_IDS:
            out[NUTRIENT_IDS[nid]] = n.get("amount")
    return out


def portions_of(food):
    portions = []
    for p in food.get("foodPortions") or []:
        grams = p.get("gramWeight")
        if grams is None:
            continue
        modifier = (p.get("modifier") or "").strip()
        amount = p.get("amount") if p.get("amount") is not None else p.get("value")
        label = ("%g %s" % (amount, modifier)).strip() if amount is not None else modifier
        portions.append({"labelEn": label, "grams": grams, "amount": amount, "modifier": modifier})
    portions.sort(key=lambda x: x["grams"])
    return portions


def pick_default(portions):
    if not portions:
        return None
    for p in portions:
        if "medium" in (p["modifier"] or "").lower():
            return p
    for key in ("cup", "large", "egg", "tablespoon", "tbsp"):
        for p in portions:
            if key in (p["modifier"] or "").lower() and "nlea" not in (p["modifier"] or "").lower():
                return p
    return portions[0]


print("Loading SR Legacy...")
foods = json.loads(SRC.read_text())["SRLegacyFoods"]
by_id = {f["fdcId"]: f for f in foods}

records = []
for fdc_id, fid, name_en, category, subcategory, state, terms in META:
    food = by_id[fdc_id]
    portions = portions_of(food)
    default = pick_default(portions)
    records.append({
        "id": fid,
        "nameEn": name_en,
        "nameTe": TE[fid],
        "category": category,
        "subcategory": subcategory,
        "state": state,
        "searchTerms": terms,
        "usdaDescription": food["description"],
        "scientificName": food.get("scientificName"),
        "fdcId": fdc_id,
        "ndbNumber": food.get("ndbNumber"),
        "publicationDate": food.get("publicationDate"),
        "usdaCategory": (food.get("foodCategory") or {}).get("description") if isinstance(food.get("foodCategory"), dict) else food.get("foodCategory"),
        "nutritionAvailable": True,
        "confidence": "HIGH",
        "nutrition": nutrients_of(food),
        "portions": portions,
        "serving": {
            "defaultAmount": default["grams"] if default else 100,
            "unit": "g",
            "basis": "per_100g",
            "commonLabelEn": default["labelEn"] if default else "100 g",
        },
        "source": {
            "organization": "U.S. Department of Agriculture, Agricultural Research Service",
            "database": "USDA FoodData Central, SR Legacy",
            "reference": "FDC ID %s" % fdc_id,
            "year": 2018,
            "country": "United States",
            "dataBasis": "per 100 g",
            "verifiedDate": "2026-08-16",
            "url": "https://fdc.nal.usda.gov/food-details/%s/nutrients" % fdc_id,
        },
    })

null_nutrition = {k: None for k in NUTRIENT_IDS.values()}
for fid, name_en, category, subcategory, state, terms in UNAVAILABLE:
    records.append({
        "id": fid,
        "nameEn": name_en,
        "nameTe": TE[fid],
        "category": category,
        "subcategory": subcategory,
        "state": state,
        "searchTerms": terms,
        "usdaDescription": None,
        "scientificName": None,
        "fdcId": None,
        "ndbNumber": None,
        "publicationDate": None,
        "usdaCategory": None,
        "nutritionAvailable": False,
        "confidence": "UNVERIFIED",
        "nutrition": null_nutrition,
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
            "importStatus": "Authoritative Indian values are not bundled in this seed. Values are not invented.",
        },
    })

OUT.parent.mkdir(parents=True, exist_ok=True)
payload = {
    "foodDatabaseVersion": "2026.1",
    "importedAt": "2026-08-16",
    "dataset": "USDA FoodData Central SR Legacy (April 2018 release file published on the FDC download page)",
    "datasetFile": "FoodData_Central_sr_legacy_food_json_2018-04.json",
    "note": "Nutrition values are copied from USDA SR Legacy. Unavailable Indian catalog items have null nutrients.",
    "foods": records,
}
OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
print("Wrote", OUT, "total", len(records), "available", sum(1 for r in records if r["nutritionAvailable"]))
print("sample te", records[0]["nameTe"], records[-1]["nameTe"])
