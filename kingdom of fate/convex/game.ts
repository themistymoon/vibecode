import { query, mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

// Generate a session ID for the browser
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('kingdoms-session-id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('kingdoms-session-id', sessionId);
    }
    return sessionId;
  }
  return generateSessionId();
}

const raceNames = {
  Human: ["Alex", "Morgan", "Jordan", "Casey", "Riley", "Avery", "Quinn", "Sage"],
  Demon: ["Vex", "Zara", "Kael", "Nyx", "Raven", "Dante", "Lilith", "Bane"],
  Elf: ["Aelindra", "Thalorin", "Silviana", "Erevan", "Lyralei", "Celeborn", "Galadriel", "Legolas"],
  Orc: ["Grosh", "Urga", "Thok", "Morg", "Grak", "Ushak", "Drog", "Brak"],
  Dwarf: ["Thorin", "Gimli", "Dain", "Balin", "Dwalin", "Nori", "Ori", "Gloin"],
  Dragonkin: ["Pyrion", "Scaleheart", "Emberclaw", "Drakmor", "Ignis", "Flamewing", "Ashborn", "Cinderfang"],
  Beastfolk: ["Fenris", "Luna", "Talon", "Whiskers", "Prowl", "Howl", "Fang", "Claw"],
  Undead: ["Mortis", "Shade", "Wraith", "Bone", "Ghoul", "Lich", "Specter", "Phantom"]
};

export const createNewGame = mutation({
  args: {
    raceId: v.id("races"),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionId = args.sessionId || generateSessionId();

    // Get the selected race
    const race = await ctx.db.get(args.raceId);
    if (!race) throw new Error("Race not found");

    // Generate random name based on race
    const raceNameList = raceNames[race.name as keyof typeof raceNames] || raceNames.Human;
    const playerName = raceNameList[Math.floor(Math.random() * raceNameList.length)];

    // Generate random kingdom name
    const kingdomPrefixes = ["New", "Old", "Great", "Little", "North", "South", "East", "West"];
    const kingdomSuffixes = ["haven", "burg", "ford", "shire", "ton", "dale", "moor", "field"];
    const kingdomName = `${kingdomPrefixes[Math.floor(Math.random() * kingdomPrefixes.length)]}${kingdomSuffixes[Math.floor(Math.random() * kingdomSuffixes.length)]}`;

    // Deactivate any existing games for this session
    const existingGames = await ctx.db
      .query("games")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();
    
    for (const game of existingGames) {
      await ctx.db.patch(game._id, { isActive: false });
    }

    // Create realistic starting stats
    const baseStats = {
      health: 20,
      maxHealth: 20,
      strength: 3,
      intelligence: 3,
      charisma: 3,
      luck: 3,
    };

    const stats = {
      health: baseStats.health + Math.max(0, race.statModifiers.health),
      maxHealth: baseStats.maxHealth + Math.max(0, race.statModifiers.health),
      strength: Math.max(1, baseStats.strength + race.statModifiers.strength),
      intelligence: Math.max(1, baseStats.intelligence + race.statModifiers.intelligence),
      charisma: Math.max(1, baseStats.charisma + race.statModifiers.charisma),
      luck: Math.max(1, baseStats.luck + race.statModifiers.luck),
    };

    // Generate random starting village stats based on race
    const baseCityData = {
      population: 80 + Math.floor(Math.random() * 40), // 80-120
      happiness: 60 + Math.floor(Math.random() * 30), // 60-90
      buildings: [
        { name: "Town Hall", level: 1, description: "Administrative center" },
        { name: "Market", level: 1, description: "Trade hub" },
      ],
      jobs: {
        farmers: 25 + Math.floor(Math.random() * 15),
        merchants: 10 + Math.floor(Math.random() * 10),
        guards: 5 + Math.floor(Math.random() * 10),
        crafters: 15 + Math.floor(Math.random() * 15),
        scholars: 2 + Math.floor(Math.random() * 8),
      },
      resources: {
        food: 100 + Math.floor(Math.random() * 100),
        materials: 50 + Math.floor(Math.random() * 80),
        knowledge: 10 + Math.floor(Math.random() * 40),
      }
    };

    // Adjust based on race
    if (race.name === "Elf") {
      baseCityData.resources.knowledge += 20;
      baseCityData.jobs.scholars += 5;
    } else if (race.name === "Dwarf") {
      baseCityData.resources.materials += 30;
      baseCityData.jobs.crafters += 10;
    } else if (race.name === "Orc") {
      baseCityData.jobs.guards += 8;
      baseCityData.population += 20;
    } else if (race.name === "Human") {
      baseCityData.jobs.merchants += 5;
      baseCityData.happiness += 10;
    }

    // Create new game
    const gameId = await ctx.db.insert("games", {
      sessionId,
      gameState: {
        playerName,
        race: {
          name: race.name,
          traits: race.traits,
          buffs: race.buffs,
          debuffs: race.debuffs,
          description: race.description,
        },
        story: {
          currentScene: "",
          history: [],
          choices: [],
          chapter: 1,
          kingdomName,
          kingdomSize: "village",
        },
        stats,
        relationships: {
          factions: {},
        },
        inventory: [
          {
            name: "Rusty Sword",
            description: "An old but serviceable blade",
            type: "weapon",
            equipped: false,
            statBonus: { stat: "strength", value: 1 }
          },
          {
            name: "Leather Armor",
            description: "Basic protection for adventurers",
            type: "armor", 
            equipped: false,
            statBonus: { stat: "health", value: 3 }
          },
          {
            name: "Health Potion",
            description: "Restores 10 health when consumed",
            type: "consumable",
            effect: { type: "heal", value: 10 }
          }
        ],
        currency: 50,
        inCombat: false,
        cityData: baseCityData,
      },
      isActive: true,
    });

    return gameId;
  },
});

export const getCurrentGame = query({
  args: {},
  handler: async (ctx) => {
    // This will be called from the client, so we need to get sessionId differently
    // For now, we'll return the most recent active game
    const games = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(1);

    return games[0] || null;
  },
});

export const getGameBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    return game;
  },
});

export const getGameById = internalQuery({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

export const updateGameStory = internalMutation({
  args: {
    gameId: v.id("games"),
    scene: v.string(),
    choices: v.array(v.object({
      text: v.string(),
      consequence: v.string(),
    })),
    playerChoice: v.optional(v.string()),
    currentHistory: v.array(v.string()),
    choiceSuccess: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        story: {
          ...game.gameState.story,
          currentScene: args.scene,
          choices: args.choices,
          history: args.playerChoice 
            ? [...args.currentHistory, `Choice: ${args.playerChoice} (${args.choiceSuccess ? 'Success' : 'Failure'})`, args.scene]
            : [args.scene],
        },
      },
    });
  },
});

export const generateStoryScene = action({
  args: {
    gameId: v.id("games"),
    playerChoice: v.optional(v.string()),
    choiceSuccess: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{ scene: string; choices: Array<{ text: string; consequence: string }> }> => {
    const game = await ctx.runQuery(internal.game.getGameById, { gameId: args.gameId });
    if (!game) throw new Error("Game not found");

    const { playerName, race, story, stats, relationships } = game.gameState;

    // Build context for AI
    const successContext = args.choiceSuccess !== undefined 
      ? `LAST CHOICE OUTCOME: ${args.choiceSuccess ? 'SUCCESS' : 'FAILURE'} - This should significantly impact the story direction.`
      : '';

    const prompt: string = `You are the narrator of "Kingdoms of Fate," an epic text adventure RPG with D&D-style mechanics.

PLAYER CONTEXT:
- Name: ${playerName}
- Race: ${race.name} (${race.description})
- Traits: ${race.traits.join(", ")}
- Buffs: ${race.buffs.join(", ")}
- Debuffs: ${race.debuffs.join(", ")}
- Kingdom: ${story.kingdomName} (${story.kingdomSize})
- Chapter: ${story.chapter}
- Stats: Health ${stats.health}/${stats.maxHealth}, Strength ${stats.strength}, Intelligence ${stats.intelligence}, Charisma ${stats.charisma}, Luck ${stats.luck}

STORY HISTORY:
${story.history.slice(-3).join("\n")}

${args.playerChoice ? `PLAYER'S LAST CHOICE: ${args.playerChoice}` : "STARTING NEW GAME"}
${successContext}

Generate a compelling story scene (2-3 paragraphs) that:
1. Uses the player's name "${playerName}" throughout the narrative
2. Reflects the player's race traits and current kingdom development
3. ${args.playerChoice ? `Continues from their choice with ${args.choiceSuccess ? 'positive consequences for success' : 'negative consequences for failure'}` : "Begins their journey in their village"}
4. ${args.choiceSuccess === false ? 'Shows clear negative consequences and setbacks from the failed choice' : ''}
5. Presents meaningful challenges appropriate to their current power level
6. Includes opportunities for kingdom growth and faction interactions
7. Incorporates chances for dice-based skill checks

Then provide exactly 3 meaningful choices that could:
- Require different skill checks (Strength, Intelligence, Charisma, or Luck)
- Lead to combat, diplomacy, exploration, or trade
- Have clear consequences for kingdom development
- Reflect the player's racial abilities and traits

Format your response as:
SCENE: [Your story scene here - must include player name "${playerName}"]

CHOICE1: [First choice - should involve skill/dice rolls]
CHOICE2: [Second choice - different approach]  
CHOICE3: [Third choice - alternative solution]`;

    const response: Response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      }),
    });

    const data: any = await response.json();
    
    // Check for API errors
    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      throw new Error(`OpenAI API failed: ${data.error?.message || 'Unknown error'}`);
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid OpenAI response:", data);
      throw new Error("Invalid response from OpenAI API");
    }
    
    const content: string = data.choices[0].message.content;

    // Parse the response
    const sceneMatch: RegExpMatchArray | null = content.match(/SCENE: (.*?)(?=CHOICE1:)/s);
    const choice1Match: RegExpMatchArray | null = content.match(/CHOICE1: (.*?)(?=CHOICE2:)/s);
    const choice2Match: RegExpMatchArray | null = content.match(/CHOICE2: (.*?)(?=CHOICE3:)/s);
    const choice3Match: RegExpMatchArray | null = content.match(/CHOICE3: (.*?)$/s);

    // Parse the response with fallbacks
    let scene: string;
    let choices: Array<{ text: string; consequence: string }>;
    
    if (sceneMatch && choice1Match && choice2Match && choice3Match) {
      // Successfully parsed AI response
      scene = sceneMatch[1].trim();
      choices = [
        { text: choice1Match[1].trim(), consequence: "" },
        { text: choice2Match[1].trim(), consequence: "" },
        { text: choice3Match[1].trim(), consequence: "" },
      ];
    } else {
      // Fallback to generated content based on game state
      console.warn("Failed to parse AI response, using fallback content");
      // Simple fallback content
      scene = `${playerName} continues their journey in ${story.kingdomName}. ${args.choiceSuccess === false ? 'The previous attempt didn\'t go as planned, but there are new opportunities ahead.' : 'New adventures await in this growing realm.'} The ${story.kingdomSize} needs strong leadership to prosper.`;
      choices = [
        { text: "Explore the surrounding area for opportunities", consequence: "" },
        { text: "Focus on strengthening your settlement's defenses", consequence: "" },
        { text: "Seek out allies and trade partners", consequence: "" }
      ];
    }

    // Update game state
    await ctx.runMutation(internal.game.updateGameStory, {
      gameId: args.gameId,
      scene,
      choices,
      playerChoice: args.playerChoice,
      currentHistory: story.history,
      choiceSuccess: args.choiceSuccess,
    });

    return { scene, choices };
  },
});

export const makeChoice = mutation({
  args: {
    gameId: v.id("games"),
    choiceIndex: v.number(),
    diceResult: v.optional(v.object({
      roll: v.number(),
      total: v.number(),
      success: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const choice = game.gameState.story.choices[args.choiceIndex];
    if (!choice) throw new Error("Invalid choice");

    // Apply dice result effects if provided
    if (args.diceResult) {
      await ctx.scheduler.runAfter(0, api.enhancedGame.applyChoiceEffects, {
        gameId: args.gameId,
        effects: [], // Effects will be generated in the frontend
        diceResult: args.diceResult,
      });
    }

    // Schedule story generation with success/failure context
    await ctx.scheduler.runAfter(0, api.game.generateStoryScene, {
      gameId: args.gameId,
      playerChoice: choice.text,
      choiceSuccess: args.diceResult?.success,
    });

    return choice.text;
  },
});

export const equipItem = mutation({
  args: {
    gameId: v.id("games"),
    itemIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const item = game.gameState.inventory[args.itemIndex];
    if (!item) throw new Error("Item not found");

    if (item.type === "consumable") {
      throw new Error("Cannot equip consumable items");
    }

    // Unequip other items of the same type
    const updatedInventory = game.gameState.inventory.map((invItem, index) => {
      if (invItem.type === item.type && index !== args.itemIndex) {
        return { ...invItem, equipped: false };
      }
      if (index === args.itemIndex) {
        return { ...invItem, equipped: !invItem.equipped };
      }
      return invItem;
    });

    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        inventory: updatedInventory,
      },
    });

    return { success: true, equipped: !item.equipped };
  },
});

export const useItem = mutation({
  args: {
    gameId: v.id("games"),
    itemIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const item = game.gameState.inventory[args.itemIndex];
    if (!item) throw new Error("Item not found");

    if (item.type !== "consumable") {
      throw new Error("Item is not consumable");
    }

    if (!item.effect) {
      throw new Error("Item has no effect");
    }

    let updatedStats = { ...game.gameState.stats };
    let message = "";

    // Apply item effect
    if (item.effect.type === "heal") {
      const healAmount = Math.min(item.effect.value, updatedStats.maxHealth - updatedStats.health);
      updatedStats.health += healAmount;
      message = `Restored ${healAmount} health`;
    } else if (item.effect.type === "stat_boost") {
      // Temporary stat boost logic could go here
      message = `Used ${item.name}`;
    }

    // Remove item from inventory
    const updatedInventory = game.gameState.inventory.filter((_, index) => index !== args.itemIndex);

    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        stats: updatedStats,
        inventory: updatedInventory,
      },
    });

    return { success: true, message };
  },
});

export const saveGameData = query({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(1);

    const game = games[0];
    if (!game) return null;

    return {
      gameState: game.gameState,
      timestamp: Date.now(),
      version: "1.0",
    };
  },
});

export const loadGameData = mutation({
  args: {
    gameData: v.object({
      gameState: v.any(),
      timestamp: v.number(),
      version: v.string(),
    }),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionId = args.sessionId || generateSessionId();

    // Deactivate existing games
    const existingGames = await ctx.db
      .query("games")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();
    
    for (const game of existingGames) {
      await ctx.db.patch(game._id, { isActive: false });
    }

    // Create new game with loaded data
    const gameId = await ctx.db.insert("games", {
      sessionId,
      gameState: args.gameData.gameState,
      isActive: true,
    });

    return gameId;
  },
});

export const deactivateCurrentGame = mutation({
  args: {},
  handler: async (ctx) => {
    // Deactivate all active games
    const activeGames = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    for (const game of activeGames) {
      await ctx.db.patch(game._id, { isActive: false });
    }

    return { success: true };
  },
});
