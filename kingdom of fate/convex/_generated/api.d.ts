/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as cityManagement from "../cityManagement.js";
import type * as combat from "../combat.js";
import type * as enhancedGame from "../enhancedGame.js";
import type * as game from "../game.js";
import type * as http from "../http.js";
import type * as races from "../races.js";
import type * as router from "../router.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cityManagement: typeof cityManagement;
  combat: typeof combat;
  enhancedGame: typeof enhancedGame;
  game: typeof game;
  http: typeof http;
  races: typeof races;
  router: typeof router;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
