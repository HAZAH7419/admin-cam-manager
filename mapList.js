// Maps shorthand aliases (user input) to full CRCON map IDs.
// Input is normalized to lowercase before lookup.
export const MAP_ALIASES = {
  // Foy
  "foy":                      "foy_warfare",
  "foy night":                "foy_warfare_night",

  // Carentan
  "carentan":                 "carentan_warfare",
  "carentan night":           "carentan_warfare_night",

  // Driel
  "driel":                    "driel_warfare",
  "driel night":              "driel_warfare_night",

  // El Alamein
  "elalamein":                "elalamein_warfare",
  "el alamein":               "elalamein_warfare",
  "elalamein night":          "elalamein_warfare_night",
  "el alamein night":         "elalamein_warfare_night",

  // Elsenborn Ridge
  "elsenborn":                "elsenbornridge_warfare_day",
  "elsenborn day":            "elsenbornridge_warfare_day",
  "elsenborn morning":        "elsenbornridge_warfare_morning",
  "elsenborn night":          "elsenbornridge_warfare_night",

  // Hill 400
  "hill400":                  "hill400_warfare",
  "hill":                     "hill400_warfare",

  // Hurtgen Forest
  "hurtgen":                  "hurtgenforest_warfare_V2",
  "hurtgen night":            "hurtgenforest_warfare_V2_night",

  // Kharkov
  "kharkov":                  "kharkov_warfare",
  "kharkov night":            "kharkov_warfare_night",

  // Kursk
  "kursk":                    "kursk_warfare",
  "kursk night":              "kursk_warfare_night",

  // Mortain
  "mortain":                  "mortain_warfare_day",
  "mortain day":              "mortain_warfare_day",
  "mortain overcast":         "mortain_warfare_overcast",
  "mortain dusk":             "mortain_warfare_dusk",

  // Omaha Beach
  "omaha":                    "omahabeach_warfare",
  "omaha night":              "omahabeach_warfare_night",

  // PHL (Philippines)
  "phl":                      "PHL_L_1944_Warfare",
  "phl night":                "PHL_L_1944_Warfare_Night",

  // Remagen
  "remagen":                  "REM_L_1945_Warfare",
  "rem":                      "REM_L_1945_Warfare",
  "remagen night":            "REM_L_1945_WarfareNight",
  "rem night":                "REM_L_1945_WarfareNight",

  // Smolensk
  "smolensk":                 "smolensk_warfare_day",
  "smolensk day":             "smolensk_warfare_day",
  "smolensk dusk":            "smolensk_warfare_dusk",
  "smolensk night":           "smolensk_warfare_night",

  // Stalingrad
  "stalingrad":               "STA_L_1942_Warfare",
  "sta":                      "STA_L_1942_Warfare",
  "stalingrad night":         "STA_L_1942_Warfare_Night",
  "sta night":                "STA_L_1942_Warfare_Night",

  // St. Marie du Mont
  "stmariedumont":            "stmariedumont_warfare",
  "marie":                    "stmariedumont_warfare",
  "stmariedumont night":      "stmariedumont_warfare_night",
  "marie night":              "stmariedumont_warfare_night",

  // St. Mère-Église
  "stmereeglise":             "stmereeglise_warfare",
  "sme":                      "stmereeglise_warfare",
  "stmereeglise night":       "stmereeglise_warfare_night",
  "sme night":                "stmereeglise_warfare_night",

  // Tobruk
  "tobruk":                   "tobruk_warfare_day",
  "tobruk day":               "tobruk_warfare_day",
  "tobruk morning":           "tobruk_warfare_morning",
  "tobruk dusk":              "tobruk_warfare_dusk",

  // Utah Beach
  "utah":                     "utahbeach_warfare",
  "utah night":               "utahbeach_warfare_night",
};

/**
 * Resolves a user's shorthand input (e.g. "foy night") to a full CRCON map ID.
 * Returns null if no match is found.
 * @param {string} input
 * @returns {string|null}
 */
export function resolveMapName(input) {
  return MAP_ALIASES[input.trim().toLowerCase()] ?? null;
}

