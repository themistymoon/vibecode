import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  games: defineTable({
    sessionId: v.optional(v.string()), // Use session ID instead of user ID
    userId: v.optional(v.string()), // Legacy field for backward compatibility
    gameState: v.object({
      playerName: v.optional(v.string()),
      race: v.object({
        name: v.string(),
        traits: v.array(v.string()),
        buffs: v.array(v.string()),
        debuffs: v.array(v.string()),
        description: v.string(),
      }),
      story: v.object({
        currentScene: v.string(),
        history: v.array(v.string()),
        choices: v.array(v.object({
          text: v.string(),
          consequence: v.string(),
        })),
        chapter: v.number(),
        kingdomName: v.optional(v.string()),
        kingdomSize: v.string(), // "village", "town", "city", "kingdom", "empire"
      }),
      stats: v.object({
        health: v.number(),
        maxHealth: v.number(),
        strength: v.number(),
        intelligence: v.number(),
        charisma: v.number(),
        luck: v.number(),
      }),
      relationships: v.object({
        factions: v.record(v.string(), v.number()), // faction name -> relationship (-100 to 100)
      }),
      inventory: v.array(v.object({
        name: v.string(),
        description: v.string(),
        type: v.string(),
        equipped: v.optional(v.boolean()),
        statBonus: v.optional(v.object({
          stat: v.string(),
          value: v.number(),
        })),
        effect: v.optional(v.object({
          type: v.string(),
          value: v.number(),
        })),
      })),
      currency: v.number(),
      inCombat: v.boolean(),
      combatState: v.optional(v.object({
        enemies: v.array(v.object({
          name: v.string(),
          health: v.number(),
          maxHealth: v.number(),
          strength: v.number(),
        })),
        turnOrder: v.array(v.string()),
        currentTurn: v.number(),
      })),
      merchantInventory: v.optional(v.array(v.object({
        name: v.string(),
        price: v.number(),
        description: v.string(),
        statBonus: v.optional(v.object({
          stat: v.string(),
          value: v.number(),
        })),
        effect: v.optional(v.object({
          type: v.string(),
          value: v.number(),
        })),
      }))),
      merchantAvailable: v.optional(v.boolean()),
      cityData: v.optional(v.object({
        population: v.number(),
        happiness: v.number(),
        buildings: v.array(v.object({
          name: v.string(),
          level: v.number(),
          description: v.string(),
        })),
        jobs: v.object({
          farmers: v.number(),
          merchants: v.number(),
          guards: v.number(),
          crafters: v.number(),
          scholars: v.number(),
        }),
        resources: v.object({
          food: v.number(),
          materials: v.number(),
          knowledge: v.number(),
        }),
      })),
    }),
    isActive: v.boolean(),
  }).index("by_session", ["sessionId"]),
  
  races: defineTable({
    name: v.string(),
    traits: v.array(v.string()),
    buffs: v.array(v.string()),
    debuffs: v.array(v.string()),
    description: v.string(),
    statModifiers: v.object({
      health: v.number(),
      strength: v.number(),
      intelligence: v.number(),
      charisma: v.number(),
      luck: v.number(),
    }),
  }),
};

export default defineSchema({
  ...applicationTables,
});
