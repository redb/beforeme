import { onRequestDelete as __api_admin_events_js_onRequestDelete } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/events.js"
import { onRequestGet as __api_admin_events_js_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/events.js"
import { onRequestOptions as __api_admin_events_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/events.js"
import { onRequestOptions as __api_admin_purge_cache_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/purge-cache.js"
import { onRequestPost as __api_admin_purge_cache_js_onRequestPost } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/purge-cache.js"
import { onRequestDelete as __api_admin_session_js_onRequestDelete } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/session.js"
import { onRequestGet as __api_admin_session_js_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/session.js"
import { onRequestOptions as __api_admin_session_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/session.js"
import { onRequestPost as __api_admin_session_js_onRequestPost } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/admin/session.js"
import { onRequestOptions as __api_anecdotes_strict_editor_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/anecdotes/strict-editor.js"
import { onRequestPost as __api_anecdotes_strict_editor_js_onRequestPost } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/anecdotes/strict-editor.js"
import { onRequestGet as __api_ad_config_js_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/ad-config.js"
import { onRequestOptions as __api_ad_config_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/ad-config.js"
import { onRequestPut as __api_ad_config_js_onRequestPut } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/ad-config.js"
import { onRequestGet as __api_anecdote_js_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/anecdote.js"
import { onRequestOptions as __api_anecdote_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/anecdote.js"
import { onRequestGet as __api_anecdotes_js_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/anecdotes.js"
import { onRequestOptions as __api_anecdotes_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/anecdotes.js"
import { onRequestPost as __api_anecdotes_js_onRequestPost } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/anecdotes.js"
import { onRequestGet as __api_batch_ts_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/batch.ts"
import { onRequestOptions as __api_batch_ts_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/batch.ts"
import { onRequestGet as __api_debug_env_js_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/debug-env.js"
import { onRequestOptions as __api_debug_env_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/debug-env.js"
import { onRequestOptions as __api_enrich_wikileads_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/enrich-wikileads.js"
import { onRequestPost as __api_enrich_wikileads_js_onRequestPost } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/enrich-wikileads.js"
import { onRequestGet as __api_history_js_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/history.js"
import { onRequestOptions as __api_history_js_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/history.js"
import { onRequestGet as __api_scene_ts_onRequestGet } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/scene.ts"
import { onRequestOptions as __api_scene_ts_onRequestOptions } from "/Users/jean-brunoricard/dev/BeforeMe/functions/api/scene.ts"

export const routes = [
    {
      routePath: "/api/admin/events",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_events_js_onRequestDelete],
    },
  {
      routePath: "/api/admin/events",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_events_js_onRequestGet],
    },
  {
      routePath: "/api/admin/events",
      mountPath: "/api/admin",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_admin_events_js_onRequestOptions],
    },
  {
      routePath: "/api/admin/purge-cache",
      mountPath: "/api/admin",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_admin_purge_cache_js_onRequestOptions],
    },
  {
      routePath: "/api/admin/purge-cache",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_purge_cache_js_onRequestPost],
    },
  {
      routePath: "/api/admin/session",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_session_js_onRequestDelete],
    },
  {
      routePath: "/api/admin/session",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_session_js_onRequestGet],
    },
  {
      routePath: "/api/admin/session",
      mountPath: "/api/admin",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_admin_session_js_onRequestOptions],
    },
  {
      routePath: "/api/admin/session",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_session_js_onRequestPost],
    },
  {
      routePath: "/api/anecdotes/strict-editor",
      mountPath: "/api/anecdotes",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_anecdotes_strict_editor_js_onRequestOptions],
    },
  {
      routePath: "/api/anecdotes/strict-editor",
      mountPath: "/api/anecdotes",
      method: "POST",
      middlewares: [],
      modules: [__api_anecdotes_strict_editor_js_onRequestPost],
    },
  {
      routePath: "/api/ad-config",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_ad_config_js_onRequestGet],
    },
  {
      routePath: "/api/ad-config",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_ad_config_js_onRequestOptions],
    },
  {
      routePath: "/api/ad-config",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_ad_config_js_onRequestPut],
    },
  {
      routePath: "/api/anecdote",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_anecdote_js_onRequestGet],
    },
  {
      routePath: "/api/anecdote",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_anecdote_js_onRequestOptions],
    },
  {
      routePath: "/api/anecdotes",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_anecdotes_js_onRequestGet],
    },
  {
      routePath: "/api/anecdotes",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_anecdotes_js_onRequestOptions],
    },
  {
      routePath: "/api/anecdotes",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_anecdotes_js_onRequestPost],
    },
  {
      routePath: "/api/batch",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_batch_ts_onRequestGet],
    },
  {
      routePath: "/api/batch",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_batch_ts_onRequestOptions],
    },
  {
      routePath: "/api/debug-env",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_debug_env_js_onRequestGet],
    },
  {
      routePath: "/api/debug-env",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_debug_env_js_onRequestOptions],
    },
  {
      routePath: "/api/enrich-wikileads",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_enrich_wikileads_js_onRequestOptions],
    },
  {
      routePath: "/api/enrich-wikileads",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_enrich_wikileads_js_onRequestPost],
    },
  {
      routePath: "/api/history",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_history_js_onRequestGet],
    },
  {
      routePath: "/api/history",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_history_js_onRequestOptions],
    },
  {
      routePath: "/api/scene",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_scene_ts_onRequestGet],
    },
  {
      routePath: "/api/scene",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_scene_ts_onRequestOptions],
    },
  ]