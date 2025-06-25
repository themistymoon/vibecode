import { mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const initiateCombat = action({
  args: {
    gameId: v.id("games"),
    enemyType: v.string(),
  },
  handler: async (ctx, args): Promise<Array<{ name: string; health: number; maxHealth: number; strength: number }>> => {
    const game = await ctx.runQuery(internal.game.getGameById, { gameId: args.gameId });
    if (!game) throw new Error("Game not found");

    // Generate enemies based on type and player level
    const prompt: string = `Generate 1-3 enemies for combat in "Kingdoms of Fate" RPG.

CONTEXT:
- Player Race: ${game.gameState.race.name}
- Player Stats: Health ${game.gameState.stats.health}, Strength ${game.gameState.stats.strength}
- Kingdom Size: ${game.gameState.story.kingdomSize}
- Enemy Type: ${args.enemyType}

Create enemies appropriate for the player's current power level. Each enemy should have:
- Name
- Health (20-150 based on player level)
- Strength (10-80 based on player level)

Format as JSON:
{
  "enemies": [
    {"name": "Enemy Name", "health": 50, "strength": 30},
    ...
  ]
}`;

    const response: Response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    const data: any = await response.json();
    let enemies: Array<{ name: string; health: number; maxHealth: number; strength: number }>;
    
    try {
      // Check for API errors
      if (!response.ok || !data.choices || !data.choices[0]) {
        throw new Error("Invalid API response");
      }
      const content: string = data.choices[0].message.content;
      const jsonMatch: RegExpMatchArray | null = content.match(/\{[\s\S]*\}/);
      const enemyData: any = JSON.parse(jsonMatch![0]);
      enemies = enemyData.enemies.map((enemy: any) => ({
        ...enemy,
        maxHealth: enemy.health,
      }));
    } catch (error) {
      // Fallback enemies
      enemies = [
        { name: "Bandit", health: 40, maxHealth: 40, strength: 25 },
      ];
    }

    // Update game state for combat
    await ctx.runMutation(internal.combat.updateCombatState, {
      gameId: args.gameId,
      enemies,
    });

    return enemies;
  },
});



export const updateCombatState = internalMutation({
  args: {
    gameId: v.id("games"),
    enemies: v.array(v.object({
      name: v.string(),
      health: v.number(),
      maxHealth: v.number(),
      strength: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        inCombat: true,
        combatState: {
          enemies: args.enemies,
          turnOrder: ["player", ...args.enemies.map((_, i: number) => `enemy_${i}`)],
          currentTurn: 0,
        },
      },
    });
  },
});

export const performCombatAction = mutation({
  args: {
    gameId: v.id("games"),
    action: v.string(), // "attack", "defend", "special"
    targetIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || !game.gameState.inCombat || !game.gameState.combatState) {
      throw new Error("Not in combat");
    }

    const { stats, combatState } = game.gameState;
    let { enemies } = combatState;
    let combatLog = [];

    // Player action
    if (args.action === "attack" && args.targetIndex !== undefined) {
      const target = enemies[args.targetIndex];
      if (target && target.health > 0) {
        const damage = Math.max(1, stats.strength + Math.floor(Math.random() * 20) - 10);
        target.health = Math.max(0, target.health - damage);
        combatLog.push(`You attack ${target.name} for ${damage} damage!`);
        
        if (target.health === 0) {
          combatLog.push(`${target.name} is defeated!`);
        }
      }
    }

    // Enemy actions
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.health > 0) {
        const damage = Math.max(1, enemy.strength + Math.floor(Math.random() * 15) - 7);
        const newHealth = Math.max(0, stats.health - damage);
        combatLog.push(`${enemy.name} attacks you for ${damage} damage!`);
        
        // Update player health
        await ctx.db.patch(args.gameId, {
          gameState: {
            ...game.gameState,
            stats: {
              ...stats,
              health: newHealth,
            },
          },
        });
      }
    }

    // Check combat end conditions
    const allEnemiesDefeated = enemies.every(enemy => enemy.health <= 0);
    const playerDefeated = stats.health <= 0;

    if (allEnemiesDefeated || playerDefeated) {
      // End combat
      await ctx.db.patch(args.gameId, {
        gameState: {
          ...game.gameState,
          inCombat: false,
          combatState: undefined,
        },
      });

      if (allEnemiesDefeated) {
        combatLog.push("Victory! You have defeated all enemies.");
        // Award currency and potentially items
        const reward = Math.floor(Math.random() * 50) + 25;
        await ctx.db.patch(args.gameId, {
          gameState: {
            ...game.gameState,
            currency: game.gameState.currency + reward,
          },
        });
        combatLog.push(`You earned ${reward} gold!`);
      } else {
        combatLog.push("Defeat! You have been overcome...");
      }
    } else {
      // Update combat state
      await ctx.db.patch(args.gameId, {
        gameState: {
          ...game.gameState,
          combatState: {
            ...combatState,
            enemies,
          },
        },
      });
    }

    return {
      combatLog,
      combatEnded: allEnemiesDefeated || playerDefeated,
      victory: allEnemiesDefeated,
    };
  },
});
