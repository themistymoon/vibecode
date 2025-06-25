import { query, mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

export const applyChoiceEffects = mutation({
  args: {
    gameId: v.id("games"),
    effects: v.array(v.object({
      type: v.string(),
      name: v.string(),
      change: v.union(v.number(), v.string()),
      positive: v.boolean(),
    })),
    diceResult: v.optional(v.object({
      roll: v.number(),
      total: v.number(),
      success: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    let updatedStats = { ...game.gameState.stats };
    let updatedCurrency = game.gameState.currency;
    let updatedInventory = [...game.gameState.inventory];

    // Apply effects
    for (const effect of args.effects) {
      if (effect.type === 'stat' && typeof effect.change === 'number') {
        switch (effect.name.toLowerCase()) {
          case 'health':
            updatedStats.health = Math.max(0, Math.min(updatedStats.maxHealth, updatedStats.health + effect.change));
            break;
          case 'strength':
            updatedStats.strength = Math.max(1, updatedStats.strength + effect.change);
            break;
          case 'intelligence':
            updatedStats.intelligence = Math.max(1, updatedStats.intelligence + effect.change);
            break;
          case 'charisma':
            updatedStats.charisma = Math.max(1, updatedStats.charisma + effect.change);
            break;
          case 'luck':
            updatedStats.luck = Math.max(1, updatedStats.luck + effect.change);
            break;
        }
      } else if (effect.type === 'currency' && typeof effect.change === 'number') {
        updatedCurrency = Math.max(0, updatedCurrency + effect.change);
      } else if (effect.type === 'item' && typeof effect.change === 'string') {
        // Add item to inventory
        updatedInventory.push({
          name: effect.change,
          description: `Acquired through adventure`,
          type: 'equipment',
          statBonus: effect.positive ? { stat: 'strength', value: 1 } : undefined,
        });
      }
    }

    // Update game state
    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        stats: updatedStats,
        currency: updatedCurrency,
        inventory: updatedInventory,
      },
    });

    return { success: true };
  },
});

export const generateRandomEvent = action({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.runQuery(internal.game.getGameById, { gameId: args.gameId });
    if (!game) throw new Error("Game not found");

    const events = [
      {
        description: "A traveling merchant offers you a mysterious potion.",
        choices: [
          { text: "Buy the potion (20 gold)", cost: 20, effect: { type: 'stat', name: 'health', change: 10 } },
          { text: "Decline politely", effect: { type: 'stat', name: 'charisma', change: 1 } },
        ]
      },
      {
        description: "You find an ancient tome in the ruins.",
        choices: [
          { text: "Study the tome carefully", effect: { type: 'stat', name: 'intelligence', change: 2 } },
          { text: "Sell it to a collector", effect: { type: 'currency', name: 'gold', change: 30 } },
        ]
      },
      {
        description: "A group of bandits demands tribute.",
        choices: [
          { text: "Fight them", diceCheck: { type: 'strength', difficulty: 15 } },
          { text: "Pay them off (15 gold)", cost: 15 },
          { text: "Try to intimidate them", diceCheck: { type: 'charisma', difficulty: 12 } },
        ]
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    return randomEvent;
  },
});

export const createMerchant = mutation({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const items = [
      { name: "Iron Sword", price: 50, statBonus: { stat: 'strength', value: 2 }, description: "A sturdy iron blade" },
      { name: "Leather Armor", price: 40, statBonus: { stat: 'health', value: 15 }, description: "Basic protection" },
      { name: "Wisdom Scroll", price: 30, statBonus: { stat: 'intelligence', value: 2 }, description: "Ancient knowledge" },
      { name: "Lucky Charm", price: 25, statBonus: { stat: 'luck', value: 3 }, description: "A rabbit's foot" },
      { name: "Health Potion", price: 20, effect: { type: 'heal', value: 25 }, description: "Restores health" },
    ];

    // Store merchant inventory in game state temporarily
    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        merchantInventory: items,
        merchantAvailable: true,
      },
    });

    return items;
  },
});

export const purchaseItem = mutation({
  args: {
    gameId: v.id("games"),
    itemIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || !game.gameState.merchantInventory) throw new Error("No merchant available");

    const item = game.gameState.merchantInventory[args.itemIndex];
    if (!item) throw new Error("Item not found");

    if (game.gameState.currency < item.price) {
      throw new Error("Not enough gold");
    }

    // Deduct cost and add item
    let updatedStats = { ...game.gameState.stats };
    let updatedInventory = [...game.gameState.inventory];

    if (item.statBonus) {
      switch (item.statBonus.stat) {
        case 'strength':
          updatedStats.strength += item.statBonus.value;
          break;
        case 'intelligence':
          updatedStats.intelligence += item.statBonus.value;
          break;
        case 'charisma':
          updatedStats.charisma += item.statBonus.value;
          break;
        case 'luck':
          updatedStats.luck += item.statBonus.value;
          break;
        case 'health':
          updatedStats.maxHealth += item.statBonus.value;
          updatedStats.health += item.statBonus.value;
          break;
      }
    }

    if (item.effect && item.effect.type === 'heal') {
      updatedStats.health = Math.min(updatedStats.maxHealth, updatedStats.health + item.effect.value);
    }

    updatedInventory.push({
      name: item.name,
      description: item.description,
      type: 'equipment',
      statBonus: item.statBonus,
    });

    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        stats: updatedStats,
        currency: game.gameState.currency - item.price,
        inventory: updatedInventory,
      },
    });

    return { success: true, item };
  },
});
