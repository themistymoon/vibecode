import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const initializeRaces = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if races already exist
    const existingRaces = await ctx.db.query("races").collect();
    if (existingRaces.length > 0) return;

    const races = [
      {
        name: "Human",
        traits: ["Adaptable", "Diplomatic", "Ambitious"],
        buffs: ["Balanced Growth", "Trade Bonus"],
        debuffs: ["No Specialization"],
        description: "Versatile and ambitious, humans excel at diplomacy and adaptation.",
        statModifiers: { health: 0, strength: 0, intelligence: 0, charisma: 1, luck: 0 }
      },
      {
        name: "Demon",
        traits: ["Intimidating", "Dark Magic", "Ruthless"],
        buffs: ["Fear Aura", "Magic Resistance"],
        debuffs: ["Distrusted by Most"],
        description: "Powerful beings of darkness with natural magical abilities and fearsome presence.",
        statModifiers: { health: 5, strength: 2, intelligence: 1, charisma: -1, luck: -1 }
      },
      {
        name: "Elf",
        traits: ["Wise", "Magical", "Long-lived"],
        buffs: ["Nature Affinity", "Enhanced Magic"],
        debuffs: ["Physically Frail"],
        description: "Ancient and wise, elves possess deep magical knowledge and connection to nature.",
        statModifiers: { health: -2, strength: -1, intelligence: 3, charisma: 1, luck: 1 }
      },
      {
        name: "Orc",
        traits: ["Strong", "Warrior Culture", "Tribal"],
        buffs: ["Combat Prowess", "Intimidation"],
        debuffs: ["Poor Diplomacy"],
        description: "Fierce warriors with incredible strength and a proud tribal heritage.",
        statModifiers: { health: 3, strength: 3, intelligence: -2, charisma: -2, luck: 0 }
      },
      {
        name: "Dwarf",
        traits: ["Sturdy", "Craftsman", "Stubborn"],
        buffs: ["Crafting Mastery", "Poison Resistance"],
        debuffs: ["Slow Movement"],
        description: "Master craftsmen and miners, dwarves are known for their resilience and skill.",
        statModifiers: { health: 2, strength: 1, intelligence: 1, charisma: -1, luck: 2 }
      },
      {
        name: "Dragonkin",
        traits: ["Draconic Heritage", "Fire Breath", "Proud"],
        buffs: ["Dragon Scales", "Fire Immunity"],
        debuffs: ["Arrogant"],
        description: "Descendants of dragons with scales, breath weapons, and immense pride.",
        statModifiers: { health: 4, strength: 2, intelligence: 2, charisma: 0, luck: -2 }
      },
      {
        name: "Beastfolk",
        traits: ["Animal Instincts", "Pack Mentality", "Wild"],
        buffs: ["Enhanced Senses", "Natural Weapons"],
        debuffs: ["Civilized Penalty"],
        description: "Half-human, half-animal beings with keen instincts and natural abilities.",
        statModifiers: { health: 1, strength: 2, intelligence: -1, charisma: -1, luck: 3 }
      },
      {
        name: "Undead",
        traits: ["Deathless", "Necromantic", "Feared"],
        buffs: ["No Fatigue", "Death Magic"],
        debuffs: ["Universally Feared"],
        description: "Beings who have transcended death, wielding dark powers but shunned by the living.",
        statModifiers: { health: 5, strength: 1, intelligence: 2, charisma: -4, luck: -2 }
      }
    ];

    for (const race of races) {
      await ctx.db.insert("races", race);
    }
  },
});

export const getAllRaces = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("races").collect();
  },
});

export const getRandomRace = query({
  args: {},
  handler: async (ctx) => {
    const races = await ctx.db.query("races").collect();
    if (races.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * races.length);
    return races[randomIndex];
  },
});
