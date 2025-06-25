import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upgradeCity = mutation({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const { story, currency } = game.gameState;
    
    const getCitySizeInfo = (size: string) => {
      switch (size) {
        case 'village':
          return { upgradeCost: 500, nextSize: 'town', newMaxPop: 1000 };
        case 'town':
          return { upgradeCost: 2000, nextSize: 'city', newMaxPop: 5000 };
        case 'city':
          return { upgradeCost: 10000, nextSize: 'kingdom', newMaxPop: 25000 };
        case 'kingdom':
          return { upgradeCost: 50000, nextSize: 'empire', newMaxPop: 100000 };
        default:
          throw new Error("Cannot upgrade further");
      }
    };

    const sizeInfo = getCitySizeInfo(story.kingdomSize);
    
    if (currency < sizeInfo.upgradeCost) {
      throw new Error("Not enough gold to upgrade");
    }

    // Initialize city data if it doesn't exist
    const currentCityData = game.gameState.cityData || {
      population: 100,
      happiness: 75,
      buildings: [
        { name: "Town Hall", level: 1, description: "Administrative center" },
        { name: "Market", level: 1, description: "Trade hub" },
      ],
      jobs: {
        farmers: 30,
        merchants: 15,
        guards: 10,
        crafters: 20,
        scholars: 5,
      },
      resources: {
        food: 150,
        materials: 80,
        knowledge: 25,
      }
    };

    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        currency: currency - sizeInfo.upgradeCost,
        story: {
          ...story,
          kingdomSize: sizeInfo.nextSize,
        },
        cityData: {
          ...currentCityData,
          population: Math.min(currentCityData.population * 1.5, sizeInfo.newMaxPop),
          happiness: Math.min(currentCityData.happiness + 10, 100),
        },
      },
    });

    return { success: true, newSize: sizeInfo.nextSize };
  },
});

export const constructBuilding = mutation({
  args: {
    gameId: v.id("games"),
    buildingType: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const buildingCosts: Record<string, number> = {
      "Barracks": 200,
      "Library": 300,
      "Workshop": 250,
      "Temple": 400,
    };

    const cost = buildingCosts[args.buildingType];
    if (!cost) throw new Error("Unknown building type");

    if (game.gameState.currency < cost) {
      throw new Error("Not enough gold to construct building");
    }

    // Initialize city data if it doesn't exist
    const currentCityData = game.gameState.cityData || {
      population: 100,
      happiness: 75,
      buildings: [
        { name: "Town Hall", level: 1, description: "Administrative center" },
        { name: "Market", level: 1, description: "Trade hub" },
      ],
      jobs: {
        farmers: 30,
        merchants: 15,
        guards: 10,
        crafters: 20,
        scholars: 5,
      },
      resources: {
        food: 150,
        materials: 80,
        knowledge: 25,
      }
    };

    // Check if building already exists
    const existingBuilding = currentCityData.buildings.find(b => b.name === args.buildingType);
    
    let updatedBuildings;
    if (existingBuilding) {
      // Upgrade existing building
      updatedBuildings = currentCityData.buildings.map(b => 
        b.name === args.buildingType 
          ? { ...b, level: b.level + 1 }
          : b
      );
    } else {
      // Add new building
      const buildingDescriptions: Record<string, string> = {
        "Barracks": "Train guards and soldiers",
        "Library": "Increase knowledge production",
        "Workshop": "Craft better equipment",
        "Temple": "Increase happiness and faith",
      };

      updatedBuildings = [
        ...currentCityData.buildings,
        {
          name: args.buildingType,
          level: 1,
          description: buildingDescriptions[args.buildingType] || "A new building",
        }
      ];
    }

    await ctx.db.patch(args.gameId, {
      gameState: {
        ...game.gameState,
        currency: game.gameState.currency - cost,
        cityData: {
          ...currentCityData,
          buildings: updatedBuildings,
          happiness: Math.min(currentCityData.happiness + 5, 100),
        },
      },
    });

    return { success: true, building: args.buildingType };
  },
});

export const getCityData = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return null;

    return game.gameState.cityData || {
      population: 100,
      happiness: 75,
      buildings: [
        { name: "Town Hall", level: 1, description: "Administrative center" },
        { name: "Market", level: 1, description: "Trade hub" },
      ],
      jobs: {
        farmers: 30,
        merchants: 15,
        guards: 10,
        crafters: 20,
        scholars: 5,
      },
      resources: {
        food: 150,
        materials: 80,
        knowledge: 25,
      }
    };
  },
});
