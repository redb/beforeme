var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x2, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// ../node_modules/@prisma/client/runtime/edge.js
var require_edge = __commonJS({
  "../node_modules/@prisma/client/runtime/edge.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ba = Object.create;
    var lr = Object.defineProperty;
    var xa = Object.getOwnPropertyDescriptor;
    var Pa = Object.getOwnPropertyNames;
    var va = Object.getPrototypeOf;
    var Ta = Object.prototype.hasOwnProperty;
    var fe = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "fe");
    var Je = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "Je");
    var vt = /* @__PURE__ */ __name((e, t) => {
      for (var r in t) lr(e, r, { get: t[r], enumerable: true });
    }, "vt");
    var ci = /* @__PURE__ */ __name((e, t, r, n) => {
      if (t && typeof t == "object" || typeof t == "function") for (let i of Pa(t)) !Ta.call(e, i) && i !== r && lr(e, i, { get: /* @__PURE__ */ __name(() => t[i], "get"), enumerable: !(n = xa(t, i)) || n.enumerable });
      return e;
    }, "ci");
    var Qe = /* @__PURE__ */ __name((e, t, r) => (r = e != null ? ba(va(e)) : {}, ci(t || !e || !e.__esModule ? lr(r, "default", { value: e, enumerable: true }) : r, e)), "Qe");
    var Aa = /* @__PURE__ */ __name((e) => ci(lr({}, "__esModule", { value: true }), e), "Aa");
    var y;
    var b2;
    var u = fe(() => {
      "use strict";
      y = { nextTick: /* @__PURE__ */ __name((e, ...t) => {
        setTimeout(() => {
          e(...t);
        }, 0);
      }, "nextTick"), env: {}, version: "", cwd: /* @__PURE__ */ __name(() => "/", "cwd"), stderr: {}, argv: ["/bin/node"], pid: 1e4 }, { cwd: b2 } = y;
    });
    var x2;
    var c = fe(() => {
      "use strict";
      x2 = globalThis.performance ?? (() => {
        let e = Date.now();
        return { now: /* @__PURE__ */ __name(() => Date.now() - e, "now") };
      })();
    });
    var E;
    var p2 = fe(() => {
      "use strict";
      E = /* @__PURE__ */ __name(() => {
      }, "E");
      E.prototype = E;
    });
    var m = fe(() => {
      "use strict";
    });
    var Ii = Je((ze) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      var gi = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "gi"), Ra = gi((e) => {
        "use strict";
        e.byteLength = l2, e.toByteArray = g, e.fromByteArray = I;
        var t = [], r = [], n = typeof Uint8Array < "u" ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (o = 0, s = i.length; o < s; ++o) t[o] = i[o], r[i.charCodeAt(o)] = o;
        var o, s;
        r[45] = 62, r[95] = 63;
        function a(S2) {
          var C = S2.length;
          if (C % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
          var M = S2.indexOf("=");
          M === -1 && (M = C);
          var F2 = M === C ? 0 : 4 - M % 4;
          return [M, F2];
        }
        __name(a, "a");
        function l2(S2) {
          var C = a(S2), M = C[0], F2 = C[1];
          return (M + F2) * 3 / 4 - F2;
        }
        __name(l2, "l");
        function d(S2, C, M) {
          return (C + M) * 3 / 4 - M;
        }
        __name(d, "d");
        function g(S2) {
          var C, M = a(S2), F2 = M[0], B = M[1], O = new n(d(S2, F2, B)), L = 0, le = B > 0 ? F2 - 4 : F2, J;
          for (J = 0; J < le; J += 4) C = r[S2.charCodeAt(J)] << 18 | r[S2.charCodeAt(J + 1)] << 12 | r[S2.charCodeAt(J + 2)] << 6 | r[S2.charCodeAt(J + 3)], O[L++] = C >> 16 & 255, O[L++] = C >> 8 & 255, O[L++] = C & 255;
          return B === 2 && (C = r[S2.charCodeAt(J)] << 2 | r[S2.charCodeAt(J + 1)] >> 4, O[L++] = C & 255), B === 1 && (C = r[S2.charCodeAt(J)] << 10 | r[S2.charCodeAt(J + 1)] << 4 | r[S2.charCodeAt(J + 2)] >> 2, O[L++] = C >> 8 & 255, O[L++] = C & 255), O;
        }
        __name(g, "g");
        function h(S2) {
          return t[S2 >> 18 & 63] + t[S2 >> 12 & 63] + t[S2 >> 6 & 63] + t[S2 & 63];
        }
        __name(h, "h");
        function T2(S2, C, M) {
          for (var F2, B = [], O = C; O < M; O += 3) F2 = (S2[O] << 16 & 16711680) + (S2[O + 1] << 8 & 65280) + (S2[O + 2] & 255), B.push(h(F2));
          return B.join("");
        }
        __name(T2, "T");
        function I(S2) {
          for (var C, M = S2.length, F2 = M % 3, B = [], O = 16383, L = 0, le = M - F2; L < le; L += O) B.push(T2(S2, L, L + O > le ? le : L + O));
          return F2 === 1 ? (C = S2[M - 1], B.push(t[C >> 2] + t[C << 4 & 63] + "==")) : F2 === 2 && (C = (S2[M - 2] << 8) + S2[M - 1], B.push(t[C >> 10] + t[C >> 4 & 63] + t[C << 2 & 63] + "=")), B.join("");
        }
        __name(I, "I");
      }), Ca = gi((e) => {
        e.read = function(t, r, n, i, o) {
          var s, a, l2 = o * 8 - i - 1, d = (1 << l2) - 1, g = d >> 1, h = -7, T2 = n ? o - 1 : 0, I = n ? -1 : 1, S2 = t[r + T2];
          for (T2 += I, s = S2 & (1 << -h) - 1, S2 >>= -h, h += l2; h > 0; s = s * 256 + t[r + T2], T2 += I, h -= 8) ;
          for (a = s & (1 << -h) - 1, s >>= -h, h += i; h > 0; a = a * 256 + t[r + T2], T2 += I, h -= 8) ;
          if (s === 0) s = 1 - g;
          else {
            if (s === d) return a ? NaN : (S2 ? -1 : 1) * (1 / 0);
            a = a + Math.pow(2, i), s = s - g;
          }
          return (S2 ? -1 : 1) * a * Math.pow(2, s - i);
        }, e.write = function(t, r, n, i, o, s) {
          var a, l2, d, g = s * 8 - o - 1, h = (1 << g) - 1, T2 = h >> 1, I = o === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, S2 = i ? 0 : s - 1, C = i ? 1 : -1, M = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
          for (r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (l2 = isNaN(r) ? 1 : 0, a = h) : (a = Math.floor(Math.log(r) / Math.LN2), r * (d = Math.pow(2, -a)) < 1 && (a--, d *= 2), a + T2 >= 1 ? r += I / d : r += I * Math.pow(2, 1 - T2), r * d >= 2 && (a++, d /= 2), a + T2 >= h ? (l2 = 0, a = h) : a + T2 >= 1 ? (l2 = (r * d - 1) * Math.pow(2, o), a = a + T2) : (l2 = r * Math.pow(2, T2 - 1) * Math.pow(2, o), a = 0)); o >= 8; t[n + S2] = l2 & 255, S2 += C, l2 /= 256, o -= 8) ;
          for (a = a << o | l2, g += o; g > 0; t[n + S2] = a & 255, S2 += C, a /= 256, g -= 8) ;
          t[n + S2 - C] |= M * 128;
        };
      }), un = Ra(), We = Ca(), pi = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
      ze.Buffer = A;
      ze.SlowBuffer = Ma;
      ze.INSPECT_MAX_BYTES = 50;
      var ur = 2147483647;
      ze.kMaxLength = ur;
      A.TYPED_ARRAY_SUPPORT = Sa();
      !A.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
      function Sa() {
        try {
          let e = new Uint8Array(1), t = { foo: /* @__PURE__ */ __name(function() {
            return 42;
          }, "foo") };
          return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), e.foo() === 42;
        } catch {
          return false;
        }
      }
      __name(Sa, "Sa");
      Object.defineProperty(A.prototype, "parent", { enumerable: true, get: /* @__PURE__ */ __name(function() {
        if (A.isBuffer(this)) return this.buffer;
      }, "get") });
      Object.defineProperty(A.prototype, "offset", { enumerable: true, get: /* @__PURE__ */ __name(function() {
        if (A.isBuffer(this)) return this.byteOffset;
      }, "get") });
      function xe(e) {
        if (e > ur) throw new RangeError('The value "' + e + '" is invalid for option "size"');
        let t = new Uint8Array(e);
        return Object.setPrototypeOf(t, A.prototype), t;
      }
      __name(xe, "xe");
      function A(e, t, r) {
        if (typeof e == "number") {
          if (typeof t == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
          return mn(e);
        }
        return hi(e, t, r);
      }
      __name(A, "A");
      A.poolSize = 8192;
      function hi(e, t, r) {
        if (typeof e == "string") return Oa(e, t);
        if (ArrayBuffer.isView(e)) return ka(e);
        if (e == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
        if (de(e, ArrayBuffer) || e && de(e.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (de(e, SharedArrayBuffer) || e && de(e.buffer, SharedArrayBuffer))) return wi(e, t, r);
        if (typeof e == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
        let n = e.valueOf && e.valueOf();
        if (n != null && n !== e) return A.from(n, t, r);
        let i = Da(e);
        if (i) return i;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] == "function") return A.from(e[Symbol.toPrimitive]("string"), t, r);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
      }
      __name(hi, "hi");
      A.from = function(e, t, r) {
        return hi(e, t, r);
      };
      Object.setPrototypeOf(A.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(A, Uint8Array);
      function yi(e) {
        if (typeof e != "number") throw new TypeError('"size" argument must be of type number');
        if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
      }
      __name(yi, "yi");
      function Ia(e, t, r) {
        return yi(e), e <= 0 ? xe(e) : t !== void 0 ? typeof r == "string" ? xe(e).fill(t, r) : xe(e).fill(t) : xe(e);
      }
      __name(Ia, "Ia");
      A.alloc = function(e, t, r) {
        return Ia(e, t, r);
      };
      function mn(e) {
        return yi(e), xe(e < 0 ? 0 : fn(e) | 0);
      }
      __name(mn, "mn");
      A.allocUnsafe = function(e) {
        return mn(e);
      };
      A.allocUnsafeSlow = function(e) {
        return mn(e);
      };
      function Oa(e, t) {
        if ((typeof t != "string" || t === "") && (t = "utf8"), !A.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
        let r = Ei(e, t) | 0, n = xe(r), i = n.write(e, t);
        return i !== r && (n = n.slice(0, i)), n;
      }
      __name(Oa, "Oa");
      function cn(e) {
        let t = e.length < 0 ? 0 : fn(e.length) | 0, r = xe(t);
        for (let n = 0; n < t; n += 1) r[n] = e[n] & 255;
        return r;
      }
      __name(cn, "cn");
      function ka(e) {
        if (de(e, Uint8Array)) {
          let t = new Uint8Array(e);
          return wi(t.buffer, t.byteOffset, t.byteLength);
        }
        return cn(e);
      }
      __name(ka, "ka");
      function wi(e, t, r) {
        if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
        if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
        let n;
        return t === void 0 && r === void 0 ? n = new Uint8Array(e) : r === void 0 ? n = new Uint8Array(e, t) : n = new Uint8Array(e, t, r), Object.setPrototypeOf(n, A.prototype), n;
      }
      __name(wi, "wi");
      function Da(e) {
        if (A.isBuffer(e)) {
          let t = fn(e.length) | 0, r = xe(t);
          return r.length === 0 || e.copy(r, 0, 0, t), r;
        }
        if (e.length !== void 0) return typeof e.length != "number" || gn(e.length) ? xe(0) : cn(e);
        if (e.type === "Buffer" && Array.isArray(e.data)) return cn(e.data);
      }
      __name(Da, "Da");
      function fn(e) {
        if (e >= ur) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + ur.toString(16) + " bytes");
        return e | 0;
      }
      __name(fn, "fn");
      function Ma(e) {
        return +e != e && (e = 0), A.alloc(+e);
      }
      __name(Ma, "Ma");
      A.isBuffer = function(e) {
        return e != null && e._isBuffer === true && e !== A.prototype;
      };
      A.compare = function(e, t) {
        if (de(e, Uint8Array) && (e = A.from(e, e.offset, e.byteLength)), de(t, Uint8Array) && (t = A.from(t, t.offset, t.byteLength)), !A.isBuffer(e) || !A.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (e === t) return 0;
        let r = e.length, n = t.length;
        for (let i = 0, o = Math.min(r, n); i < o; ++i) if (e[i] !== t[i]) {
          r = e[i], n = t[i];
          break;
        }
        return r < n ? -1 : n < r ? 1 : 0;
      };
      A.isEncoding = function(e) {
        switch (String(e).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      A.concat = function(e, t) {
        if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (e.length === 0) return A.alloc(0);
        let r;
        if (t === void 0) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
        let n = A.allocUnsafe(t), i = 0;
        for (r = 0; r < e.length; ++r) {
          let o = e[r];
          if (de(o, Uint8Array)) i + o.length > n.length ? (A.isBuffer(o) || (o = A.from(o)), o.copy(n, i)) : Uint8Array.prototype.set.call(n, o, i);
          else if (A.isBuffer(o)) o.copy(n, i);
          else throw new TypeError('"list" argument must be an Array of Buffers');
          i += o.length;
        }
        return n;
      };
      function Ei(e, t) {
        if (A.isBuffer(e)) return e.length;
        if (ArrayBuffer.isView(e) || de(e, ArrayBuffer)) return e.byteLength;
        if (typeof e != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
        let r = e.length, n = arguments.length > 2 && arguments[2] === true;
        if (!n && r === 0) return 0;
        let i = false;
        for (; ; ) switch (t) {
          case "ascii":
          case "latin1":
          case "binary":
            return r;
          case "utf8":
          case "utf-8":
            return pn(e).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return r * 2;
          case "hex":
            return r >>> 1;
          case "base64":
            return Si(e).length;
          default:
            if (i) return n ? -1 : pn(e).length;
            t = ("" + t).toLowerCase(), i = true;
        }
      }
      __name(Ei, "Ei");
      A.byteLength = Ei;
      function _a(e, t, r) {
        let n = false;
        if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, t >>>= 0, r <= t)) return "";
        for (e || (e = "utf8"); ; ) switch (e) {
          case "hex":
            return Ga(this, t, r);
          case "utf8":
          case "utf-8":
            return xi(this, t, r);
          case "ascii":
            return $a(this, t, r);
          case "latin1":
          case "binary":
            return ja(this, t, r);
          case "base64":
            return qa(this, t, r);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Ja(this, t, r);
          default:
            if (n) throw new TypeError("Unknown encoding: " + e);
            e = (e + "").toLowerCase(), n = true;
        }
      }
      __name(_a, "_a");
      A.prototype._isBuffer = true;
      function Le(e, t, r) {
        let n = e[t];
        e[t] = e[r], e[r] = n;
      }
      __name(Le, "Le");
      A.prototype.swap16 = function() {
        let e = this.length;
        if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let t = 0; t < e; t += 2) Le(this, t, t + 1);
        return this;
      };
      A.prototype.swap32 = function() {
        let e = this.length;
        if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let t = 0; t < e; t += 4) Le(this, t, t + 3), Le(this, t + 1, t + 2);
        return this;
      };
      A.prototype.swap64 = function() {
        let e = this.length;
        if (e % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let t = 0; t < e; t += 8) Le(this, t, t + 7), Le(this, t + 1, t + 6), Le(this, t + 2, t + 5), Le(this, t + 3, t + 4);
        return this;
      };
      A.prototype.toString = function() {
        let e = this.length;
        return e === 0 ? "" : arguments.length === 0 ? xi(this, 0, e) : _a.apply(this, arguments);
      };
      A.prototype.toLocaleString = A.prototype.toString;
      A.prototype.equals = function(e) {
        if (!A.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
        return this === e ? true : A.compare(this, e) === 0;
      };
      A.prototype.inspect = function() {
        let e = "", t = ze.INSPECT_MAX_BYTES;
        return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
      };
      pi && (A.prototype[pi] = A.prototype.inspect);
      A.prototype.compare = function(e, t, r, n, i) {
        if (de(e, Uint8Array) && (e = A.from(e, e.offset, e.byteLength)), !A.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
        if (t === void 0 && (t = 0), r === void 0 && (r = e ? e.length : 0), n === void 0 && (n = 0), i === void 0 && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
        if (n >= i && t >= r) return 0;
        if (n >= i) return -1;
        if (t >= r) return 1;
        if (t >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === e) return 0;
        let o = i - n, s = r - t, a = Math.min(o, s), l2 = this.slice(n, i), d = e.slice(t, r);
        for (let g = 0; g < a; ++g) if (l2[g] !== d[g]) {
          o = l2[g], s = d[g];
          break;
        }
        return o < s ? -1 : s < o ? 1 : 0;
      };
      function bi(e, t, r, n, i) {
        if (e.length === 0) return -1;
        if (typeof r == "string" ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, gn(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
          if (i) return -1;
          r = e.length - 1;
        } else if (r < 0) if (i) r = 0;
        else return -1;
        if (typeof t == "string" && (t = A.from(t, n)), A.isBuffer(t)) return t.length === 0 ? -1 : mi(e, t, r, n, i);
        if (typeof t == "number") return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : mi(e, [t], r, n, i);
        throw new TypeError("val must be string, number or Buffer");
      }
      __name(bi, "bi");
      function mi(e, t, r, n, i) {
        let o = 1, s = e.length, a = t.length;
        if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
          if (e.length < 2 || t.length < 2) return -1;
          o = 2, s /= 2, a /= 2, r /= 2;
        }
        function l2(g, h) {
          return o === 1 ? g[h] : g.readUInt16BE(h * o);
        }
        __name(l2, "l");
        let d;
        if (i) {
          let g = -1;
          for (d = r; d < s; d++) if (l2(e, d) === l2(t, g === -1 ? 0 : d - g)) {
            if (g === -1 && (g = d), d - g + 1 === a) return g * o;
          } else g !== -1 && (d -= d - g), g = -1;
        } else for (r + a > s && (r = s - a), d = r; d >= 0; d--) {
          let g = true;
          for (let h = 0; h < a; h++) if (l2(e, d + h) !== l2(t, h)) {
            g = false;
            break;
          }
          if (g) return d;
        }
        return -1;
      }
      __name(mi, "mi");
      A.prototype.includes = function(e, t, r) {
        return this.indexOf(e, t, r) !== -1;
      };
      A.prototype.indexOf = function(e, t, r) {
        return bi(this, e, t, r, true);
      };
      A.prototype.lastIndexOf = function(e, t, r) {
        return bi(this, e, t, r, false);
      };
      function Na(e, t, r, n) {
        r = Number(r) || 0;
        let i = e.length - r;
        n ? (n = Number(n), n > i && (n = i)) : n = i;
        let o = t.length;
        n > o / 2 && (n = o / 2);
        let s;
        for (s = 0; s < n; ++s) {
          let a = parseInt(t.substr(s * 2, 2), 16);
          if (gn(a)) return s;
          e[r + s] = a;
        }
        return s;
      }
      __name(Na, "Na");
      function Fa(e, t, r, n) {
        return cr(pn(t, e.length - r), e, r, n);
      }
      __name(Fa, "Fa");
      function La(e, t, r, n) {
        return cr(Ha(t), e, r, n);
      }
      __name(La, "La");
      function Ua(e, t, r, n) {
        return cr(Si(t), e, r, n);
      }
      __name(Ua, "Ua");
      function Ba(e, t, r, n) {
        return cr(za(t, e.length - r), e, r, n);
      }
      __name(Ba, "Ba");
      A.prototype.write = function(e, t, r, n) {
        if (t === void 0) n = "utf8", r = this.length, t = 0;
        else if (r === void 0 && typeof t == "string") n = t, r = this.length, t = 0;
        else if (isFinite(t)) t = t >>> 0, isFinite(r) ? (r = r >>> 0, n === void 0 && (n = "utf8")) : (n = r, r = void 0);
        else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        let i = this.length - t;
        if ((r === void 0 || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        n || (n = "utf8");
        let o = false;
        for (; ; ) switch (n) {
          case "hex":
            return Na(this, e, t, r);
          case "utf8":
          case "utf-8":
            return Fa(this, e, t, r);
          case "ascii":
          case "latin1":
          case "binary":
            return La(this, e, t, r);
          case "base64":
            return Ua(this, e, t, r);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Ba(this, e, t, r);
          default:
            if (o) throw new TypeError("Unknown encoding: " + n);
            n = ("" + n).toLowerCase(), o = true;
        }
      };
      A.prototype.toJSON = function() {
        return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
      };
      function qa(e, t, r) {
        return t === 0 && r === e.length ? un.fromByteArray(e) : un.fromByteArray(e.slice(t, r));
      }
      __name(qa, "qa");
      function xi(e, t, r) {
        r = Math.min(e.length, r);
        let n = [], i = t;
        for (; i < r; ) {
          let o = e[i], s = null, a = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
          if (i + a <= r) {
            let l2, d, g, h;
            switch (a) {
              case 1:
                o < 128 && (s = o);
                break;
              case 2:
                l2 = e[i + 1], (l2 & 192) === 128 && (h = (o & 31) << 6 | l2 & 63, h > 127 && (s = h));
                break;
              case 3:
                l2 = e[i + 1], d = e[i + 2], (l2 & 192) === 128 && (d & 192) === 128 && (h = (o & 15) << 12 | (l2 & 63) << 6 | d & 63, h > 2047 && (h < 55296 || h > 57343) && (s = h));
                break;
              case 4:
                l2 = e[i + 1], d = e[i + 2], g = e[i + 3], (l2 & 192) === 128 && (d & 192) === 128 && (g & 192) === 128 && (h = (o & 15) << 18 | (l2 & 63) << 12 | (d & 63) << 6 | g & 63, h > 65535 && h < 1114112 && (s = h));
            }
          }
          s === null ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, n.push(s >>> 10 & 1023 | 55296), s = 56320 | s & 1023), n.push(s), i += a;
        }
        return Va(n);
      }
      __name(xi, "xi");
      var fi = 4096;
      function Va(e) {
        let t = e.length;
        if (t <= fi) return String.fromCharCode.apply(String, e);
        let r = "", n = 0;
        for (; n < t; ) r += String.fromCharCode.apply(String, e.slice(n, n += fi));
        return r;
      }
      __name(Va, "Va");
      function $a(e, t, r) {
        let n = "";
        r = Math.min(e.length, r);
        for (let i = t; i < r; ++i) n += String.fromCharCode(e[i] & 127);
        return n;
      }
      __name($a, "$a");
      function ja(e, t, r) {
        let n = "";
        r = Math.min(e.length, r);
        for (let i = t; i < r; ++i) n += String.fromCharCode(e[i]);
        return n;
      }
      __name(ja, "ja");
      function Ga(e, t, r) {
        let n = e.length;
        (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
        let i = "";
        for (let o = t; o < r; ++o) i += Ya[e[o]];
        return i;
      }
      __name(Ga, "Ga");
      function Ja(e, t, r) {
        let n = e.slice(t, r), i = "";
        for (let o = 0; o < n.length - 1; o += 2) i += String.fromCharCode(n[o] + n[o + 1] * 256);
        return i;
      }
      __name(Ja, "Ja");
      A.prototype.slice = function(e, t) {
        let r = this.length;
        e = ~~e, t = t === void 0 ? r : ~~t, e < 0 ? (e += r, e < 0 && (e = 0)) : e > r && (e = r), t < 0 ? (t += r, t < 0 && (t = 0)) : t > r && (t = r), t < e && (t = e);
        let n = this.subarray(e, t);
        return Object.setPrototypeOf(n, A.prototype), n;
      };
      function W(e, t, r) {
        if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
        if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
      }
      __name(W, "W");
      A.prototype.readUintLE = A.prototype.readUIntLE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = this[e], i = 1, o = 0;
        for (; ++o < t && (i *= 256); ) n += this[e + o] * i;
        return n;
      };
      A.prototype.readUintBE = A.prototype.readUIntBE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = this[e + --t], i = 1;
        for (; t > 0 && (i *= 256); ) n += this[e + --t] * i;
        return n;
      };
      A.prototype.readUint8 = A.prototype.readUInt8 = function(e, t) {
        return e = e >>> 0, t || W(e, 1, this.length), this[e];
      };
      A.prototype.readUint16LE = A.prototype.readUInt16LE = function(e, t) {
        return e = e >>> 0, t || W(e, 2, this.length), this[e] | this[e + 1] << 8;
      };
      A.prototype.readUint16BE = A.prototype.readUInt16BE = function(e, t) {
        return e = e >>> 0, t || W(e, 2, this.length), this[e] << 8 | this[e + 1];
      };
      A.prototype.readUint32LE = A.prototype.readUInt32LE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
      };
      A.prototype.readUint32BE = A.prototype.readUInt32BE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
      };
      A.prototype.readBigUInt64LE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, i = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + r * 2 ** 24;
        return BigInt(n) + (BigInt(i) << BigInt(32));
      });
      A.prototype.readBigUInt64BE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], i = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r;
        return (BigInt(n) << BigInt(32)) + BigInt(i);
      });
      A.prototype.readIntLE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = this[e], i = 1, o = 0;
        for (; ++o < t && (i *= 256); ) n += this[e + o] * i;
        return i *= 128, n >= i && (n -= Math.pow(2, 8 * t)), n;
      };
      A.prototype.readIntBE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = t, i = 1, o = this[e + --n];
        for (; n > 0 && (i *= 256); ) o += this[e + --n] * i;
        return i *= 128, o >= i && (o -= Math.pow(2, 8 * t)), o;
      };
      A.prototype.readInt8 = function(e, t) {
        return e = e >>> 0, t || W(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
      };
      A.prototype.readInt16LE = function(e, t) {
        e = e >>> 0, t || W(e, 2, this.length);
        let r = this[e] | this[e + 1] << 8;
        return r & 32768 ? r | 4294901760 : r;
      };
      A.prototype.readInt16BE = function(e, t) {
        e = e >>> 0, t || W(e, 2, this.length);
        let r = this[e + 1] | this[e] << 8;
        return r & 32768 ? r | 4294901760 : r;
      };
      A.prototype.readInt32LE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
      };
      A.prototype.readInt32BE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
      };
      A.prototype.readBigInt64LE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (r << 24);
        return (BigInt(n) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
      });
      A.prototype.readBigInt64BE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
        return (BigInt(n) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r);
      });
      A.prototype.readFloatLE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), We.read(this, e, true, 23, 4);
      };
      A.prototype.readFloatBE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), We.read(this, e, false, 23, 4);
      };
      A.prototype.readDoubleLE = function(e, t) {
        return e = e >>> 0, t || W(e, 8, this.length), We.read(this, e, true, 52, 8);
      };
      A.prototype.readDoubleBE = function(e, t) {
        return e = e >>> 0, t || W(e, 8, this.length), We.read(this, e, false, 52, 8);
      };
      function re(e, t, r, n, i, o) {
        if (!A.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
        if (r + n > e.length) throw new RangeError("Index out of range");
      }
      __name(re, "re");
      A.prototype.writeUintLE = A.prototype.writeUIntLE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, r = r >>> 0, !n) {
          let s = Math.pow(2, 8 * r) - 1;
          re(this, e, t, r, s, 0);
        }
        let i = 1, o = 0;
        for (this[t] = e & 255; ++o < r && (i *= 256); ) this[t + o] = e / i & 255;
        return t + r;
      };
      A.prototype.writeUintBE = A.prototype.writeUIntBE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, r = r >>> 0, !n) {
          let s = Math.pow(2, 8 * r) - 1;
          re(this, e, t, r, s, 0);
        }
        let i = r - 1, o = 1;
        for (this[t + i] = e & 255; --i >= 0 && (o *= 256); ) this[t + i] = e / o & 255;
        return t + r;
      };
      A.prototype.writeUint8 = A.prototype.writeUInt8 = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
      };
      A.prototype.writeUint16LE = A.prototype.writeUInt16LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      };
      A.prototype.writeUint16BE = A.prototype.writeUInt16BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      };
      A.prototype.writeUint32LE = A.prototype.writeUInt32LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
      };
      A.prototype.writeUint32BE = A.prototype.writeUInt32BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      };
      function Pi(e, t, r, n, i) {
        Ci(t, n, i, e, r, 7);
        let o = Number(t & BigInt(4294967295));
        e[r++] = o, o = o >> 8, e[r++] = o, o = o >> 8, e[r++] = o, o = o >> 8, e[r++] = o;
        let s = Number(t >> BigInt(32) & BigInt(4294967295));
        return e[r++] = s, s = s >> 8, e[r++] = s, s = s >> 8, e[r++] = s, s = s >> 8, e[r++] = s, r;
      }
      __name(Pi, "Pi");
      function vi(e, t, r, n, i) {
        Ci(t, n, i, e, r, 7);
        let o = Number(t & BigInt(4294967295));
        e[r + 7] = o, o = o >> 8, e[r + 6] = o, o = o >> 8, e[r + 5] = o, o = o >> 8, e[r + 4] = o;
        let s = Number(t >> BigInt(32) & BigInt(4294967295));
        return e[r + 3] = s, s = s >> 8, e[r + 2] = s, s = s >> 8, e[r + 1] = s, s = s >> 8, e[r] = s, r + 8;
      }
      __name(vi, "vi");
      A.prototype.writeBigUInt64LE = Se(function(e, t = 0) {
        return Pi(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      A.prototype.writeBigUInt64BE = Se(function(e, t = 0) {
        return vi(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      A.prototype.writeIntLE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, !n) {
          let a = Math.pow(2, 8 * r - 1);
          re(this, e, t, r, a - 1, -a);
        }
        let i = 0, o = 1, s = 0;
        for (this[t] = e & 255; ++i < r && (o *= 256); ) e < 0 && s === 0 && this[t + i - 1] !== 0 && (s = 1), this[t + i] = (e / o >> 0) - s & 255;
        return t + r;
      };
      A.prototype.writeIntBE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, !n) {
          let a = Math.pow(2, 8 * r - 1);
          re(this, e, t, r, a - 1, -a);
        }
        let i = r - 1, o = 1, s = 0;
        for (this[t + i] = e & 255; --i >= 0 && (o *= 256); ) e < 0 && s === 0 && this[t + i + 1] !== 0 && (s = 1), this[t + i] = (e / o >> 0) - s & 255;
        return t + r;
      };
      A.prototype.writeInt8 = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
      };
      A.prototype.writeInt16LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      };
      A.prototype.writeInt16BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      };
      A.prototype.writeInt32LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
      };
      A.prototype.writeInt32BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      };
      A.prototype.writeBigInt64LE = Se(function(e, t = 0) {
        return Pi(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      A.prototype.writeBigInt64BE = Se(function(e, t = 0) {
        return vi(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function Ti(e, t, r, n, i, o) {
        if (r + n > e.length) throw new RangeError("Index out of range");
        if (r < 0) throw new RangeError("Index out of range");
      }
      __name(Ti, "Ti");
      function Ai(e, t, r, n, i) {
        return t = +t, r = r >>> 0, i || Ti(e, t, r, 4, 34028234663852886e22, -34028234663852886e22), We.write(e, t, r, n, 23, 4), r + 4;
      }
      __name(Ai, "Ai");
      A.prototype.writeFloatLE = function(e, t, r) {
        return Ai(this, e, t, true, r);
      };
      A.prototype.writeFloatBE = function(e, t, r) {
        return Ai(this, e, t, false, r);
      };
      function Ri(e, t, r, n, i) {
        return t = +t, r = r >>> 0, i || Ti(e, t, r, 8, 17976931348623157e292, -17976931348623157e292), We.write(e, t, r, n, 52, 8), r + 8;
      }
      __name(Ri, "Ri");
      A.prototype.writeDoubleLE = function(e, t, r) {
        return Ri(this, e, t, true, r);
      };
      A.prototype.writeDoubleBE = function(e, t, r) {
        return Ri(this, e, t, false, r);
      };
      A.prototype.copy = function(e, t, r, n) {
        if (!A.isBuffer(e)) throw new TypeError("argument should be a Buffer");
        if (r || (r = 0), !n && n !== 0 && (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r || e.length === 0 || this.length === 0) return 0;
        if (t < 0) throw new RangeError("targetStart out of bounds");
        if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
        if (n < 0) throw new RangeError("sourceEnd out of bounds");
        n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
        let i = n - r;
        return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, r, n) : Uint8Array.prototype.set.call(e, this.subarray(r, n), t), i;
      };
      A.prototype.fill = function(e, t, r, n) {
        if (typeof e == "string") {
          if (typeof t == "string" ? (n = t, t = 0, r = this.length) : typeof r == "string" && (n = r, r = this.length), n !== void 0 && typeof n != "string") throw new TypeError("encoding must be a string");
          if (typeof n == "string" && !A.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
          if (e.length === 1) {
            let o = e.charCodeAt(0);
            (n === "utf8" && o < 128 || n === "latin1") && (e = o);
          }
        } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
        if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
        if (r <= t) return this;
        t = t >>> 0, r = r === void 0 ? this.length : r >>> 0, e || (e = 0);
        let i;
        if (typeof e == "number") for (i = t; i < r; ++i) this[i] = e;
        else {
          let o = A.isBuffer(e) ? e : A.from(e, n), s = o.length;
          if (s === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
          for (i = 0; i < r - t; ++i) this[i + t] = o[i % s];
        }
        return this;
      };
      var Ke = {};
      function dn(e, t, r) {
        Ke[e] = class extends r {
          constructor() {
            super(), Object.defineProperty(this, "message", { value: t.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e}]`, this.stack, delete this.name;
          }
          get code() {
            return e;
          }
          set code(n) {
            Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: n, writable: true });
          }
          toString() {
            return `${this.name} [${e}]: ${this.message}`;
          }
        };
      }
      __name(dn, "dn");
      dn("ERR_BUFFER_OUT_OF_BOUNDS", function(e) {
        return e ? `${e} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      }, RangeError);
      dn("ERR_INVALID_ARG_TYPE", function(e, t) {
        return `The "${e}" argument must be of type number. Received type ${typeof t}`;
      }, TypeError);
      dn("ERR_OUT_OF_RANGE", function(e, t, r) {
        let n = `The value of "${e}" is out of range.`, i = r;
        return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? i = di(String(r)) : typeof r == "bigint" && (i = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (i = di(i)), i += "n"), n += ` It must be ${t}. Received ${i}`, n;
      }, RangeError);
      function di(e) {
        let t = "", r = e.length, n = e[0] === "-" ? 1 : 0;
        for (; r >= n + 4; r -= 3) t = `_${e.slice(r - 3, r)}${t}`;
        return `${e.slice(0, r)}${t}`;
      }
      __name(di, "di");
      function Qa(e, t, r) {
        He(t, "offset"), (e[t] === void 0 || e[t + r] === void 0) && Tt(t, e.length - (r + 1));
      }
      __name(Qa, "Qa");
      function Ci(e, t, r, n, i, o) {
        if (e > r || e < t) {
          let s = typeof t == "bigint" ? "n" : "", a;
          throw o > 3 ? t === 0 || t === BigInt(0) ? a = `>= 0${s} and < 2${s} ** ${(o + 1) * 8}${s}` : a = `>= -(2${s} ** ${(o + 1) * 8 - 1}${s}) and < 2 ** ${(o + 1) * 8 - 1}${s}` : a = `>= ${t}${s} and <= ${r}${s}`, new Ke.ERR_OUT_OF_RANGE("value", a, e);
        }
        Qa(n, i, o);
      }
      __name(Ci, "Ci");
      function He(e, t) {
        if (typeof e != "number") throw new Ke.ERR_INVALID_ARG_TYPE(t, "number", e);
      }
      __name(He, "He");
      function Tt(e, t, r) {
        throw Math.floor(e) !== e ? (He(e, r), new Ke.ERR_OUT_OF_RANGE(r || "offset", "an integer", e)) : t < 0 ? new Ke.ERR_BUFFER_OUT_OF_BOUNDS() : new Ke.ERR_OUT_OF_RANGE(r || "offset", `>= ${r ? 1 : 0} and <= ${t}`, e);
      }
      __name(Tt, "Tt");
      var Ka = /[^+/0-9A-Za-z-_]/g;
      function Wa(e) {
        if (e = e.split("=")[0], e = e.trim().replace(Ka, ""), e.length < 2) return "";
        for (; e.length % 4 !== 0; ) e = e + "=";
        return e;
      }
      __name(Wa, "Wa");
      function pn(e, t) {
        t = t || 1 / 0;
        let r, n = e.length, i = null, o = [];
        for (let s = 0; s < n; ++s) {
          if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
            if (!i) {
              if (r > 56319) {
                (t -= 3) > -1 && o.push(239, 191, 189);
                continue;
              } else if (s + 1 === n) {
                (t -= 3) > -1 && o.push(239, 191, 189);
                continue;
              }
              i = r;
              continue;
            }
            if (r < 56320) {
              (t -= 3) > -1 && o.push(239, 191, 189), i = r;
              continue;
            }
            r = (i - 55296 << 10 | r - 56320) + 65536;
          } else i && (t -= 3) > -1 && o.push(239, 191, 189);
          if (i = null, r < 128) {
            if ((t -= 1) < 0) break;
            o.push(r);
          } else if (r < 2048) {
            if ((t -= 2) < 0) break;
            o.push(r >> 6 | 192, r & 63 | 128);
          } else if (r < 65536) {
            if ((t -= 3) < 0) break;
            o.push(r >> 12 | 224, r >> 6 & 63 | 128, r & 63 | 128);
          } else if (r < 1114112) {
            if ((t -= 4) < 0) break;
            o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, r & 63 | 128);
          } else throw new Error("Invalid code point");
        }
        return o;
      }
      __name(pn, "pn");
      function Ha(e) {
        let t = [];
        for (let r = 0; r < e.length; ++r) t.push(e.charCodeAt(r) & 255);
        return t;
      }
      __name(Ha, "Ha");
      function za(e, t) {
        let r, n, i, o = [];
        for (let s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), n = r >> 8, i = r % 256, o.push(i), o.push(n);
        return o;
      }
      __name(za, "za");
      function Si(e) {
        return un.toByteArray(Wa(e));
      }
      __name(Si, "Si");
      function cr(e, t, r, n) {
        let i;
        for (i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
        return i;
      }
      __name(cr, "cr");
      function de(e, t) {
        return e instanceof t || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === t.name;
      }
      __name(de, "de");
      function gn(e) {
        return e !== e;
      }
      __name(gn, "gn");
      var Ya = (function() {
        let e = "0123456789abcdef", t = new Array(256);
        for (let r = 0; r < 16; ++r) {
          let n = r * 16;
          for (let i = 0; i < 16; ++i) t[n + i] = e[r] + e[i];
        }
        return t;
      })();
      function Se(e) {
        return typeof BigInt > "u" ? Za : e;
      }
      __name(Se, "Se");
      function Za() {
        throw new Error("BigInt not supported");
      }
      __name(Za, "Za");
    });
    var w2;
    var f2 = fe(() => {
      "use strict";
      w2 = Qe(Ii());
    });
    function il() {
      return false;
    }
    __name(il, "il");
    function bn() {
      return { dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0, atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0, atime: /* @__PURE__ */ new Date(), mtime: /* @__PURE__ */ new Date(), ctime: /* @__PURE__ */ new Date(), birthtime: /* @__PURE__ */ new Date() };
    }
    __name(bn, "bn");
    function ol() {
      return bn();
    }
    __name(ol, "ol");
    function sl() {
      return [];
    }
    __name(sl, "sl");
    function al(e) {
      e(null, []);
    }
    __name(al, "al");
    function ll() {
      return "";
    }
    __name(ll, "ll");
    function ul() {
      return "";
    }
    __name(ul, "ul");
    function cl() {
    }
    __name(cl, "cl");
    function pl() {
    }
    __name(pl, "pl");
    function ml() {
    }
    __name(ml, "ml");
    function fl() {
    }
    __name(fl, "fl");
    function dl() {
    }
    __name(dl, "dl");
    function gl() {
    }
    __name(gl, "gl");
    function hl() {
    }
    __name(hl, "hl");
    function yl() {
    }
    __name(yl, "yl");
    function wl() {
      return { close: /* @__PURE__ */ __name(() => {
      }, "close"), on: /* @__PURE__ */ __name(() => {
      }, "on"), removeAllListeners: /* @__PURE__ */ __name(() => {
      }, "removeAllListeners") };
    }
    __name(wl, "wl");
    function El(e, t) {
      t(null, bn());
    }
    __name(El, "El");
    var bl;
    var xl;
    var Qi;
    var Ki = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      bl = {}, xl = { existsSync: il, lstatSync: bn, stat: El, statSync: ol, readdirSync: sl, readdir: al, readlinkSync: ll, realpathSync: ul, chmodSync: cl, renameSync: pl, mkdirSync: ml, rmdirSync: fl, rmSync: dl, unlinkSync: gl, watchFile: hl, unwatchFile: yl, watch: wl, promises: bl }, Qi = xl;
    });
    function Pl(...e) {
      return e.join("/");
    }
    __name(Pl, "Pl");
    function vl(...e) {
      return e.join("/");
    }
    __name(vl, "vl");
    function Tl(e) {
      let t = Wi(e), r = Hi(e), [n, i] = t.split(".");
      return { root: "/", dir: r, base: t, ext: i, name: n };
    }
    __name(Tl, "Tl");
    function Wi(e) {
      let t = e.split("/");
      return t[t.length - 1];
    }
    __name(Wi, "Wi");
    function Hi(e) {
      return e.split("/").slice(0, -1).join("/");
    }
    __name(Hi, "Hi");
    function Rl(e) {
      let t = e.split("/").filter((i) => i !== "" && i !== "."), r = [];
      for (let i of t) i === ".." ? r.pop() : r.push(i);
      let n = r.join("/");
      return e.startsWith("/") ? "/" + n : n;
    }
    __name(Rl, "Rl");
    var zi;
    var Al;
    var Cl;
    var Sl;
    var dr;
    var Yi = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      zi = "/", Al = ":";
      Cl = { sep: zi }, Sl = { basename: Wi, delimiter: Al, dirname: Hi, join: vl, normalize: Rl, parse: Tl, posix: Cl, resolve: Pl, sep: zi }, dr = Sl;
    });
    var Zi = Je((bf, Il) => {
      Il.exports = { name: "@prisma/internals", version: "6.16.0", description: "This package is intended for Prisma's internal use", main: "dist/index.js", types: "dist/index.d.ts", repository: { type: "git", url: "https://github.com/prisma/prisma.git", directory: "packages/internals" }, homepage: "https://www.prisma.io", author: "Tim Suchanek <suchanek@prisma.io>", bugs: "https://github.com/prisma/prisma/issues", license: "Apache-2.0", scripts: { dev: "DEV=true tsx helpers/build.ts", build: "tsx helpers/build.ts", test: "dotenv -e ../../.db.env -- jest --silent", prepublishOnly: "pnpm run build" }, files: ["README.md", "dist", "!**/libquery_engine*", "!dist/get-generators/engines/*", "scripts"], devDependencies: { "@babel/helper-validator-identifier": "7.25.9", "@opentelemetry/api": "1.9.0", "@swc/core": "1.11.5", "@swc/jest": "0.2.37", "@types/babel__helper-validator-identifier": "7.15.2", "@types/jest": "29.5.14", "@types/node": "18.19.76", "@types/resolve": "1.20.6", archiver: "6.0.2", "checkpoint-client": "1.1.33", "cli-truncate": "4.0.0", dotenv: "16.5.0", empathic: "2.0.0", "escape-string-regexp": "5.0.0", execa: "5.1.1", "fast-glob": "3.3.3", "find-up": "7.0.0", "fp-ts": "2.16.9", "fs-extra": "11.3.0", "fs-jetpack": "5.1.0", "global-directory": "4.0.0", globby: "11.1.0", "identifier-regex": "1.0.0", "indent-string": "4.0.0", "is-windows": "1.0.2", "is-wsl": "3.1.0", jest: "29.7.0", "jest-junit": "16.0.0", kleur: "4.1.5", "mock-stdin": "1.0.0", "new-github-issue-url": "0.2.1", "node-fetch": "3.3.2", "npm-packlist": "5.1.3", open: "7.4.2", "p-map": "4.0.0", resolve: "1.22.10", "string-width": "7.2.0", "strip-indent": "4.0.0", "temp-dir": "2.0.0", tempy: "1.0.1", "terminal-link": "4.0.0", tmp: "0.2.3", "ts-pattern": "5.6.2", "ts-toolbelt": "9.6.0", typescript: "5.4.5", yarn: "1.22.22" }, dependencies: { "@prisma/config": "workspace:*", "@prisma/debug": "workspace:*", "@prisma/dmmf": "workspace:*", "@prisma/driver-adapter-utils": "workspace:*", "@prisma/engines": "workspace:*", "@prisma/fetch-engine": "workspace:*", "@prisma/generator": "workspace:*", "@prisma/generator-helper": "workspace:*", "@prisma/get-platform": "workspace:*", "@prisma/prisma-schema-wasm": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43", "@prisma/schema-engine-wasm": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43", "@prisma/schema-files-loader": "workspace:*", arg: "5.0.2", prompts: "2.4.2" }, peerDependencies: { typescript: ">=5.1.0" }, peerDependenciesMeta: { typescript: { optional: true } }, sideEffects: false };
    });
    var Pn = Je((Mf, Ml) => {
      Ml.exports = { name: "@prisma/engines-version", version: "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.76", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
    });
    var Xi = Je((gr) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      Object.defineProperty(gr, "__esModule", { value: true });
      gr.enginesVersion = void 0;
      gr.enginesVersion = Pn().prisma.enginesVersion;
    });
    var ro = Je((Qf, to) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      to.exports = (e, t = 1, r) => {
        if (r = { indent: " ", includeEmptyLines: false, ...r }, typeof e != "string") throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);
        if (typeof t != "number") throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t}\``);
        if (typeof r.indent != "string") throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);
        if (t === 0) return e;
        let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return e.replace(n, r.indent.repeat(t));
      };
    });
    var Nn = Je((Jy, vo) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      vo.exports = /* @__PURE__ */ (function() {
        function e(t, r, n, i, o) {
          return t < r || n < r ? t > n ? n + 1 : t + 1 : i === o ? r : r + 1;
        }
        __name(e, "e");
        return function(t, r) {
          if (t === r) return 0;
          if (t.length > r.length) {
            var n = t;
            t = r, r = n;
          }
          for (var i = t.length, o = r.length; i > 0 && t.charCodeAt(i - 1) === r.charCodeAt(o - 1); ) i--, o--;
          for (var s = 0; s < i && t.charCodeAt(s) === r.charCodeAt(s); ) s++;
          if (i -= s, o -= s, i === 0 || o < 3) return o;
          var a = 0, l2, d, g, h, T2, I, S2, C, M, F2, B, O, L = [];
          for (l2 = 0; l2 < i; l2++) L.push(l2 + 1), L.push(t.charCodeAt(s + l2));
          for (var le = L.length - 1; a < o - 3; ) for (M = r.charCodeAt(s + (d = a)), F2 = r.charCodeAt(s + (g = a + 1)), B = r.charCodeAt(s + (h = a + 2)), O = r.charCodeAt(s + (T2 = a + 3)), I = a += 4, l2 = 0; l2 < le; l2 += 2) S2 = L[l2], C = L[l2 + 1], d = e(S2, d, g, M, C), g = e(d, g, h, F2, C), h = e(g, h, T2, B, C), I = e(h, T2, I, O, C), L[l2] = I, T2 = h, h = g, g = d, d = S2;
          for (; a < o; ) for (M = r.charCodeAt(s + (d = a)), I = ++a, l2 = 0; l2 < le; l2 += 2) S2 = L[l2], L[l2] = I = e(S2, d, I, M, L[l2 + 1]), d = S2;
          return I;
        };
      })();
    });
    var So = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
    });
    var Io = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
    });
    var Jr;
    var Xo = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      Jr = class {
        static {
          __name(this, "Jr");
        }
        events = {};
        on(t, r) {
          return this.events[t] || (this.events[t] = []), this.events[t].push(r), this;
        }
        emit(t, ...r) {
          return this.events[t] ? (this.events[t].forEach((n) => {
            n(...r);
          }), true) : false;
        }
      };
    });
    var kp = {};
    vt(kp, { DMMF: /* @__PURE__ */ __name(() => Dt, "DMMF"), Debug: /* @__PURE__ */ __name(() => z, "Debug"), Decimal: /* @__PURE__ */ __name(() => Ae, "Decimal"), Extensions: /* @__PURE__ */ __name(() => hn, "Extensions"), MetricsClient: /* @__PURE__ */ __name(() => pt, "MetricsClient"), PrismaClientInitializationError: /* @__PURE__ */ __name(() => Q, "PrismaClientInitializationError"), PrismaClientKnownRequestError: /* @__PURE__ */ __name(() => ne, "PrismaClientKnownRequestError"), PrismaClientRustPanicError: /* @__PURE__ */ __name(() => Pe, "PrismaClientRustPanicError"), PrismaClientUnknownRequestError: /* @__PURE__ */ __name(() => ie, "PrismaClientUnknownRequestError"), PrismaClientValidationError: /* @__PURE__ */ __name(() => X, "PrismaClientValidationError"), Public: /* @__PURE__ */ __name(() => yn, "Public"), Sql: /* @__PURE__ */ __name(() => se, "Sql"), createParam: /* @__PURE__ */ __name(() => Jo, "createParam"), defineDmmfProperty: /* @__PURE__ */ __name(() => Yo, "defineDmmfProperty"), deserializeJsonResponse: /* @__PURE__ */ __name(() => dt, "deserializeJsonResponse"), deserializeRawResult: /* @__PURE__ */ __name(() => nn, "deserializeRawResult"), dmmfToRuntimeDataModel: /* @__PURE__ */ __name(() => ao, "dmmfToRuntimeDataModel"), empty: /* @__PURE__ */ __name(() => ts, "empty"), getPrismaClient: /* @__PURE__ */ __name(() => ya, "getPrismaClient"), getRuntime: /* @__PURE__ */ __name(() => Zr, "getRuntime"), join: /* @__PURE__ */ __name(() => es, "join"), makeStrictEnum: /* @__PURE__ */ __name(() => wa, "makeStrictEnum"), makeTypedQueryFactory: /* @__PURE__ */ __name(() => Zo, "makeTypedQueryFactory"), objectEnumValues: /* @__PURE__ */ __name(() => Nr, "objectEnumValues"), raw: /* @__PURE__ */ __name(() => Gn, "raw"), serializeJsonQuery: /* @__PURE__ */ __name(() => $r, "serializeJsonQuery"), skip: /* @__PURE__ */ __name(() => Vr, "skip"), sqltag: /* @__PURE__ */ __name(() => Jn, "sqltag"), warnEnvConflicts: /* @__PURE__ */ __name(() => void 0, "warnEnvConflicts"), warnOnce: /* @__PURE__ */ __name(() => St, "warnOnce") });
    module.exports = Aa(kp);
    f2();
    u();
    c();
    p2();
    m();
    var hn = {};
    vt(hn, { defineExtension: /* @__PURE__ */ __name(() => Oi, "defineExtension"), getExtensionContext: /* @__PURE__ */ __name(() => ki, "getExtensionContext") });
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Oi(e) {
      return typeof e == "function" ? e : (t) => t.$extends(e);
    }
    __name(Oi, "Oi");
    f2();
    u();
    c();
    p2();
    m();
    function ki(e) {
      return e;
    }
    __name(ki, "ki");
    var yn = {};
    vt(yn, { validator: /* @__PURE__ */ __name(() => Di, "validator") });
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Di(...e) {
      return (t) => t;
    }
    __name(Di, "Di");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var wn;
    var Mi;
    var _i;
    var Ni;
    var Fi = true;
    typeof y < "u" && ({ FORCE_COLOR: wn, NODE_DISABLE_COLORS: Mi, NO_COLOR: _i, TERM: Ni } = y.env || {}, Fi = y.stdout && y.stdout.isTTY);
    var Xa = { enabled: !Mi && _i == null && Ni !== "dumb" && (wn != null && wn !== "0" || Fi) };
    function j(e, t) {
      let r = new RegExp(`\\x1b\\[${t}m`, "g"), n = `\x1B[${e}m`, i = `\x1B[${t}m`;
      return function(o) {
        return !Xa.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(r, i + n) : o) + i;
      };
    }
    __name(j, "j");
    var Pm = j(0, 0);
    var pr = j(1, 22);
    var mr = j(2, 22);
    var vm = j(3, 23);
    var Li = j(4, 24);
    var Tm = j(7, 27);
    var Am = j(8, 28);
    var Rm = j(9, 29);
    var Cm = j(30, 39);
    var Ye = j(31, 39);
    var Ui = j(32, 39);
    var Bi = j(33, 39);
    var qi = j(34, 39);
    var Sm = j(35, 39);
    var Vi = j(36, 39);
    var Im = j(37, 39);
    var $i = j(90, 39);
    var Om = j(90, 39);
    var km = j(40, 49);
    var Dm = j(41, 49);
    var Mm = j(42, 49);
    var _m = j(43, 49);
    var Nm = j(44, 49);
    var Fm = j(45, 49);
    var Lm = j(46, 49);
    var Um = j(47, 49);
    f2();
    u();
    c();
    p2();
    m();
    var el = 100;
    var ji = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var fr = [];
    var Gi = Date.now();
    var tl = 0;
    var En = typeof y < "u" ? y.env : {};
    globalThis.DEBUG ??= En.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= En.DEBUG_COLORS ? En.DEBUG_COLORS === "true" : true;
    var At = { enable(e) {
      typeof e == "string" && (globalThis.DEBUG = e);
    }, disable() {
      let e = globalThis.DEBUG;
      return globalThis.DEBUG = "", e;
    }, enabled(e) {
      let t = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r = t.some((i) => i === "" || i[0] === "-" ? false : e.match(RegExp(i.split("*").join(".*") + "$"))), n = t.some((i) => i === "" || i[0] !== "-" ? false : e.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
      return r && !n;
    }, log: /* @__PURE__ */ __name((...e) => {
      let [t, r, ...n] = e;
      (console.warn ?? console.log)(`${t} ${r}`, ...n);
    }, "log"), formatters: {} };
    function rl(e) {
      let t = { color: ji[tl++ % ji.length], enabled: At.enabled(e), namespace: e, log: At.log, extend: /* @__PURE__ */ __name(() => {
      }, "extend") }, r = /* @__PURE__ */ __name((...n) => {
        let { enabled: i, namespace: o, color: s, log: a } = t;
        if (n.length !== 0 && fr.push([o, ...n]), fr.length > el && fr.shift(), At.enabled(o) || i) {
          let l2 = n.map((g) => typeof g == "string" ? g : nl(g)), d = `+${Date.now() - Gi}ms`;
          Gi = Date.now(), a(o, ...l2, d);
        }
      }, "r");
      return new Proxy(r, { get: /* @__PURE__ */ __name((n, i) => t[i], "get"), set: /* @__PURE__ */ __name((n, i, o) => t[i] = o, "set") });
    }
    __name(rl, "rl");
    var z = new Proxy(rl, { get: /* @__PURE__ */ __name((e, t) => At[t], "get"), set: /* @__PURE__ */ __name((e, t, r) => At[t] = r, "set") });
    function nl(e, t = 2) {
      let r = /* @__PURE__ */ new Set();
      return JSON.stringify(e, (n, i) => {
        if (typeof i == "object" && i !== null) {
          if (r.has(i)) return "[Circular *]";
          r.add(i);
        } else if (typeof i == "bigint") return i.toString();
        return i;
      }, t);
    }
    __name(nl, "nl");
    function Ji() {
      fr.length = 0;
    }
    __name(Ji, "Ji");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Ol = Zi();
    var xn = Ol.version;
    f2();
    u();
    c();
    p2();
    m();
    function Ze(e) {
      let t = kl();
      return t || (e?.config.engineType === "library" ? "library" : e?.config.engineType === "binary" ? "binary" : e?.config.engineType === "client" ? "client" : Dl());
    }
    __name(Ze, "Ze");
    function kl() {
      let e = y.env.PRISMA_CLIENT_ENGINE_TYPE;
      return e === "library" ? "library" : e === "binary" ? "binary" : e === "client" ? "client" : void 0;
    }
    __name(kl, "kl");
    function Dl() {
      return "library";
    }
    __name(Dl, "Dl");
    f2();
    u();
    c();
    p2();
    m();
    var eo = "prisma+postgres";
    var hr = `${eo}:`;
    function yr(e) {
      return e?.toString().startsWith(`${hr}//`) ?? false;
    }
    __name(yr, "yr");
    function vn(e) {
      if (!yr(e)) return false;
      let { host: t } = new URL(e);
      return t.includes("localhost") || t.includes("127.0.0.1") || t.includes("[::1]");
    }
    __name(vn, "vn");
    var Ct = {};
    vt(Ct, { error: /* @__PURE__ */ __name(() => Fl, "error"), info: /* @__PURE__ */ __name(() => Nl, "info"), log: /* @__PURE__ */ __name(() => _l, "log"), query: /* @__PURE__ */ __name(() => Ll, "query"), should: /* @__PURE__ */ __name(() => no, "should"), tags: /* @__PURE__ */ __name(() => Rt, "tags"), warn: /* @__PURE__ */ __name(() => Tn, "warn") });
    f2();
    u();
    c();
    p2();
    m();
    var Rt = { error: Ye("prisma:error"), warn: Bi("prisma:warn"), info: Vi("prisma:info"), query: qi("prisma:query") };
    var no = { warn: /* @__PURE__ */ __name(() => !y.env.PRISMA_DISABLE_WARNINGS, "warn") };
    function _l(...e) {
      console.log(...e);
    }
    __name(_l, "_l");
    function Tn(e, ...t) {
      no.warn() && console.warn(`${Rt.warn} ${e}`, ...t);
    }
    __name(Tn, "Tn");
    function Nl(e, ...t) {
      console.info(`${Rt.info} ${e}`, ...t);
    }
    __name(Nl, "Nl");
    function Fl(e, ...t) {
      console.error(`${Rt.error} ${e}`, ...t);
    }
    __name(Fl, "Fl");
    function Ll(e, ...t) {
      console.log(`${Rt.query} ${e}`, ...t);
    }
    __name(Ll, "Ll");
    f2();
    u();
    c();
    p2();
    m();
    function Ue(e, t) {
      throw new Error(t);
    }
    __name(Ue, "Ue");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function An({ onlyFirst: e = false } = {}) {
      let r = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
      return new RegExp(r, e ? void 0 : "g");
    }
    __name(An, "An");
    var Ul = An();
    function Rn(e) {
      if (typeof e != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);
      return e.replace(Ul, "");
    }
    __name(Rn, "Rn");
    f2();
    u();
    c();
    p2();
    m();
    function Cn(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }
    __name(Cn, "Cn");
    f2();
    u();
    c();
    p2();
    m();
    function wr(e, t) {
      let r = {};
      for (let n of Object.keys(e)) r[n] = t(e[n], n);
      return r;
    }
    __name(wr, "wr");
    f2();
    u();
    c();
    p2();
    m();
    function Sn(e, t) {
      if (e.length === 0) return;
      let r = e[0];
      for (let n = 1; n < e.length; n++) t(r, e[n]) < 0 && (r = e[n]);
      return r;
    }
    __name(Sn, "Sn");
    f2();
    u();
    c();
    p2();
    m();
    function N(e, t) {
      Object.defineProperty(e, "name", { value: t, configurable: true });
    }
    __name(N, "N");
    f2();
    u();
    c();
    p2();
    m();
    var io = /* @__PURE__ */ new Set();
    var St = /* @__PURE__ */ __name((e, t, ...r) => {
      io.has(e) || (io.add(e), Tn(t, ...r));
    }, "St");
    var Q = class e extends Error {
      static {
        __name(this, "e");
      }
      clientVersion;
      errorCode;
      retryable;
      constructor(t, r, n) {
        super(t), this.name = "PrismaClientInitializationError", this.clientVersion = r, this.errorCode = n, Error.captureStackTrace(e);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
      }
    };
    N(Q, "PrismaClientInitializationError");
    f2();
    u();
    c();
    p2();
    m();
    var ne = class extends Error {
      static {
        __name(this, "ne");
      }
      code;
      meta;
      clientVersion;
      batchRequestIdx;
      constructor(t, { code: r, clientVersion: n, meta: i, batchRequestIdx: o }) {
        super(t), this.name = "PrismaClientKnownRequestError", this.code = r, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
      }
    };
    N(ne, "PrismaClientKnownRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var Pe = class extends Error {
      static {
        __name(this, "Pe");
      }
      clientVersion;
      constructor(t, r) {
        super(t), this.name = "PrismaClientRustPanicError", this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
      }
    };
    N(Pe, "PrismaClientRustPanicError");
    f2();
    u();
    c();
    p2();
    m();
    var ie = class extends Error {
      static {
        __name(this, "ie");
      }
      clientVersion;
      batchRequestIdx;
      constructor(t, { clientVersion: r, batchRequestIdx: n }) {
        super(t), this.name = "PrismaClientUnknownRequestError", this.clientVersion = r, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
      }
    };
    N(ie, "PrismaClientUnknownRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var X = class extends Error {
      static {
        __name(this, "X");
      }
      name = "PrismaClientValidationError";
      clientVersion;
      constructor(t, { clientVersion: r }) {
        super(t), this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
      }
    };
    N(X, "PrismaClientValidationError");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var ge = class {
      static {
        __name(this, "ge");
      }
      _map = /* @__PURE__ */ new Map();
      get(t) {
        return this._map.get(t)?.value;
      }
      set(t, r) {
        this._map.set(t, { value: r });
      }
      getOrCreate(t, r) {
        let n = this._map.get(t);
        if (n) return n.value;
        let i = r();
        return this.set(t, i), i;
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function Ie(e) {
      return e.substring(0, 1).toLowerCase() + e.substring(1);
    }
    __name(Ie, "Ie");
    f2();
    u();
    c();
    p2();
    m();
    function so(e, t) {
      let r = {};
      for (let n of e) {
        let i = n[t];
        r[i] = n;
      }
      return r;
    }
    __name(so, "so");
    f2();
    u();
    c();
    p2();
    m();
    function It(e) {
      let t;
      return { get() {
        return t || (t = { value: e() }), t.value;
      } };
    }
    __name(It, "It");
    f2();
    u();
    c();
    p2();
    m();
    function ao(e) {
      return { models: In(e.models), enums: In(e.enums), types: In(e.types) };
    }
    __name(ao, "ao");
    function In(e) {
      let t = {};
      for (let { name: r, ...n } of e) t[r] = n;
      return t;
    }
    __name(In, "In");
    f2();
    u();
    c();
    p2();
    m();
    function Xe(e) {
      return e instanceof Date || Object.prototype.toString.call(e) === "[object Date]";
    }
    __name(Xe, "Xe");
    function Er(e) {
      return e.toString() !== "Invalid Date";
    }
    __name(Er, "Er");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var et = 9e15;
    var Me = 1e9;
    var On = "0123456789abcdef";
    var Pr = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
    var vr = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
    var kn = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -et, maxE: et, crypto: false };
    var po;
    var ve;
    var _ = true;
    var Ar = "[DecimalError] ";
    var De = Ar + "Invalid argument: ";
    var mo = Ar + "Precision limit exceeded";
    var fo = Ar + "crypto unavailable";
    var go = "[object Decimal]";
    var ee = Math.floor;
    var K = Math.pow;
    var Bl = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
    var ql = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
    var Vl = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
    var ho = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    var pe = 1e7;
    var D = 7;
    var $l = 9007199254740991;
    var jl = Pr.length - 1;
    var Dn = vr.length - 1;
    var R = { toStringTag: go };
    R.absoluteValue = R.abs = function() {
      var e = new this.constructor(this);
      return e.s < 0 && (e.s = 1), k2(e);
    };
    R.ceil = function() {
      return k2(new this.constructor(this), this.e + 1, 2);
    };
    R.clampedTo = R.clamp = function(e, t) {
      var r, n = this, i = n.constructor;
      if (e = new i(e), t = new i(t), !e.s || !t.s) return new i(NaN);
      if (e.gt(t)) throw Error(De + t);
      return r = n.cmp(e), r < 0 ? e : n.cmp(t) > 0 ? t : new i(n);
    };
    R.comparedTo = R.cmp = function(e) {
      var t, r, n, i, o = this, s = o.d, a = (e = new o.constructor(e)).d, l2 = o.s, d = e.s;
      if (!s || !a) return !l2 || !d ? NaN : l2 !== d ? l2 : s === a ? 0 : !s ^ l2 < 0 ? 1 : -1;
      if (!s[0] || !a[0]) return s[0] ? l2 : a[0] ? -d : 0;
      if (l2 !== d) return l2;
      if (o.e !== e.e) return o.e > e.e ^ l2 < 0 ? 1 : -1;
      for (n = s.length, i = a.length, t = 0, r = n < i ? n : i; t < r; ++t) if (s[t] !== a[t]) return s[t] > a[t] ^ l2 < 0 ? 1 : -1;
      return n === i ? 0 : n > i ^ l2 < 0 ? 1 : -1;
    };
    R.cosine = R.cos = function() {
      var e, t, r = this, n = r.constructor;
      return r.d ? r.d[0] ? (e = n.precision, t = n.rounding, n.precision = e + Math.max(r.e, r.sd()) + D, n.rounding = 1, r = Gl(n, xo(n, r)), n.precision = e, n.rounding = t, k2(ve == 2 || ve == 3 ? r.neg() : r, e, t, true)) : new n(1) : new n(NaN);
    };
    R.cubeRoot = R.cbrt = function() {
      var e, t, r, n, i, o, s, a, l2, d, g = this, h = g.constructor;
      if (!g.isFinite() || g.isZero()) return new h(g);
      for (_ = false, o = g.s * K(g.s * g, 1 / 3), !o || Math.abs(o) == 1 / 0 ? (r = Y(g.d), e = g.e, (o = (e - r.length + 1) % 3) && (r += o == 1 || o == -2 ? "0" : "00"), o = K(r, 1 / 3), e = ee((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), o == 1 / 0 ? r = "5e" + e : (r = o.toExponential(), r = r.slice(0, r.indexOf("e") + 1) + e), n = new h(r), n.s = g.s) : n = new h(o.toString()), s = (e = h.precision) + 3; ; ) if (a = n, l2 = a.times(a).times(a), d = l2.plus(g), n = V(d.plus(g).times(a), d.plus(l2), s + 2, 1), Y(a.d).slice(0, s) === (r = Y(n.d)).slice(0, s)) if (r = r.slice(s - 3, s + 1), r == "9999" || !i && r == "4999") {
        if (!i && (k2(a, e + 1, 0), a.times(a).times(a).eq(g))) {
          n = a;
          break;
        }
        s += 4, i = 1;
      } else {
        (!+r || !+r.slice(1) && r.charAt(0) == "5") && (k2(n, e + 1, 1), t = !n.times(n).times(n).eq(g));
        break;
      }
      return _ = true, k2(n, e, h.rounding, t);
    };
    R.decimalPlaces = R.dp = function() {
      var e, t = this.d, r = NaN;
      if (t) {
        if (e = t.length - 1, r = (e - ee(this.e / D)) * D, e = t[e], e) for (; e % 10 == 0; e /= 10) r--;
        r < 0 && (r = 0);
      }
      return r;
    };
    R.dividedBy = R.div = function(e) {
      return V(this, new this.constructor(e));
    };
    R.dividedToIntegerBy = R.divToInt = function(e) {
      var t = this, r = t.constructor;
      return k2(V(t, new r(e), 0, 1, 1), r.precision, r.rounding);
    };
    R.equals = R.eq = function(e) {
      return this.cmp(e) === 0;
    };
    R.floor = function() {
      return k2(new this.constructor(this), this.e + 1, 3);
    };
    R.greaterThan = R.gt = function(e) {
      return this.cmp(e) > 0;
    };
    R.greaterThanOrEqualTo = R.gte = function(e) {
      var t = this.cmp(e);
      return t == 1 || t === 0;
    };
    R.hyperbolicCosine = R.cosh = function() {
      var e, t, r, n, i, o = this, s = o.constructor, a = new s(1);
      if (!o.isFinite()) return new s(o.s ? 1 / 0 : NaN);
      if (o.isZero()) return a;
      r = s.precision, n = s.rounding, s.precision = r + Math.max(o.e, o.sd()) + 4, s.rounding = 1, i = o.d.length, i < 32 ? (e = Math.ceil(i / 3), t = (1 / Cr(4, e)).toString()) : (e = 16, t = "2.3283064365386962890625e-10"), o = tt(s, 1, o.times(t), new s(1), true);
      for (var l2, d = e, g = new s(8); d--; ) l2 = o.times(o), o = a.minus(l2.times(g.minus(l2.times(g))));
      return k2(o, s.precision = r, s.rounding = n, true);
    };
    R.hyperbolicSine = R.sinh = function() {
      var e, t, r, n, i = this, o = i.constructor;
      if (!i.isFinite() || i.isZero()) return new o(i);
      if (t = o.precision, r = o.rounding, o.precision = t + Math.max(i.e, i.sd()) + 4, o.rounding = 1, n = i.d.length, n < 3) i = tt(o, 2, i, i, true);
      else {
        e = 1.4 * Math.sqrt(n), e = e > 16 ? 16 : e | 0, i = i.times(1 / Cr(5, e)), i = tt(o, 2, i, i, true);
        for (var s, a = new o(5), l2 = new o(16), d = new o(20); e--; ) s = i.times(i), i = i.times(a.plus(s.times(l2.times(s).plus(d))));
      }
      return o.precision = t, o.rounding = r, k2(i, t, r, true);
    };
    R.hyperbolicTangent = R.tanh = function() {
      var e, t, r = this, n = r.constructor;
      return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 7, n.rounding = 1, V(r.sinh(), r.cosh(), n.precision = e, n.rounding = t)) : new n(r.s);
    };
    R.inverseCosine = R.acos = function() {
      var e = this, t = e.constructor, r = e.abs().cmp(1), n = t.precision, i = t.rounding;
      return r !== -1 ? r === 0 ? e.isNeg() ? he(t, n, i) : new t(0) : new t(NaN) : e.isZero() ? he(t, n + 4, i).times(0.5) : (t.precision = n + 6, t.rounding = 1, e = new t(1).minus(e).div(e.plus(1)).sqrt().atan(), t.precision = n, t.rounding = i, e.times(2));
    };
    R.inverseHyperbolicCosine = R.acosh = function() {
      var e, t, r = this, n = r.constructor;
      return r.lte(1) ? new n(r.eq(1) ? 0 : NaN) : r.isFinite() ? (e = n.precision, t = n.rounding, n.precision = e + Math.max(Math.abs(r.e), r.sd()) + 4, n.rounding = 1, _ = false, r = r.times(r).minus(1).sqrt().plus(r), _ = true, n.precision = e, n.rounding = t, r.ln()) : new n(r);
    };
    R.inverseHyperbolicSine = R.asinh = function() {
      var e, t, r = this, n = r.constructor;
      return !r.isFinite() || r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 2 * Math.max(Math.abs(r.e), r.sd()) + 6, n.rounding = 1, _ = false, r = r.times(r).plus(1).sqrt().plus(r), _ = true, n.precision = e, n.rounding = t, r.ln());
    };
    R.inverseHyperbolicTangent = R.atanh = function() {
      var e, t, r, n, i = this, o = i.constructor;
      return i.isFinite() ? i.e >= 0 ? new o(i.abs().eq(1) ? i.s / 0 : i.isZero() ? i : NaN) : (e = o.precision, t = o.rounding, n = i.sd(), Math.max(n, e) < 2 * -i.e - 1 ? k2(new o(i), e, t, true) : (o.precision = r = n - i.e, i = V(i.plus(1), new o(1).minus(i), r + e, 1), o.precision = e + 4, o.rounding = 1, i = i.ln(), o.precision = e, o.rounding = t, i.times(0.5))) : new o(NaN);
    };
    R.inverseSine = R.asin = function() {
      var e, t, r, n, i = this, o = i.constructor;
      return i.isZero() ? new o(i) : (t = i.abs().cmp(1), r = o.precision, n = o.rounding, t !== -1 ? t === 0 ? (e = he(o, r + 4, n).times(0.5), e.s = i.s, e) : new o(NaN) : (o.precision = r + 6, o.rounding = 1, i = i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan(), o.precision = r, o.rounding = n, i.times(2)));
    };
    R.inverseTangent = R.atan = function() {
      var e, t, r, n, i, o, s, a, l2, d = this, g = d.constructor, h = g.precision, T2 = g.rounding;
      if (d.isFinite()) {
        if (d.isZero()) return new g(d);
        if (d.abs().eq(1) && h + 4 <= Dn) return s = he(g, h + 4, T2).times(0.25), s.s = d.s, s;
      } else {
        if (!d.s) return new g(NaN);
        if (h + 4 <= Dn) return s = he(g, h + 4, T2).times(0.5), s.s = d.s, s;
      }
      for (g.precision = a = h + 10, g.rounding = 1, r = Math.min(28, a / D + 2 | 0), e = r; e; --e) d = d.div(d.times(d).plus(1).sqrt().plus(1));
      for (_ = false, t = Math.ceil(a / D), n = 1, l2 = d.times(d), s = new g(d), i = d; e !== -1; ) if (i = i.times(l2), o = s.minus(i.div(n += 2)), i = i.times(l2), s = o.plus(i.div(n += 2)), s.d[t] !== void 0) for (e = t; s.d[e] === o.d[e] && e--; ) ;
      return r && (s = s.times(2 << r - 1)), _ = true, k2(s, g.precision = h, g.rounding = T2, true);
    };
    R.isFinite = function() {
      return !!this.d;
    };
    R.isInteger = R.isInt = function() {
      return !!this.d && ee(this.e / D) > this.d.length - 2;
    };
    R.isNaN = function() {
      return !this.s;
    };
    R.isNegative = R.isNeg = function() {
      return this.s < 0;
    };
    R.isPositive = R.isPos = function() {
      return this.s > 0;
    };
    R.isZero = function() {
      return !!this.d && this.d[0] === 0;
    };
    R.lessThan = R.lt = function(e) {
      return this.cmp(e) < 0;
    };
    R.lessThanOrEqualTo = R.lte = function(e) {
      return this.cmp(e) < 1;
    };
    R.logarithm = R.log = function(e) {
      var t, r, n, i, o, s, a, l2, d = this, g = d.constructor, h = g.precision, T2 = g.rounding, I = 5;
      if (e == null) e = new g(10), t = true;
      else {
        if (e = new g(e), r = e.d, e.s < 0 || !r || !r[0] || e.eq(1)) return new g(NaN);
        t = e.eq(10);
      }
      if (r = d.d, d.s < 0 || !r || !r[0] || d.eq(1)) return new g(r && !r[0] ? -1 / 0 : d.s != 1 ? NaN : r ? 0 : 1 / 0);
      if (t) if (r.length > 1) o = true;
      else {
        for (i = r[0]; i % 10 === 0; ) i /= 10;
        o = i !== 1;
      }
      if (_ = false, a = h + I, s = ke(d, a), n = t ? Tr(g, a + 10) : ke(e, a), l2 = V(s, n, a, 1), Ot(l2.d, i = h, T2)) do
        if (a += 10, s = ke(d, a), n = t ? Tr(g, a + 10) : ke(e, a), l2 = V(s, n, a, 1), !o) {
          +Y(l2.d).slice(i + 1, i + 15) + 1 == 1e14 && (l2 = k2(l2, h + 1, 0));
          break;
        }
      while (Ot(l2.d, i += 10, T2));
      return _ = true, k2(l2, h, T2);
    };
    R.minus = R.sub = function(e) {
      var t, r, n, i, o, s, a, l2, d, g, h, T2, I = this, S2 = I.constructor;
      if (e = new S2(e), !I.d || !e.d) return !I.s || !e.s ? e = new S2(NaN) : I.d ? e.s = -e.s : e = new S2(e.d || I.s !== e.s ? I : NaN), e;
      if (I.s != e.s) return e.s = -e.s, I.plus(e);
      if (d = I.d, T2 = e.d, a = S2.precision, l2 = S2.rounding, !d[0] || !T2[0]) {
        if (T2[0]) e.s = -e.s;
        else if (d[0]) e = new S2(I);
        else return new S2(l2 === 3 ? -0 : 0);
        return _ ? k2(e, a, l2) : e;
      }
      if (r = ee(e.e / D), g = ee(I.e / D), d = d.slice(), o = g - r, o) {
        for (h = o < 0, h ? (t = d, o = -o, s = T2.length) : (t = T2, r = g, s = d.length), n = Math.max(Math.ceil(a / D), s) + 2, o > n && (o = n, t.length = 1), t.reverse(), n = o; n--; ) t.push(0);
        t.reverse();
      } else {
        for (n = d.length, s = T2.length, h = n < s, h && (s = n), n = 0; n < s; n++) if (d[n] != T2[n]) {
          h = d[n] < T2[n];
          break;
        }
        o = 0;
      }
      for (h && (t = d, d = T2, T2 = t, e.s = -e.s), s = d.length, n = T2.length - s; n > 0; --n) d[s++] = 0;
      for (n = T2.length; n > o; ) {
        if (d[--n] < T2[n]) {
          for (i = n; i && d[--i] === 0; ) d[i] = pe - 1;
          --d[i], d[n] += pe;
        }
        d[n] -= T2[n];
      }
      for (; d[--s] === 0; ) d.pop();
      for (; d[0] === 0; d.shift()) --r;
      return d[0] ? (e.d = d, e.e = Rr(d, r), _ ? k2(e, a, l2) : e) : new S2(l2 === 3 ? -0 : 0);
    };
    R.modulo = R.mod = function(e) {
      var t, r = this, n = r.constructor;
      return e = new n(e), !r.d || !e.s || e.d && !e.d[0] ? new n(NaN) : !e.d || r.d && !r.d[0] ? k2(new n(r), n.precision, n.rounding) : (_ = false, n.modulo == 9 ? (t = V(r, e.abs(), 0, 3, 1), t.s *= e.s) : t = V(r, e, 0, n.modulo, 1), t = t.times(e), _ = true, r.minus(t));
    };
    R.naturalExponential = R.exp = function() {
      return Mn(this);
    };
    R.naturalLogarithm = R.ln = function() {
      return ke(this);
    };
    R.negated = R.neg = function() {
      var e = new this.constructor(this);
      return e.s = -e.s, k2(e);
    };
    R.plus = R.add = function(e) {
      var t, r, n, i, o, s, a, l2, d, g, h = this, T2 = h.constructor;
      if (e = new T2(e), !h.d || !e.d) return !h.s || !e.s ? e = new T2(NaN) : h.d || (e = new T2(e.d || h.s === e.s ? h : NaN)), e;
      if (h.s != e.s) return e.s = -e.s, h.minus(e);
      if (d = h.d, g = e.d, a = T2.precision, l2 = T2.rounding, !d[0] || !g[0]) return g[0] || (e = new T2(h)), _ ? k2(e, a, l2) : e;
      if (o = ee(h.e / D), n = ee(e.e / D), d = d.slice(), i = o - n, i) {
        for (i < 0 ? (r = d, i = -i, s = g.length) : (r = g, n = o, s = d.length), o = Math.ceil(a / D), s = o > s ? o + 1 : s + 1, i > s && (i = s, r.length = 1), r.reverse(); i--; ) r.push(0);
        r.reverse();
      }
      for (s = d.length, i = g.length, s - i < 0 && (i = s, r = g, g = d, d = r), t = 0; i; ) t = (d[--i] = d[i] + g[i] + t) / pe | 0, d[i] %= pe;
      for (t && (d.unshift(t), ++n), s = d.length; d[--s] == 0; ) d.pop();
      return e.d = d, e.e = Rr(d, n), _ ? k2(e, a, l2) : e;
    };
    R.precision = R.sd = function(e) {
      var t, r = this;
      if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(De + e);
      return r.d ? (t = yo(r.d), e && r.e + 1 > t && (t = r.e + 1)) : t = NaN, t;
    };
    R.round = function() {
      var e = this, t = e.constructor;
      return k2(new t(e), e.e + 1, t.rounding);
    };
    R.sine = R.sin = function() {
      var e, t, r = this, n = r.constructor;
      return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + Math.max(r.e, r.sd()) + D, n.rounding = 1, r = Ql(n, xo(n, r)), n.precision = e, n.rounding = t, k2(ve > 2 ? r.neg() : r, e, t, true)) : new n(NaN);
    };
    R.squareRoot = R.sqrt = function() {
      var e, t, r, n, i, o, s = this, a = s.d, l2 = s.e, d = s.s, g = s.constructor;
      if (d !== 1 || !a || !a[0]) return new g(!d || d < 0 && (!a || a[0]) ? NaN : a ? s : 1 / 0);
      for (_ = false, d = Math.sqrt(+s), d == 0 || d == 1 / 0 ? (t = Y(a), (t.length + l2) % 2 == 0 && (t += "0"), d = Math.sqrt(t), l2 = ee((l2 + 1) / 2) - (l2 < 0 || l2 % 2), d == 1 / 0 ? t = "5e" + l2 : (t = d.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + l2), n = new g(t)) : n = new g(d.toString()), r = (l2 = g.precision) + 3; ; ) if (o = n, n = o.plus(V(s, o, r + 2, 1)).times(0.5), Y(o.d).slice(0, r) === (t = Y(n.d)).slice(0, r)) if (t = t.slice(r - 3, r + 1), t == "9999" || !i && t == "4999") {
        if (!i && (k2(o, l2 + 1, 0), o.times(o).eq(s))) {
          n = o;
          break;
        }
        r += 4, i = 1;
      } else {
        (!+t || !+t.slice(1) && t.charAt(0) == "5") && (k2(n, l2 + 1, 1), e = !n.times(n).eq(s));
        break;
      }
      return _ = true, k2(n, l2, g.rounding, e);
    };
    R.tangent = R.tan = function() {
      var e, t, r = this, n = r.constructor;
      return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 10, n.rounding = 1, r = r.sin(), r.s = 1, r = V(r, new n(1).minus(r.times(r)).sqrt(), e + 10, 0), n.precision = e, n.rounding = t, k2(ve == 2 || ve == 4 ? r.neg() : r, e, t, true)) : new n(NaN);
    };
    R.times = R.mul = function(e) {
      var t, r, n, i, o, s, a, l2, d, g = this, h = g.constructor, T2 = g.d, I = (e = new h(e)).d;
      if (e.s *= g.s, !T2 || !T2[0] || !I || !I[0]) return new h(!e.s || T2 && !T2[0] && !I || I && !I[0] && !T2 ? NaN : !T2 || !I ? e.s / 0 : e.s * 0);
      for (r = ee(g.e / D) + ee(e.e / D), l2 = T2.length, d = I.length, l2 < d && (o = T2, T2 = I, I = o, s = l2, l2 = d, d = s), o = [], s = l2 + d, n = s; n--; ) o.push(0);
      for (n = d; --n >= 0; ) {
        for (t = 0, i = l2 + n; i > n; ) a = o[i] + I[n] * T2[i - n - 1] + t, o[i--] = a % pe | 0, t = a / pe | 0;
        o[i] = (o[i] + t) % pe | 0;
      }
      for (; !o[--s]; ) o.pop();
      return t ? ++r : o.shift(), e.d = o, e.e = Rr(o, r), _ ? k2(e, h.precision, h.rounding) : e;
    };
    R.toBinary = function(e, t) {
      return _n(this, 2, e, t);
    };
    R.toDecimalPlaces = R.toDP = function(e, t) {
      var r = this, n = r.constructor;
      return r = new n(r), e === void 0 ? r : (oe(e, 0, Me), t === void 0 ? t = n.rounding : oe(t, 0, 8), k2(r, e + r.e + 1, t));
    };
    R.toExponential = function(e, t) {
      var r, n = this, i = n.constructor;
      return e === void 0 ? r = ye(n, true) : (oe(e, 0, Me), t === void 0 ? t = i.rounding : oe(t, 0, 8), n = k2(new i(n), e + 1, t), r = ye(n, true, e + 1)), n.isNeg() && !n.isZero() ? "-" + r : r;
    };
    R.toFixed = function(e, t) {
      var r, n, i = this, o = i.constructor;
      return e === void 0 ? r = ye(i) : (oe(e, 0, Me), t === void 0 ? t = o.rounding : oe(t, 0, 8), n = k2(new o(i), e + i.e + 1, t), r = ye(n, false, e + n.e + 1)), i.isNeg() && !i.isZero() ? "-" + r : r;
    };
    R.toFraction = function(e) {
      var t, r, n, i, o, s, a, l2, d, g, h, T2, I = this, S2 = I.d, C = I.constructor;
      if (!S2) return new C(I);
      if (d = r = new C(1), n = l2 = new C(0), t = new C(n), o = t.e = yo(S2) - I.e - 1, s = o % D, t.d[0] = K(10, s < 0 ? D + s : s), e == null) e = o > 0 ? t : d;
      else {
        if (a = new C(e), !a.isInt() || a.lt(d)) throw Error(De + a);
        e = a.gt(t) ? o > 0 ? t : d : a;
      }
      for (_ = false, a = new C(Y(S2)), g = C.precision, C.precision = o = S2.length * D * 2; h = V(a, t, 0, 1, 1), i = r.plus(h.times(n)), i.cmp(e) != 1; ) r = n, n = i, i = d, d = l2.plus(h.times(i)), l2 = i, i = t, t = a.minus(h.times(i)), a = i;
      return i = V(e.minus(r), n, 0, 1, 1), l2 = l2.plus(i.times(d)), r = r.plus(i.times(n)), l2.s = d.s = I.s, T2 = V(d, n, o, 1).minus(I).abs().cmp(V(l2, r, o, 1).minus(I).abs()) < 1 ? [d, n] : [l2, r], C.precision = g, _ = true, T2;
    };
    R.toHexadecimal = R.toHex = function(e, t) {
      return _n(this, 16, e, t);
    };
    R.toNearest = function(e, t) {
      var r = this, n = r.constructor;
      if (r = new n(r), e == null) {
        if (!r.d) return r;
        e = new n(1), t = n.rounding;
      } else {
        if (e = new n(e), t === void 0 ? t = n.rounding : oe(t, 0, 8), !r.d) return e.s ? r : e;
        if (!e.d) return e.s && (e.s = r.s), e;
      }
      return e.d[0] ? (_ = false, r = V(r, e, 0, t, 1).times(e), _ = true, k2(r)) : (e.s = r.s, r = e), r;
    };
    R.toNumber = function() {
      return +this;
    };
    R.toOctal = function(e, t) {
      return _n(this, 8, e, t);
    };
    R.toPower = R.pow = function(e) {
      var t, r, n, i, o, s, a = this, l2 = a.constructor, d = +(e = new l2(e));
      if (!a.d || !e.d || !a.d[0] || !e.d[0]) return new l2(K(+a, d));
      if (a = new l2(a), a.eq(1)) return a;
      if (n = l2.precision, o = l2.rounding, e.eq(1)) return k2(a, n, o);
      if (t = ee(e.e / D), t >= e.d.length - 1 && (r = d < 0 ? -d : d) <= $l) return i = wo(l2, a, r, n), e.s < 0 ? new l2(1).div(i) : k2(i, n, o);
      if (s = a.s, s < 0) {
        if (t < e.d.length - 1) return new l2(NaN);
        if ((e.d[t] & 1) == 0 && (s = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1) return a.s = s, a;
      }
      return r = K(+a, d), t = r == 0 || !isFinite(r) ? ee(d * (Math.log("0." + Y(a.d)) / Math.LN10 + a.e + 1)) : new l2(r + "").e, t > l2.maxE + 1 || t < l2.minE - 1 ? new l2(t > 0 ? s / 0 : 0) : (_ = false, l2.rounding = a.s = 1, r = Math.min(12, (t + "").length), i = Mn(e.times(ke(a, n + r)), n), i.d && (i = k2(i, n + 5, 1), Ot(i.d, n, o) && (t = n + 10, i = k2(Mn(e.times(ke(a, t + r)), t), t + 5, 1), +Y(i.d).slice(n + 1, n + 15) + 1 == 1e14 && (i = k2(i, n + 1, 0)))), i.s = s, _ = true, l2.rounding = o, k2(i, n, o));
    };
    R.toPrecision = function(e, t) {
      var r, n = this, i = n.constructor;
      return e === void 0 ? r = ye(n, n.e <= i.toExpNeg || n.e >= i.toExpPos) : (oe(e, 1, Me), t === void 0 ? t = i.rounding : oe(t, 0, 8), n = k2(new i(n), e, t), r = ye(n, e <= n.e || n.e <= i.toExpNeg, e)), n.isNeg() && !n.isZero() ? "-" + r : r;
    };
    R.toSignificantDigits = R.toSD = function(e, t) {
      var r = this, n = r.constructor;
      return e === void 0 ? (e = n.precision, t = n.rounding) : (oe(e, 1, Me), t === void 0 ? t = n.rounding : oe(t, 0, 8)), k2(new n(r), e, t);
    };
    R.toString = function() {
      var e = this, t = e.constructor, r = ye(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
      return e.isNeg() && !e.isZero() ? "-" + r : r;
    };
    R.truncated = R.trunc = function() {
      return k2(new this.constructor(this), this.e + 1, 1);
    };
    R.valueOf = R.toJSON = function() {
      var e = this, t = e.constructor, r = ye(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
      return e.isNeg() ? "-" + r : r;
    };
    function Y(e) {
      var t, r, n, i = e.length - 1, o = "", s = e[0];
      if (i > 0) {
        for (o += s, t = 1; t < i; t++) n = e[t] + "", r = D - n.length, r && (o += Oe(r)), o += n;
        s = e[t], n = s + "", r = D - n.length, r && (o += Oe(r));
      } else if (s === 0) return "0";
      for (; s % 10 === 0; ) s /= 10;
      return o + s;
    }
    __name(Y, "Y");
    function oe(e, t, r) {
      if (e !== ~~e || e < t || e > r) throw Error(De + e);
    }
    __name(oe, "oe");
    function Ot(e, t, r, n) {
      var i, o, s, a;
      for (o = e[0]; o >= 10; o /= 10) --t;
      return --t < 0 ? (t += D, i = 0) : (i = Math.ceil((t + 1) / D), t %= D), o = K(10, D - t), a = e[i] % o | 0, n == null ? t < 3 ? (t == 0 ? a = a / 100 | 0 : t == 1 && (a = a / 10 | 0), s = r < 4 && a == 99999 || r > 3 && a == 49999 || a == 5e4 || a == 0) : s = (r < 4 && a + 1 == o || r > 3 && a + 1 == o / 2) && (e[i + 1] / o / 100 | 0) == K(10, t - 2) - 1 || (a == o / 2 || a == 0) && (e[i + 1] / o / 100 | 0) == 0 : t < 4 ? (t == 0 ? a = a / 1e3 | 0 : t == 1 ? a = a / 100 | 0 : t == 2 && (a = a / 10 | 0), s = (n || r < 4) && a == 9999 || !n && r > 3 && a == 4999) : s = ((n || r < 4) && a + 1 == o || !n && r > 3 && a + 1 == o / 2) && (e[i + 1] / o / 1e3 | 0) == K(10, t - 3) - 1, s;
    }
    __name(Ot, "Ot");
    function br(e, t, r) {
      for (var n, i = [0], o, s = 0, a = e.length; s < a; ) {
        for (o = i.length; o--; ) i[o] *= t;
        for (i[0] += On.indexOf(e.charAt(s++)), n = 0; n < i.length; n++) i[n] > r - 1 && (i[n + 1] === void 0 && (i[n + 1] = 0), i[n + 1] += i[n] / r | 0, i[n] %= r);
      }
      return i.reverse();
    }
    __name(br, "br");
    function Gl(e, t) {
      var r, n, i;
      if (t.isZero()) return t;
      n = t.d.length, n < 32 ? (r = Math.ceil(n / 3), i = (1 / Cr(4, r)).toString()) : (r = 16, i = "2.3283064365386962890625e-10"), e.precision += r, t = tt(e, 1, t.times(i), new e(1));
      for (var o = r; o--; ) {
        var s = t.times(t);
        t = s.times(s).minus(s).times(8).plus(1);
      }
      return e.precision -= r, t;
    }
    __name(Gl, "Gl");
    var V = /* @__PURE__ */ (function() {
      function e(n, i, o) {
        var s, a = 0, l2 = n.length;
        for (n = n.slice(); l2--; ) s = n[l2] * i + a, n[l2] = s % o | 0, a = s / o | 0;
        return a && n.unshift(a), n;
      }
      __name(e, "e");
      function t(n, i, o, s) {
        var a, l2;
        if (o != s) l2 = o > s ? 1 : -1;
        else for (a = l2 = 0; a < o; a++) if (n[a] != i[a]) {
          l2 = n[a] > i[a] ? 1 : -1;
          break;
        }
        return l2;
      }
      __name(t, "t");
      function r(n, i, o, s) {
        for (var a = 0; o--; ) n[o] -= a, a = n[o] < i[o] ? 1 : 0, n[o] = a * s + n[o] - i[o];
        for (; !n[0] && n.length > 1; ) n.shift();
      }
      __name(r, "r");
      return function(n, i, o, s, a, l2) {
        var d, g, h, T2, I, S2, C, M, F2, B, O, L, le, J, sn, or, Pt, an, ce, sr, ar = n.constructor, ln = n.s == i.s ? 1 : -1, Z = n.d, $ = i.d;
        if (!Z || !Z[0] || !$ || !$[0]) return new ar(!n.s || !i.s || (Z ? $ && Z[0] == $[0] : !$) ? NaN : Z && Z[0] == 0 || !$ ? ln * 0 : ln / 0);
        for (l2 ? (I = 1, g = n.e - i.e) : (l2 = pe, I = D, g = ee(n.e / I) - ee(i.e / I)), ce = $.length, Pt = Z.length, F2 = new ar(ln), B = F2.d = [], h = 0; $[h] == (Z[h] || 0); h++) ;
        if ($[h] > (Z[h] || 0) && g--, o == null ? (J = o = ar.precision, s = ar.rounding) : a ? J = o + (n.e - i.e) + 1 : J = o, J < 0) B.push(1), S2 = true;
        else {
          if (J = J / I + 2 | 0, h = 0, ce == 1) {
            for (T2 = 0, $ = $[0], J++; (h < Pt || T2) && J--; h++) sn = T2 * l2 + (Z[h] || 0), B[h] = sn / $ | 0, T2 = sn % $ | 0;
            S2 = T2 || h < Pt;
          } else {
            for (T2 = l2 / ($[0] + 1) | 0, T2 > 1 && ($ = e($, T2, l2), Z = e(Z, T2, l2), ce = $.length, Pt = Z.length), or = ce, O = Z.slice(0, ce), L = O.length; L < ce; ) O[L++] = 0;
            sr = $.slice(), sr.unshift(0), an = $[0], $[1] >= l2 / 2 && ++an;
            do
              T2 = 0, d = t($, O, ce, L), d < 0 ? (le = O[0], ce != L && (le = le * l2 + (O[1] || 0)), T2 = le / an | 0, T2 > 1 ? (T2 >= l2 && (T2 = l2 - 1), C = e($, T2, l2), M = C.length, L = O.length, d = t(C, O, M, L), d == 1 && (T2--, r(C, ce < M ? sr : $, M, l2))) : (T2 == 0 && (d = T2 = 1), C = $.slice()), M = C.length, M < L && C.unshift(0), r(O, C, L, l2), d == -1 && (L = O.length, d = t($, O, ce, L), d < 1 && (T2++, r(O, ce < L ? sr : $, L, l2))), L = O.length) : d === 0 && (T2++, O = [0]), B[h++] = T2, d && O[0] ? O[L++] = Z[or] || 0 : (O = [Z[or]], L = 1);
            while ((or++ < Pt || O[0] !== void 0) && J--);
            S2 = O[0] !== void 0;
          }
          B[0] || B.shift();
        }
        if (I == 1) F2.e = g, po = S2;
        else {
          for (h = 1, T2 = B[0]; T2 >= 10; T2 /= 10) h++;
          F2.e = h + g * I - 1, k2(F2, a ? o + F2.e + 1 : o, s, S2);
        }
        return F2;
      };
    })();
    function k2(e, t, r, n) {
      var i, o, s, a, l2, d, g, h, T2, I = e.constructor;
      e: if (t != null) {
        if (h = e.d, !h) return e;
        for (i = 1, a = h[0]; a >= 10; a /= 10) i++;
        if (o = t - i, o < 0) o += D, s = t, g = h[T2 = 0], l2 = g / K(10, i - s - 1) % 10 | 0;
        else if (T2 = Math.ceil((o + 1) / D), a = h.length, T2 >= a) if (n) {
          for (; a++ <= T2; ) h.push(0);
          g = l2 = 0, i = 1, o %= D, s = o - D + 1;
        } else break e;
        else {
          for (g = a = h[T2], i = 1; a >= 10; a /= 10) i++;
          o %= D, s = o - D + i, l2 = s < 0 ? 0 : g / K(10, i - s - 1) % 10 | 0;
        }
        if (n = n || t < 0 || h[T2 + 1] !== void 0 || (s < 0 ? g : g % K(10, i - s - 1)), d = r < 4 ? (l2 || n) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : l2 > 5 || l2 == 5 && (r == 4 || n || r == 6 && (o > 0 ? s > 0 ? g / K(10, i - s) : 0 : h[T2 - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7)), t < 1 || !h[0]) return h.length = 0, d ? (t -= e.e + 1, h[0] = K(10, (D - t % D) % D), e.e = -t || 0) : h[0] = e.e = 0, e;
        if (o == 0 ? (h.length = T2, a = 1, T2--) : (h.length = T2 + 1, a = K(10, D - o), h[T2] = s > 0 ? (g / K(10, i - s) % K(10, s) | 0) * a : 0), d) for (; ; ) if (T2 == 0) {
          for (o = 1, s = h[0]; s >= 10; s /= 10) o++;
          for (s = h[0] += a, a = 1; s >= 10; s /= 10) a++;
          o != a && (e.e++, h[0] == pe && (h[0] = 1));
          break;
        } else {
          if (h[T2] += a, h[T2] != pe) break;
          h[T2--] = 0, a = 1;
        }
        for (o = h.length; h[--o] === 0; ) h.pop();
      }
      return _ && (e.e > I.maxE ? (e.d = null, e.e = NaN) : e.e < I.minE && (e.e = 0, e.d = [0])), e;
    }
    __name(k2, "k");
    function ye(e, t, r) {
      if (!e.isFinite()) return bo(e);
      var n, i = e.e, o = Y(e.d), s = o.length;
      return t ? (r && (n = r - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + Oe(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (e.e < 0 ? "e" : "e+") + e.e) : i < 0 ? (o = "0." + Oe(-i - 1) + o, r && (n = r - s) > 0 && (o += Oe(n))) : i >= s ? (o += Oe(i + 1 - s), r && (n = r - i - 1) > 0 && (o = o + "." + Oe(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), r && (n = r - s) > 0 && (i + 1 === s && (o += "."), o += Oe(n))), o;
    }
    __name(ye, "ye");
    function Rr(e, t) {
      var r = e[0];
      for (t *= D; r >= 10; r /= 10) t++;
      return t;
    }
    __name(Rr, "Rr");
    function Tr(e, t, r) {
      if (t > jl) throw _ = true, r && (e.precision = r), Error(mo);
      return k2(new e(Pr), t, 1, true);
    }
    __name(Tr, "Tr");
    function he(e, t, r) {
      if (t > Dn) throw Error(mo);
      return k2(new e(vr), t, r, true);
    }
    __name(he, "he");
    function yo(e) {
      var t = e.length - 1, r = t * D + 1;
      if (t = e[t], t) {
        for (; t % 10 == 0; t /= 10) r--;
        for (t = e[0]; t >= 10; t /= 10) r++;
      }
      return r;
    }
    __name(yo, "yo");
    function Oe(e) {
      for (var t = ""; e--; ) t += "0";
      return t;
    }
    __name(Oe, "Oe");
    function wo(e, t, r, n) {
      var i, o = new e(1), s = Math.ceil(n / D + 4);
      for (_ = false; ; ) {
        if (r % 2 && (o = o.times(t), uo(o.d, s) && (i = true)), r = ee(r / 2), r === 0) {
          r = o.d.length - 1, i && o.d[r] === 0 && ++o.d[r];
          break;
        }
        t = t.times(t), uo(t.d, s);
      }
      return _ = true, o;
    }
    __name(wo, "wo");
    function lo(e) {
      return e.d[e.d.length - 1] & 1;
    }
    __name(lo, "lo");
    function Eo(e, t, r) {
      for (var n, i, o = new e(t[0]), s = 0; ++s < t.length; ) {
        if (i = new e(t[s]), !i.s) {
          o = i;
          break;
        }
        n = o.cmp(i), (n === r || n === 0 && o.s === r) && (o = i);
      }
      return o;
    }
    __name(Eo, "Eo");
    function Mn(e, t) {
      var r, n, i, o, s, a, l2, d = 0, g = 0, h = 0, T2 = e.constructor, I = T2.rounding, S2 = T2.precision;
      if (!e.d || !e.d[0] || e.e > 17) return new T2(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
      for (t == null ? (_ = false, l2 = S2) : l2 = t, a = new T2(0.03125); e.e > -2; ) e = e.times(a), h += 5;
      for (n = Math.log(K(2, h)) / Math.LN10 * 2 + 5 | 0, l2 += n, r = o = s = new T2(1), T2.precision = l2; ; ) {
        if (o = k2(o.times(e), l2, 1), r = r.times(++g), a = s.plus(V(o, r, l2, 1)), Y(a.d).slice(0, l2) === Y(s.d).slice(0, l2)) {
          for (i = h; i--; ) s = k2(s.times(s), l2, 1);
          if (t == null) if (d < 3 && Ot(s.d, l2 - n, I, d)) T2.precision = l2 += 10, r = o = a = new T2(1), g = 0, d++;
          else return k2(s, T2.precision = S2, I, _ = true);
          else return T2.precision = S2, s;
        }
        s = a;
      }
    }
    __name(Mn, "Mn");
    function ke(e, t) {
      var r, n, i, o, s, a, l2, d, g, h, T2, I = 1, S2 = 10, C = e, M = C.d, F2 = C.constructor, B = F2.rounding, O = F2.precision;
      if (C.s < 0 || !M || !M[0] || !C.e && M[0] == 1 && M.length == 1) return new F2(M && !M[0] ? -1 / 0 : C.s != 1 ? NaN : M ? 0 : C);
      if (t == null ? (_ = false, g = O) : g = t, F2.precision = g += S2, r = Y(M), n = r.charAt(0), Math.abs(o = C.e) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; ) C = C.times(e), r = Y(C.d), n = r.charAt(0), I++;
        o = C.e, n > 1 ? (C = new F2("0." + r), o++) : C = new F2(n + "." + r.slice(1));
      } else return d = Tr(F2, g + 2, O).times(o + ""), C = ke(new F2(n + "." + r.slice(1)), g - S2).plus(d), F2.precision = O, t == null ? k2(C, O, B, _ = true) : C;
      for (h = C, l2 = s = C = V(C.minus(1), C.plus(1), g, 1), T2 = k2(C.times(C), g, 1), i = 3; ; ) {
        if (s = k2(s.times(T2), g, 1), d = l2.plus(V(s, new F2(i), g, 1)), Y(d.d).slice(0, g) === Y(l2.d).slice(0, g)) if (l2 = l2.times(2), o !== 0 && (l2 = l2.plus(Tr(F2, g + 2, O).times(o + ""))), l2 = V(l2, new F2(I), g, 1), t == null) if (Ot(l2.d, g - S2, B, a)) F2.precision = g += S2, d = s = C = V(h.minus(1), h.plus(1), g, 1), T2 = k2(C.times(C), g, 1), i = a = 1;
        else return k2(l2, F2.precision = O, B, _ = true);
        else return F2.precision = O, l2;
        l2 = d, i += 2;
      }
    }
    __name(ke, "ke");
    function bo(e) {
      return String(e.s * e.s / 0);
    }
    __name(bo, "bo");
    function xr(e, t) {
      var r, n, i;
      for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; n++) ;
      for (i = t.length; t.charCodeAt(i - 1) === 48; --i) ;
      if (t = t.slice(n, i), t) {
        if (i -= n, e.e = r = r - n - 1, e.d = [], n = (r + 1) % D, r < 0 && (n += D), n < i) {
          for (n && e.d.push(+t.slice(0, n)), i -= D; n < i; ) e.d.push(+t.slice(n, n += D));
          t = t.slice(n), n = D - t.length;
        } else n -= i;
        for (; n--; ) t += "0";
        e.d.push(+t), _ && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [0]));
      } else e.e = 0, e.d = [0];
      return e;
    }
    __name(xr, "xr");
    function Jl(e, t) {
      var r, n, i, o, s, a, l2, d, g;
      if (t.indexOf("_") > -1) {
        if (t = t.replace(/(\d)_(?=\d)/g, "$1"), ho.test(t)) return xr(e, t);
      } else if (t === "Infinity" || t === "NaN") return +t || (e.s = NaN), e.e = NaN, e.d = null, e;
      if (ql.test(t)) r = 16, t = t.toLowerCase();
      else if (Bl.test(t)) r = 2;
      else if (Vl.test(t)) r = 8;
      else throw Error(De + t);
      for (o = t.search(/p/i), o > 0 ? (l2 = +t.slice(o + 1), t = t.substring(2, o)) : t = t.slice(2), o = t.indexOf("."), s = o >= 0, n = e.constructor, s && (t = t.replace(".", ""), a = t.length, o = a - o, i = wo(n, new n(r), o, o * 2)), d = br(t, r, pe), g = d.length - 1, o = g; d[o] === 0; --o) d.pop();
      return o < 0 ? new n(e.s * 0) : (e.e = Rr(d, g), e.d = d, _ = false, s && (e = V(e, i, a * 4)), l2 && (e = e.times(Math.abs(l2) < 54 ? K(2, l2) : Te.pow(2, l2))), _ = true, e);
    }
    __name(Jl, "Jl");
    function Ql(e, t) {
      var r, n = t.d.length;
      if (n < 3) return t.isZero() ? t : tt(e, 2, t, t);
      r = 1.4 * Math.sqrt(n), r = r > 16 ? 16 : r | 0, t = t.times(1 / Cr(5, r)), t = tt(e, 2, t, t);
      for (var i, o = new e(5), s = new e(16), a = new e(20); r--; ) i = t.times(t), t = t.times(o.plus(i.times(s.times(i).minus(a))));
      return t;
    }
    __name(Ql, "Ql");
    function tt(e, t, r, n, i) {
      var o, s, a, l2, d = 1, g = e.precision, h = Math.ceil(g / D);
      for (_ = false, l2 = r.times(r), a = new e(n); ; ) {
        if (s = V(a.times(l2), new e(t++ * t++), g, 1), a = i ? n.plus(s) : n.minus(s), n = V(s.times(l2), new e(t++ * t++), g, 1), s = a.plus(n), s.d[h] !== void 0) {
          for (o = h; s.d[o] === a.d[o] && o--; ) ;
          if (o == -1) break;
        }
        o = a, a = n, n = s, s = o, d++;
      }
      return _ = true, s.d.length = h + 1, s;
    }
    __name(tt, "tt");
    function Cr(e, t) {
      for (var r = e; --t; ) r *= e;
      return r;
    }
    __name(Cr, "Cr");
    function xo(e, t) {
      var r, n = t.s < 0, i = he(e, e.precision, 1), o = i.times(0.5);
      if (t = t.abs(), t.lte(o)) return ve = n ? 4 : 1, t;
      if (r = t.divToInt(i), r.isZero()) ve = n ? 3 : 2;
      else {
        if (t = t.minus(r.times(i)), t.lte(o)) return ve = lo(r) ? n ? 2 : 3 : n ? 4 : 1, t;
        ve = lo(r) ? n ? 1 : 4 : n ? 3 : 2;
      }
      return t.minus(i).abs();
    }
    __name(xo, "xo");
    function _n(e, t, r, n) {
      var i, o, s, a, l2, d, g, h, T2, I = e.constructor, S2 = r !== void 0;
      if (S2 ? (oe(r, 1, Me), n === void 0 ? n = I.rounding : oe(n, 0, 8)) : (r = I.precision, n = I.rounding), !e.isFinite()) g = bo(e);
      else {
        for (g = ye(e), s = g.indexOf("."), S2 ? (i = 2, t == 16 ? r = r * 4 - 3 : t == 8 && (r = r * 3 - 2)) : i = t, s >= 0 && (g = g.replace(".", ""), T2 = new I(1), T2.e = g.length - s, T2.d = br(ye(T2), 10, i), T2.e = T2.d.length), h = br(g, 10, i), o = l2 = h.length; h[--l2] == 0; ) h.pop();
        if (!h[0]) g = S2 ? "0p+0" : "0";
        else {
          if (s < 0 ? o-- : (e = new I(e), e.d = h, e.e = o, e = V(e, T2, r, n, 0, i), h = e.d, o = e.e, d = po), s = h[r], a = i / 2, d = d || h[r + 1] !== void 0, d = n < 4 ? (s !== void 0 || d) && (n === 0 || n === (e.s < 0 ? 3 : 2)) : s > a || s === a && (n === 4 || d || n === 6 && h[r - 1] & 1 || n === (e.s < 0 ? 8 : 7)), h.length = r, d) for (; ++h[--r] > i - 1; ) h[r] = 0, r || (++o, h.unshift(1));
          for (l2 = h.length; !h[l2 - 1]; --l2) ;
          for (s = 0, g = ""; s < l2; s++) g += On.charAt(h[s]);
          if (S2) {
            if (l2 > 1) if (t == 16 || t == 8) {
              for (s = t == 16 ? 4 : 3, --l2; l2 % s; l2++) g += "0";
              for (h = br(g, i, t), l2 = h.length; !h[l2 - 1]; --l2) ;
              for (s = 1, g = "1."; s < l2; s++) g += On.charAt(h[s]);
            } else g = g.charAt(0) + "." + g.slice(1);
            g = g + (o < 0 ? "p" : "p+") + o;
          } else if (o < 0) {
            for (; ++o; ) g = "0" + g;
            g = "0." + g;
          } else if (++o > l2) for (o -= l2; o--; ) g += "0";
          else o < l2 && (g = g.slice(0, o) + "." + g.slice(o));
        }
        g = (t == 16 ? "0x" : t == 2 ? "0b" : t == 8 ? "0o" : "") + g;
      }
      return e.s < 0 ? "-" + g : g;
    }
    __name(_n, "_n");
    function uo(e, t) {
      if (e.length > t) return e.length = t, true;
    }
    __name(uo, "uo");
    function Kl(e) {
      return new this(e).abs();
    }
    __name(Kl, "Kl");
    function Wl(e) {
      return new this(e).acos();
    }
    __name(Wl, "Wl");
    function Hl(e) {
      return new this(e).acosh();
    }
    __name(Hl, "Hl");
    function zl(e, t) {
      return new this(e).plus(t);
    }
    __name(zl, "zl");
    function Yl(e) {
      return new this(e).asin();
    }
    __name(Yl, "Yl");
    function Zl(e) {
      return new this(e).asinh();
    }
    __name(Zl, "Zl");
    function Xl(e) {
      return new this(e).atan();
    }
    __name(Xl, "Xl");
    function eu(e) {
      return new this(e).atanh();
    }
    __name(eu, "eu");
    function tu(e, t) {
      e = new this(e), t = new this(t);
      var r, n = this.precision, i = this.rounding, o = n + 4;
      return !e.s || !t.s ? r = new this(NaN) : !e.d && !t.d ? (r = he(this, o, 1).times(t.s > 0 ? 0.25 : 0.75), r.s = e.s) : !t.d || e.isZero() ? (r = t.s < 0 ? he(this, n, i) : new this(0), r.s = e.s) : !e.d || t.isZero() ? (r = he(this, o, 1).times(0.5), r.s = e.s) : t.s < 0 ? (this.precision = o, this.rounding = 1, r = this.atan(V(e, t, o, 1)), t = he(this, o, 1), this.precision = n, this.rounding = i, r = e.s < 0 ? r.minus(t) : r.plus(t)) : r = this.atan(V(e, t, o, 1)), r;
    }
    __name(tu, "tu");
    function ru(e) {
      return new this(e).cbrt();
    }
    __name(ru, "ru");
    function nu(e) {
      return k2(e = new this(e), e.e + 1, 2);
    }
    __name(nu, "nu");
    function iu(e, t, r) {
      return new this(e).clamp(t, r);
    }
    __name(iu, "iu");
    function ou(e) {
      if (!e || typeof e != "object") throw Error(Ar + "Object expected");
      var t, r, n, i = e.defaults === true, o = ["precision", 1, Me, "rounding", 0, 8, "toExpNeg", -et, 0, "toExpPos", 0, et, "maxE", 0, et, "minE", -et, 0, "modulo", 0, 9];
      for (t = 0; t < o.length; t += 3) if (r = o[t], i && (this[r] = kn[r]), (n = e[r]) !== void 0) if (ee(n) === n && n >= o[t + 1] && n <= o[t + 2]) this[r] = n;
      else throw Error(De + r + ": " + n);
      if (r = "crypto", i && (this[r] = kn[r]), (n = e[r]) !== void 0) if (n === true || n === false || n === 0 || n === 1) if (n) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[r] = true;
      else throw Error(fo);
      else this[r] = false;
      else throw Error(De + r + ": " + n);
      return this;
    }
    __name(ou, "ou");
    function su(e) {
      return new this(e).cos();
    }
    __name(su, "su");
    function au(e) {
      return new this(e).cosh();
    }
    __name(au, "au");
    function Po(e) {
      var t, r, n;
      function i(o) {
        var s, a, l2, d = this;
        if (!(d instanceof i)) return new i(o);
        if (d.constructor = i, co(o)) {
          d.s = o.s, _ ? !o.d || o.e > i.maxE ? (d.e = NaN, d.d = null) : o.e < i.minE ? (d.e = 0, d.d = [0]) : (d.e = o.e, d.d = o.d.slice()) : (d.e = o.e, d.d = o.d ? o.d.slice() : o.d);
          return;
        }
        if (l2 = typeof o, l2 === "number") {
          if (o === 0) {
            d.s = 1 / o < 0 ? -1 : 1, d.e = 0, d.d = [0];
            return;
          }
          if (o < 0 ? (o = -o, d.s = -1) : d.s = 1, o === ~~o && o < 1e7) {
            for (s = 0, a = o; a >= 10; a /= 10) s++;
            _ ? s > i.maxE ? (d.e = NaN, d.d = null) : s < i.minE ? (d.e = 0, d.d = [0]) : (d.e = s, d.d = [o]) : (d.e = s, d.d = [o]);
            return;
          }
          if (o * 0 !== 0) {
            o || (d.s = NaN), d.e = NaN, d.d = null;
            return;
          }
          return xr(d, o.toString());
        }
        if (l2 === "string") return (a = o.charCodeAt(0)) === 45 ? (o = o.slice(1), d.s = -1) : (a === 43 && (o = o.slice(1)), d.s = 1), ho.test(o) ? xr(d, o) : Jl(d, o);
        if (l2 === "bigint") return o < 0 ? (o = -o, d.s = -1) : d.s = 1, xr(d, o.toString());
        throw Error(De + o);
      }
      __name(i, "i");
      if (i.prototype = R, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.EUCLID = 9, i.config = i.set = ou, i.clone = Po, i.isDecimal = co, i.abs = Kl, i.acos = Wl, i.acosh = Hl, i.add = zl, i.asin = Yl, i.asinh = Zl, i.atan = Xl, i.atanh = eu, i.atan2 = tu, i.cbrt = ru, i.ceil = nu, i.clamp = iu, i.cos = su, i.cosh = au, i.div = lu, i.exp = uu, i.floor = cu, i.hypot = pu, i.ln = mu, i.log = fu, i.log10 = gu, i.log2 = du, i.max = hu, i.min = yu, i.mod = wu, i.mul = Eu, i.pow = bu, i.random = xu, i.round = Pu, i.sign = vu, i.sin = Tu, i.sinh = Au, i.sqrt = Ru, i.sub = Cu, i.sum = Su, i.tan = Iu, i.tanh = Ou, i.trunc = ku, e === void 0 && (e = {}), e && e.defaults !== true) for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
      return i.config(e), i;
    }
    __name(Po, "Po");
    function lu(e, t) {
      return new this(e).div(t);
    }
    __name(lu, "lu");
    function uu(e) {
      return new this(e).exp();
    }
    __name(uu, "uu");
    function cu(e) {
      return k2(e = new this(e), e.e + 1, 3);
    }
    __name(cu, "cu");
    function pu() {
      var e, t, r = new this(0);
      for (_ = false, e = 0; e < arguments.length; ) if (t = new this(arguments[e++]), t.d) r.d && (r = r.plus(t.times(t)));
      else {
        if (t.s) return _ = true, new this(1 / 0);
        r = t;
      }
      return _ = true, r.sqrt();
    }
    __name(pu, "pu");
    function co(e) {
      return e instanceof Te || e && e.toStringTag === go || false;
    }
    __name(co, "co");
    function mu(e) {
      return new this(e).ln();
    }
    __name(mu, "mu");
    function fu(e, t) {
      return new this(e).log(t);
    }
    __name(fu, "fu");
    function du(e) {
      return new this(e).log(2);
    }
    __name(du, "du");
    function gu(e) {
      return new this(e).log(10);
    }
    __name(gu, "gu");
    function hu() {
      return Eo(this, arguments, -1);
    }
    __name(hu, "hu");
    function yu() {
      return Eo(this, arguments, 1);
    }
    __name(yu, "yu");
    function wu(e, t) {
      return new this(e).mod(t);
    }
    __name(wu, "wu");
    function Eu(e, t) {
      return new this(e).mul(t);
    }
    __name(Eu, "Eu");
    function bu(e, t) {
      return new this(e).pow(t);
    }
    __name(bu, "bu");
    function xu(e) {
      var t, r, n, i, o = 0, s = new this(1), a = [];
      if (e === void 0 ? e = this.precision : oe(e, 1, Me), n = Math.ceil(e / D), this.crypto) if (crypto.getRandomValues) for (t = crypto.getRandomValues(new Uint32Array(n)); o < n; ) i = t[o], i >= 429e7 ? t[o] = crypto.getRandomValues(new Uint32Array(1))[0] : a[o++] = i % 1e7;
      else if (crypto.randomBytes) {
        for (t = crypto.randomBytes(n *= 4); o < n; ) i = t[o] + (t[o + 1] << 8) + (t[o + 2] << 16) + ((t[o + 3] & 127) << 24), i >= 214e7 ? crypto.randomBytes(4).copy(t, o) : (a.push(i % 1e7), o += 4);
        o = n / 4;
      } else throw Error(fo);
      else for (; o < n; ) a[o++] = Math.random() * 1e7 | 0;
      for (n = a[--o], e %= D, n && e && (i = K(10, D - e), a[o] = (n / i | 0) * i); a[o] === 0; o--) a.pop();
      if (o < 0) r = 0, a = [0];
      else {
        for (r = -1; a[0] === 0; r -= D) a.shift();
        for (n = 1, i = a[0]; i >= 10; i /= 10) n++;
        n < D && (r -= D - n);
      }
      return s.e = r, s.d = a, s;
    }
    __name(xu, "xu");
    function Pu(e) {
      return k2(e = new this(e), e.e + 1, this.rounding);
    }
    __name(Pu, "Pu");
    function vu(e) {
      return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
    }
    __name(vu, "vu");
    function Tu(e) {
      return new this(e).sin();
    }
    __name(Tu, "Tu");
    function Au(e) {
      return new this(e).sinh();
    }
    __name(Au, "Au");
    function Ru(e) {
      return new this(e).sqrt();
    }
    __name(Ru, "Ru");
    function Cu(e, t) {
      return new this(e).sub(t);
    }
    __name(Cu, "Cu");
    function Su() {
      var e = 0, t = arguments, r = new this(t[e]);
      for (_ = false; r.s && ++e < t.length; ) r = r.plus(t[e]);
      return _ = true, k2(r, this.precision, this.rounding);
    }
    __name(Su, "Su");
    function Iu(e) {
      return new this(e).tan();
    }
    __name(Iu, "Iu");
    function Ou(e) {
      return new this(e).tanh();
    }
    __name(Ou, "Ou");
    function ku(e) {
      return k2(e = new this(e), e.e + 1, 1);
    }
    __name(ku, "ku");
    R[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = R.toString;
    R[Symbol.toStringTag] = "Decimal";
    var Te = R.constructor = Po(kn);
    Pr = new Te(Pr);
    vr = new Te(vr);
    var Ae = Te;
    function rt(e) {
      return Te.isDecimal(e) ? true : e !== null && typeof e == "object" && typeof e.s == "number" && typeof e.e == "number" && typeof e.toFixed == "function" && Array.isArray(e.d);
    }
    __name(rt, "rt");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Dt = {};
    vt(Dt, { ModelAction: /* @__PURE__ */ __name(() => kt, "ModelAction"), datamodelEnumToSchemaEnum: /* @__PURE__ */ __name(() => Du, "datamodelEnumToSchemaEnum") });
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Du(e) {
      return { name: e.name, values: e.values.map((t) => t.name) };
    }
    __name(Du, "Du");
    f2();
    u();
    c();
    p2();
    m();
    var kt = ((O) => (O.findUnique = "findUnique", O.findUniqueOrThrow = "findUniqueOrThrow", O.findFirst = "findFirst", O.findFirstOrThrow = "findFirstOrThrow", O.findMany = "findMany", O.create = "create", O.createMany = "createMany", O.createManyAndReturn = "createManyAndReturn", O.update = "update", O.updateMany = "updateMany", O.updateManyAndReturn = "updateManyAndReturn", O.upsert = "upsert", O.delete = "delete", O.deleteMany = "deleteMany", O.groupBy = "groupBy", O.count = "count", O.aggregate = "aggregate", O.findRaw = "findRaw", O.aggregateRaw = "aggregateRaw", O))(kt || {});
    var Mu = Qe(ro());
    var _u = { red: Ye, gray: $i, dim: mr, bold: pr, underline: Li, highlightSource: /* @__PURE__ */ __name((e) => e.highlight(), "highlightSource") };
    var Nu = { red: /* @__PURE__ */ __name((e) => e, "red"), gray: /* @__PURE__ */ __name((e) => e, "gray"), dim: /* @__PURE__ */ __name((e) => e, "dim"), bold: /* @__PURE__ */ __name((e) => e, "bold"), underline: /* @__PURE__ */ __name((e) => e, "underline"), highlightSource: /* @__PURE__ */ __name((e) => e, "highlightSource") };
    function Fu({ message: e, originalMethod: t, isPanic: r, callArguments: n }) {
      return { functionName: `prisma.${t}()`, message: e, isPanic: r ?? false, callArguments: n };
    }
    __name(Fu, "Fu");
    function Lu({ functionName: e, location: t, message: r, isPanic: n, contextLines: i, callArguments: o }, s) {
      let a = [""], l2 = t ? " in" : ":";
      if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${l2}`))) : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${l2}`)), t && a.push(s.underline(Uu(t))), i) {
        a.push("");
        let d = [i.toString()];
        o && (d.push(o), d.push(s.dim(")"))), a.push(d.join("")), o && a.push("");
      } else a.push(""), o && a.push(o), a.push("");
      return a.push(r), a.join(`
`);
    }
    __name(Lu, "Lu");
    function Uu(e) {
      let t = [e.fileName];
      return e.lineNumber && t.push(String(e.lineNumber)), e.columnNumber && t.push(String(e.columnNumber)), t.join(":");
    }
    __name(Uu, "Uu");
    function Sr(e) {
      let t = e.showColors ? _u : Nu, r;
      return typeof $getTemplateParameters < "u" ? r = $getTemplateParameters(e, t) : r = Fu(e), Lu(r, t);
    }
    __name(Sr, "Sr");
    f2();
    u();
    c();
    p2();
    m();
    var ko = Qe(Nn());
    f2();
    u();
    c();
    p2();
    m();
    function Ro(e, t, r) {
      let n = Co(e), i = Bu(n), o = Vu(i);
      o ? Ir(o, t, r) : t.addErrorMessage(() => "Unknown error");
    }
    __name(Ro, "Ro");
    function Co(e) {
      return e.errors.flatMap((t) => t.kind === "Union" ? Co(t) : [t]);
    }
    __name(Co, "Co");
    function Bu(e) {
      let t = /* @__PURE__ */ new Map(), r = [];
      for (let n of e) {
        if (n.kind !== "InvalidArgumentType") {
          r.push(n);
          continue;
        }
        let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = t.get(i);
        o ? t.set(i, { ...n, argument: { ...n.argument, typeNames: qu(o.argument.typeNames, n.argument.typeNames) } }) : t.set(i, n);
      }
      return r.push(...t.values()), r;
    }
    __name(Bu, "Bu");
    function qu(e, t) {
      return [...new Set(e.concat(t))];
    }
    __name(qu, "qu");
    function Vu(e) {
      return Sn(e, (t, r) => {
        let n = To(t), i = To(r);
        return n !== i ? n - i : Ao(t) - Ao(r);
      });
    }
    __name(Vu, "Vu");
    function To(e) {
      let t = 0;
      return Array.isArray(e.selectionPath) && (t += e.selectionPath.length), Array.isArray(e.argumentPath) && (t += e.argumentPath.length), t;
    }
    __name(To, "To");
    function Ao(e) {
      switch (e.kind) {
        case "InvalidArgumentValue":
        case "ValueTooLarge":
          return 20;
        case "InvalidArgumentType":
          return 10;
        case "RequiredArgumentMissing":
          return -10;
        default:
          return 0;
      }
    }
    __name(Ao, "Ao");
    f2();
    u();
    c();
    p2();
    m();
    var ue = class {
      static {
        __name(this, "ue");
      }
      constructor(t, r) {
        this.name = t;
        this.value = r;
      }
      isRequired = false;
      makeRequired() {
        return this.isRequired = true, this;
      }
      write(t) {
        let { colors: { green: r } } = t.context;
        t.addMarginSymbol(r(this.isRequired ? "+" : "?")), t.write(r(this.name)), this.isRequired || t.write(r("?")), t.write(r(": ")), typeof this.value == "string" ? t.write(r(this.value)) : t.write(this.value);
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    Io();
    f2();
    u();
    c();
    p2();
    m();
    var nt = class {
      static {
        __name(this, "nt");
      }
      constructor(t = 0, r) {
        this.context = r;
        this.currentIndent = t;
      }
      lines = [];
      currentLine = "";
      currentIndent = 0;
      marginSymbol;
      afterNextNewLineCallback;
      write(t) {
        return typeof t == "string" ? this.currentLine += t : t.write(this), this;
      }
      writeJoined(t, r, n = (i, o) => o.write(i)) {
        let i = r.length - 1;
        for (let o = 0; o < r.length; o++) n(r[o], this), o !== i && this.write(t);
        return this;
      }
      writeLine(t) {
        return this.write(t).newLine();
      }
      newLine() {
        this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
        let t = this.afterNextNewLineCallback;
        return this.afterNextNewLineCallback = void 0, t?.(), this;
      }
      withIndent(t) {
        return this.indent(), t(this), this.unindent(), this;
      }
      afterNextNewline(t) {
        return this.afterNextNewLineCallback = t, this;
      }
      indent() {
        return this.currentIndent++, this;
      }
      unindent() {
        return this.currentIndent > 0 && this.currentIndent--, this;
      }
      addMarginSymbol(t) {
        return this.marginSymbol = t, this;
      }
      toString() {
        return this.lines.concat(this.indentedCurrentLine()).join(`
`);
      }
      getCurrentLineLength() {
        return this.currentLine.length;
      }
      indentedCurrentLine() {
        let t = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
        return this.marginSymbol ? this.marginSymbol + t.slice(1) : t;
      }
    };
    So();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Or = class {
      static {
        __name(this, "Or");
      }
      constructor(t) {
        this.value = t;
      }
      write(t) {
        t.write(this.value);
      }
      markAsError() {
        this.value.markAsError();
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var kr = /* @__PURE__ */ __name((e) => e, "kr");
    var Dr = { bold: kr, red: kr, green: kr, dim: kr, enabled: false };
    var Oo = { bold: pr, red: Ye, green: Ui, dim: mr, enabled: true };
    var it = { write(e) {
      e.writeLine(",");
    } };
    f2();
    u();
    c();
    p2();
    m();
    var we = class {
      static {
        __name(this, "we");
      }
      constructor(t) {
        this.contents = t;
      }
      isUnderlined = false;
      color = /* @__PURE__ */ __name((t) => t, "color");
      underline() {
        return this.isUnderlined = true, this;
      }
      setColor(t) {
        return this.color = t, this;
      }
      write(t) {
        let r = t.getCurrentLineLength();
        t.write(this.color(this.contents)), this.isUnderlined && t.afterNextNewline(() => {
          t.write(" ".repeat(r)).writeLine(this.color("~".repeat(this.contents.length)));
        });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var _e = class {
      static {
        __name(this, "_e");
      }
      hasError = false;
      markAsError() {
        return this.hasError = true, this;
      }
    };
    var ot = class extends _e {
      static {
        __name(this, "ot");
      }
      items = [];
      addItem(t) {
        return this.items.push(new Or(t)), this;
      }
      getField(t) {
        return this.items[t];
      }
      getPrintWidth() {
        return this.items.length === 0 ? 2 : Math.max(...this.items.map((r) => r.value.getPrintWidth())) + 2;
      }
      write(t) {
        if (this.items.length === 0) {
          this.writeEmpty(t);
          return;
        }
        this.writeWithItems(t);
      }
      writeEmpty(t) {
        let r = new we("[]");
        this.hasError && r.setColor(t.context.colors.red).underline(), t.write(r);
      }
      writeWithItems(t) {
        let { colors: r } = t.context;
        t.writeLine("[").withIndent(() => t.writeJoined(it, this.items).newLine()).write("]"), this.hasError && t.afterNextNewline(() => {
          t.writeLine(r.red("~".repeat(this.getPrintWidth())));
        });
      }
      asObject() {
      }
    };
    var st = class e extends _e {
      static {
        __name(this, "e");
      }
      fields = {};
      suggestions = [];
      addField(t) {
        this.fields[t.name] = t;
      }
      addSuggestion(t) {
        this.suggestions.push(t);
      }
      getField(t) {
        return this.fields[t];
      }
      getDeepField(t) {
        let [r, ...n] = t, i = this.getField(r);
        if (!i) return;
        let o = i;
        for (let s of n) {
          let a;
          if (o.value instanceof e ? a = o.value.getField(s) : o.value instanceof ot && (a = o.value.getField(Number(s))), !a) return;
          o = a;
        }
        return o;
      }
      getDeepFieldValue(t) {
        return t.length === 0 ? this : this.getDeepField(t)?.value;
      }
      hasField(t) {
        return !!this.getField(t);
      }
      removeAllFields() {
        this.fields = {};
      }
      removeField(t) {
        delete this.fields[t];
      }
      getFields() {
        return this.fields;
      }
      isEmpty() {
        return Object.keys(this.fields).length === 0;
      }
      getFieldValue(t) {
        return this.getField(t)?.value;
      }
      getDeepSubSelectionValue(t) {
        let r = this;
        for (let n of t) {
          if (!(r instanceof e)) return;
          let i = r.getSubSelectionValue(n);
          if (!i) return;
          r = i;
        }
        return r;
      }
      getDeepSelectionParent(t) {
        let r = this.getSelectionParent();
        if (!r) return;
        let n = r;
        for (let i of t) {
          let o = n.value.getFieldValue(i);
          if (!o || !(o instanceof e)) return;
          let s = o.getSelectionParent();
          if (!s) return;
          n = s;
        }
        return n;
      }
      getSelectionParent() {
        let t = this.getField("select")?.value.asObject();
        if (t) return { kind: "select", value: t };
        let r = this.getField("include")?.value.asObject();
        if (r) return { kind: "include", value: r };
      }
      getSubSelectionValue(t) {
        return this.getSelectionParent()?.value.fields[t].value;
      }
      getPrintWidth() {
        let t = Object.values(this.fields);
        return t.length == 0 ? 2 : Math.max(...t.map((n) => n.getPrintWidth())) + 2;
      }
      write(t) {
        let r = Object.values(this.fields);
        if (r.length === 0 && this.suggestions.length === 0) {
          this.writeEmpty(t);
          return;
        }
        this.writeWithContents(t, r);
      }
      asObject() {
        return this;
      }
      writeEmpty(t) {
        let r = new we("{}");
        this.hasError && r.setColor(t.context.colors.red).underline(), t.write(r);
      }
      writeWithContents(t, r) {
        t.writeLine("{").withIndent(() => {
          t.writeJoined(it, [...r, ...this.suggestions]).newLine();
        }), t.write("}"), this.hasError && t.afterNextNewline(() => {
          t.writeLine(t.context.colors.red("~".repeat(this.getPrintWidth())));
        });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var H = class extends _e {
      static {
        __name(this, "H");
      }
      constructor(r) {
        super();
        this.text = r;
      }
      getPrintWidth() {
        return this.text.length;
      }
      write(r) {
        let n = new we(this.text);
        this.hasError && n.underline().setColor(r.context.colors.red), r.write(n);
      }
      asObject() {
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var Mt = class {
      static {
        __name(this, "Mt");
      }
      fields = [];
      addField(t, r) {
        return this.fields.push({ write(n) {
          let { green: i, dim: o } = n.context.colors;
          n.write(i(o(`${t}: ${r}`))).addMarginSymbol(i(o("+")));
        } }), this;
      }
      write(t) {
        let { colors: { green: r } } = t.context;
        t.writeLine(r("{")).withIndent(() => {
          t.writeJoined(it, this.fields).newLine();
        }).write(r("}")).addMarginSymbol(r("+"));
      }
    };
    function Ir(e, t, r) {
      switch (e.kind) {
        case "MutuallyExclusiveFields":
          $u(e, t);
          break;
        case "IncludeOnScalar":
          ju(e, t);
          break;
        case "EmptySelection":
          Gu(e, t, r);
          break;
        case "UnknownSelectionField":
          Wu(e, t);
          break;
        case "InvalidSelectionValue":
          Hu(e, t);
          break;
        case "UnknownArgument":
          zu(e, t);
          break;
        case "UnknownInputField":
          Yu(e, t);
          break;
        case "RequiredArgumentMissing":
          Zu(e, t);
          break;
        case "InvalidArgumentType":
          Xu(e, t);
          break;
        case "InvalidArgumentValue":
          ec(e, t);
          break;
        case "ValueTooLarge":
          tc(e, t);
          break;
        case "SomeFieldsMissing":
          rc(e, t);
          break;
        case "TooManyFieldsGiven":
          nc(e, t);
          break;
        case "Union":
          Ro(e, t, r);
          break;
        default:
          throw new Error("not implemented: " + e.kind);
      }
    }
    __name(Ir, "Ir");
    function $u(e, t) {
      let r = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      r && (r.getField(e.firstField)?.markAsError(), r.getField(e.secondField)?.markAsError()), t.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);
    }
    __name($u, "$u");
    function ju(e, t) {
      let [r, n] = at(e.selectionPath), i = e.outputType, o = t.arguments.getDeepSelectionParent(r)?.value;
      if (o && (o.getField(n)?.markAsError(), i)) for (let s of i.fields) s.isRelation && o.addSuggestion(new ue(s.name, "true"));
      t.addErrorMessage((s) => {
        let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
        return i ? a += ` on model ${s.bold(i.name)}. ${_t(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
      });
    }
    __name(ju, "ju");
    function Gu(e, t, r) {
      let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getField("omit")?.value.asObject();
        if (i) {
          Ju(e, t, i);
          return;
        }
        if (n.hasField("select")) {
          Qu(e, t);
          return;
        }
      }
      if (r?.[Ie(e.outputType.name)]) {
        Ku(e, t);
        return;
      }
      t.addErrorMessage(() => `Unknown field at "${e.selectionPath.join(".")} selection"`);
    }
    __name(Gu, "Gu");
    function Ju(e, t, r) {
      r.removeAllFields();
      for (let n of e.outputType.fields) r.addSuggestion(new ue(n.name, "false"));
      t.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    __name(Ju, "Ju");
    function Qu(e, t) {
      let r = e.outputType, n = t.arguments.getDeepSelectionParent(e.selectionPath)?.value, i = n?.isEmpty() ?? false;
      n && (n.removeAllFields(), _o(n, r)), t.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(r.name)} must not be empty. ${_t(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(r.name)} needs ${o.bold("at least one truthy value")}.`);
    }
    __name(Qu, "Qu");
    function Ku(e, t) {
      let r = new Mt();
      for (let i of e.outputType.fields) i.isRelation || r.addField(i.name, "false");
      let n = new ue("omit", r).makeRequired();
      if (e.selectionPath.length === 0) t.arguments.addSuggestion(n);
      else {
        let [i, o] = at(e.selectionPath), a = t.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
        if (a) {
          let l2 = a?.value.asObject() ?? new st();
          l2.addSuggestion(n), a.value = l2;
        }
      }
      t.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    __name(Ku, "Ku");
    function Wu(e, t) {
      let r = No(e.selectionPath, t);
      if (r.parentKind !== "unknown") {
        r.field.markAsError();
        let n = r.parent;
        switch (r.parentKind) {
          case "select":
            _o(n, e.outputType);
            break;
          case "include":
            ic(n, e.outputType);
            break;
          case "omit":
            oc(n, e.outputType);
            break;
        }
      }
      t.addErrorMessage((n) => {
        let i = [`Unknown field ${n.red(`\`${r.fieldName}\``)}`];
        return r.parentKind !== "unknown" && i.push(`for ${n.bold(r.parentKind)} statement`), i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`), i.push(_t(n)), i.join(" ");
      });
    }
    __name(Wu, "Wu");
    function Hu(e, t) {
      let r = No(e.selectionPath, t);
      r.parentKind !== "unknown" && r.field.value.markAsError(), t.addErrorMessage((n) => `Invalid value for selection field \`${n.red(r.fieldName)}\`: ${e.underlyingError}`);
    }
    __name(Hu, "Hu");
    function zu(e, t) {
      let r = e.argumentPath[0], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && (n.getField(r)?.markAsError(), sc(n, e.arguments)), t.addErrorMessage((i) => Do(i, r, e.arguments.map((o) => o.name)));
    }
    __name(zu, "zu");
    function Yu(e, t) {
      let [r, n] = at(e.argumentPath), i = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (i) {
        i.getDeepField(e.argumentPath)?.markAsError();
        let o = i.getDeepFieldValue(r)?.asObject();
        o && Fo(o, e.inputType);
      }
      t.addErrorMessage((o) => Do(o, n, e.inputType.fields.map((s) => s.name)));
    }
    __name(Yu, "Yu");
    function Do(e, t, r) {
      let n = [`Unknown argument \`${e.red(t)}\`.`], i = lc(t, r);
      return i && n.push(`Did you mean \`${e.green(i)}\`?`), r.length > 0 && n.push(_t(e)), n.join(" ");
    }
    __name(Do, "Do");
    function Zu(e, t) {
      let r;
      t.addErrorMessage((l2) => r?.value instanceof H && r.value.text === "null" ? `Argument \`${l2.green(o)}\` must not be ${l2.red("null")}.` : `Argument \`${l2.green(o)}\` is missing.`);
      let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (!n) return;
      let [i, o] = at(e.argumentPath), s = new Mt(), a = n.getDeepFieldValue(i)?.asObject();
      if (a) {
        if (r = a.getField(o), r && a.removeField(o), e.inputTypes.length === 1 && e.inputTypes[0].kind === "object") {
          for (let l2 of e.inputTypes[0].fields) s.addField(l2.name, l2.typeNames.join(" | "));
          a.addSuggestion(new ue(o, s).makeRequired());
        } else {
          let l2 = e.inputTypes.map(Mo).join(" | ");
          a.addSuggestion(new ue(o, l2).makeRequired());
        }
        if (e.dependentArgumentPath) {
          n.getDeepField(e.dependentArgumentPath)?.markAsError();
          let [, l2] = at(e.dependentArgumentPath);
          t.addErrorMessage((d) => `Argument \`${d.green(o)}\` is required because argument \`${d.green(l2)}\` was provided.`);
        }
      }
    }
    __name(Zu, "Zu");
    function Mo(e) {
      return e.kind === "list" ? `${Mo(e.elementType)}[]` : e.name;
    }
    __name(Mo, "Mo");
    function Xu(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
        let o = Mr("or", e.argument.typeNames.map((s) => i.green(s)));
        return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`;
      });
    }
    __name(Xu, "Xu");
    function ec(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
        let o = [`Invalid value for argument \`${i.bold(r)}\``];
        if (e.underlyingError && o.push(`: ${e.underlyingError}`), o.push("."), e.argument.typeNames.length > 0) {
          let s = Mr("or", e.argument.typeNames.map((a) => i.green(a)));
          o.push(` Expected ${s}.`);
        }
        return o.join("");
      });
    }
    __name(ec, "ec");
    function tc(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i;
      if (n) {
        let s = n.getDeepField(e.argumentPath)?.value;
        s?.markAsError(), s instanceof H && (i = s.text);
      }
      t.addErrorMessage((o) => {
        let s = ["Unable to fit value"];
        return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``), s.join(" ");
      });
    }
    __name(tc, "tc");
    function rc(e, t) {
      let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getDeepFieldValue(e.argumentPath)?.asObject();
        i && Fo(i, e.inputType);
      }
      t.addErrorMessage((i) => {
        let o = [`Argument \`${i.bold(r)}\` of type ${i.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 ? e.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${Mr("or", e.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`), o.push(_t(i)), o.join(" ");
      });
    }
    __name(rc, "rc");
    function nc(e, t) {
      let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i = [];
      if (n) {
        let o = n.getDeepFieldValue(e.argumentPath)?.asObject();
        o && (o.markAsError(), i = Object.keys(o.getFields()));
      }
      t.addErrorMessage((o) => {
        let s = [`Argument \`${o.bold(r)}\` of type ${o.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 && e.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : e.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${Mr("and", i.map((a) => o.red(a)))}. Please choose`), e.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${e.constraints.maxFieldCount}.`), s.join(" ");
      });
    }
    __name(nc, "nc");
    function _o(e, t) {
      for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new ue(r.name, "true"));
    }
    __name(_o, "_o");
    function ic(e, t) {
      for (let r of t.fields) r.isRelation && !e.hasField(r.name) && e.addSuggestion(new ue(r.name, "true"));
    }
    __name(ic, "ic");
    function oc(e, t) {
      for (let r of t.fields) !e.hasField(r.name) && !r.isRelation && e.addSuggestion(new ue(r.name, "true"));
    }
    __name(oc, "oc");
    function sc(e, t) {
      for (let r of t) e.hasField(r.name) || e.addSuggestion(new ue(r.name, r.typeNames.join(" | ")));
    }
    __name(sc, "sc");
    function No(e, t) {
      let [r, n] = at(e), i = t.arguments.getDeepSubSelectionValue(r)?.asObject();
      if (!i) return { parentKind: "unknown", fieldName: n };
      let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), l2 = o?.getField(n);
      return o && l2 ? { parentKind: "select", parent: o, field: l2, fieldName: n } : (l2 = s?.getField(n), s && l2 ? { parentKind: "include", field: l2, parent: s, fieldName: n } : (l2 = a?.getField(n), a && l2 ? { parentKind: "omit", field: l2, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
    }
    __name(No, "No");
    function Fo(e, t) {
      if (t.kind === "object") for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new ue(r.name, r.typeNames.join(" | ")));
    }
    __name(Fo, "Fo");
    function at(e) {
      let t = [...e], r = t.pop();
      if (!r) throw new Error("unexpected empty path");
      return [t, r];
    }
    __name(at, "at");
    function _t({ green: e, enabled: t }) {
      return "Available options are " + (t ? `listed in ${e("green")}` : "marked with ?") + ".";
    }
    __name(_t, "_t");
    function Mr(e, t) {
      if (t.length === 1) return t[0];
      let r = [...t], n = r.pop();
      return `${r.join(", ")} ${e} ${n}`;
    }
    __name(Mr, "Mr");
    var ac = 3;
    function lc(e, t) {
      let r = 1 / 0, n;
      for (let i of t) {
        let o = (0, ko.default)(e, i);
        o > ac || o < r && (r = o, n = i);
      }
      return n;
    }
    __name(lc, "lc");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Nt = class {
      static {
        __name(this, "Nt");
      }
      modelName;
      name;
      typeName;
      isList;
      isEnum;
      constructor(t, r, n, i, o) {
        this.modelName = t, this.name = r, this.typeName = n, this.isList = i, this.isEnum = o;
      }
      _toGraphQLInputType() {
        let t = this.isList ? "List" : "", r = this.isEnum ? "Enum" : "";
        return `${t}${r}${this.typeName}FieldRefInput<${this.modelName}>`;
      }
    };
    function lt(e) {
      return e instanceof Nt;
    }
    __name(lt, "lt");
    f2();
    u();
    c();
    p2();
    m();
    var _r = /* @__PURE__ */ Symbol();
    var Ln = /* @__PURE__ */ new WeakMap();
    var Re = class {
      static {
        __name(this, "Re");
      }
      constructor(t) {
        t === _r ? Ln.set(this, `Prisma.${this._getName()}`) : Ln.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return Ln.get(this);
      }
    };
    var Ft = class extends Re {
      static {
        __name(this, "Ft");
      }
      _getNamespace() {
        return "NullTypes";
      }
    };
    var Lt = class extends Ft {
      static {
        __name(this, "Lt");
      }
      #e;
    };
    Un(Lt, "DbNull");
    var Ut = class extends Ft {
      static {
        __name(this, "Ut");
      }
      #e;
    };
    Un(Ut, "JsonNull");
    var Bt = class extends Ft {
      static {
        __name(this, "Bt");
      }
      #e;
    };
    Un(Bt, "AnyNull");
    var Nr = { classes: { DbNull: Lt, JsonNull: Ut, AnyNull: Bt }, instances: { DbNull: new Lt(_r), JsonNull: new Ut(_r), AnyNull: new Bt(_r) } };
    function Un(e, t) {
      Object.defineProperty(e, "name", { value: t, configurable: true });
    }
    __name(Un, "Un");
    f2();
    u();
    c();
    p2();
    m();
    var Lo = ": ";
    var Fr = class {
      static {
        __name(this, "Fr");
      }
      constructor(t, r) {
        this.name = t;
        this.value = r;
      }
      hasError = false;
      markAsError() {
        this.hasError = true;
      }
      getPrintWidth() {
        return this.name.length + this.value.getPrintWidth() + Lo.length;
      }
      write(t) {
        let r = new we(this.name);
        this.hasError && r.underline().setColor(t.context.colors.red), t.write(r).write(Lo).write(this.value);
      }
    };
    var Bn = class {
      static {
        __name(this, "Bn");
      }
      arguments;
      errorMessages = [];
      constructor(t) {
        this.arguments = t;
      }
      write(t) {
        t.write(this.arguments);
      }
      addErrorMessage(t) {
        this.errorMessages.push(t);
      }
      renderAllMessages(t) {
        return this.errorMessages.map((r) => r(t)).join(`
`);
      }
    };
    function ut(e) {
      return new Bn(Uo(e));
    }
    __name(ut, "ut");
    function Uo(e) {
      let t = new st();
      for (let [r, n] of Object.entries(e)) {
        let i = new Fr(r, Bo(n));
        t.addField(i);
      }
      return t;
    }
    __name(Uo, "Uo");
    function Bo(e) {
      if (typeof e == "string") return new H(JSON.stringify(e));
      if (typeof e == "number" || typeof e == "boolean") return new H(String(e));
      if (typeof e == "bigint") return new H(`${e}n`);
      if (e === null) return new H("null");
      if (e === void 0) return new H("undefined");
      if (rt(e)) return new H(`new Prisma.Decimal("${e.toFixed()}")`);
      if (e instanceof Uint8Array) return w2.Buffer.isBuffer(e) ? new H(`Buffer.alloc(${e.byteLength})`) : new H(`new Uint8Array(${e.byteLength})`);
      if (e instanceof Date) {
        let t = Er(e) ? e.toISOString() : "Invalid Date";
        return new H(`new Date("${t}")`);
      }
      return e instanceof Re ? new H(`Prisma.${e._getName()}`) : lt(e) ? new H(`prisma.${Ie(e.modelName)}.$fields.${e.name}`) : Array.isArray(e) ? uc(e) : typeof e == "object" ? Uo(e) : new H(Object.prototype.toString.call(e));
    }
    __name(Bo, "Bo");
    function uc(e) {
      let t = new ot();
      for (let r of e) t.addItem(Bo(r));
      return t;
    }
    __name(uc, "uc");
    function Lr(e, t) {
      let r = t === "pretty" ? Oo : Dr, n = e.renderAllMessages(r), i = new nt(0, { colors: r }).write(e).toString();
      return { message: n, args: i };
    }
    __name(Lr, "Lr");
    function Ur({ args: e, errors: t, errorFormat: r, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
      let a = ut(e);
      for (let h of t) Ir(h, a, s);
      let { message: l2, args: d } = Lr(a, r), g = Sr({ message: l2, callsite: n, originalMethod: i, showColors: r === "pretty", callArguments: d });
      throw new X(g, { clientVersion: o });
    }
    __name(Ur, "Ur");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Ee(e) {
      return e.replace(/^./, (t) => t.toLowerCase());
    }
    __name(Ee, "Ee");
    f2();
    u();
    c();
    p2();
    m();
    function Vo(e, t, r) {
      let n = Ee(r);
      return !t.result || !(t.result.$allModels || t.result[n]) ? e : cc({ ...e, ...qo(t.name, e, t.result.$allModels), ...qo(t.name, e, t.result[n]) });
    }
    __name(Vo, "Vo");
    function cc(e) {
      let t = new ge(), r = /* @__PURE__ */ __name((n, i) => t.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), e[n] ? e[n].needs.flatMap((o) => r(o, i)) : [n])), "r");
      return wr(e, (n) => ({ ...n, needs: r(n.name, /* @__PURE__ */ new Set()) }));
    }
    __name(cc, "cc");
    function qo(e, t, r) {
      return r ? wr(r, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: pc(t, o, i) })) : {};
    }
    __name(qo, "qo");
    function pc(e, t, r) {
      let n = e?.[t]?.compute;
      return n ? (i) => r({ ...i, [t]: n(i) }) : r;
    }
    __name(pc, "pc");
    function $o(e, t) {
      if (!t) return e;
      let r = { ...e };
      for (let n of Object.values(t)) if (e[n.name]) for (let i of n.needs) r[i] = true;
      return r;
    }
    __name($o, "$o");
    function jo(e, t) {
      if (!t) return e;
      let r = { ...e };
      for (let n of Object.values(t)) if (!e[n.name]) for (let i of n.needs) delete r[i];
      return r;
    }
    __name(jo, "jo");
    var Br = class {
      static {
        __name(this, "Br");
      }
      constructor(t, r) {
        this.extension = t;
        this.previous = r;
      }
      computedFieldsCache = new ge();
      modelExtensionsCache = new ge();
      queryCallbacksCache = new ge();
      clientExtensions = It(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
      batchCallbacks = It(() => {
        let t = this.previous?.getAllBatchQueryCallbacks() ?? [], r = this.extension.query?.$__internalBatch;
        return r ? t.concat(r) : t;
      });
      getAllComputedFields(t) {
        return this.computedFieldsCache.getOrCreate(t, () => Vo(this.previous?.getAllComputedFields(t), this.extension, t));
      }
      getAllClientExtensions() {
        return this.clientExtensions.get();
      }
      getAllModelExtensions(t) {
        return this.modelExtensionsCache.getOrCreate(t, () => {
          let r = Ee(t);
          return !this.extension.model || !(this.extension.model[r] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(t) : { ...this.previous?.getAllModelExtensions(t), ...this.extension.model.$allModels, ...this.extension.model[r] };
        });
      }
      getAllQueryCallbacks(t, r) {
        return this.queryCallbacksCache.getOrCreate(`${t}:${r}`, () => {
          let n = this.previous?.getAllQueryCallbacks(t, r) ?? [], i = [], o = this.extension.query;
          return !o || !(o[t] || o.$allModels || o[r] || o.$allOperations) ? n : (o[t] !== void 0 && (o[t][r] !== void 0 && i.push(o[t][r]), o[t].$allOperations !== void 0 && i.push(o[t].$allOperations)), t !== "$none" && o.$allModels !== void 0 && (o.$allModels[r] !== void 0 && i.push(o.$allModels[r]), o.$allModels.$allOperations !== void 0 && i.push(o.$allModels.$allOperations)), o[r] !== void 0 && i.push(o[r]), o.$allOperations !== void 0 && i.push(o.$allOperations), n.concat(i));
        });
      }
      getAllBatchQueryCallbacks() {
        return this.batchCallbacks.get();
      }
    };
    var ct = class e {
      static {
        __name(this, "e");
      }
      constructor(t) {
        this.head = t;
      }
      static empty() {
        return new e();
      }
      static single(t) {
        return new e(new Br(t));
      }
      isEmpty() {
        return this.head === void 0;
      }
      append(t) {
        return new e(new Br(t, this.head));
      }
      getAllComputedFields(t) {
        return this.head?.getAllComputedFields(t);
      }
      getAllClientExtensions() {
        return this.head?.getAllClientExtensions();
      }
      getAllModelExtensions(t) {
        return this.head?.getAllModelExtensions(t);
      }
      getAllQueryCallbacks(t, r) {
        return this.head?.getAllQueryCallbacks(t, r) ?? [];
      }
      getAllBatchQueryCallbacks() {
        return this.head?.getAllBatchQueryCallbacks() ?? [];
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var qr = class {
      static {
        __name(this, "qr");
      }
      constructor(t) {
        this.name = t;
      }
    };
    function Go(e) {
      return e instanceof qr;
    }
    __name(Go, "Go");
    function Jo(e) {
      return new qr(e);
    }
    __name(Jo, "Jo");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qo = /* @__PURE__ */ Symbol();
    var qt = class {
      static {
        __name(this, "qt");
      }
      constructor(t) {
        if (t !== Qo) throw new Error("Skip instance can not be constructed directly");
      }
      ifUndefined(t) {
        return t === void 0 ? Vr : t;
      }
    };
    var Vr = new qt(Qo);
    function be(e) {
      return e instanceof qt;
    }
    __name(be, "be");
    var mc = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", updateManyAndReturn: "updateManyAndReturn", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
    var Ko = "explicitly `undefined` values are not allowed";
    function $r({ modelName: e, action: t, args: r, runtimeDataModel: n, extensions: i = ct.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: l2, previewFeatures: d, globalOmit: g }) {
      let h = new qn({ runtimeDataModel: n, modelName: e, action: t, rootArgs: r, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: l2, previewFeatures: d, globalOmit: g });
      return { modelName: e, action: mc[t], query: Vt(r, h) };
    }
    __name($r, "$r");
    function Vt({ select: e, include: t, ...r } = {}, n) {
      let i = r.omit;
      return delete r.omit, { arguments: Ho(r, n), selection: fc(e, t, i, n) };
    }
    __name(Vt, "Vt");
    function fc(e, t, r, n) {
      return e ? (t ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : r && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), yc(e, n)) : dc(n, t, r);
    }
    __name(fc, "fc");
    function dc(e, t, r) {
      let n = {};
      return e.modelOrType && !e.isRawAction() && (n.$composites = true, n.$scalars = true), t && gc(n, t, e), hc(n, r, e), n;
    }
    __name(dc, "dc");
    function gc(e, t, r) {
      for (let [n, i] of Object.entries(t)) {
        if (be(i)) continue;
        let o = r.nestSelection(n);
        if (Vn(i, o), i === false || i === void 0) {
          e[n] = false;
          continue;
        }
        let s = r.findField(n);
        if (s && s.kind !== "object" && r.throwValidationError({ kind: "IncludeOnScalar", selectionPath: r.getSelectionPath().concat(n), outputType: r.getOutputTypeDescription() }), s) {
          e[n] = Vt(i === true ? {} : i, o);
          continue;
        }
        if (i === true) {
          e[n] = true;
          continue;
        }
        e[n] = Vt(i, o);
      }
    }
    __name(gc, "gc");
    function hc(e, t, r) {
      let n = r.getComputedFields(), i = { ...r.getGlobalOmit(), ...t }, o = jo(i, n);
      for (let [s, a] of Object.entries(o)) {
        if (be(a)) continue;
        Vn(a, r.nestSelection(s));
        let l2 = r.findField(s);
        n?.[s] && !l2 || (e[s] = !a);
      }
    }
    __name(hc, "hc");
    function yc(e, t) {
      let r = {}, n = t.getComputedFields(), i = $o(e, n);
      for (let [o, s] of Object.entries(i)) {
        if (be(s)) continue;
        let a = t.nestSelection(o);
        Vn(s, a);
        let l2 = t.findField(o);
        if (!(n?.[o] && !l2)) {
          if (s === false || s === void 0 || be(s)) {
            r[o] = false;
            continue;
          }
          if (s === true) {
            l2?.kind === "object" ? r[o] = Vt({}, a) : r[o] = true;
            continue;
          }
          r[o] = Vt(s, a);
        }
      }
      return r;
    }
    __name(yc, "yc");
    function Wo(e, t) {
      if (e === null) return null;
      if (typeof e == "string" || typeof e == "number" || typeof e == "boolean") return e;
      if (typeof e == "bigint") return { $type: "BigInt", value: String(e) };
      if (Xe(e)) {
        if (Er(e)) return { $type: "DateTime", value: e.toISOString() };
        t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
      }
      if (Go(e)) return { $type: "Param", value: e.name };
      if (lt(e)) return { $type: "FieldRef", value: { _ref: e.name, _container: e.modelName } };
      if (Array.isArray(e)) return wc(e, t);
      if (ArrayBuffer.isView(e)) {
        let { buffer: r, byteOffset: n, byteLength: i } = e;
        return { $type: "Bytes", value: w2.Buffer.from(r, n, i).toString("base64") };
      }
      if (Ec(e)) return e.values;
      if (rt(e)) return { $type: "Decimal", value: e.toFixed() };
      if (e instanceof Re) {
        if (e !== Nr.instances[e._getName()]) throw new Error("Invalid ObjectEnumValue");
        return { $type: "Enum", value: e._getName() };
      }
      if (bc(e)) return e.toJSON();
      if (typeof e == "object") return Ho(e, t);
      t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
    }
    __name(Wo, "Wo");
    function Ho(e, t) {
      if (e.$type) return { $type: "Raw", value: e };
      let r = {};
      for (let n in e) {
        let i = e[n], o = t.nestArgument(n);
        be(i) || (i !== void 0 ? r[n] = Wo(i, o) : t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: t.getSelectionPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: Ko }));
      }
      return r;
    }
    __name(Ho, "Ho");
    function wc(e, t) {
      let r = [];
      for (let n = 0; n < e.length; n++) {
        let i = t.nestArgument(String(n)), o = e[n];
        if (o === void 0 || be(o)) {
          let s = o === void 0 ? "undefined" : "Prisma.skip";
          t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${t.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
        }
        r.push(Wo(o, i));
      }
      return r;
    }
    __name(wc, "wc");
    function Ec(e) {
      return typeof e == "object" && e !== null && e.__prismaRawParameters__ === true;
    }
    __name(Ec, "Ec");
    function bc(e) {
      return typeof e == "object" && e !== null && typeof e.toJSON == "function";
    }
    __name(bc, "bc");
    function Vn(e, t) {
      e === void 0 && t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: t.getSelectionPath(), underlyingError: Ko });
    }
    __name(Vn, "Vn");
    var qn = class e {
      static {
        __name(this, "e");
      }
      constructor(t) {
        this.params = t;
        this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
      }
      modelOrType;
      throwValidationError(t) {
        Ur({ errors: [t], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
      }
      getSelectionPath() {
        return this.params.selectionPath;
      }
      getArgumentPath() {
        return this.params.argumentPath;
      }
      getArgumentName() {
        return this.params.argumentPath[this.params.argumentPath.length - 1];
      }
      getOutputTypeDescription() {
        if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((t) => ({ name: t.name, typeName: "boolean", isRelation: t.kind === "object" })) };
      }
      isRawAction() {
        return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
      }
      isPreviewFeatureOn(t) {
        return this.params.previewFeatures.includes(t);
      }
      getComputedFields() {
        if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
      }
      findField(t) {
        return this.modelOrType?.fields.find((r) => r.name === t);
      }
      nestSelection(t) {
        let r = this.findField(t), n = r?.kind === "object" ? r.type : void 0;
        return new e({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(t) });
      }
      getGlobalOmit() {
        return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[Ie(this.params.modelName)] ?? {} : {};
      }
      shouldApplyGlobalOmit() {
        switch (this.params.action) {
          case "findFirst":
          case "findFirstOrThrow":
          case "findUniqueOrThrow":
          case "findMany":
          case "upsert":
          case "findUnique":
          case "createManyAndReturn":
          case "create":
          case "update":
          case "updateManyAndReturn":
          case "delete":
            return true;
          case "executeRaw":
          case "aggregateRaw":
          case "runCommandRaw":
          case "findRaw":
          case "createMany":
          case "deleteMany":
          case "groupBy":
          case "updateMany":
          case "count":
          case "aggregate":
          case "queryRaw":
            return false;
          default:
            Ue(this.params.action, "Unknown action");
        }
      }
      nestArgument(t) {
        return new e({ ...this.params, argumentPath: this.params.argumentPath.concat(t) });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function zo(e) {
      if (!e._hasPreviewFlag("metrics")) throw new X("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: e._clientVersion });
    }
    __name(zo, "zo");
    var pt = class {
      static {
        __name(this, "pt");
      }
      _client;
      constructor(t) {
        this._client = t;
      }
      prometheus(t) {
        return zo(this._client), this._client._engine.metrics({ format: "prometheus", ...t });
      }
      json(t) {
        return zo(this._client), this._client._engine.metrics({ format: "json", ...t });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function Yo(e, t) {
      let r = It(() => xc(t));
      Object.defineProperty(e, "dmmf", { get: /* @__PURE__ */ __name(() => r.get(), "get") });
    }
    __name(Yo, "Yo");
    function xc(e) {
      return { datamodel: { models: $n(e.models), enums: $n(e.enums), types: $n(e.types) } };
    }
    __name(xc, "xc");
    function $n(e) {
      return Object.entries(e).map(([t, r]) => ({ name: t, ...r }));
    }
    __name($n, "$n");
    f2();
    u();
    c();
    p2();
    m();
    var jn = /* @__PURE__ */ new WeakMap();
    var jr = "$$PrismaTypedSql";
    var $t = class {
      static {
        __name(this, "$t");
      }
      constructor(t, r) {
        jn.set(this, { sql: t, values: r }), Object.defineProperty(this, jr, { value: jr });
      }
      get sql() {
        return jn.get(this).sql;
      }
      get values() {
        return jn.get(this).values;
      }
    };
    function Zo(e) {
      return (...t) => new $t(e, t);
    }
    __name(Zo, "Zo");
    function Gr(e) {
      return e != null && e[jr] === jr;
    }
    __name(Gr, "Gr");
    f2();
    u();
    c();
    p2();
    m();
    var ha = Qe(Pn());
    f2();
    u();
    c();
    p2();
    m();
    Xo();
    Ki();
    Yi();
    f2();
    u();
    c();
    p2();
    m();
    var se = class e {
      static {
        __name(this, "e");
      }
      constructor(t, r) {
        if (t.length - 1 !== r.length) throw t.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${t.length} strings to have ${t.length - 1} values`);
        let n = r.reduce((s, a) => s + (a instanceof e ? a.values.length : 1), 0);
        this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = t[0];
        let i = 0, o = 0;
        for (; i < r.length; ) {
          let s = r[i++], a = t[i];
          if (s instanceof e) {
            this.strings[o] += s.strings[0];
            let l2 = 0;
            for (; l2 < s.values.length; ) this.values[o++] = s.values[l2++], this.strings[o] = s.strings[l2];
            this.strings[o] += a;
          } else this.values[o++] = s, this.strings[o] = a;
        }
      }
      get sql() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `?${this.strings[r++]}`;
        return n;
      }
      get statement() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `:${r}${this.strings[r++]}`;
        return n;
      }
      get text() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `$${r}${this.strings[r++]}`;
        return n;
      }
      inspect() {
        return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
      }
    };
    function es(e, t = ",", r = "", n = "") {
      if (e.length === 0) throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
      return new se([r, ...Array(e.length - 1).fill(t), n], e);
    }
    __name(es, "es");
    function Gn(e) {
      return new se([e], []);
    }
    __name(Gn, "Gn");
    var ts = Gn("");
    function Jn(e, ...t) {
      return new se(e, t);
    }
    __name(Jn, "Jn");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function jt(e) {
      return { getKeys() {
        return Object.keys(e);
      }, getPropertyValue(t) {
        return e[t];
      } };
    }
    __name(jt, "jt");
    f2();
    u();
    c();
    p2();
    m();
    function te(e, t) {
      return { getKeys() {
        return [e];
      }, getPropertyValue() {
        return t();
      } };
    }
    __name(te, "te");
    f2();
    u();
    c();
    p2();
    m();
    function Be(e) {
      let t = new ge();
      return { getKeys() {
        return e.getKeys();
      }, getPropertyValue(r) {
        return t.getOrCreate(r, () => e.getPropertyValue(r));
      }, getPropertyDescriptor(r) {
        return e.getPropertyDescriptor?.(r);
      } };
    }
    __name(Be, "Be");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qr = { enumerable: true, configurable: true, writable: true };
    function Kr(e) {
      let t = new Set(e);
      return { getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf"), getOwnPropertyDescriptor: /* @__PURE__ */ __name(() => Qr, "getOwnPropertyDescriptor"), has: /* @__PURE__ */ __name((r, n) => t.has(n), "has"), set: /* @__PURE__ */ __name((r, n, i) => t.add(n) && Reflect.set(r, n, i), "set"), ownKeys: /* @__PURE__ */ __name(() => [...t], "ownKeys") };
    }
    __name(Kr, "Kr");
    var rs = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
    function me(e, t) {
      let r = Pc(t), n = /* @__PURE__ */ new Set(), i = new Proxy(e, { get(o, s) {
        if (n.has(s)) return o[s];
        let a = r.get(s);
        return a ? a.getPropertyValue(s) : o[s];
      }, has(o, s) {
        if (n.has(s)) return true;
        let a = r.get(s);
        return a ? a.has?.(s) ?? true : Reflect.has(o, s);
      }, ownKeys(o) {
        let s = ns(Reflect.ownKeys(o), r), a = ns(Array.from(r.keys()), r);
        return [.../* @__PURE__ */ new Set([...s, ...a, ...n])];
      }, set(o, s, a) {
        return r.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
      }, getOwnPropertyDescriptor(o, s) {
        let a = Reflect.getOwnPropertyDescriptor(o, s);
        if (a && !a.configurable) return a;
        let l2 = r.get(s);
        return l2 ? l2.getPropertyDescriptor ? { ...Qr, ...l2?.getPropertyDescriptor(s) } : Qr : a;
      }, defineProperty(o, s, a) {
        return n.add(s), Reflect.defineProperty(o, s, a);
      }, getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf") });
      return i[rs] = function() {
        let o = { ...this };
        return delete o[rs], o;
      }, i;
    }
    __name(me, "me");
    function Pc(e) {
      let t = /* @__PURE__ */ new Map();
      for (let r of e) {
        let n = r.getKeys();
        for (let i of n) t.set(i, r);
      }
      return t;
    }
    __name(Pc, "Pc");
    function ns(e, t) {
      return e.filter((r) => t.get(r)?.has?.(r) ?? true);
    }
    __name(ns, "ns");
    f2();
    u();
    c();
    p2();
    m();
    function mt(e) {
      return { getKeys() {
        return e;
      }, has() {
        return false;
      }, getPropertyValue() {
      } };
    }
    __name(mt, "mt");
    f2();
    u();
    c();
    p2();
    m();
    function Wr(e, t) {
      return { batch: e, transaction: t?.kind === "batch" ? { isolationLevel: t.options.isolationLevel } : void 0 };
    }
    __name(Wr, "Wr");
    f2();
    u();
    c();
    p2();
    m();
    function is(e) {
      if (e === void 0) return "";
      let t = ut(e);
      return new nt(0, { colors: Dr }).write(t).toString();
    }
    __name(is, "is");
    f2();
    u();
    c();
    p2();
    m();
    var vc = "P2037";
    function Hr({ error: e, user_facing_error: t }, r, n) {
      return t.error_code ? new ne(Tc(t, n), { code: t.error_code, clientVersion: r, meta: t.meta, batchRequestIdx: t.batch_request_idx }) : new ie(e, { clientVersion: r, batchRequestIdx: t.batch_request_idx });
    }
    __name(Hr, "Hr");
    function Tc(e, t) {
      let r = e.message;
      return (t === "postgresql" || t === "postgres" || t === "mysql") && e.error_code === vc && (r += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), r;
    }
    __name(Tc, "Tc");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qn = class {
      static {
        __name(this, "Qn");
      }
      getLocation() {
        return null;
      }
    };
    function Ne(e) {
      return typeof $EnabledCallSite == "function" && e !== "minimal" ? new $EnabledCallSite() : new Qn();
    }
    __name(Ne, "Ne");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var os = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
    function ft(e = {}) {
      let t = Rc(e);
      return Object.entries(t).reduce((n, [i, o]) => (os[i] !== void 0 ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
    }
    __name(ft, "ft");
    function Rc(e = {}) {
      return typeof e._count == "boolean" ? { ...e, _count: { _all: e._count } } : e;
    }
    __name(Rc, "Rc");
    function zr(e = {}) {
      return (t) => (typeof e._count == "boolean" && (t._count = t._count._all), t);
    }
    __name(zr, "zr");
    function ss(e, t) {
      let r = zr(e);
      return t({ action: "aggregate", unpacker: r, argsMapper: ft })(e);
    }
    __name(ss, "ss");
    f2();
    u();
    c();
    p2();
    m();
    function Cc(e = {}) {
      let { select: t, ...r } = e;
      return typeof t == "object" ? ft({ ...r, _count: t }) : ft({ ...r, _count: { _all: true } });
    }
    __name(Cc, "Cc");
    function Sc(e = {}) {
      return typeof e.select == "object" ? (t) => zr(e)(t)._count : (t) => zr(e)(t)._count._all;
    }
    __name(Sc, "Sc");
    function as(e, t) {
      return t({ action: "count", unpacker: Sc(e), argsMapper: Cc })(e);
    }
    __name(as, "as");
    f2();
    u();
    c();
    p2();
    m();
    function Ic(e = {}) {
      let t = ft(e);
      if (Array.isArray(t.by)) for (let r of t.by) typeof r == "string" && (t.select[r] = true);
      else typeof t.by == "string" && (t.select[t.by] = true);
      return t;
    }
    __name(Ic, "Ic");
    function Oc(e = {}) {
      return (t) => (typeof e?._count == "boolean" && t.forEach((r) => {
        r._count = r._count._all;
      }), t);
    }
    __name(Oc, "Oc");
    function ls(e, t) {
      return t({ action: "groupBy", unpacker: Oc(e), argsMapper: Ic })(e);
    }
    __name(ls, "ls");
    function us(e, t, r) {
      if (t === "aggregate") return (n) => ss(n, r);
      if (t === "count") return (n) => as(n, r);
      if (t === "groupBy") return (n) => ls(n, r);
    }
    __name(us, "us");
    f2();
    u();
    c();
    p2();
    m();
    function cs(e, t) {
      let r = t.fields.filter((i) => !i.relationName), n = so(r, "name");
      return new Proxy({}, { get(i, o) {
        if (o in i || typeof o == "symbol") return i[o];
        let s = n[o];
        if (s) return new Nt(e, o, s.type, s.isList, s.kind === "enum");
      }, ...Kr(Object.keys(n)) });
    }
    __name(cs, "cs");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var ps = /* @__PURE__ */ __name((e) => Array.isArray(e) ? e : e.split("."), "ps");
    var Kn = /* @__PURE__ */ __name((e, t) => ps(t).reduce((r, n) => r && r[n], e), "Kn");
    var ms = /* @__PURE__ */ __name((e, t, r) => ps(t).reduceRight((n, i, o, s) => Object.assign({}, Kn(e, s.slice(0, o)), { [i]: n }), r), "ms");
    function kc(e, t) {
      return e === void 0 || t === void 0 ? [] : [...t, "select", e];
    }
    __name(kc, "kc");
    function Dc(e, t, r) {
      return t === void 0 ? e ?? {} : ms(t, r, e || true);
    }
    __name(Dc, "Dc");
    function Wn(e, t, r, n, i, o) {
      let a = e._runtimeDataModel.models[t].fields.reduce((l2, d) => ({ ...l2, [d.name]: d }), {});
      return (l2) => {
        let d = Ne(e._errorFormat), g = kc(n, i), h = Dc(l2, o, g), T2 = r({ dataPath: g, callsite: d })(h), I = Mc(e, t);
        return new Proxy(T2, { get(S2, C) {
          if (!I.includes(C)) return S2[C];
          let F2 = [a[C].type, r, C], B = [g, h];
          return Wn(e, ...F2, ...B);
        }, ...Kr([...I, ...Object.getOwnPropertyNames(T2)]) });
      };
    }
    __name(Wn, "Wn");
    function Mc(e, t) {
      return e._runtimeDataModel.models[t].fields.filter((r) => r.kind === "object").map((r) => r.name);
    }
    __name(Mc, "Mc");
    var _c = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
    var Nc = ["aggregate", "count", "groupBy"];
    function Hn(e, t) {
      let r = e._extensions.getAllModelExtensions(t) ?? {}, n = [Fc(e, t), Uc(e, t), jt(r), te("name", () => t), te("$name", () => t), te("$parent", () => e._appliedParent)];
      return me({}, n);
    }
    __name(Hn, "Hn");
    function Fc(e, t) {
      let r = Ee(t), n = Object.keys(kt).concat("count");
      return { getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = i, s = /* @__PURE__ */ __name((a) => (l2) => {
          let d = Ne(e._errorFormat);
          return e._createPrismaPromise((g) => {
            let h = { args: l2, dataPath: [], action: o, model: t, clientMethod: `${r}.${i}`, jsModelName: r, transaction: g, callsite: d };
            return e._request({ ...h, ...a });
          }, { action: o, args: l2, model: t });
        }, "s");
        return _c.includes(o) ? Wn(e, t, s) : Lc(i) ? us(e, i, s) : s({});
      } };
    }
    __name(Fc, "Fc");
    function Lc(e) {
      return Nc.includes(e);
    }
    __name(Lc, "Lc");
    function Uc(e, t) {
      return Be(te("fields", () => {
        let r = e._runtimeDataModel.models[t];
        return cs(t, r);
      }));
    }
    __name(Uc, "Uc");
    f2();
    u();
    c();
    p2();
    m();
    function fs(e) {
      return e.replace(/^./, (t) => t.toUpperCase());
    }
    __name(fs, "fs");
    var zn = /* @__PURE__ */ Symbol();
    function Gt(e) {
      let t = [Bc(e), qc(e), te(zn, () => e), te("$parent", () => e._appliedParent)], r = e._extensions.getAllClientExtensions();
      return r && t.push(jt(r)), me(e, t);
    }
    __name(Gt, "Gt");
    function Bc(e) {
      let t = Object.getPrototypeOf(e._originalClient), r = [...new Set(Object.getOwnPropertyNames(t))];
      return { getKeys() {
        return r;
      }, getPropertyValue(n) {
        return e[n];
      } };
    }
    __name(Bc, "Bc");
    function qc(e) {
      let t = Object.keys(e._runtimeDataModel.models), r = t.map(Ee), n = [...new Set(t.concat(r))];
      return Be({ getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = fs(i);
        if (e._runtimeDataModel.models[o] !== void 0) return Hn(e, o);
        if (e._runtimeDataModel.models[i] !== void 0) return Hn(e, i);
      }, getPropertyDescriptor(i) {
        if (!r.includes(i)) return { enumerable: false };
      } });
    }
    __name(qc, "qc");
    function ds(e) {
      return e[zn] ? e[zn] : e;
    }
    __name(ds, "ds");
    function gs(e) {
      if (typeof e == "function") return e(this);
      if (e.client?.__AccelerateEngine) {
        let r = e.client.__AccelerateEngine;
        this._originalClient._engine = new r(this._originalClient._accelerateEngineConfig);
      }
      let t = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e) }, _appliedParent: { value: this, configurable: true }, $on: { value: void 0 } });
      return Gt(t);
    }
    __name(gs, "gs");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function hs({ result: e, modelName: t, select: r, omit: n, extensions: i }) {
      let o = i.getAllComputedFields(t);
      if (!o) return e;
      let s = [], a = [];
      for (let l2 of Object.values(o)) {
        if (n) {
          if (n[l2.name]) continue;
          let d = l2.needs.filter((g) => n[g]);
          d.length > 0 && a.push(mt(d));
        } else if (r) {
          if (!r[l2.name]) continue;
          let d = l2.needs.filter((g) => !r[g]);
          d.length > 0 && a.push(mt(d));
        }
        Vc(e, l2.needs) && s.push($c(l2, me(e, s)));
      }
      return s.length > 0 || a.length > 0 ? me(e, [...s, ...a]) : e;
    }
    __name(hs, "hs");
    function Vc(e, t) {
      return t.every((r) => Cn(e, r));
    }
    __name(Vc, "Vc");
    function $c(e, t) {
      return Be(te(e.name, () => e.compute(t)));
    }
    __name($c, "$c");
    f2();
    u();
    c();
    p2();
    m();
    function Yr({ visitor: e, result: t, args: r, runtimeDataModel: n, modelName: i }) {
      if (Array.isArray(t)) {
        for (let s = 0; s < t.length; s++) t[s] = Yr({ result: t[s], args: r, modelName: i, runtimeDataModel: n, visitor: e });
        return t;
      }
      let o = e(t, i, r) ?? t;
      return r.include && ys({ includeOrSelect: r.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), r.select && ys({ includeOrSelect: r.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), o;
    }
    __name(Yr, "Yr");
    function ys({ includeOrSelect: e, result: t, parentModelName: r, runtimeDataModel: n, visitor: i }) {
      for (let [o, s] of Object.entries(e)) {
        if (!s || t[o] == null || be(s)) continue;
        let l2 = n.models[r].fields.find((g) => g.name === o);
        if (!l2 || l2.kind !== "object" || !l2.relationName) continue;
        let d = typeof s == "object" ? s : {};
        t[o] = Yr({ visitor: i, result: t[o], args: d, modelName: l2.type, runtimeDataModel: n });
      }
    }
    __name(ys, "ys");
    function ws({ result: e, modelName: t, args: r, extensions: n, runtimeDataModel: i, globalOmit: o }) {
      return n.isEmpty() || e == null || typeof e != "object" || !i.models[t] ? e : Yr({ result: e, args: r ?? {}, modelName: t, runtimeDataModel: i, visitor: /* @__PURE__ */ __name((a, l2, d) => {
        let g = Ee(l2);
        return hs({ result: a, modelName: g, select: d.select, omit: d.select ? void 0 : { ...o?.[g], ...d.omit }, extensions: n });
      }, "visitor") });
    }
    __name(ws, "ws");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var jc = ["$connect", "$disconnect", "$on", "$transaction", "$extends"];
    var Es = jc;
    function bs(e) {
      if (e instanceof se) return Gc(e);
      if (Gr(e)) return Jc(e);
      if (Array.isArray(e)) {
        let r = [e[0]];
        for (let n = 1; n < e.length; n++) r[n] = Jt(e[n]);
        return r;
      }
      let t = {};
      for (let r in e) t[r] = Jt(e[r]);
      return t;
    }
    __name(bs, "bs");
    function Gc(e) {
      return new se(e.strings, e.values);
    }
    __name(Gc, "Gc");
    function Jc(e) {
      return new $t(e.sql, e.values);
    }
    __name(Jc, "Jc");
    function Jt(e) {
      if (typeof e != "object" || e == null || e instanceof Re || lt(e)) return e;
      if (rt(e)) return new Ae(e.toFixed());
      if (Xe(e)) return /* @__PURE__ */ new Date(+e);
      if (ArrayBuffer.isView(e)) return e.slice(0);
      if (Array.isArray(e)) {
        let t = e.length, r;
        for (r = Array(t); t--; ) r[t] = Jt(e[t]);
        return r;
      }
      if (typeof e == "object") {
        let t = {};
        for (let r in e) r === "__proto__" ? Object.defineProperty(t, r, { value: Jt(e[r]), configurable: true, enumerable: true, writable: true }) : t[r] = Jt(e[r]);
        return t;
      }
      Ue(e, "Unknown value");
    }
    __name(Jt, "Jt");
    function Ps(e, t, r, n = 0) {
      return e._createPrismaPromise((i) => {
        let o = t.customDataProxyFetch;
        return "transaction" in t && i !== void 0 && (t.transaction?.kind === "batch" && t.transaction.lock.then(), t.transaction = i), n === r.length ? e._executeRequest(t) : r[n]({ model: t.model, operation: t.model ? t.action : t.clientMethod, args: bs(t.args ?? {}), __internalParams: t, query: /* @__PURE__ */ __name((s, a = t) => {
          let l2 = a.customDataProxyFetch;
          return a.customDataProxyFetch = Rs(o, l2), a.args = s, Ps(e, a, r, n + 1);
        }, "query") });
      });
    }
    __name(Ps, "Ps");
    function vs(e, t) {
      let { jsModelName: r, action: n, clientMethod: i } = t, o = r ? n : i;
      if (e._extensions.isEmpty()) return e._executeRequest(t);
      let s = e._extensions.getAllQueryCallbacks(r ?? "$none", o);
      return Ps(e, t, s);
    }
    __name(vs, "vs");
    function Ts(e) {
      return (t) => {
        let r = { requests: t }, n = t[0].extensions.getAllBatchQueryCallbacks();
        return n.length ? As(r, n, 0, e) : e(r);
      };
    }
    __name(Ts, "Ts");
    function As(e, t, r, n) {
      if (r === t.length) return n(e);
      let i = e.customDataProxyFetch, o = e.requests[0].transaction;
      return t[r]({ args: { queries: e.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : void 0 } : void 0 }, __internalParams: e, query(s, a = e) {
        let l2 = a.customDataProxyFetch;
        return a.customDataProxyFetch = Rs(i, l2), As(a, t, r + 1, n);
      } });
    }
    __name(As, "As");
    var xs = /* @__PURE__ */ __name((e) => e, "xs");
    function Rs(e = xs, t = xs) {
      return (r) => e(t(r));
    }
    __name(Rs, "Rs");
    f2();
    u();
    c();
    p2();
    m();
    var Cs = z("prisma:client");
    var Ss = { Vercel: "vercel", "Netlify CI": "netlify" };
    function Is({ postinstall: e, ciName: t, clientVersion: r, generator: n }) {
      if (Cs("checkPlatformCaching:postinstall", e), Cs("checkPlatformCaching:ciName", t), e === true && !(n?.output && typeof (n.output.fromEnvVar ?? n.output.value) == "string") && t && t in Ss) {
        let i = `Prisma has detected that this project was built on ${t}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Ss[t]}-build`;
        throw console.error(i), new Q(i, r);
      }
    }
    __name(Is, "Is");
    f2();
    u();
    c();
    p2();
    m();
    function Os(e, t) {
      return e ? e.datasources ? e.datasources : e.datasourceUrl ? { [t[0]]: { url: e.datasourceUrl } } : {} : {};
    }
    __name(Os, "Os");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function ks(e, t) {
      throw new Error(t);
    }
    __name(ks, "ks");
    function Qc(e) {
      return e !== null && typeof e == "object" && typeof e.$type == "string";
    }
    __name(Qc, "Qc");
    function Kc(e, t) {
      let r = {};
      for (let n of Object.keys(e)) r[n] = t(e[n], n);
      return r;
    }
    __name(Kc, "Kc");
    function dt(e) {
      return e === null ? e : Array.isArray(e) ? e.map(dt) : typeof e == "object" ? Qc(e) ? Wc(e) : e.constructor !== null && e.constructor.name !== "Object" ? e : Kc(e, dt) : e;
    }
    __name(dt, "dt");
    function Wc({ $type: e, value: t }) {
      switch (e) {
        case "BigInt":
          return BigInt(t);
        case "Bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = w2.Buffer.from(t, "base64");
          return new Uint8Array(r, n, i);
        }
        case "DateTime":
          return new Date(t);
        case "Decimal":
          return new Te(t);
        case "Json":
          return JSON.parse(t);
        default:
          ks(t, "Unknown tagged value");
      }
    }
    __name(Wc, "Wc");
    var Ds = "6.16.0";
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var zc = /* @__PURE__ */ __name(() => globalThis.process?.release?.name === "node", "zc");
    var Yc = /* @__PURE__ */ __name(() => !!globalThis.Bun || !!globalThis.process?.versions?.bun, "Yc");
    var Zc = /* @__PURE__ */ __name(() => !!globalThis.Deno, "Zc");
    var Xc = /* @__PURE__ */ __name(() => typeof globalThis.Netlify == "object", "Xc");
    var ep = /* @__PURE__ */ __name(() => typeof globalThis.EdgeRuntime == "object", "ep");
    var tp = /* @__PURE__ */ __name(() => globalThis.navigator?.userAgent === "Cloudflare-Workers", "tp");
    function rp() {
      return [[Xc, "netlify"], [ep, "edge-light"], [tp, "workerd"], [Zc, "deno"], [Yc, "bun"], [zc, "node"]].flatMap((r) => r[0]() ? [r[1]] : []).at(0) ?? "";
    }
    __name(rp, "rp");
    var np = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
    function Zr() {
      let e = rp();
      return { id: e, prettyName: np[e] || e, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e) };
    }
    __name(Zr, "Zr");
    function gt({ inlineDatasources: e, overrideDatasources: t, env: r, clientVersion: n }) {
      let i, o = Object.keys(e)[0], s = e[o]?.url, a = t[o]?.url;
      if (o === void 0 ? i = void 0 : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = r[s.fromEnvVar]), s?.fromEnvVar !== void 0 && i === void 0) throw Zr().id === "workerd" ? new Q(`error: Environment variable not found: ${s.fromEnvVar}.

In Cloudflare module Workers, environment variables are available only in the Worker's \`env\` parameter of \`fetch\`.
To solve this, provide the connection string directly: https://pris.ly/d/cloudflare-datasource-url`, n) : new Q(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
      if (i === void 0) throw new Q("error: Missing URL environment variable, value, or override.", n);
      return i;
    }
    __name(gt, "gt");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Xr = class extends Error {
      static {
        __name(this, "Xr");
      }
      clientVersion;
      cause;
      constructor(t, r) {
        super(t), this.clientVersion = r.clientVersion, this.cause = r.cause;
      }
      get [Symbol.toStringTag]() {
        return this.name;
      }
    };
    var ae = class extends Xr {
      static {
        __name(this, "ae");
      }
      isRetryable;
      constructor(t, r) {
        super(t, r), this.isRetryable = r.isRetryable ?? true;
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function U(e, t) {
      return { ...e, isRetryable: t };
    }
    __name(U, "U");
    var qe = class extends ae {
      static {
        __name(this, "qe");
      }
      name = "InvalidDatasourceError";
      code = "P6001";
      constructor(t, r) {
        super(t, U(r, false));
      }
    };
    N(qe, "InvalidDatasourceError");
    function Ms(e) {
      let t = { clientVersion: e.clientVersion }, r = Object.keys(e.inlineDatasources)[0], n = gt({ inlineDatasources: e.inlineDatasources, overrideDatasources: e.overrideDatasources, clientVersion: e.clientVersion, env: { ...e.env, ...typeof y < "u" ? y.env : {} } }), i;
      try {
        i = new URL(n);
      } catch {
        throw new qe(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\``, t);
      }
      let { protocol: o, searchParams: s } = i;
      if (o !== "prisma:" && o !== hr) throw new qe(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\` or \`prisma+postgres://\``, t);
      let a = s.get("api_key");
      if (a === null || a.length < 1) throw new qe(`Error validating datasource \`${r}\`: the URL must contain a valid API key`, t);
      let l2 = vn(i) ? "http:" : "https:";
      y.env.TEST_CLIENT_ENGINE_REMOTE_EXECUTOR && i.searchParams.has("use_http") && (l2 = "http:");
      let d = new URL(i.href.replace(o, l2));
      return { apiKey: a, url: d };
    }
    __name(Ms, "Ms");
    f2();
    u();
    c();
    p2();
    m();
    var _s = Qe(Xi());
    var en = class {
      static {
        __name(this, "en");
      }
      apiKey;
      tracingHelper;
      logLevel;
      logQueries;
      engineHash;
      constructor({ apiKey: t, tracingHelper: r, logLevel: n, logQueries: i, engineHash: o }) {
        this.apiKey = t, this.tracingHelper = r, this.logLevel = n, this.logQueries = i, this.engineHash = o;
      }
      build({ traceparent: t, transactionId: r } = {}) {
        let n = { Accept: "application/json", Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "Prisma-Engine-Hash": this.engineHash, "Prisma-Engine-Version": _s.enginesVersion };
        this.tracingHelper.isEnabled() && (n.traceparent = t ?? this.tracingHelper.getTraceParent()), r && (n["X-Transaction-Id"] = r);
        let i = this.#e();
        return i.length > 0 && (n["X-Capture-Telemetry"] = i.join(", ")), n;
      }
      #e() {
        let t = [];
        return this.tracingHelper.isEnabled() && t.push("tracing"), this.logLevel && t.push(this.logLevel), this.logQueries && t.push("query"), t;
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function ip(e) {
      return e[0] * 1e3 + e[1] / 1e6;
    }
    __name(ip, "ip");
    function Yn(e) {
      return new Date(ip(e));
    }
    __name(Yn, "Yn");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var ht = class extends ae {
      static {
        __name(this, "ht");
      }
      name = "ForcedRetryError";
      code = "P5001";
      constructor(t) {
        super("This request must be retried", U(t, true));
      }
    };
    N(ht, "ForcedRetryError");
    f2();
    u();
    c();
    p2();
    m();
    var Ve = class extends ae {
      static {
        __name(this, "Ve");
      }
      name = "NotImplementedYetError";
      code = "P5004";
      constructor(t, r) {
        super(t, U(r, false));
      }
    };
    N(Ve, "NotImplementedYetError");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var G = class extends ae {
      static {
        __name(this, "G");
      }
      response;
      constructor(t, r) {
        super(t, r), this.response = r.response;
        let n = this.response.headers.get("prisma-request-id");
        if (n) {
          let i = `(The request id was: ${n})`;
          this.message = this.message + " " + i;
        }
      }
    };
    var $e = class extends G {
      static {
        __name(this, "$e");
      }
      name = "SchemaMissingError";
      code = "P5005";
      constructor(t) {
        super("Schema needs to be uploaded", U(t, true));
      }
    };
    N($e, "SchemaMissingError");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Zn = "This request could not be understood by the server";
    var Qt = class extends G {
      static {
        __name(this, "Qt");
      }
      name = "BadRequestError";
      code = "P5000";
      constructor(t, r, n) {
        super(r || Zn, U(t, false)), n && (this.code = n);
      }
    };
    N(Qt, "BadRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var Kt = class extends G {
      static {
        __name(this, "Kt");
      }
      name = "HealthcheckTimeoutError";
      code = "P5013";
      logs;
      constructor(t, r) {
        super("Engine not started: healthcheck timeout", U(t, true)), this.logs = r;
      }
    };
    N(Kt, "HealthcheckTimeoutError");
    f2();
    u();
    c();
    p2();
    m();
    var Wt = class extends G {
      static {
        __name(this, "Wt");
      }
      name = "EngineStartupError";
      code = "P5014";
      logs;
      constructor(t, r, n) {
        super(r, U(t, true)), this.logs = n;
      }
    };
    N(Wt, "EngineStartupError");
    f2();
    u();
    c();
    p2();
    m();
    var Ht = class extends G {
      static {
        __name(this, "Ht");
      }
      name = "EngineVersionNotSupportedError";
      code = "P5012";
      constructor(t) {
        super("Engine version is not supported", U(t, false));
      }
    };
    N(Ht, "EngineVersionNotSupportedError");
    f2();
    u();
    c();
    p2();
    m();
    var Xn = "Request timed out";
    var zt = class extends G {
      static {
        __name(this, "zt");
      }
      name = "GatewayTimeoutError";
      code = "P5009";
      constructor(t, r = Xn) {
        super(r, U(t, false));
      }
    };
    N(zt, "GatewayTimeoutError");
    f2();
    u();
    c();
    p2();
    m();
    var op = "Interactive transaction error";
    var Yt = class extends G {
      static {
        __name(this, "Yt");
      }
      name = "InteractiveTransactionError";
      code = "P5015";
      constructor(t, r = op) {
        super(r, U(t, false));
      }
    };
    N(Yt, "InteractiveTransactionError");
    f2();
    u();
    c();
    p2();
    m();
    var sp = "Request parameters are invalid";
    var Zt = class extends G {
      static {
        __name(this, "Zt");
      }
      name = "InvalidRequestError";
      code = "P5011";
      constructor(t, r = sp) {
        super(r, U(t, false));
      }
    };
    N(Zt, "InvalidRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var ei = "Requested resource does not exist";
    var Xt = class extends G {
      static {
        __name(this, "Xt");
      }
      name = "NotFoundError";
      code = "P5003";
      constructor(t, r = ei) {
        super(r, U(t, false));
      }
    };
    N(Xt, "NotFoundError");
    f2();
    u();
    c();
    p2();
    m();
    var ti = "Unknown server error";
    var yt = class extends G {
      static {
        __name(this, "yt");
      }
      name = "ServerError";
      code = "P5006";
      logs;
      constructor(t, r, n) {
        super(r || ti, U(t, true)), this.logs = n;
      }
    };
    N(yt, "ServerError");
    f2();
    u();
    c();
    p2();
    m();
    var ri = "Unauthorized, check your connection string";
    var er = class extends G {
      static {
        __name(this, "er");
      }
      name = "UnauthorizedError";
      code = "P5007";
      constructor(t, r = ri) {
        super(r, U(t, false));
      }
    };
    N(er, "UnauthorizedError");
    f2();
    u();
    c();
    p2();
    m();
    var ni = "Usage exceeded, retry again later";
    var tr = class extends G {
      static {
        __name(this, "tr");
      }
      name = "UsageExceededError";
      code = "P5008";
      constructor(t, r = ni) {
        super(r, U(t, true));
      }
    };
    N(tr, "UsageExceededError");
    async function ap(e) {
      let t;
      try {
        t = await e.text();
      } catch {
        return { type: "EmptyError" };
      }
      try {
        let r = JSON.parse(t);
        if (typeof r == "string") switch (r) {
          case "InternalDataProxyError":
            return { type: "DataProxyError", body: r };
          default:
            return { type: "UnknownTextError", body: r };
        }
        if (typeof r == "object" && r !== null) {
          if ("is_panic" in r && "message" in r && "error_code" in r) return { type: "QueryEngineError", body: r };
          if ("EngineNotStarted" in r || "InteractiveTransactionMisrouted" in r || "InvalidRequestError" in r) {
            let n = Object.values(r)[0].reason;
            return typeof n == "string" && !["SchemaMissing", "EngineVersionNotSupported"].includes(n) ? { type: "UnknownJsonError", body: r } : { type: "DataProxyError", body: r };
          }
        }
        return { type: "UnknownJsonError", body: r };
      } catch {
        return t === "" ? { type: "EmptyError" } : { type: "UnknownTextError", body: t };
      }
    }
    __name(ap, "ap");
    async function rr(e, t) {
      if (e.ok) return;
      let r = { clientVersion: t, response: e }, n = await ap(e);
      if (n.type === "QueryEngineError") throw new ne(n.body.message, { code: n.body.error_code, clientVersion: t });
      if (n.type === "DataProxyError") {
        if (n.body === "InternalDataProxyError") throw new yt(r, "Internal Data Proxy error");
        if ("EngineNotStarted" in n.body) {
          if (n.body.EngineNotStarted.reason === "SchemaMissing") return new $e(r);
          if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported") throw new Ht(r);
          if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
            throw new Wt(r, i, o);
          }
          if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
            throw new Q(i, t, o);
          }
          if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
            let { logs: i } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
            throw new Kt(r, i);
          }
        }
        if ("InteractiveTransactionMisrouted" in n.body) {
          let i = { IDParseError: "Could not parse interactive transaction ID", NoQueryEngineFoundError: "Could not find Query Engine for the specified host and transaction ID", TransactionStartError: "Could not start interactive transaction" };
          throw new Yt(r, i[n.body.InteractiveTransactionMisrouted.reason]);
        }
        if ("InvalidRequestError" in n.body) throw new Zt(r, n.body.InvalidRequestError.reason);
      }
      if (e.status === 401 || e.status === 403) throw new er(r, wt(ri, n));
      if (e.status === 404) return new Xt(r, wt(ei, n));
      if (e.status === 429) throw new tr(r, wt(ni, n));
      if (e.status === 504) throw new zt(r, wt(Xn, n));
      if (e.status >= 500) throw new yt(r, wt(ti, n));
      if (e.status >= 400) throw new Qt(r, wt(Zn, n));
    }
    __name(rr, "rr");
    function wt(e, t) {
      return t.type === "EmptyError" ? e : `${e}: ${JSON.stringify(t)}`;
    }
    __name(wt, "wt");
    f2();
    u();
    c();
    p2();
    m();
    function Ns(e) {
      let t = Math.pow(2, e) * 50, r = Math.ceil(Math.random() * t) - Math.ceil(t / 2), n = t + r;
      return new Promise((i) => setTimeout(() => i(n), n));
    }
    __name(Ns, "Ns");
    f2();
    u();
    c();
    p2();
    m();
    var Ce = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function Fs(e) {
      let t = new TextEncoder().encode(e), r = "", n = t.byteLength, i = n % 3, o = n - i, s, a, l2, d, g;
      for (let h = 0; h < o; h = h + 3) g = t[h] << 16 | t[h + 1] << 8 | t[h + 2], s = (g & 16515072) >> 18, a = (g & 258048) >> 12, l2 = (g & 4032) >> 6, d = g & 63, r += Ce[s] + Ce[a] + Ce[l2] + Ce[d];
      return i == 1 ? (g = t[o], s = (g & 252) >> 2, a = (g & 3) << 4, r += Ce[s] + Ce[a] + "==") : i == 2 && (g = t[o] << 8 | t[o + 1], s = (g & 64512) >> 10, a = (g & 1008) >> 4, l2 = (g & 15) << 2, r += Ce[s] + Ce[a] + Ce[l2] + "="), r;
    }
    __name(Fs, "Fs");
    f2();
    u();
    c();
    p2();
    m();
    function Ls(e) {
      if (!!e.generator?.previewFeatures.some((r) => r.toLowerCase().includes("metrics"))) throw new Q("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate", e.clientVersion);
    }
    __name(Ls, "Ls");
    f2();
    u();
    c();
    p2();
    m();
    var Us = { "@prisma/debug": "workspace:*", "@prisma/engines-version": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43", "@prisma/fetch-engine": "workspace:*", "@prisma/get-platform": "workspace:*" };
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var nr = class extends ae {
      static {
        __name(this, "nr");
      }
      name = "RequestError";
      code = "P5010";
      constructor(t, r) {
        super(`Cannot fetch data from service:
${t}`, U(r, true));
      }
    };
    N(nr, "RequestError");
    async function je(e, t, r = (n) => n) {
      let { clientVersion: n, ...i } = t, o = r(fetch);
      try {
        return await o(e, i);
      } catch (s) {
        let a = s.message ?? "Unknown error";
        throw new nr(a, { clientVersion: n, cause: s });
      }
    }
    __name(je, "je");
    var up = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
    var Bs = z("prisma:client:dataproxyEngine");
    async function cp(e, t) {
      let r = Us["@prisma/engines-version"], n = t.clientVersion ?? "unknown";
      if (y.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION) return y.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
      if (e.includes("accelerate") && n !== "0.0.0" && n !== "in-memory") return n;
      let [i, o] = n?.split("-") ?? [];
      if (o === void 0 && up.test(i)) return i;
      if (o !== void 0 || n === "0.0.0" || n === "in-memory") {
        let [s] = r.split("-") ?? [], [a, l2, d] = s.split("."), g = pp(`<=${a}.${l2}.${d}`), h = await je(g, { clientVersion: n });
        if (!h.ok) throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${h.status} ${h.statusText}, response body: ${await h.text() || "<empty body>"}`);
        let T2 = await h.text();
        Bs("length of body fetched from unpkg.com", T2.length);
        let I;
        try {
          I = JSON.parse(T2);
        } catch (S2) {
          throw console.error("JSON.parse error: body fetched from unpkg.com: ", T2), S2;
        }
        return I.version;
      }
      throw new Ve("Only `major.minor.patch` versions are supported by Accelerate.", { clientVersion: n });
    }
    __name(cp, "cp");
    async function qs(e, t) {
      let r = await cp(e, t);
      return Bs("version", r), r;
    }
    __name(qs, "qs");
    function pp(e) {
      return encodeURI(`https://unpkg.com/prisma@${e}/package.json`);
    }
    __name(pp, "pp");
    var Vs = 3;
    var ir = z("prisma:client:dataproxyEngine");
    var Et = class {
      static {
        __name(this, "Et");
      }
      name = "DataProxyEngine";
      inlineSchema;
      inlineSchemaHash;
      inlineDatasources;
      config;
      logEmitter;
      env;
      clientVersion;
      engineHash;
      tracingHelper;
      remoteClientVersion;
      host;
      headerBuilder;
      startPromise;
      protocol;
      constructor(t) {
        Ls(t), this.config = t, this.env = t.env, this.inlineSchema = Fs(t.inlineSchema), this.inlineDatasources = t.inlineDatasources, this.inlineSchemaHash = t.inlineSchemaHash, this.clientVersion = t.clientVersion, this.engineHash = t.engineVersion, this.logEmitter = t.logEmitter, this.tracingHelper = t.tracingHelper;
      }
      apiKey() {
        return this.headerBuilder.apiKey;
      }
      version() {
        return this.engineHash;
      }
      async start() {
        this.startPromise !== void 0 && await this.startPromise, this.startPromise = (async () => {
          let { apiKey: t, url: r } = this.getURLAndAPIKey();
          this.host = r.host, this.protocol = r.protocol, this.headerBuilder = new en({ apiKey: t, tracingHelper: this.tracingHelper, logLevel: this.config.logLevel ?? "error", logQueries: this.config.logQueries, engineHash: this.engineHash }), this.remoteClientVersion = await qs(this.host, this.config), ir("host", this.host), ir("protocol", this.protocol);
        })(), await this.startPromise;
      }
      async stop() {
      }
      propagateResponseExtensions(t) {
        t?.logs?.length && t.logs.forEach((r) => {
          switch (r.level) {
            case "debug":
            case "trace":
              ir(r);
              break;
            case "error":
            case "warn":
            case "info": {
              this.logEmitter.emit(r.level, { timestamp: Yn(r.timestamp), message: r.attributes.message ?? "", target: r.target ?? "BinaryEngine" });
              break;
            }
            case "query": {
              this.logEmitter.emit("query", { query: r.attributes.query ?? "", timestamp: Yn(r.timestamp), duration: r.attributes.duration_ms ?? 0, params: r.attributes.params ?? "", target: r.target ?? "BinaryEngine" });
              break;
            }
            default:
              r.level;
          }
        }), t?.traces?.length && this.tracingHelper.dispatchEngineSpans(t.traces);
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the remote query engine');
      }
      async url(t) {
        return await this.start(), `${this.protocol}//${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${t}`;
      }
      async uploadSchema() {
        let t = { name: "schemaUpload", internal: true };
        return this.tracingHelper.runInChildSpan(t, async () => {
          let r = await je(await this.url("schema"), { method: "PUT", headers: this.headerBuilder.build(), body: this.inlineSchema, clientVersion: this.clientVersion });
          r.ok || ir("schema response status", r.status);
          let n = await rr(r, this.clientVersion);
          if (n) throw this.logEmitter.emit("warn", { message: `Error while uploading schema: ${n.message}`, timestamp: /* @__PURE__ */ new Date(), target: "" }), n;
          this.logEmitter.emit("info", { message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
        });
      }
      request(t, { traceparent: r, interactiveTransaction: n, customDataProxyFetch: i }) {
        return this.requestInternal({ body: t, traceparent: r, interactiveTransaction: n, customDataProxyFetch: i });
      }
      async requestBatch(t, { traceparent: r, transaction: n, customDataProxyFetch: i }) {
        let o = n?.kind === "itx" ? n.options : void 0, s = Wr(t, n);
        return (await this.requestInternal({ body: s, customDataProxyFetch: i, interactiveTransaction: o, traceparent: r })).map((l2) => (l2.extensions && this.propagateResponseExtensions(l2.extensions), "errors" in l2 ? this.convertProtocolErrorsToClientError(l2.errors) : l2));
      }
      requestInternal({ body: t, traceparent: r, customDataProxyFetch: n, interactiveTransaction: i }) {
        return this.withRetry({ actionGerund: "querying", callback: /* @__PURE__ */ __name(async ({ logHttpCall: o }) => {
          let s = i ? `${i.payload.endpoint}/graphql` : await this.url("graphql");
          o(s);
          let a = await je(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r, transactionId: i?.id }), body: JSON.stringify(t), clientVersion: this.clientVersion }, n);
          a.ok || ir("graphql response status", a.status), await this.handleError(await rr(a, this.clientVersion));
          let l2 = await a.json();
          if (l2.extensions && this.propagateResponseExtensions(l2.extensions), "errors" in l2) throw this.convertProtocolErrorsToClientError(l2.errors);
          return "batchResult" in l2 ? l2.batchResult : l2;
        }, "callback") });
      }
      async transaction(t, r, n) {
        let i = { start: "starting", commit: "committing", rollback: "rolling back" };
        return this.withRetry({ actionGerund: `${i[t]} transaction`, callback: /* @__PURE__ */ __name(async ({ logHttpCall: o }) => {
          if (t === "start") {
            let s = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }), a = await this.url("transaction/start");
            o(a);
            let l2 = await je(a, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), body: s, clientVersion: this.clientVersion });
            await this.handleError(await rr(l2, this.clientVersion));
            let d = await l2.json(), { extensions: g } = d;
            g && this.propagateResponseExtensions(g);
            let h = d.id, T2 = d["data-proxy"].endpoint;
            return { id: h, payload: { endpoint: T2 } };
          } else {
            let s = `${n.payload.endpoint}/${t}`;
            o(s);
            let a = await je(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), clientVersion: this.clientVersion });
            await this.handleError(await rr(a, this.clientVersion));
            let l2 = await a.json(), { extensions: d } = l2;
            d && this.propagateResponseExtensions(d);
            return;
          }
        }, "callback") });
      }
      getURLAndAPIKey() {
        return Ms({ clientVersion: this.clientVersion, env: this.env, inlineDatasources: this.inlineDatasources, overrideDatasources: this.config.overrideDatasources });
      }
      metrics() {
        throw new Ve("Metrics are not yet supported for Accelerate", { clientVersion: this.clientVersion });
      }
      async withRetry(t) {
        for (let r = 0; ; r++) {
          let n = /* @__PURE__ */ __name((i) => {
            this.logEmitter.emit("info", { message: `Calling ${i} (n=${r})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }, "n");
          try {
            return await t.callback({ logHttpCall: n });
          } catch (i) {
            if (!(i instanceof ae) || !i.isRetryable) throw i;
            if (r >= Vs) throw i instanceof ht ? i.cause : i;
            this.logEmitter.emit("warn", { message: `Attempt ${r + 1}/${Vs} failed for ${t.actionGerund}: ${i.message ?? "(unknown)"}`, timestamp: /* @__PURE__ */ new Date(), target: "" });
            let o = await Ns(r);
            this.logEmitter.emit("warn", { message: `Retrying after ${o}ms`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }
        }
      }
      async handleError(t) {
        if (t instanceof $e) throw await this.uploadSchema(), new ht({ clientVersion: this.clientVersion, cause: t });
        if (t) throw t;
      }
      convertProtocolErrorsToClientError(t) {
        return t.length === 1 ? Hr(t[0], this.config.clientVersion, this.config.activeProvider) : new ie(JSON.stringify(t), { clientVersion: this.config.clientVersion });
      }
      applyPendingMigrations() {
        throw new Error("Method not implemented.");
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function $s({ url: e, adapter: t, copyEngine: r, targetBuildType: n }) {
      let i = [], o = [], s = /* @__PURE__ */ __name((C) => {
        i.push({ _tag: "warning", value: C });
      }, "s"), a = /* @__PURE__ */ __name((C) => {
        let M = C.join(`
`);
        o.push({ _tag: "error", value: M });
      }, "a"), l2 = !!e?.startsWith("prisma://"), d = yr(e), g = !!t, h = l2 || d;
      !g && r && h && n !== "client" && n !== "wasm-compiler-edge" && s(["recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)"]);
      let T2 = h || !r;
      g && (T2 || n === "edge") && (n === "edge" ? a(["Prisma Client was configured to use the `adapter` option but it was imported via its `/edge` endpoint.", "Please either remove the `/edge` endpoint or remove the `adapter` from the Prisma Client constructor."]) : r ? l2 && a(["Prisma Client was configured to use the `adapter` option but the URL was a `prisma://` URL.", "Please either use the `prisma://` URL or remove the `adapter` from the Prisma Client constructor."]) : a(["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."]));
      let I = { accelerate: T2, ppg: d, driverAdapters: g };
      function S2(C) {
        return C.length > 0;
      }
      __name(S2, "S");
      return S2(o) ? { ok: false, diagnostics: { warnings: i, errors: o }, isUsing: I } : { ok: true, diagnostics: { warnings: i }, isUsing: I };
    }
    __name($s, "$s");
    function js({ copyEngine: e = true }, t) {
      let r;
      try {
        r = gt({ inlineDatasources: t.inlineDatasources, overrideDatasources: t.overrideDatasources, env: { ...t.env, ...y.env }, clientVersion: t.clientVersion });
      } catch {
      }
      let { ok: n, isUsing: i, diagnostics: o } = $s({ url: r, adapter: t.adapter, copyEngine: e, targetBuildType: "edge" });
      for (let h of o.warnings) St(...h.value);
      if (!n) {
        let h = o.errors[0];
        throw new X(h.value, { clientVersion: t.clientVersion });
      }
      let s = Ze(t.generator), a = s === "library", l2 = s === "binary", d = s === "client", g = (i.accelerate || i.ppg) && !i.driverAdapters;
      return i.accelerate ? new Et(t) : (i.driverAdapters, i.accelerate, new Et(t));
    }
    __name(js, "js");
    f2();
    u();
    c();
    p2();
    m();
    function Gs({ generator: e }) {
      return e?.previewFeatures ?? [];
    }
    __name(Gs, "Gs");
    f2();
    u();
    c();
    p2();
    m();
    var Js = /* @__PURE__ */ __name((e) => ({ command: e }), "Js");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qs = /* @__PURE__ */ __name((e) => e.strings.reduce((t, r, n) => `${t}@P${n}${r}`), "Qs");
    f2();
    u();
    c();
    p2();
    m();
    function bt(e) {
      try {
        return Ks(e, "fast");
      } catch {
        return Ks(e, "slow");
      }
    }
    __name(bt, "bt");
    function Ks(e, t) {
      return JSON.stringify(e.map((r) => Hs(r, t)));
    }
    __name(Ks, "Ks");
    function Hs(e, t) {
      if (Array.isArray(e)) return e.map((r) => Hs(r, t));
      if (typeof e == "bigint") return { prisma__type: "bigint", prisma__value: e.toString() };
      if (Xe(e)) return { prisma__type: "date", prisma__value: e.toJSON() };
      if (Ae.isDecimal(e)) return { prisma__type: "decimal", prisma__value: e.toJSON() };
      if (w2.Buffer.isBuffer(e)) return { prisma__type: "bytes", prisma__value: e.toString("base64") };
      if (mp(e)) return { prisma__type: "bytes", prisma__value: w2.Buffer.from(e).toString("base64") };
      if (ArrayBuffer.isView(e)) {
        let { buffer: r, byteOffset: n, byteLength: i } = e;
        return { prisma__type: "bytes", prisma__value: w2.Buffer.from(r, n, i).toString("base64") };
      }
      return typeof e == "object" && t === "slow" ? zs(e) : e;
    }
    __name(Hs, "Hs");
    function mp(e) {
      return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer ? true : typeof e == "object" && e !== null ? e[Symbol.toStringTag] === "ArrayBuffer" || e[Symbol.toStringTag] === "SharedArrayBuffer" : false;
    }
    __name(mp, "mp");
    function zs(e) {
      if (typeof e != "object" || e === null) return e;
      if (typeof e.toJSON == "function") return e.toJSON();
      if (Array.isArray(e)) return e.map(Ws);
      let t = {};
      for (let r of Object.keys(e)) t[r] = Ws(e[r]);
      return t;
    }
    __name(zs, "zs");
    function Ws(e) {
      return typeof e == "bigint" ? e.toString() : zs(e);
    }
    __name(Ws, "Ws");
    var fp = /^(\s*alter\s)/i;
    var Ys = z("prisma:client");
    function ii(e, t, r, n) {
      if (!(e !== "postgresql" && e !== "cockroachdb") && r.length > 0 && fp.exec(t)) throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
    }
    __name(ii, "ii");
    var oi = /* @__PURE__ */ __name(({ clientMethod: e, activeProvider: t }) => (r) => {
      let n = "", i;
      if (Gr(r)) n = r.sql, i = { values: bt(r.values), __prismaRawParameters__: true };
      else if (Array.isArray(r)) {
        let [o, ...s] = r;
        n = o, i = { values: bt(s || []), __prismaRawParameters__: true };
      } else switch (t) {
        case "sqlite":
        case "mysql": {
          n = r.sql, i = { values: bt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = r.text, i = { values: bt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = Qs(r), i = { values: bt(r.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${t} provider does not support ${e}`);
      }
      return i?.values ? Ys(`prisma.${e}(${n}, ${i.values})`) : Ys(`prisma.${e}(${n})`), { query: n, parameters: i };
    }, "oi");
    var Zs = { requestArgsToMiddlewareArgs(e) {
      return [e.strings, ...e.values];
    }, middlewareArgsToRequestArgs(e) {
      let [t, ...r] = e;
      return new se(t, r);
    } };
    var Xs = { requestArgsToMiddlewareArgs(e) {
      return [e];
    }, middlewareArgsToRequestArgs(e) {
      return e[0];
    } };
    f2();
    u();
    c();
    p2();
    m();
    function si(e) {
      return function(r, n) {
        let i, o = /* @__PURE__ */ __name((s = e) => {
          try {
            return s === void 0 || s?.kind === "itx" ? i ??= ea(r(s)) : ea(r(s));
          } catch (a) {
            return Promise.reject(a);
          }
        }, "o");
        return { get spec() {
          return n;
        }, then(s, a) {
          return o().then(s, a);
        }, catch(s) {
          return o().catch(s);
        }, finally(s) {
          return o().finally(s);
        }, requestTransaction(s) {
          let a = o(s);
          return a.requestTransaction ? a.requestTransaction(s) : a;
        }, [Symbol.toStringTag]: "PrismaPromise" };
      };
    }
    __name(si, "si");
    function ea(e) {
      return typeof e.then == "function" ? e : Promise.resolve(e);
    }
    __name(ea, "ea");
    f2();
    u();
    c();
    p2();
    m();
    var dp = xn.split(".")[0];
    var gp = { isEnabled() {
      return false;
    }, getTraceParent() {
      return "00-10-10-00";
    }, dispatchEngineSpans() {
    }, getActiveContext() {
    }, runInChildSpan(e, t) {
      return t();
    } };
    var ai = class {
      static {
        __name(this, "ai");
      }
      isEnabled() {
        return this.getGlobalTracingHelper().isEnabled();
      }
      getTraceParent(t) {
        return this.getGlobalTracingHelper().getTraceParent(t);
      }
      dispatchEngineSpans(t) {
        return this.getGlobalTracingHelper().dispatchEngineSpans(t);
      }
      getActiveContext() {
        return this.getGlobalTracingHelper().getActiveContext();
      }
      runInChildSpan(t, r) {
        return this.getGlobalTracingHelper().runInChildSpan(t, r);
      }
      getGlobalTracingHelper() {
        let t = globalThis[`V${dp}_PRISMA_INSTRUMENTATION`], r = globalThis.PRISMA_INSTRUMENTATION;
        return t?.helper ?? r?.helper ?? gp;
      }
    };
    function ta() {
      return new ai();
    }
    __name(ta, "ta");
    f2();
    u();
    c();
    p2();
    m();
    function ra(e, t = () => {
    }) {
      let r, n = new Promise((i) => r = i);
      return { then(i) {
        return --e === 0 && r(t()), i?.(n);
      } };
    }
    __name(ra, "ra");
    f2();
    u();
    c();
    p2();
    m();
    function na(e) {
      return typeof e == "string" ? e : e.reduce((t, r) => {
        let n = typeof r == "string" ? r : r.level;
        return n === "query" ? t : t && (r === "info" || t === "info") ? "info" : n;
      }, void 0);
    }
    __name(na, "na");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function tn(e) {
      return typeof e.batchRequestIdx == "number";
    }
    __name(tn, "tn");
    f2();
    u();
    c();
    p2();
    m();
    function ia(e) {
      if (e.action !== "findUnique" && e.action !== "findUniqueOrThrow") return;
      let t = [];
      return e.modelName && t.push(e.modelName), e.query.arguments && t.push(li(e.query.arguments)), t.push(li(e.query.selection)), t.join("");
    }
    __name(ia, "ia");
    function li(e) {
      return `(${Object.keys(e).sort().map((r) => {
        let n = e[r];
        return typeof n == "object" && n !== null ? `(${r} ${li(n)})` : r;
      }).join(" ")})`;
    }
    __name(li, "li");
    f2();
    u();
    c();
    p2();
    m();
    var hp = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateManyAndReturn: true, updateOne: true, upsertOne: true };
    function ui(e) {
      return hp[e];
    }
    __name(ui, "ui");
    f2();
    u();
    c();
    p2();
    m();
    var rn = class {
      static {
        __name(this, "rn");
      }
      constructor(t) {
        this.options = t;
        this.batches = {};
      }
      batches;
      tickActive = false;
      request(t) {
        let r = this.options.batchBy(t);
        return r ? (this.batches[r] || (this.batches[r] = [], this.tickActive || (this.tickActive = true, y.nextTick(() => {
          this.dispatchBatches(), this.tickActive = false;
        }))), new Promise((n, i) => {
          this.batches[r].push({ request: t, resolve: n, reject: i });
        })) : this.options.singleLoader(t);
      }
      dispatchBatches() {
        for (let t in this.batches) {
          let r = this.batches[t];
          delete this.batches[t], r.length === 1 ? this.options.singleLoader(r[0].request).then((n) => {
            n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
          }).catch((n) => {
            r[0].reject(n);
          }) : (r.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(r.map((n) => n.request)).then((n) => {
            if (n instanceof Error) for (let i = 0; i < r.length; i++) r[i].reject(n);
            else for (let i = 0; i < r.length; i++) {
              let o = n[i];
              o instanceof Error ? r[i].reject(o) : r[i].resolve(o);
            }
          }).catch((n) => {
            for (let i = 0; i < r.length; i++) r[i].reject(n);
          }));
        }
      }
      get [Symbol.toStringTag]() {
        return "DataLoader";
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function Ge(e, t) {
      if (t === null) return t;
      switch (e) {
        case "bigint":
          return BigInt(t);
        case "bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = w2.Buffer.from(t, "base64");
          return new Uint8Array(r, n, i);
        }
        case "decimal":
          return new Ae(t);
        case "datetime":
        case "date":
          return new Date(t);
        case "time":
          return /* @__PURE__ */ new Date(`1970-01-01T${t}Z`);
        case "bigint-array":
          return t.map((r) => Ge("bigint", r));
        case "bytes-array":
          return t.map((r) => Ge("bytes", r));
        case "decimal-array":
          return t.map((r) => Ge("decimal", r));
        case "datetime-array":
          return t.map((r) => Ge("datetime", r));
        case "date-array":
          return t.map((r) => Ge("date", r));
        case "time-array":
          return t.map((r) => Ge("time", r));
        default:
          return t;
      }
    }
    __name(Ge, "Ge");
    function nn(e) {
      let t = [], r = yp(e);
      for (let n = 0; n < e.rows.length; n++) {
        let i = e.rows[n], o = { ...r };
        for (let s = 0; s < i.length; s++) o[e.columns[s]] = Ge(e.types[s], i[s]);
        t.push(o);
      }
      return t;
    }
    __name(nn, "nn");
    function yp(e) {
      let t = {};
      for (let r = 0; r < e.columns.length; r++) t[e.columns[r]] = null;
      return t;
    }
    __name(yp, "yp");
    var wp = z("prisma:client:request_handler");
    var on2 = class {
      static {
        __name(this, "on");
      }
      client;
      dataloader;
      logEmitter;
      constructor(t, r) {
        this.logEmitter = r, this.client = t, this.dataloader = new rn({ batchLoader: Ts(async ({ requests: n, customDataProxyFetch: i }) => {
          let { transaction: o, otelParentCtx: s } = n[0], a = n.map((h) => h.protocolQuery), l2 = this.client._tracingHelper.getTraceParent(s), d = n.some((h) => ui(h.protocolQuery.action));
          return (await this.client._engine.requestBatch(a, { traceparent: l2, transaction: Ep(o), containsWrite: d, customDataProxyFetch: i })).map((h, T2) => {
            if (h instanceof Error) return h;
            try {
              return this.mapQueryEngineResult(n[T2], h);
            } catch (I) {
              return I;
            }
          });
        }), singleLoader: /* @__PURE__ */ __name(async (n) => {
          let i = n.transaction?.kind === "itx" ? oa(n.transaction) : void 0, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: ui(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
          return this.mapQueryEngineResult(n, o);
        }, "singleLoader"), batchBy: /* @__PURE__ */ __name((n) => n.transaction?.id ? `transaction-${n.transaction.id}` : ia(n.protocolQuery), "batchBy"), batchOrder(n, i) {
          return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
        } });
      }
      async request(t) {
        try {
          return await this.dataloader.request(t);
        } catch (r) {
          let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = t;
          this.handleAndLogRequestError({ error: r, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: t.globalOmit });
        }
      }
      mapQueryEngineResult({ dataPath: t, unpacker: r }, n) {
        let i = n?.data, o = this.unpack(i, t, r);
        return y.env.PRISMA_CLIENT_GET_TIME ? { data: o } : o;
      }
      handleAndLogRequestError(t) {
        try {
          this.handleRequestError(t);
        } catch (r) {
          throw this.logEmitter && this.logEmitter.emit("error", { message: r.message, target: t.clientMethod, timestamp: /* @__PURE__ */ new Date() }), r;
        }
      }
      handleRequestError({ error: t, clientMethod: r, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
        if (wp(t), bp(t, i)) throw t;
        if (t instanceof ne && xp(t)) {
          let d = sa(t.meta);
          Ur({ args: o, errors: [d], callsite: n, errorFormat: this.client._errorFormat, originalMethod: r, clientVersion: this.client._clientVersion, globalOmit: a });
        }
        let l2 = t.message;
        if (n && (l2 = Sr({ callsite: n, originalMethod: r, isPanic: t.isPanic, showColors: this.client._errorFormat === "pretty", message: l2 })), l2 = this.sanitizeMessage(l2), t.code) {
          let d = s ? { modelName: s, ...t.meta } : t.meta;
          throw new ne(l2, { code: t.code, clientVersion: this.client._clientVersion, meta: d, batchRequestIdx: t.batchRequestIdx });
        } else {
          if (t.isPanic) throw new Pe(l2, this.client._clientVersion);
          if (t instanceof ie) throw new ie(l2, { clientVersion: this.client._clientVersion, batchRequestIdx: t.batchRequestIdx });
          if (t instanceof Q) throw new Q(l2, this.client._clientVersion);
          if (t instanceof Pe) throw new Pe(l2, this.client._clientVersion);
        }
        throw t.clientVersion = this.client._clientVersion, t;
      }
      sanitizeMessage(t) {
        return this.client._errorFormat && this.client._errorFormat !== "pretty" ? Rn(t) : t;
      }
      unpack(t, r, n) {
        if (!t || (t.data && (t = t.data), !t)) return t;
        let i = Object.keys(t)[0], o = Object.values(t)[0], s = r.filter((d) => d !== "select" && d !== "include"), a = Kn(o, s), l2 = i === "queryRaw" ? nn(a) : dt(a);
        return n ? n(l2) : l2;
      }
      get [Symbol.toStringTag]() {
        return "RequestHandler";
      }
    };
    function Ep(e) {
      if (e) {
        if (e.kind === "batch") return { kind: "batch", options: { isolationLevel: e.isolationLevel } };
        if (e.kind === "itx") return { kind: "itx", options: oa(e) };
        Ue(e, "Unknown transaction kind");
      }
    }
    __name(Ep, "Ep");
    function oa(e) {
      return { id: e.id, payload: e.payload };
    }
    __name(oa, "oa");
    function bp(e, t) {
      return tn(e) && t?.kind === "batch" && e.batchRequestIdx !== t.index;
    }
    __name(bp, "bp");
    function xp(e) {
      return e.code === "P2009" || e.code === "P2012";
    }
    __name(xp, "xp");
    function sa(e) {
      if (e.kind === "Union") return { kind: "Union", errors: e.errors.map(sa) };
      if (Array.isArray(e.selectionPath)) {
        let [, ...t] = e.selectionPath;
        return { ...e, selectionPath: t };
      }
      return e;
    }
    __name(sa, "sa");
    f2();
    u();
    c();
    p2();
    m();
    var aa = Ds;
    f2();
    u();
    c();
    p2();
    m();
    var ma = Qe(Nn());
    f2();
    u();
    c();
    p2();
    m();
    var q = class extends Error {
      static {
        __name(this, "q");
      }
      constructor(t) {
        super(t + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientConstructorValidationError";
      }
    };
    N(q, "PrismaClientConstructorValidationError");
    var la = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
    var ua = ["pretty", "colorless", "minimal"];
    var ca = ["info", "query", "warn", "error"];
    var Pp = { datasources: /* @__PURE__ */ __name((e, { datasourceNames: t }) => {
      if (e) {
        if (typeof e != "object" || Array.isArray(e)) throw new q(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);
        for (let [r, n] of Object.entries(e)) {
          if (!t.includes(r)) {
            let i = xt(r, t) || ` Available datasources: ${t.join(", ")}`;
            throw new q(`Unknown datasource ${r} provided to PrismaClient constructor.${i}`);
          }
          if (typeof n != "object" || Array.isArray(n)) throw new q(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object") for (let [i, o] of Object.entries(n)) {
            if (i !== "url") throw new q(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string") throw new q(`Invalid value ${JSON.stringify(o)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
        }
      }
    }, "datasources"), adapter: /* @__PURE__ */ __name((e, t) => {
      if (!e && Ze(t.generator) === "client") throw new q('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');
      if (e !== null) {
        if (e === void 0) throw new q('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
        if (Ze(t.generator) === "binary") throw new q('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
      }
    }, "adapter"), datasourceUrl: /* @__PURE__ */ __name((e) => {
      if (typeof e < "u" && typeof e != "string") throw new q(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    }, "datasourceUrl"), errorFormat: /* @__PURE__ */ __name((e) => {
      if (e) {
        if (typeof e != "string") throw new q(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!ua.includes(e)) {
          let t = xt(e, ua);
          throw new q(`Invalid errorFormat ${e} provided to PrismaClient constructor.${t}`);
        }
      }
    }, "errorFormat"), log: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      if (!Array.isArray(e)) throw new q(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);
      function t(r) {
        if (typeof r == "string" && !ca.includes(r)) {
          let n = xt(r, ca);
          throw new q(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`);
        }
      }
      __name(t, "t");
      for (let r of e) {
        t(r);
        let n = { level: t, emit: /* @__PURE__ */ __name((i) => {
          let o = ["stdout", "event"];
          if (!o.includes(i)) {
            let s = xt(i, o);
            throw new q(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
          }
        }, "emit") };
        if (r && typeof r == "object") for (let [i, o] of Object.entries(r)) if (n[i]) n[i](o);
        else throw new q(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
      }
    }, "log"), transactionOptions: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      let t = e.maxWait;
      if (t != null && t <= 0) throw new q(`Invalid value ${t} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
      let r = e.timeout;
      if (r != null && r <= 0) throw new q(`Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
    }, "transactionOptions"), omit: /* @__PURE__ */ __name((e, t) => {
      if (typeof e != "object") throw new q('"omit" option is expected to be an object.');
      if (e === null) throw new q('"omit" option can not be `null`');
      let r = [];
      for (let [n, i] of Object.entries(e)) {
        let o = Tp(n, t.runtimeDataModel);
        if (!o) {
          r.push({ kind: "UnknownModel", modelKey: n });
          continue;
        }
        for (let [s, a] of Object.entries(i)) {
          let l2 = o.fields.find((d) => d.name === s);
          if (!l2) {
            r.push({ kind: "UnknownField", modelKey: n, fieldName: s });
            continue;
          }
          if (l2.relationName) {
            r.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
            continue;
          }
          typeof a != "boolean" && r.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
        }
      }
      if (r.length > 0) throw new q(Ap(e, r));
    }, "omit"), __internal: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      let t = ["debug", "engine", "configOverride"];
      if (typeof e != "object") throw new q(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);
      for (let [r] of Object.entries(e)) if (!t.includes(r)) {
        let n = xt(r, t);
        throw new q(`Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
    }, "__internal") };
    function fa(e, t) {
      for (let [r, n] of Object.entries(e)) {
        if (!la.includes(r)) {
          let i = xt(r, la);
          throw new q(`Unknown property ${r} provided to PrismaClient constructor.${i}`);
        }
        Pp[r](n, t);
      }
      if (e.datasourceUrl && e.datasources) throw new q('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
    }
    __name(fa, "fa");
    function xt(e, t) {
      if (t.length === 0 || typeof e != "string") return "";
      let r = vp(e, t);
      return r ? ` Did you mean "${r}"?` : "";
    }
    __name(xt, "xt");
    function vp(e, t) {
      if (t.length === 0) return null;
      let r = t.map((i) => ({ value: i, distance: (0, ma.default)(e, i) }));
      r.sort((i, o) => i.distance < o.distance ? -1 : 1);
      let n = r[0];
      return n.distance < 3 ? n.value : null;
    }
    __name(vp, "vp");
    function Tp(e, t) {
      return pa(t.models, e) ?? pa(t.types, e);
    }
    __name(Tp, "Tp");
    function pa(e, t) {
      let r = Object.keys(e).find((n) => Ie(n) === t);
      if (r) return e[r];
    }
    __name(pa, "pa");
    function Ap(e, t) {
      let r = ut(e);
      for (let o of t) switch (o.kind) {
        case "UnknownModel":
          r.arguments.getField(o.modelKey)?.markAsError(), r.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          r.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
      let { message: n, args: i } = Lr(r, "colorless");
      return `Error validating "omit" option:

${i}

${n}`;
    }
    __name(Ap, "Ap");
    f2();
    u();
    c();
    p2();
    m();
    function da(e) {
      return e.length === 0 ? Promise.resolve([]) : new Promise((t, r) => {
        let n = new Array(e.length), i = null, o = false, s = 0, a = /* @__PURE__ */ __name(() => {
          o || (s++, s === e.length && (o = true, i ? r(i) : t(n)));
        }, "a"), l2 = /* @__PURE__ */ __name((d) => {
          o || (o = true, r(d));
        }, "l");
        for (let d = 0; d < e.length; d++) e[d].then((g) => {
          n[d] = g, a();
        }, (g) => {
          if (!tn(g)) {
            l2(g);
            return;
          }
          g.batchRequestIdx === d ? l2(g) : (i || (i = g), a());
        });
      });
    }
    __name(da, "da");
    var Fe = z("prisma:client");
    typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
    var Rp = { requestArgsToMiddlewareArgs: /* @__PURE__ */ __name((e) => e, "requestArgsToMiddlewareArgs"), middlewareArgsToRequestArgs: /* @__PURE__ */ __name((e) => e, "middlewareArgsToRequestArgs") };
    var Cp = /* @__PURE__ */ Symbol.for("prisma.client.transaction.id");
    var Sp = { id: 0, nextId() {
      return ++this.id;
    } };
    function ya(e) {
      class t {
        static {
          __name(this, "t");
        }
        _originalClient = this;
        _runtimeDataModel;
        _requestHandler;
        _connectionPromise;
        _disconnectionPromise;
        _engineConfig;
        _accelerateEngineConfig;
        _clientVersion;
        _errorFormat;
        _tracingHelper;
        _previewFeatures;
        _activeProvider;
        _globalOmit;
        _extensions;
        _engine;
        _appliedParent;
        _createPrismaPromise = si();
        constructor(n) {
          e = n?.__internal?.configOverride?.(e) ?? e, Is(e), n && fa(n, e);
          let i = new Jr().on("error", () => {
          });
          this._extensions = ct.empty(), this._previewFeatures = Gs(e), this._clientVersion = e.clientVersion ?? aa, this._activeProvider = e.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = ta();
          let o = e.relativeEnvPaths && { rootEnvPath: e.relativeEnvPaths.rootEnvPath && dr.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath), schemaEnvPath: e.relativeEnvPaths.schemaEnvPath && dr.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath) }, s;
          if (n?.adapter) {
            s = n.adapter;
            let l2 = e.activeProvider === "postgresql" || e.activeProvider === "cockroachdb" ? "postgres" : e.activeProvider;
            if (s.provider !== l2) throw new Q(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${l2}\` specified in the Prisma schema.`, this._clientVersion);
            if (n.datasources || n.datasourceUrl !== void 0) throw new Q("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
          }
          let a = e.injectableEdgeEnv?.();
          try {
            let l2 = n ?? {}, d = l2.__internal ?? {}, g = d.debug === true;
            g && z.enable("prisma:client");
            let h = dr.resolve(e.dirname, e.relativePath);
            Qi.existsSync(h) || (h = e.dirname), Fe("dirname", e.dirname), Fe("relativePath", e.relativePath), Fe("cwd", h);
            let T2 = d.engine || {};
            if (l2.errorFormat ? this._errorFormat = l2.errorFormat : y.env.NODE_ENV === "production" ? this._errorFormat = "minimal" : y.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = e.runtimeDataModel, this._engineConfig = { cwd: h, dirname: e.dirname, enableDebugLogs: g, allowTriggerPanic: T2.allowTriggerPanic, prismaPath: T2.binaryPath ?? void 0, engineEndpoint: T2.endpoint, generator: e.generator, showColors: this._errorFormat === "pretty", logLevel: l2.log && na(l2.log), logQueries: l2.log && !!(typeof l2.log == "string" ? l2.log === "query" : l2.log.find((I) => typeof I == "string" ? I === "query" : I.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: e.engineWasm, compilerWasm: e.compilerWasm, clientVersion: e.clientVersion, engineVersion: e.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e.activeProvider, inlineSchema: e.inlineSchema, overrideDatasources: Os(l2, e.datasourceNames), inlineDatasources: e.inlineDatasources, inlineSchemaHash: e.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: l2.transactionOptions?.maxWait ?? 2e3, timeout: l2.transactionOptions?.timeout ?? 5e3, isolationLevel: l2.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: e.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: gt, getBatchRequestPayload: Wr, prismaGraphQLToJSError: Hr, PrismaClientUnknownRequestError: ie, PrismaClientInitializationError: Q, PrismaClientKnownRequestError: ne, debug: z("prisma:client:accelerateEngine"), engineVersion: ha.version, clientVersion: e.clientVersion } }, Fe("clientVersion", e.clientVersion), this._engine = js(e, this._engineConfig), this._requestHandler = new on2(this, i), l2.log) for (let I of l2.log) {
              let S2 = typeof I == "string" ? I : I.emit === "stdout" ? I.level : null;
              S2 && this.$on(S2, (C) => {
                Ct.log(`${Ct.tags[S2] ?? ""}`, C.message || C.query);
              });
            }
          } catch (l2) {
            throw l2.clientVersion = this._clientVersion, l2;
          }
          return this._appliedParent = Gt(this);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClient";
        }
        $on(n, i) {
          return n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i), this;
        }
        $connect() {
          try {
            return this._engine.start();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          }
        }
        async $disconnect() {
          try {
            await this._engine.stop();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          } finally {
            Ji();
          }
        }
        $executeRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: oi({ clientMethod: i, activeProvider: a }), callsite: Ne(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $executeRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) {
              let [s, a] = ga(n, i);
              return ii(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
            }
            throw new X("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
          });
        }
        $executeRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => (ii(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
        }
        $runCommandRaw(n) {
          if (e.activeProvider !== "mongodb") throw new X(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
          return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: Js, callsite: Ne(this._errorFormat), transaction: i }));
        }
        async $queryRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: oi({ clientMethod: i, activeProvider: a }), callsite: Ne(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $queryRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, "$queryRaw", ...ga(n, i));
            throw new X("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
          });
        }
        $queryRawTyped(n) {
          return this._createPrismaPromise((i) => {
            if (!this._hasPreviewFlag("typedSql")) throw new X("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
            return this.$queryRawInternal(i, "$queryRawTyped", n);
          });
        }
        $queryRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
        }
        _transactionWithArray({ promises: n, options: i }) {
          let o = Sp.nextId(), s = ra(n.length), a = n.map((l2, d) => {
            if (l2?.[Symbol.toStringTag] !== "PrismaPromise") throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
            let g = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, h = { kind: "batch", id: o, index: d, isolationLevel: g, lock: s };
            return l2.requestTransaction?.(h) ?? l2;
          });
          return da(a);
        }
        async _transactionWithCallback({ callback: n, options: i }) {
          let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), l2;
          try {
            let d = { kind: "itx", ...a };
            l2 = await n(this._createItxClient(d)), await this._engine.transaction("commit", o, a);
          } catch (d) {
            throw await this._engine.transaction("rollback", o, a).catch(() => {
            }), d;
          }
          return l2;
        }
        _createItxClient(n) {
          return me(Gt(me(ds(this), [te("_appliedParent", () => this._appliedParent._createItxClient(n)), te("_createPrismaPromise", () => si(n)), te(Cp, () => n.id)])), [mt(Es)]);
        }
        $transaction(n, i) {
          let o;
          typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = /* @__PURE__ */ __name(() => {
            throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
          }, "o") : o = /* @__PURE__ */ __name(() => this._transactionWithCallback({ callback: n, options: i }), "o") : o = /* @__PURE__ */ __name(() => this._transactionWithArray({ promises: n, options: i }), "o");
          let s = { name: "transaction", attributes: { method: "$transaction" } };
          return this._tracingHelper.runInChildSpan(s, o);
        }
        _request(n) {
          n.otelParentCtx = this._tracingHelper.getActiveContext();
          let i = n.middlewareArgsMapper ?? Rp, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = /* @__PURE__ */ __name(async (l2) => {
            let { runInTransaction: d, args: g, ...h } = l2, T2 = { ...n, ...h };
            g && (T2.args = i.middlewareArgsToRequestArgs(g)), n.transaction !== void 0 && d === false && delete T2.transaction;
            let I = await vs(this, T2);
            return T2.model ? ws({ result: I, modelName: T2.model, args: T2.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : I;
          }, "a");
          return this._tracingHelper.runInChildSpan(s.operation, () => a(o));
        }
        async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: l2, argsMapper: d, transaction: g, unpacker: h, otelParentCtx: T2, customDataProxyFetch: I }) {
          try {
            n = d ? d(n) : n;
            let S2 = { name: "serialize" }, C = this._tracingHelper.runInChildSpan(S2, () => $r({ modelName: l2, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
            return z.enabled("prisma:client") && (Fe("Prisma Client call:"), Fe(`prisma.${i}(${is(n)})`), Fe("Generated request:"), Fe(JSON.stringify(C, null, 2) + `
`)), g?.kind === "batch" && await g.lock, this._requestHandler.request({ protocolQuery: C, modelName: l2, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: g, unpacker: h, otelParentCtx: T2, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: I });
          } catch (S2) {
            throw S2.clientVersion = this._clientVersion, S2;
          }
        }
        $metrics = new pt(this);
        _hasPreviewFlag(n) {
          return !!this._engineConfig.previewFeatures?.includes(n);
        }
        $applyPendingMigrations() {
          return this._engine.applyPendingMigrations();
        }
        $extends = gs;
      }
      return t;
    }
    __name(ya, "ya");
    function ga(e, t) {
      return Ip(e) ? [new se(e, t), Zs] : [e, Xs];
    }
    __name(ga, "ga");
    function Ip(e) {
      return Array.isArray(e) && Array.isArray(e.raw);
    }
    __name(Ip, "Ip");
    f2();
    u();
    c();
    p2();
    m();
    var Op = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
    function wa(e) {
      return new Proxy(e, { get(t, r) {
        if (r in t) return t[r];
        if (!Op.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
      } });
    }
    __name(wa, "wa");
    f2();
    u();
    c();
    p2();
    m();
  }
});

// ../node_modules/.prisma/client/edge.js
var require_edge2 = __commonJS({
  "../node_modules/.prisma/client/edge.js"(exports) {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var {
      PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
      PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
      PrismaClientRustPanicError: PrismaClientRustPanicError2,
      PrismaClientInitializationError: PrismaClientInitializationError2,
      PrismaClientValidationError: PrismaClientValidationError2,
      getPrismaClient: getPrismaClient3,
      sqltag: sqltag2,
      empty: empty2,
      join: join2,
      raw: raw2,
      skip: skip2,
      Decimal: Decimal2,
      Debug: Debug2,
      objectEnumValues: objectEnumValues2,
      makeStrictEnum: makeStrictEnum2,
      Extensions: Extensions2,
      warnOnce: warnOnce2,
      defineDmmfProperty: defineDmmfProperty2,
      Public: Public2,
      getRuntime: getRuntime2,
      createParam: createParam2
    } = require_edge();
    var Prisma = {};
    exports.Prisma = Prisma;
    exports.$Enums = {};
    Prisma.prismaVersion = {
      client: "6.16.0",
      engine: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43"
    };
    Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
    Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
    Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError2;
    Prisma.PrismaClientInitializationError = PrismaClientInitializationError2;
    Prisma.PrismaClientValidationError = PrismaClientValidationError2;
    Prisma.Decimal = Decimal2;
    Prisma.sql = sqltag2;
    Prisma.empty = empty2;
    Prisma.join = join2;
    Prisma.raw = raw2;
    Prisma.validator = Public2.validator;
    Prisma.getExtensionContext = Extensions2.getExtensionContext;
    Prisma.defineExtension = Extensions2.defineExtension;
    Prisma.DbNull = objectEnumValues2.instances.DbNull;
    Prisma.JsonNull = objectEnumValues2.instances.JsonNull;
    Prisma.AnyNull = objectEnumValues2.instances.AnyNull;
    Prisma.NullTypes = {
      DbNull: objectEnumValues2.classes.DbNull,
      JsonNull: objectEnumValues2.classes.JsonNull,
      AnyNull: objectEnumValues2.classes.AnyNull
    };
    exports.Prisma.TransactionIsolationLevel = makeStrictEnum2({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    exports.Prisma.AnecdoteCacheScalarFieldEnum = {
      cacheKey: "cacheKey",
      scope: "scope",
      year: "year",
      lang: "lang",
      country: "country",
      payload: "payload",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.EventCacheScalarFieldEnum = {
      id: "id",
      year: "year",
      country: "country",
      lang: "lang",
      eventQid: "eventQid",
      title: "title",
      fact: "fact",
      sourceUrl: "sourceUrl",
      scene: "scene",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.VoteScalarFieldEnum = {
      id: "id",
      year: "year",
      country: "country",
      lang: "lang",
      eventQid: "eventQid",
      up: "up",
      down: "down",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.AppConfigScalarFieldEnum = {
      key: "key",
      value: "value",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    exports.Prisma.JsonNullValueInput = {
      JsonNull: Prisma.JsonNull
    };
    exports.Prisma.QueryMode = {
      default: "default",
      insensitive: "insensitive"
    };
    exports.Prisma.JsonNullValueFilter = {
      DbNull: Prisma.DbNull,
      JsonNull: Prisma.JsonNull,
      AnyNull: Prisma.AnyNull
    };
    exports.Prisma.NullsOrder = {
      first: "first",
      last: "last"
    };
    exports.Prisma.ModelName = {
      AnecdoteCache: "AnecdoteCache",
      EventCache: "EventCache",
      Vote: "Vote",
      AppConfig: "AppConfig"
    };
    var config2 = {
      "generator": {
        "name": "client",
        "provider": {
          "fromEnvVar": null,
          "value": "prisma-client-js"
        },
        "output": {
          "value": "/Users/jean-brunoricard/dev/BeforeMe/node_modules/@prisma/client",
          "fromEnvVar": null
        },
        "config": {
          "engineType": "library"
        },
        "binaryTargets": [
          {
            "fromEnvVar": null,
            "value": "darwin-arm64",
            "native": true
          }
        ],
        "previewFeatures": [],
        "sourceFilePath": "/Users/jean-brunoricard/dev/BeforeMe/prisma/schema.prisma"
      },
      "relativeEnvPaths": {
        "rootEnvPath": null
      },
      "relativePath": "../../../prisma",
      "clientVersion": "6.16.0",
      "engineVersion": "1c57fdcd7e44b29b9313256c76699e91c3ac3c43",
      "datasourceNames": [
        "db"
      ],
      "activeProvider": "postgresql",
      "postinstall": false,
      "inlineDatasources": {
        "db": {
          "url": {
            "fromEnvVar": "DATABASE_URL",
            "value": null
          }
        }
      },
      "inlineSchema": 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel AnecdoteCache {\n  cacheKey  String   @id @map("cache_key")\n  scope     String\n  year      Int\n  lang      String\n  country   String?\n  payload   Json\n  createdAt DateTime @map("created_at")\n  updatedAt DateTime @map("updated_at")\n\n  @@map("anecdote_cache")\n}\n\nmodel EventCache {\n  id        String   @id @default(cuid())\n  year      Int\n  country   String\n  lang      String\n  eventQid  String   @map("event_qid")\n  title     String\n  fact      String\n  sourceUrl String   @map("source_url")\n  scene     String\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@unique([year, country, lang, eventQid])\n  @@map("event_cache")\n}\n\nmodel Vote {\n  id        String   @id @default(cuid())\n  year      Int\n  country   String\n  lang      String\n  eventQid  String   @map("event_qid")\n  up        Int      @default(0)\n  down      Int      @default(0)\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@unique([year, country, lang, eventQid])\n  @@map("vote")\n}\n\nmodel AppConfig {\n  key       String   @id\n  value     Json\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("app_config")\n}\n',
      "inlineSchemaHash": "b79d95262b57f37d34db1c874519843b9ca43e13b622fcba6de7ed852e600c2b",
      "copyEngine": false
    };
    config2.dirname = "/";
    config2.runtimeDataModel = JSON.parse('{"models":{"AnecdoteCache":{"dbName":"anecdote_cache","schema":null,"fields":[{"name":"cacheKey","dbName":"cache_key","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"scope","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"year","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"lang","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"country","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"payload","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"EventCache":{"dbName":"event_cache","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"year","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"country","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"lang","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"eventQid","dbName":"event_qid","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"fact","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sourceUrl","dbName":"source_url","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"scene","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[["year","country","lang","eventQid"]],"uniqueIndexes":[{"name":null,"fields":["year","country","lang","eventQid"]}],"isGenerated":false},"Vote":{"dbName":"vote","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"year","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"country","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"lang","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"eventQid","dbName":"event_qid","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"up","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"down","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[["year","country","lang","eventQid"]],"uniqueIndexes":[{"name":null,"fields":["year","country","lang","eventQid"]}],"isGenerated":false},"AppConfig":{"dbName":"app_config","schema":null,"fields":[{"name":"key","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"value","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}');
    defineDmmfProperty2(exports.Prisma, config2.runtimeDataModel);
    config2.engineWasm = void 0;
    config2.compilerWasm = void 0;
    config2.injectableEdgeEnv = () => ({
      parsed: {
        DATABASE_URL: typeof globalThis !== "undefined" && globalThis["DATABASE_URL"] || typeof process !== "undefined" && process.env && process.env.DATABASE_URL || void 0
      }
    });
    if (typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0) {
      Debug2.enable(typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0);
    }
    var PrismaClient2 = getPrismaClient3(config2);
    exports.PrismaClient = PrismaClient2;
    Object.assign(exports, Prisma);
  }
});

// ../node_modules/@prisma/client/edge.js
var require_edge3 = __commonJS({
  "../node_modules/@prisma/client/edge.js"(exports, module) {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = {
      // https://github.com/prisma/prisma/pull/12907
      ...require_edge2()
    };
  }
});

// ../node_modules/@prisma/client/scripts/default-index.js
var require_default_index = __commonJS({
  "../node_modules/@prisma/client/scripts/default-index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var default_index_exports = {};
    __export(default_index_exports, {
      Prisma: /* @__PURE__ */ __name(() => Prisma, "Prisma"),
      PrismaClient: /* @__PURE__ */ __name(() => PrismaClient2, "PrismaClient"),
      default: /* @__PURE__ */ __name(() => default_index_default, "default")
    });
    module.exports = __toCommonJS(default_index_exports);
    var prisma = {
      enginesVersion: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43"
    };
    var version2 = "6.16.0";
    var clientVersion = version2;
    var PrismaClient2 = class {
      static {
        __name(this, "PrismaClient");
      }
      constructor() {
        throw new Error('@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.');
      }
    };
    function defineExtension(ext) {
      if (typeof ext === "function") {
        return ext;
      }
      return (client) => client.$extends(ext);
    }
    __name(defineExtension, "defineExtension");
    function getExtensionContext(that) {
      return that;
    }
    __name(getExtensionContext, "getExtensionContext");
    var Prisma = {
      defineExtension,
      getExtensionContext,
      prismaVersion: { client: clientVersion, engine: prisma.enginesVersion }
    };
    var default_index_default = { Prisma };
  }
});

// ../node_modules/@prisma/extension-accelerate/dist/index.js
function f(a, n) {
  let [c = 0, u = 0, m = 0] = a.split(".").map(Number), [o = 0, h = 0, i = 0] = n.split(".").map(Number), r = o - c, e = h - u, t = i - m;
  return r || e || t;
}
function p() {
  let a = import_default_index2.default.Prisma.prismaVersion;
  return [F(), `PrismaEngine/${a.engine}`, `PrismaClient/${a.client}`].join(" ");
}
function F() {
  return typeof navigator < "u" ? "Cloudflare-Workers" : typeof process < "u" && typeof process.versions < "u" ? `Node/${process.versions.node} (${process.platform}; ${process.arch})` : "EdgeRuntime" in globalThis ? "Vercel-Edge-Runtime" : "UnknownRuntime";
}
function b(a) {
  let n = p(), c;
  return async (u) => {
    let { args: m } = u, { cacheStrategy: o, __accelerateInfo: h = false, ...i } = m, r = null, { __internalParams: e, query: t } = u;
    return e.customDataProxyFetch = () => async (s, d) => {
      let A = new Array();
      typeof o?.ttl == "number" && A.push(`max-age=${o.ttl}`), typeof o?.swr == "number" && A.push(`stale-while-revalidate=${o.swr}`);
      let y = o?.tags?.join(",") ?? "";
      d.headers = { ...d.headers, "cache-control": A.length > 0 ? A.join(",") : "no-cache", "user-agent": n, ...y.length > 0 ? { "accelerate-cache-tags": y } : {} }, c && (d.headers["accelerate-query-engine-jwt"] = c);
      try {
        let g = await a(s, d);
        return r = { cacheStatus: g.headers.get("accelerate-cache-status"), lastModified: new Date(g.headers.get("last-modified") ?? ""), region: g.headers.get("cf-ray")?.split("-")[1] ?? "unspecified", requestId: g.headers.get("cf-ray") ?? "unspecified", signature: g.headers.get("accelerate-signature") ?? "unspecified" }, c = g.headers.get("accelerate-query-engine-jwt") ?? void 0, g;
      } catch {
        throw new Error(x);
      }
    }, h ? { data: await t(i, e), info: r } : t(i, e);
  };
}
function T(a) {
  let n = f("5.1.0", import_default_index.default.Prisma.prismaVersion.client) >= 0;
  return import_default_index.default.Prisma.defineExtension((c) => {
    let { apiKeyPromise: u, baseURL: m } = S(c), o = b(a);
    async function h(r) {
      let e = await u;
      if (!e) return { requestId: "unspecified" };
      let t;
      try {
        t = await a(new URL("/invalidate", m).href, { method: "POST", headers: { authorization: `Bearer ${e}`, "content-type": "application/json" }, body: JSON.stringify(r) });
      } catch {
        throw new Error(x);
      }
      if (!t?.ok) {
        let s = await t.text();
        throw new Error(`Failed to invalidate Accelerate cache. Response was ${t.status} ${t.statusText}. ${s}`);
      }
      return t.body?.cancel(), { requestId: t.headers.get("cf-ray") ?? "unspecified" };
    }
    __name(h, "h");
    let i = c.$extends({ name: P, query: { $allModels: { $allOperations: o } } });
    return i.$extends({ name: P, client: { $accelerate: { invalidate: /* @__PURE__ */ __name((r) => h(r), "invalidate"), invalidateAll: /* @__PURE__ */ __name(() => h({ tags: "all" }), "invalidateAll") } }, model: { $allModels: { aggregate(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.aggregate(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.aggregate({ ...r, __accelerateInfo: true });
      } });
    }, count(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.count(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.count({ ...r, __accelerateInfo: true });
      } });
    }, findFirst(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findFirst(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findFirst({ ...r, __accelerateInfo: true });
      } });
    }, findFirstOrThrow(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findFirstOrThrow(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findFirstOrThrow({ ...r, __accelerateInfo: true });
      } });
    }, findMany(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findMany(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findMany({ ...r, __accelerateInfo: true });
      } });
    }, findUnique(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findUnique(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findUnique({ ...r, __accelerateInfo: true });
      } });
    }, findUniqueOrThrow(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findUniqueOrThrow(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findUniqueOrThrow({ ...r, __accelerateInfo: true });
      } });
    }, groupBy(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.groupBy(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.groupBy({ ...r, __accelerateInfo: true });
      } });
    } } } });
  });
}
function S(a) {
  let n = Reflect.get(a, "_accelerateEngineConfig");
  try {
    let { host: c, hostname: u, protocol: m, searchParams: o } = new URL(n?.accelerateUtils?.resolveDatasourceUrl?.(n));
    if (m === "prisma+postgres:" && (u === "localhost" || u === "127.0.0.1")) return { apiKeyPromise: Promise.resolve(o.get("api_key")), baseURL: new URL(`http://${c}`) };
  } catch {
  }
  return { apiKeyPromise: a._engine.start().then(() => a._engine.apiKey?.() ?? null), baseURL: new URL("https://accelerate.prisma-data.net") };
}
function k(a) {
  let n = a?.fetch ?? fetch;
  return T(n);
}
var import_default_index, import_default_index2, P, x;
var init_dist = __esm({
  "../node_modules/@prisma/extension-accelerate/dist/index.js"() {
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_default_index = __toESM(require_default_index(), 1);
    import_default_index2 = __toESM(require_default_index(), 1);
    __name(f, "f");
    __name(p, "p");
    __name(F, "F");
    P = "@prisma/extension-accelerate";
    x = "Unable to connect to the Accelerate API. This may be due to a network or DNS issue. Please check your connection and the Accelerate connection string. For details, visit https://www.prisma.io/docs/accelerate/troubleshoot.";
    __name(b, "b");
    __name(T, "T");
    __name(S, "S");
    __name(k, "k");
  }
});

// lib/prisma.js
function getPrismaClient2(env2) {
  if (prismaClient) {
    return prismaClient;
  }
  const url = String(env2?.DATABASE_URL || env2?.PRISMA_ACCELERATE_URL || "").trim();
  if (!url) {
    throw new Error("DATABASE_URL is missing");
  }
  const base = new import_edge.PrismaClient({
    datasources: {
      db: { url }
    }
  });
  prismaClient = base.$extends(k());
  return prismaClient;
}
var import_edge, prismaClient;
var init_prisma = __esm({
  "lib/prisma.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_edge = __toESM(require_edge3(), 1);
    init_dist();
    prismaClient = null;
    __name(getPrismaClient2, "getPrismaClient");
  }
});

// lib/admin-auth.js
function toBase64Url(value) {
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
function fromBase64Url(value) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return atob(`${normalized}${padding}`);
}
function textEncoder() {
  return new TextEncoder();
}
function getSessionSecret(env2) {
  return String(env2?.ADMIN_SESSION_SECRET || "").trim();
}
function allowedEmails(env2) {
  const raw2 = String(env2?.ADMIN_GOOGLE_EMAILS || env2?.ADMIN_GOOGLE_EMAIL || "").trim();
  return raw2.split(",").map((entry) => entry.trim().toLowerCase()).filter(Boolean);
}
function googleClientId(env2) {
  return String(env2?.ADMIN_GOOGLE_CLIENT_ID || env2?.GOOGLE_CLIENT_ID || "").trim();
}
async function hmacSign(input, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder().encode(input));
  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}
async function createAdminSessionToken(payload, env2) {
  const secret = getSessionSecret(env2);
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is missing");
  }
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await hmacSign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}
async function verifyAdminSessionToken(token, env2) {
  const secret = getSessionSecret(env2);
  if (!secret) {
    return { ok: false, reason: "session_secret_missing" };
  }
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) {
    return { ok: false, reason: "malformed" };
  }
  const expected = await hmacSign(encodedPayload, secret);
  if (signature !== expected) {
    return { ok: false, reason: "signature_mismatch" };
  }
  let payload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload));
  } catch {
    return { ok: false, reason: "invalid_payload" };
  }
  const email = String(payload?.email || "").trim().toLowerCase();
  const exp = Number(payload?.exp || 0);
  if (!email || !Number.isFinite(exp)) {
    return { ok: false, reason: "invalid_claims" };
  }
  if (Date.now() >= exp * 1e3) {
    return { ok: false, reason: "expired" };
  }
  const allowList = allowedEmails(env2);
  if (!allowList.length) {
    return { ok: false, reason: "allowlist_missing" };
  }
  if (!allowList.includes(email)) {
    return { ok: false, reason: "email_not_allowed" };
  }
  return { ok: true, email };
}
function extractBearerToken(request) {
  const header = String(request.headers.get("Authorization") || "");
  if (!header.toLowerCase().startsWith("bearer ")) {
    return "";
  }
  return header.slice(7).trim();
}
async function requireAdminSession(request, env2) {
  const token = extractBearerToken(request);
  if (!token) {
    return { ok: false, status: 401, error: "missing_session" };
  }
  const result = await verifyAdminSessionToken(token, env2);
  if (!result.ok) {
    return { ok: false, status: 401, error: result.reason || "invalid_session" };
  }
  return { ok: true, email: result.email };
}
function getAdminGoogleClientId(env2) {
  return googleClientId(env2);
}
function isAllowedAdminEmail(email, env2) {
  const allowList = allowedEmails(env2);
  if (!allowList.length) return false;
  return allowList.includes(String(email || "").trim().toLowerCase());
}
function hasAdminAllowList(env2) {
  return allowedEmails(env2).length > 0;
}
var init_admin_auth = __esm({
  "lib/admin-auth.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(toBase64Url, "toBase64Url");
    __name(fromBase64Url, "fromBase64Url");
    __name(textEncoder, "textEncoder");
    __name(getSessionSecret, "getSessionSecret");
    __name(allowedEmails, "allowedEmails");
    __name(googleClientId, "googleClientId");
    __name(hmacSign, "hmacSign");
    __name(createAdminSessionToken, "createAdminSessionToken");
    __name(verifyAdminSessionToken, "verifyAdminSessionToken");
    __name(extractBearerToken, "extractBearerToken");
    __name(requireAdminSession, "requireAdminSession");
    __name(getAdminGoogleClientId, "getAdminGoogleClientId");
    __name(isAllowedAdminEmail, "isAllowedAdminEmail");
    __name(hasAdminAllowList, "hasAdminAllowList");
  }
});

// api/admin/events.js
function responseHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  };
}
function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders()
  });
}
function parseYear(raw2) {
  if (!raw2) return null;
  const year = Number(raw2);
  return Number.isInteger(year) ? year : null;
}
function isMissingTableError(error3) {
  const message = String(error3 instanceof Error ? error3.message : "");
  return message.includes("does not exist") || message.includes("relation") || message.includes("event_cache");
}
async function onRequestOptions() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}
async function onRequestGet(context2) {
  const auth = await requireAdminSession(context2.request, context2.env);
  if (!auth.ok) {
    return json(auth.status || 401, { error: auth.error || "unauthorized" });
  }
  try {
    const year = parseYear(context2.params?.year || new URL(context2.request.url).searchParams.get("year"));
    const where = year ? { year, country: "FR" } : { country: "FR" };
    const client = getPrismaClient2(context2.env);
    const rows = await client.eventCache.findMany({
      where,
      orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
      take: 300,
      select: {
        year: true,
        country: true,
        lang: true,
        eventQid: true,
        title: true,
        fact: true,
        sourceUrl: true,
        updatedAt: true
      }
    });
    return json(200, { items: rows });
  } catch (error3) {
    if (isMissingTableError(error3)) {
      return json(200, { items: [] });
    }
    return json(500, { error: error3 instanceof Error ? error3.message : "internal_error" });
  }
}
async function onRequestDelete(context2) {
  const auth = await requireAdminSession(context2.request, context2.env);
  if (!auth.ok) {
    return json(auth.status || 401, { error: auth.error || "unauthorized" });
  }
  try {
    const requestUrl = new URL(context2.request.url);
    const year = parseYear(requestUrl.searchParams.get("year"));
    const eventQid = String(requestUrl.searchParams.get("eventQid") || "").trim();
    const lang = String(requestUrl.searchParams.get("lang") || "fr").trim();
    if (!year || !eventQid) {
      return json(400, { error: "year and eventQid are required" });
    }
    const client = getPrismaClient2(context2.env);
    await client.eventCache.delete({
      where: {
        year_country_lang_eventQid: {
          year,
          country: "FR",
          lang,
          eventQid
        }
      }
    });
    return json(200, { ok: true });
  } catch (error3) {
    if (isMissingTableError(error3)) {
      return json(200, { ok: true });
    }
    return json(500, { error: error3 instanceof Error ? error3.message : "internal_error" });
  }
}
var init_events = __esm({
  "api/admin/events.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_prisma();
    init_admin_auth();
    __name(responseHeaders, "responseHeaders");
    __name(json, "json");
    __name(parseYear, "parseYear");
    __name(isMissingTableError, "isMissingTableError");
    __name(onRequestOptions, "onRequestOptions");
    __name(onRequestGet, "onRequestGet");
    __name(onRequestDelete, "onRequestDelete");
  }
});

// api/admin/purge-cache.js
function responseHeaders2() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function json2(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders2() });
}
function isMissingTableError2(error3) {
  const message = String(error3 instanceof Error ? error3.message : "");
  return message.includes("does not exist") || message.includes("relation");
}
async function onRequestOptions2() {
  return new Response(null, { status: 204, headers: responseHeaders2() });
}
async function onRequestPost(context2) {
  const url = new URL(context2.request.url);
  const confirm = String(url.searchParams.get("confirm") || "").trim();
  if (confirm !== "YES_DELETE_CACHE") {
    return json2(400, { error: "Missing confirm=YES_DELETE_CACHE" });
  }
  try {
    const client = getPrismaClient2(context2.env);
    const [eventResult, anecdoteResult] = await Promise.all([
      client.eventCache.deleteMany({ where: {} }),
      client.anecdoteCache.deleteMany({ where: {} })
    ]);
    return json2(200, {
      ok: true,
      deleted: {
        eventCache: Number(eventResult.count || 0),
        anecdoteCache: Number(anecdoteResult.count || 0)
      }
    });
  } catch (error3) {
    if (isMissingTableError2(error3)) {
      return json2(200, {
        ok: true,
        deleted: { eventCache: 0, anecdoteCache: 0 },
        note: "One or more cache tables are missing."
      });
    }
    return json2(500, { error: error3 instanceof Error ? error3.message : "purge_failed" });
  }
}
var init_purge_cache = __esm({
  "api/admin/purge-cache.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_prisma();
    __name(responseHeaders2, "responseHeaders");
    __name(json2, "json");
    __name(isMissingTableError2, "isMissingTableError");
    __name(onRequestOptions2, "onRequestOptions");
    __name(onRequestPost, "onRequestPost");
  }
});

// api/admin/session.js
function responseHeaders3() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  };
}
function json3(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders3()
  });
}
function log3(event, payload) {
  console.log(JSON.stringify({ service: "admin-session", event, ...payload }));
}
function validateIdToken(raw2) {
  const token = String(raw2 || "").trim();
  if (!token) {
    return { ok: false, error: "missing_id_token" };
  }
  if (token.length > 8e3) {
    return { ok: false, error: "id_token_too_long" };
  }
  return { ok: true, token };
}
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "GET",
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}
async function fetchGoogleTokenInfo(idToken) {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  let lastError = new Error("tokeninfo_failed");
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, 5e3);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(String(payload?.error_description || payload?.error || `status_${response.status}`));
      }
      return payload;
    } catch (error3) {
      lastError = error3 instanceof Error ? error3 : new Error("tokeninfo_failed");
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 250));
      }
    }
  }
  throw lastError;
}
function parseBody(raw2) {
  if (!raw2 || typeof raw2 !== "object") {
    return {};
  }
  return raw2;
}
function parseGoogleClaims(payload) {
  const email = String(payload?.email || "").trim().toLowerCase();
  const verified = String(payload?.email_verified || "").toLowerCase() === "true";
  const aud = String(payload?.aud || "").trim();
  return { email, verified, aud };
}
async function onRequestOptions3() {
  return new Response(null, { status: 204, headers: responseHeaders3() });
}
async function onRequestGet2(context2) {
  const clientId = getAdminGoogleClientId(context2.env);
  const auth = await requireAdminSession(context2.request, context2.env);
  return json3(200, {
    authenticated: auth.ok,
    email: auth.ok ? auth.email : null,
    googleClientId: clientId || null
  });
}
async function onRequestDelete2() {
  return json3(200, { ok: true });
}
async function onRequestPost2(context2) {
  const requestId = crypto.randomUUID();
  const clientId = getAdminGoogleClientId(context2.env);
  if (!clientId) {
    log3("config_error", { requestId, reason: "missing_google_client_id" });
    return json3(500, { error: "google_client_id_missing" });
  }
  if (!hasAdminAllowList(context2.env)) {
    log3("config_error", { requestId, reason: "missing_admin_google_emails" });
    return json3(500, { error: "admin_google_emails_missing" });
  }
  let body;
  try {
    body = parseBody(await context2.request.json());
  } catch {
    return json3(400, { error: "invalid_json" });
  }
  const idTokenCheck = validateIdToken(body.idToken);
  if (!idTokenCheck.ok) {
    return json3(400, { error: idTokenCheck.error });
  }
  try {
    const tokenInfo = await fetchGoogleTokenInfo(idTokenCheck.token);
    const claims = parseGoogleClaims(tokenInfo);
    if (!claims.verified) {
      log3("auth_denied", { requestId, reason: "email_not_verified" });
      return json3(401, { error: "email_not_verified" });
    }
    if (claims.aud !== clientId) {
      log3("auth_denied", { requestId, reason: "aud_mismatch" });
      return json3(401, { error: "aud_mismatch" });
    }
    if (!isAllowedAdminEmail(claims.email, context2.env)) {
      log3("auth_denied", { requestId, reason: "email_not_allowed", email: claims.email });
      return json3(403, { error: "email_not_allowed" });
    }
    const nowSec = Math.floor(Date.now() / 1e3);
    const exp = nowSec + SESSION_TTL_SECONDS;
    const sessionToken = await createAdminSessionToken(
      {
        email: claims.email,
        iat: nowSec,
        exp
      },
      context2.env
    );
    log3("auth_success", { requestId, email: claims.email });
    return json3(200, {
      ok: true,
      email: claims.email,
      sessionToken,
      expiresIn: SESSION_TTL_SECONDS
    });
  } catch (error3) {
    const message = error3 instanceof Error ? error3.message : "unknown";
    if (message.includes("ADMIN_SESSION_SECRET is missing")) {
      log3("config_error", { requestId, reason: "missing_admin_session_secret" });
      return json3(500, { error: "admin_session_secret_missing" });
    }
    log3("tokeninfo_error", { requestId, message });
    return json3(502, { error: "google_verification_failed" });
  }
}
var SESSION_TTL_SECONDS;
var init_session = __esm({
  "api/admin/session.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_admin_auth();
    SESSION_TTL_SECONDS = 60 * 60 * 12;
    __name(responseHeaders3, "responseHeaders");
    __name(json3, "json");
    __name(log3, "log");
    __name(validateIdToken, "validateIdToken");
    __name(fetchWithTimeout, "fetchWithTimeout");
    __name(fetchGoogleTokenInfo, "fetchGoogleTokenInfo");
    __name(parseBody, "parseBody");
    __name(parseGoogleClaims, "parseGoogleClaims");
    __name(onRequestOptions3, "onRequestOptions");
    __name(onRequestGet2, "onRequestGet");
    __name(onRequestDelete2, "onRequestDelete");
    __name(onRequestPost2, "onRequestPost");
  }
});

// lib/wiki-lead.js
function normalizeWhitespace(text) {
  return String(text || "").replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}
function truncateToSentence(text, maxChars = 1200) {
  const clean = normalizeWhitespace(text);
  if (clean.length <= maxChars) return clean;
  const slice = clean.slice(0, maxChars);
  const lastPunctuation = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("!"), slice.lastIndexOf("?"));
  if (lastPunctuation > 200) {
    return slice.slice(0, lastPunctuation + 1).trim();
  }
  return `${slice.trim()}...`;
}
function parseWikipediaUrl(sourceUrl) {
  try {
    const parsed = new URL(sourceUrl);
    const host = parsed.hostname.toLowerCase();
    const lang = host.split(".")[0];
    if (!host.endsWith("wikipedia.org")) return null;
    const pathMatch = parsed.pathname.match(/^\/wiki\/(.+)$/);
    if (!pathMatch) return null;
    const title2 = decodeURIComponent(pathMatch[1]).replaceAll("_", " ").trim();
    if (!title2) return null;
    return { lang, title: title2 };
  } catch {
    return null;
  }
}
async function fetchJsonWithRetry(url, retries = 1) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WIKI_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "AvantMoi/1.0 (contact: contact@avantmoi.com)"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }
      return await response.json();
    } catch (error3) {
      lastError = error3;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error("wiki_fetch_failed");
}
function extractLeadText(payload) {
  const pages = payload?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  return normalizeWhitespace(firstPage?.extract || "");
}
function buildWikiApiUrl(lang, title2, includeIntroOnly) {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("prop", "extracts");
  url.searchParams.set("explaintext", "1");
  if (includeIntroOnly) {
    url.searchParams.set("exintro", "1");
  }
  url.searchParams.set("redirects", "1");
  url.searchParams.set("titles", title2);
  url.searchParams.set("origin", "*");
  return url.toString();
}
async function getWikiLead(sourceUrl) {
  const parsed = parseWikipediaUrl(sourceUrl);
  if (!parsed) return "";
  const { lang, title: title2 } = parsed;
  try {
    const introPayload = await fetchJsonWithRetry(buildWikiApiUrl(lang, title2, true), 1);
    let lead = extractLeadText(introPayload);
    if (lead.length < 200) {
      const fullPayload = await fetchJsonWithRetry(buildWikiApiUrl(lang, title2, false), 1);
      lead = extractLeadText(fullPayload);
    }
    if (!lead) return "";
    return truncateToSentence(lead, 1200);
  } catch {
    return "";
  }
}
var WIKI_TIMEOUT_MS;
var init_wiki_lead = __esm({
  "lib/wiki-lead.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WIKI_TIMEOUT_MS = 7e3;
    __name(normalizeWhitespace, "normalizeWhitespace");
    __name(truncateToSentence, "truncateToSentence");
    __name(parseWikipediaUrl, "parseWikipediaUrl");
    __name(fetchJsonWithRetry, "fetchJsonWithRetry");
    __name(extractLeadText, "extractLeadText");
    __name(buildWikiApiUrl, "buildWikiApiUrl");
    __name(getWikiLead, "getWikiLead");
  }
});

// api/anecdotes/strict-editor.js
function responseHeaders4() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function json4(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders4() });
}
function log4(level, message, context2 = {}) {
  const payload = { level, message, ts: (/* @__PURE__ */ new Date()).toISOString(), ...context2 };
  if (level === "error") console.error(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
}
function normalizeText(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function sentenceCount(text) {
  return String(text || "").split(/[.!?]/).map((part) => part.trim()).filter(Boolean).length;
}
function countWords(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}
function hasConcreteElement(text) {
  return /(paves|pavés|banderole|badge|ticket|raquette|tribune|panneau|vitrine|tele|télé|camera|caméra|guichet|barricade|flamme|affiche|micro|casque|journal|rideau)/i.test(text);
}
function hasHumanAction(text) {
  return /(lit|lisent|cour|court|courent|applaudit|applaudissent|compose|composent|colle|collent|ferme|ferment|pointe|pointent|crie|crient|avance|avancent|ouvre|ouvrent|regarde|regardent|arrache|arrachent)/i.test(text);
}
function hasSensoryDetail(text) {
  return /(bruit|odeur|lumiere|lumière|froid|poussiere|poussière|fumee|fumée|cris|vibration|metal|métal|claquement)/i.test(text);
}
function hasImmediateConsequence(text) {
  return /(tout de suite|immédiatement|immediatement|dans la minute|d'un coup|aussitôt|aussitot|tu dois|tu ne peux plus|la file change|la rue se vide)/i.test(text);
}
function validateSceneStrict(scene) {
  const s = String(scene || "").trim();
  if (!s) return { ok: false, reason: "scene_empty" };
  const words = countWords(s);
  const sentences = sentenceCount(s);
  if (sentences < 3 || sentences > 4) return { ok: false, reason: "scene_sentence_count" };
  if (words < 50 || words > 90) return { ok: false, reason: "scene_word_count" };
  if (!/\btu\b/i.test(s)) return { ok: false, reason: "scene_missing_second_person" };
  if (!hasConcreteElement(s)) return { ok: false, reason: "scene_missing_concrete_element" };
  if (!hasHumanAction(s)) return { ok: false, reason: "scene_missing_human_action" };
  if (!hasSensoryDetail(s)) return { ok: false, reason: "scene_missing_sensory_detail" };
  if (!hasImmediateConsequence(s)) return { ok: false, reason: "scene_missing_immediate_consequence" };
  const lowered = normalizeText(s);
  for (const word of BANNED_WORDS) {
    if (lowered.includes(normalizeText(word))) return { ok: false, reason: `scene_banned_word:${word}` };
  }
  for (const pattern of BANNED_PATTERNS) {
    if (lowered.includes(normalizeText(pattern))) return { ok: false, reason: `scene_banned_pattern:${pattern}` };
  }
  return { ok: true };
}
function validateFactStrict(fact) {
  const f2 = String(fact || "").trim();
  if (!f2) return { ok: false, reason: "fact_empty" };
  if (sentenceCount(f2) > 1) return { ok: false, reason: "fact_sentence_count" };
  if (countWords(f2) > 28) return { ok: false, reason: "fact_too_long" };
  if (!/\d{4}|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|1968/i.test(f2)) {
    return { ok: false, reason: "fact_missing_date_or_period" };
  }
  return { ok: true };
}
function extractDateOrPeriod(lead, fallbackYear) {
  const text = String(lead || "");
  const fullDate = text.match(/\b\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+1968\b/i);
  if (fullDate) return fullDate[0];
  const monthYear = text.match(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+1968\b/i);
  if (monthYear) return monthYear[0];
  return `1968`;
}
function extractPlace(lead) {
  const text = String(lead || "");
  const placeMatch = text.match(/\b(Paris|Lyon|Marseille|Grenoble|Cannes|Nanterre|Strasbourg|Bordeaux|Toulouse|Nantes|Nice|Lille)\b/);
  return placeMatch ? placeMatch[1] : "Paris";
}
function buildFallbackSceneFromLead({ title: title2, wikiLead }) {
  const whenText = extractDateOrPeriod(wikiLead, 1968);
  const placeText = extractPlace(wikiLead);
  const concrete = /festival|cannes/i.test(title2) ? "une affiche pli\xE9e" : "une banderole froiss\xE9e";
  const action = /festival|cannes/i.test(title2) ? "des passants lisent le programme" : "des \xE9tudiants collent des tracts";
  const sensory = /fumée|gaz|lacrymogène/i.test(wikiLead) ? "Une odeur de fum\xE9e pique la gorge." : "Le bruit des slogans rebondit contre les vitrines.";
  return `${whenText}, ${placeText} : tu tiens ${concrete} pendant que ${action} devant toi. Un agent pointe la rue, la foule recule puis revient en courant vers le carrefour. ${sensory} Pour avancer, tu dois changer d\u2019itin\xE9raire imm\xE9diatement et contourner le bloc suivant.`;
}
function buildFallbackFactFromLead({ wikiLead, title: title2 }) {
  const firstSentence = String(wikiLead || "").split(/(?<=[.!?])\s+/)[0]?.trim() || "";
  if (firstSentence && /1968|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre/i.test(firstSentence)) {
    const compact = firstSentence.replace(/\s+/g, " ").trim().split(" ").slice(0, 24).join(" ");
    return compact.endsWith(".") ? compact : `${compact}.`;
  }
  const whenText = extractDateOrPeriod(wikiLead, 1968);
  return `${title2} se d\xE9roule en ${whenText} en France selon la source Wikip\xE9dia.`;
}
async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runOne() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }
  __name(runOne, "runOne");
  const runners = Array.from({ length: Math.max(1, Math.min(concurrency, 3)) }, () => runOne());
  await Promise.all(runners);
  return results;
}
async function rewriteWithModel({ item, wikiLead, year, country, env: env2 }) {
  const apiKey = env2.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");
  const prompt = [
    "Tu es l\u2019\xE9diteur strict d\u2019avantmoi.com.",
    "R\xE9\xE9cris JSON avec EXACTEMENT les cl\xE9s scene et fact.",
    "R\xE8gles: sc\xE8ne 3-4 phrases, 50-90 mots, 2e personne, pr\xE9sent, France, ann\xE9e 1968 uniquement.",
    "Inclure: 1 \xE9l\xE9ment concret, 1 action humaine, 1 d\xE9tail sensoriel, 1 cons\xE9quence imm\xE9diate.",
    "Interdire les formulations g\xE9n\xE9riques et mots vagues.",
    "Fact: 1 phrase v\xE9rifiable issue du lead.",
    `Year: ${year}`,
    `Country: ${country}`,
    `Title: ${item.title}`,
    `Source: ${item.sourceUrl}`,
    `WikiLead: ${wikiLead}`
  ].join("\n");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: String(env2.OPENAI_MODEL || MODEL_NAME),
      input: prompt,
      max_output_tokens: 350,
      text: {
        format: {
          type: "json_schema",
          name: "strict_editor_output",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              scene: { type: "string" },
              fact: { type: "string" }
            },
            required: ["scene", "fact"]
          }
        }
      }
    })
  });
  if (!response.ok) {
    throw new Error(`openai_http_${response.status}`);
  }
  const payload = await response.json();
  let output = payload?.output_parsed || null;
  if (!output || typeof output !== "object") {
    const outputText = String(payload?.output_text || "").trim();
    if (outputText) {
      try {
        output = JSON.parse(outputText);
      } catch {
        const sceneMatch = outputText.match(/scene\s*[:=]\s*(.+)/i);
        const factMatch = outputText.match(/fact\s*[:=]\s*(.+)/i);
        output = {
          scene: sceneMatch ? sceneMatch[1].trim() : "",
          fact: factMatch ? factMatch[1].trim() : ""
        };
      }
    }
  }
  const scene = String(output?.scene || "").trim();
  const fact = String(output?.fact || "").trim();
  if (scene && fact) return { scene, fact };
  return {
    scene: buildFallbackSceneFromLead({ title: item.title, wikiLead }),
    fact: buildFallbackFactFromLead({ wikiLead, title: item.title })
  };
}
function sanitizeInputItems(rawItems) {
  return (Array.isArray(rawItems) ? rawItems : []).map((item) => ({
    uniqueEventId: String(item?.uniqueEventId || "").trim(),
    eventQid: String(item?.eventQid || "").trim(),
    title: String(item?.title || "").trim(),
    sourceUrl: String(item?.sourceUrl || "").trim()
  }));
}
async function onRequestOptions4() {
  return new Response(null, { status: 204, headers: responseHeaders4() });
}
async function onRequestPost3(context2) {
  const requestId = crypto.randomUUID();
  let payload;
  try {
    payload = await context2.request.json();
  } catch {
    return json4(400, { error: "invalid_json_body", requestId });
  }
  const year = Number(payload?.year);
  const country = String(payload?.country || "").toUpperCase();
  const inputItems = sanitizeInputItems(payload?.items);
  if (!Number.isInteger(year) || country !== "FR" || inputItems.length === 0) {
    return json4(400, { error: "invalid_payload", requestId });
  }
  const client = getPrismaClient2(context2.env);
  const rejected = [];
  const outputItems = [];
  const start = Date.now();
  const enriched = await mapWithConcurrency(inputItems, 3, async (item) => {
    const wikiLead = await getWikiLead(item.sourceUrl);
    if (!wikiLead) {
      return { ...item, wikiLead: "", invalidReason: "missing_wikiLead" };
    }
    return { ...item, wikiLead };
  });
  for (const item of enriched) {
    if (outputItems.length >= MAX_ITEMS) break;
    if (!item.wikiLead) {
      rejected.push({
        uniqueEventId: item.uniqueEventId,
        eventQid: item.eventQid,
        title: item.title,
        reason: item.invalidReason || "missing_wikiLead"
      });
      continue;
    }
    const cacheLang = `${CACHE_LANG_PREFIX}${item.uniqueEventId}`;
    if (!DISABLE_STRICT_EDITOR_CACHE) {
      const cached = await client.eventCache.findUnique({
        where: {
          year_country_lang_eventQid: {
            year,
            country,
            lang: cacheLang,
            eventQid: item.eventQid
          }
        },
        select: {
          title: true,
          scene: true,
          fact: true,
          sourceUrl: true
        }
      });
      if (cached?.scene && cached?.fact) {
        outputItems.push({
          uniqueEventId: item.uniqueEventId,
          eventQid: item.eventQid,
          title: cached.title,
          scene: cached.scene,
          fact: cached.fact,
          sourceUrl: cached.sourceUrl
        });
        continue;
      }
    }
    try {
      const rewritten = await rewriteWithModel({
        item,
        wikiLead: item.wikiLead,
        year,
        country,
        env: context2.env
      });
      const sceneCheck = validateSceneStrict(rewritten.scene);
      if (!sceneCheck.ok) {
        rejected.push({
          uniqueEventId: item.uniqueEventId,
          eventQid: item.eventQid,
          title: item.title,
          reason: sceneCheck.reason
        });
        continue;
      }
      let fact = rewritten.fact;
      let factCheck = validateFactStrict(fact);
      if (!factCheck.ok) {
        fact = buildFallbackFactFromLead({ wikiLead: item.wikiLead, title: item.title });
        factCheck = validateFactStrict(fact);
      }
      if (!factCheck.ok) {
        rejected.push({
          uniqueEventId: item.uniqueEventId,
          eventQid: item.eventQid,
          title: item.title,
          reason: factCheck.reason
        });
        continue;
      }
      if (!DISABLE_STRICT_EDITOR_CACHE) {
        await client.eventCache.upsert({
          where: {
            year_country_lang_eventQid: {
              year,
              country,
              lang: cacheLang,
              eventQid: item.eventQid
            }
          },
          create: {
            year,
            country,
            lang: cacheLang,
            eventQid: item.eventQid,
            title: item.title,
            scene: rewritten.scene,
            fact,
            sourceUrl: item.sourceUrl
          },
          update: {
            title: item.title,
            scene: rewritten.scene,
            fact,
            sourceUrl: item.sourceUrl
          }
        });
      }
      outputItems.push({
        uniqueEventId: item.uniqueEventId,
        eventQid: item.eventQid,
        title: item.title,
        scene: rewritten.scene,
        fact,
        sourceUrl: item.sourceUrl
      });
    } catch (error3) {
      rejected.push({
        uniqueEventId: item.uniqueEventId,
        eventQid: item.eventQid,
        title: item.title,
        reason: error3 instanceof Error ? error3.message : "rewrite_failed"
      });
    }
  }
  const partial = outputItems.length < MAX_ITEMS;
  const responsePayload = {
    year,
    country,
    partial,
    items: outputItems.slice(0, MAX_ITEMS),
    rejected
  };
  log4("info", "strict_editor_completed", {
    requestId,
    year,
    country,
    count: responsePayload.items.length,
    rejected: responsePayload.rejected.length,
    partial,
    durationMs: Date.now() - start
  });
  return json4(200, responsePayload);
}
var MODEL_NAME, MAX_ITEMS, CACHE_LANG_PREFIX, DISABLE_STRICT_EDITOR_CACHE, BANNED_WORDS, BANNED_PATTERNS;
var init_strict_editor = __esm({
  "api/anecdotes/strict-editor.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_prisma();
    init_wiki_lead();
    MODEL_NAME = "gpt-4.1-mini";
    MAX_ITEMS = 20;
    CACHE_LANG_PREFIX = "strict-editor:v2:";
    DISABLE_STRICT_EDITOR_CACHE = true;
    BANNED_WORDS = [
      "chose",
      "ph\xE9nom\xE8ne",
      "phenomene",
      "dispositif",
      "innovation",
      "quelque chose",
      "atmosph\xE8re",
      "atmosphere",
      "symbole",
      "tension",
      "espoir",
      "\xE9v\xE9nement",
      "evenement",
      "situation",
      "transformation",
      "r\xE9volution",
      "revolution",
      "contexte",
      "ambiance",
      "impact",
      "progr\xE8s",
      "progres",
      "\xE9volution",
      "evolution",
      "soci\xE9t\xE9",
      "societe",
      "modernit\xE9",
      "modernite",
      "syst\xE8me",
      "systeme",
      "dynamique",
      "processus"
    ];
    BANNED_PATTERNS = [
      "appara\xEEt devant toi",
      "apparait devant toi",
      "coupe le passage",
      "un bruit sec part du trottoir",
      "ce geste devient la norme"
    ];
    __name(responseHeaders4, "responseHeaders");
    __name(json4, "json");
    __name(log4, "log");
    __name(normalizeText, "normalizeText");
    __name(sentenceCount, "sentenceCount");
    __name(countWords, "countWords");
    __name(hasConcreteElement, "hasConcreteElement");
    __name(hasHumanAction, "hasHumanAction");
    __name(hasSensoryDetail, "hasSensoryDetail");
    __name(hasImmediateConsequence, "hasImmediateConsequence");
    __name(validateSceneStrict, "validateSceneStrict");
    __name(validateFactStrict, "validateFactStrict");
    __name(extractDateOrPeriod, "extractDateOrPeriod");
    __name(extractPlace, "extractPlace");
    __name(buildFallbackSceneFromLead, "buildFallbackSceneFromLead");
    __name(buildFallbackFactFromLead, "buildFallbackFactFromLead");
    __name(mapWithConcurrency, "mapWithConcurrency");
    __name(rewriteWithModel, "rewriteWithModel");
    __name(sanitizeInputItems, "sanitizeInputItems");
    __name(onRequestOptions4, "onRequestOptions");
    __name(onRequestPost3, "onRequestPost");
  }
});

// api/ad-config.js
function responseHeaders5() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  };
}
function json5(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders5()
  });
}
function defaultConfig() {
  return {
    mode: "label",
    label: "Propos\xE9 par avantmoi.com",
    html: "",
    imageUrl: "",
    linkUrl: ""
  };
}
function isMissingTableError3(error3) {
  const message = String(error3 instanceof Error ? error3.message : "");
  return message.includes("does not exist") || message.includes("relation") || message.includes("app_config");
}
async function parseBody2(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
async function onRequestOptions5() {
  return new Response(null, { status: 204, headers: responseHeaders5() });
}
async function onRequestGet3(context2) {
  try {
    const client = getPrismaClient2(context2.env);
    const row = await client.appConfig.findUnique({
      where: { key: CONFIG_KEY }
    });
    return json5(200, row?.value || transientValue || defaultConfig());
  } catch (error3) {
    if (isMissingTableError3(error3)) {
      return json5(200, transientValue || defaultConfig());
    }
    return json5(200, transientValue || defaultConfig());
  }
}
async function onRequestPut(context2) {
  const auth = await requireAdminSession(context2.request, context2.env);
  if (!auth.ok) {
    return json5(auth.status || 401, { error: auth.error || "unauthorized" });
  }
  try {
    const body = await parseBody2(context2.request);
    const value = {
      mode: String(body.mode || "label"),
      label: String(body.label || "Propos\xE9 par avantmoi.com"),
      html: String(body.html || ""),
      imageUrl: String(body.imageUrl || ""),
      linkUrl: String(body.linkUrl || "")
    };
    const client = getPrismaClient2(context2.env);
    try {
      await client.appConfig.upsert({
        where: { key: CONFIG_KEY },
        create: { key: CONFIG_KEY, value },
        update: { value }
      });
    } catch (error3) {
      if (!isMissingTableError3(error3)) {
        throw error3;
      }
      transientValue = value;
    }
    return json5(200, { ok: true, value });
  } catch (error3) {
    return json5(500, { error: error3 instanceof Error ? error3.message : "internal_error" });
  }
}
var CONFIG_KEY, transientValue;
var init_ad_config = __esm({
  "api/ad-config.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_prisma();
    init_admin_auth();
    CONFIG_KEY = "ad_config";
    transientValue = null;
    __name(responseHeaders5, "responseHeaders");
    __name(json5, "json");
    __name(defaultConfig, "defaultConfig");
    __name(isMissingTableError3, "isMissingTableError");
    __name(parseBody2, "parseBody");
    __name(onRequestOptions5, "onRequestOptions");
    __name(onRequestGet3, "onRequestGet");
    __name(onRequestPut, "onRequestPut");
  }
});

// api/anecdote.js
function responseHeaders6(contentType = "application/json; charset=utf-8") {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function json6(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders6() });
}
function parseSlot(raw2) {
  const value = Number(raw2);
  if (!Number.isInteger(value) || value < 1 || value > MAX_SLOT) return null;
  return value;
}
function parseYear2(raw2) {
  const value = Number(raw2);
  if (!Number.isInteger(value) || value < 1 || value > 2100) return null;
  return value;
}
function sourceForSlot({ year, country, slot }) {
  const pool = SOURCE_POOL[`${country}:${year}`] || [];
  if (!pool.length) return null;
  return pool[(slot - 1) % pool.length];
}
function countWords2(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}
function sentenceCount2(text) {
  return String(text || "").split(/[.!?]/).map((chunk2) => chunk2.trim()).filter(Boolean).length;
}
function normalizeText2(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function isValidNarrative(text) {
  if (!ENABLE_NARRATIVE_FILTERS) {
    return Boolean(String(text || "").trim());
  }
  const words = countWords2(text);
  if (words < 50 || words > 80) return false;
  const sentences = sentenceCount2(text);
  if (sentences !== 4) return false;
  if (!/\btu\b/i.test(text)) return false;
  const lowered = normalizeText2(text);
  const blocked = ["se repand sur le trottoir", "entree marquee", "tout le quartier s organise autour de ce repere"];
  if (blocked.some((item) => lowered.includes(item))) return false;
  if (EMOTION_WORDS.some((w2) => lowered.includes(normalizeText2(w2)))) return false;
  if (BANNED_GENERIC_WORDS.some((w2) => lowered.includes(normalizeText2(w2)))) return false;
  if (METAPHOR_PATTERNS.some((w2) => lowered.includes(normalizeText2(w2)))) return false;
  if (PSYCH_WORDS.some((w2) => lowered.includes(normalizeText2(w2)))) return false;
  if (/(^|[.!?]\s*)tu\s+(sens|comprends|realises|réalises)\b/i.test(text)) return false;
  const objectHits = OBJECT_WORDS.filter((w2) => new RegExp(`\\b${normalizeText2(w2)}\\b`, "i").test(lowered)).length;
  if (objectHits < 2) return false;
  if (!ACTION_WORDS.some((w2) => new RegExp(`\\b${normalizeText2(w2)}\\b`, "i").test(lowered))) return false;
  if (!PRECISE_LOCATIONS.some((loc) => lowered.includes(normalizeText2(loc)))) return false;
  return true;
}
async function fetchWithRetry(url, init, { timeoutMs, retries }) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }
      return response;
    } catch (error3) {
      lastError = error3;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error("request_failed");
}
async function generateSceneWithAI({ year, title: title2, sourceUrl, wikiLead, env: env2 }) {
  const apiKey = String(env2?.OPENAI_API_KEY || "").trim();
  if (!apiKey) return "";
  const prompt = [
    "You are AVANT MOI, a documentary scene composer.",
    "NON-NEGOTIABLE GOAL: produce ONE short, concrete, verifiable scene anchored in a real place and a single verifiable claim, using ONLY provided sources.",
    "OUTPUT FORMAT: output MUST be a single valid JSON object matching SceneCard schema, no extra text.",
    "ABSOLUTE PROHIBITIONS: no psychology, no interpretation, no lyrical prose, no invention, no disclaimers.",
    "EPISTEMIC RULE: do not introduce specific details unless supported by source_context.",
    "SINGLE CLAIM RULE: event_claim is exactly one sentence, directly supported by at least one source.",
    "SCENE RULES: narrative in present tense, 120-180 words, purely observable details, at least 6 observable elements.",
    "VALIDATION: if details missing, keep quality flags false and avoid invention.",
    "",
    "SceneCard schema fields:",
    "slot (int), year (int), country (string), city (string),",
    "location (string), timestamp_hint (string), narrative (string),",
    "observable_elements (string[]), event_claim (string),",
    "sources (array of {type,title,url,support}),",
    "quality_flags ({no_psychology,no_political_interpretation,not_a_summary,has_real_place,has_single_verifiable_claim}).",
    "",
    `Known values: year=${year}, country=FR, slot=1.`,
    `Event title: ${title2}`,
    `source_context: ${wikiLead}`,
    `source_url: ${sourceUrl}`
  ].join("\n");
  try {
    const response = await fetchWithRetry(
      OPENAI_ENDPOINT,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: String(env2?.OPENAI_MODEL || "gpt-4.1-mini"),
          input: prompt,
          max_output_tokens: 800,
          text: {
            format: {
              type: "json_schema",
              name: "scene_card",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  slot: { type: "integer" },
                  year: { type: "integer" },
                  country: { type: "string" },
                  city: { type: "string" },
                  location: { type: "string" },
                  timestamp_hint: { type: "string" },
                  narrative: { type: "string" },
                  observable_elements: {
                    type: "array",
                    items: { type: "string" }
                  },
                  event_claim: { type: "string" },
                  sources: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        type: { type: "string" },
                        title: { type: "string" },
                        url: { type: "string" },
                        support: { type: "string" }
                      },
                      required: ["type", "title", "url", "support"]
                    }
                  },
                  quality_flags: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      no_psychology: { type: "boolean" },
                      no_political_interpretation: { type: "boolean" },
                      not_a_summary: { type: "boolean" },
                      has_real_place: { type: "boolean" },
                      has_single_verifiable_claim: { type: "boolean" }
                    },
                    required: [
                      "no_psychology",
                      "no_political_interpretation",
                      "not_a_summary",
                      "has_real_place",
                      "has_single_verifiable_claim"
                    ]
                  }
                },
                required: [
                  "slot",
                  "year",
                  "country",
                  "city",
                  "location",
                  "timestamp_hint",
                  "narrative",
                  "observable_elements",
                  "event_claim",
                  "sources",
                  "quality_flags"
                ]
              }
            }
          }
        })
      },
      { timeoutMs: 18e3, retries: 2 }
    );
    const payload = await response.json();
    const card = payload?.output_parsed || null;
    if (card && typeof card === "object") {
      return JSON.stringify(card);
    }
    return "";
  } catch {
    return "";
  }
}
function shortFactFromLead(lead, fallbackTitle) {
  const firstSentence = String(lead || "").split(/(?<=[.!?])\s+/)[0]?.trim() || "";
  if (!firstSentence) {
    return `${fallbackTitle}.`;
  }
  const trimmed = firstSentence.split(/\s+/).slice(0, 20).join(" ");
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
}
async function onRequestOptions6() {
  return new Response(null, { status: 204, headers: responseHeaders6() });
}
async function onRequestGet4(context2) {
  const requestUrl = new URL(context2.request.url);
  const year = parseYear2(requestUrl.searchParams.get("year"));
  const slot = parseSlot(requestUrl.searchParams.get("slot"));
  const country = String(requestUrl.searchParams.get("country") || "FR").trim().toUpperCase();
  const lang = String(requestUrl.searchParams.get("lang") || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
  if (!year || !slot) {
    return json6(400, { error: "Invalid parameters. Expected year and slot." });
  }
  if (country !== "FR" || lang !== "fr") {
    return json6(404, { error: "Mode one-by-one currently available for FR/fr only." });
  }
  const source = sourceForSlot({ year, country, slot });
  if (!source) {
    return json6(404, { error: "No source pool configured for this year/country yet." });
  }
  const cacheKey = `${year}|${country}|${slot}`;
  const cached = poolCache.get(cacheKey);
  if (cached) {
    return json6(200, cached);
  }
  const wikiLead = await getWikiLead(source.sourceUrl);
  if (!wikiLead || wikiLead.length < 200) {
    return json6(502, { error: "Wikipedia lead unavailable for selected source." });
  }
  const narrative = await generateSceneWithAI({
    year,
    title: source.title,
    sourceUrl: source.sourceUrl,
    wikiLead,
    env: context2.env
  });
  let card = null;
  try {
    card = JSON.parse(narrative);
  } catch {
    card = null;
  }
  const renderedNarrative = String(card?.narrative || "").trim();
  const renderedFact = String(card?.event_claim || "").trim();
  const sourceFromCard = Array.isArray(card?.sources) ? String(card.sources[0]?.url || "").trim() : "";
  const renderedUrl = sourceFromCard || source.sourceUrl;
  if (!isValidNarrative(renderedNarrative) || !renderedFact || !renderedUrl) {
    return json6(502, { error: "AI scene did not pass minimal narrative checks." });
  }
  const payload = {
    slot,
    narrative: renderedNarrative,
    fact: renderedFact || shortFactFromLead(wikiLead, source.title),
    url: renderedUrl
  };
  poolCache.set(cacheKey, payload);
  return json6(200, payload);
}
var MAX_SLOT, OPENAI_ENDPOINT, poolCache, ENABLE_NARRATIVE_FILTERS, EMOTION_WORDS, BANNED_GENERIC_WORDS, METAPHOR_PATTERNS, PSYCH_WORDS, OBJECT_WORDS, ACTION_WORDS, PRECISE_LOCATIONS, SOURCE_POOL;
var init_anecdote = __esm({
  "api/anecdote.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_wiki_lead();
    MAX_SLOT = 20;
    OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";
    poolCache = /* @__PURE__ */ new Map();
    ENABLE_NARRATIVE_FILTERS = false;
    EMOTION_WORDS = [
      "espoir",
      "peur",
      "tension",
      "incertitude",
      "fragile",
      "h\xE9sitant",
      "hesitant",
      "scepticisme",
      "angoisse",
      "anxieux",
      "anxieuse"
    ];
    BANNED_GENERIC_WORDS = [
      "objet",
      "chose",
      "ph\xE9nom\xE8ne",
      "phenomene",
      "\xE9v\xE9nement",
      "evenement",
      "innovation",
      "dispositif",
      "quelque chose",
      "syst\xE8me",
      "systeme",
      "appareil"
    ];
    METAPHOR_PATTERNS = [
      "comme si",
      "tel un",
      "telle une",
      "dans une danse",
      "poids du possible",
      "au bord de"
    ];
    PSYCH_WORDS = [
      "tu sens",
      "tu comprends",
      "tu r\xE9alises",
      "tu realises",
      "impression",
      "intuition",
      "esprit"
    ];
    OBJECT_WORDS = [
      "affiche",
      "ticket",
      "panneau",
      "barri\xE8re",
      "barriere",
      "micro",
      "journal",
      "pav\xE9",
      "pave",
      "vitrine",
      "guichet",
      "tribune",
      "casque",
      "rideau",
      "urne",
      "combin\xE9",
      "combine",
      "radio",
      "t\xE9l\xE9viseur",
      "televiseur",
      "badge",
      "banderole"
    ];
    ACTION_WORDS = [
      "court",
      "courent",
      "lit",
      "lisent",
      "applaudit",
      "applaudissent",
      "colle",
      "collent",
      "pointe",
      "pointent",
      "ouvre",
      "ouvrent",
      "ferme",
      "ferment",
      "grimpe",
      "grimpent",
      "change",
      "changent",
      "marche",
      "marchent",
      "arr\xEAte",
      "arr\xEAtent",
      "arrete",
      "arretent"
    ];
    PRECISE_LOCATIONS = ["gare", "station", "quai", "place", "march\xE9", "marche", "boulevard", "rue", "tribune", "palais"];
    SOURCE_POOL = {
      "FR:1968": [
        {
          title: "Accords de Grenelle",
          sourceUrl: "https://fr.wikipedia.org/wiki/Accords_de_Grenelle"
        },
        {
          title: "Jeux olympiques d'hiver de 1968",
          sourceUrl: "https://fr.wikipedia.org/wiki/Jeux_olympiques_d%27hiver_de_1968"
        },
        {
          title: "Festival de Cannes 1968",
          sourceUrl: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968"
        },
        {
          title: "Mai 68",
          sourceUrl: "https://fr.wikipedia.org/wiki/Mai_68"
        },
        {
          title: "Manifestations de mai 1968 en France",
          sourceUrl: "https://fr.wikipedia.org/wiki/Manifestations_de_mai_1968_en_France"
        }
      ]
    };
    __name(responseHeaders6, "responseHeaders");
    __name(json6, "json");
    __name(parseSlot, "parseSlot");
    __name(parseYear2, "parseYear");
    __name(sourceForSlot, "sourceForSlot");
    __name(countWords2, "countWords");
    __name(sentenceCount2, "sentenceCount");
    __name(normalizeText2, "normalizeText");
    __name(isValidNarrative, "isValidNarrative");
    __name(fetchWithRetry, "fetchWithRetry");
    __name(generateSceneWithAI, "generateSceneWithAI");
    __name(shortFactFromLead, "shortFactFromLead");
    __name(onRequestOptions6, "onRequestOptions");
    __name(onRequestGet4, "onRequestGet");
  }
});

// api/anecdotes.js
function log5(level, message, context2 = {}) {
  const payload = {
    level,
    message,
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    ...context2
  };
  if (level === "error") {
    console.error(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }
}
function responseHeaders7(contentType = "application/json; charset=utf-8") {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function json7(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders7()
  });
}
function normalizeText3(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function parseBoolean(value, defaultValue = false) {
  if (value == null) return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}
function parseDebugOptions(searchParams) {
  return {
    noCache: parseBoolean(searchParams.get("noCache"), false),
    noFilters: parseBoolean(searchParams.get("noFilters"), false),
    noAnchors: parseBoolean(searchParams.get("noAnchors"), false),
    noConstraints: parseBoolean(searchParams.get("noConstraints"), false),
    noTimeout: parseBoolean(searchParams.get("noTimeout"), false),
    noFallback: parseBoolean(searchParams.get("noFallback"), false)
  };
}
function parseCountryStrict(raw2) {
  const value = String(raw2 || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(value)) return null;
  return value;
}
function parseYear3(raw2) {
  const value = Number(raw2);
  if (!Number.isInteger(value) || value < 1 || value > 2100) return null;
  return value;
}
function validateInput(searchParams) {
  const year = parseYear3(searchParams.get("year"));
  const country = parseCountryStrict(searchParams.get("country"));
  const lang = String(searchParams.get("lang") || "").toLowerCase().startsWith("fr") ? "fr" : "en";
  const allowOverseas = parseBoolean(searchParams.get("allowOverseas"), false);
  const safe = parseBoolean(searchParams.get("safe"), false);
  const errors = [];
  if (!year) errors.push("year is required and must be an integer between 1 and 2100");
  if (!country) errors.push("country is required as ISO alpha-2 (ex: FR, US, BR)");
  return {
    ok: errors.length === 0,
    data: { year, country, lang, allowOverseas, safe },
    errors
  };
}
function rateLimitKey(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
}
function checkRateLimit(request) {
  const key = rateLimitKey(request);
  const now = Date.now();
  const current = rateLimitState.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitState.set(key, { count: 1, resetAt: now + CONFIG.rateLimitWindowMs });
    return { allowed: true };
  }
  if (current.count >= CONFIG.rateLimitMax) {
    return { allowed: false, retryAfterMs: current.resetAt - now };
  }
  current.count += 1;
  return { allowed: true };
}
async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchWithTimeoutAndRetry(url, init, { timeoutMs, retries }) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error3) {
      lastError = error3;
      if (attempt < retries) {
        await sleep(200 * (attempt + 1));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error("request_failed");
}
function extractQid(value) {
  const match2 = String(value || "").match(/Q\d+/);
  return match2 ? match2[0] : null;
}
async function resolveCountryQid(country) {
  if (country === "FR") return "Q142";
  const query = `
SELECT ?country WHERE {
  ?country wdt:P31/wdt:P279* wd:Q6256;
           wdt:P297 "${country}".
}
LIMIT 1
`;
  const url = `${CONFIG.wikidataSparqlEndpoint}?query=${encodeURIComponent(query)}`;
  const response = await fetchWithTimeoutAndRetry(
    url,
    {
      method: "GET",
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "AvantMoi/1.0 (contact: contact@avantmoi.com)"
      }
    },
    { timeoutMs: CONFIG.sparqlTimeoutMs, retries: CONFIG.retries }
  );
  const payload = await response.json();
  const qid = extractQid(payload?.results?.bindings?.[0]?.country?.value || "");
  if (!qid) {
    throw new Error(`unsupported_country:${country}`);
  }
  return qid;
}
function buildOverseasExclusionClause(countryQid, allowOverseas) {
  return "";
}
function buildCandidateQuery({ year, countryQid, limit, allowOverseas, strictPlace }) {
  const overseasClause = buildOverseasExclusionClause(countryQid, allowOverseas);
  const placeClause = strictPlace ? `{
    ?event wdt:P276 ?placeOut .
    ?placeOut wdt:P131* ?country .
  }
  UNION
  {
    ?event wdt:P131 ?placeOut .
    ?placeOut wdt:P131* ?country .
  }` : `{
    ?event wdt:P276 ?placeOut .
    ?placeOut wdt:P17 ?country .
  }
  UNION
  {
    ?event wdt:P131 ?placeOut .
    ?placeOut wdt:P17 ?country .
  }`;
  return `
SELECT ?event ?date ?placeOut ?type WHERE {
  VALUES ?targetYear { ${year} }
  VALUES ?country { wd:${countryQid} }
  {
    ?event wdt:P585 ?date .
  } UNION {
    ?event wdt:P580 ?date .
  } UNION {
    ?event wdt:P582 ?date .
  }
  FILTER(YEAR(?date) = ?targetYear)

  ${placeClause}
  ${overseasClause}

  OPTIONAL { ?event wdt:P31 ?type . }
}
LIMIT ${limit}
`;
}
async function fetchSparqlRows(query) {
  const url = `${CONFIG.wikidataSparqlEndpoint}?query=${encodeURIComponent(query)}`;
  const response = await fetchWithTimeoutAndRetry(
    url,
    {
      method: "GET",
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "AvantMoi/1.0 (contact: contact@avantmoi.com)"
      }
    },
    { timeoutMs: CONFIG.sparqlTimeoutMs, retries: CONFIG.retries }
  );
  const payload = await response.json();
  return payload?.results?.bindings || [];
}
function parseRows(rows) {
  return rows.map((row) => ({
    eventQid: extractQid(row?.event?.value || ""),
    placeQid: extractQid(row?.placeOut?.value || ""),
    placeMissing: !extractQid(row?.placeOut?.value || ""),
    typeQid: extractQid(row?.type?.value || ""),
    dateIso: String(row?.date?.value || "").trim()
  })).filter((item) => item.eventQid && item.dateIso);
}
function isMetropolitanExcludedCandidate(candidate) {
  if (OVERSEAS_QID_SET.has(candidate.placeQid)) return true;
  const searchable = normalizeText3(`${candidate.placeLabel} ${candidate.placeDescription}`);
  return OVERSEAS_LABEL_KEYWORDS.some((word) => searchable.includes(normalizeText3(word)));
}
function chunk(items, size) {
  const output = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
}
async function fetchEntityBundle(ids, lang) {
  const entities = /* @__PURE__ */ new Map();
  const chunks = chunk([...new Set(ids)].filter((id) => /^Q\d+$/.test(String(id || ""))), 50);
  for (const group3 of chunks) {
    const url = new URL(CONFIG.wikidataApiEndpoint);
    url.searchParams.set("action", "wbgetentities");
    url.searchParams.set("format", "json");
    url.searchParams.set("props", "labels|descriptions|sitelinks");
    url.searchParams.set("languages", lang === "fr" ? "fr|en" : "en|fr");
    url.searchParams.set("sitefilter", "frwiki|enwiki");
    url.searchParams.set("ids", group3.join("|"));
    const response = await fetchWithTimeoutAndRetry(
      url.toString(),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "AvantMoi/1.0 (contact: contact@avantmoi.com)"
        }
      },
      { timeoutMs: CONFIG.entityTimeoutMs, retries: CONFIG.retries }
    );
    const payload = await response.json();
    const rawEntities = payload?.entities || {};
    for (const id of group3) {
      const entity = rawEntities[id];
      if (!entity) continue;
      const label = entity?.labels?.[lang]?.value || entity?.labels?.fr?.value || entity?.labels?.en?.value || "";
      const description = entity?.descriptions?.[lang]?.value || entity?.descriptions?.fr?.value || entity?.descriptions?.en?.value || "";
      const frTitle = entity?.sitelinks?.frwiki?.title || "";
      const enTitle = entity?.sitelinks?.enwiki?.title || "";
      entities.set(id, {
        label: String(label || "").trim(),
        description: String(description || "").trim(),
        frTitle,
        enTitle
      });
    }
  }
  return entities;
}
function wikiUrlFromTitle(host, title2) {
  if (!title2) return null;
  return `https://${host}/wiki/${encodeURIComponent(title2.replaceAll(" ", "_"))}`;
}
function sourceUrlForEvent(eventQid, entityMeta) {
  const fr = wikiUrlFromTitle("fr.wikipedia.org", entityMeta?.frTitle || "");
  if (!fr) return null;
  return fr;
}
function categorySignals(candidate) {
  const searchable = normalizeText3(`${candidate.title} ${candidate.description} ${candidate.typeLabel}`);
  const hardBan = HARD_BAN_CATEGORY_KEYWORDS.some((word) => searchable.includes(normalizeText3(word)));
  const softHits = BANNED_CATEGORY_KEYWORDS.filter((word) => searchable.includes(normalizeText3(word))).length;
  return { hardBan, softHits };
}
function isTrashCompetitionCandidate(candidate) {
  const title2 = normalizeText3(candidate.title);
  const type = normalizeText3(candidate.typeLabel);
  const titleTrash = TITLE_TRASH_KEYWORDS.some((word) => title2.includes(normalizeText3(word)));
  const typeTrash = TYPE_TRASH_KEYWORDS.some((word) => type.includes(normalizeText3(word)));
  return titleTrash || typeTrash;
}
function computeVisualScore(candidate, { safe }) {
  const searchable = normalizeText3(`${candidate.title} ${candidate.description} ${candidate.typeLabel} ${candidate.placeLabel}`);
  let score = 0;
  if (candidate.sourceUrl.includes("fr.wikipedia.org")) score += 4;
  if (candidate.placeLabel) score += 3;
  if (VISUAL_KEYWORDS.some((word) => searchable.includes(normalizeText3(word)))) score += 2;
  if (candidate.datePrecision === "precise") score += 2;
  if (candidate.typeLabel) score += 1;
  if (safe) {
    score -= Math.min(candidate.softBannedHits || 0, 4);
  }
  return score;
}
function parseDatePrecision(dateIso) {
  const normalized = String(dateIso || "");
  if (!normalized) return { dateText: null, precision: "none" };
  const match2 = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match2) return { dateText: null, precision: "none" };
  const [, y, m, d] = match2;
  const date = /* @__PURE__ */ new Date(`${y}-${m}-${d}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return { dateText: null, precision: "none" };
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
  if (m === "01" && d === "01") {
    return { dateText: null, precision: "year_only" };
  }
  return { dateText: formatted, precision: "precise" };
}
async function fetchWikipediaSummary(frTitle, debugOptions = null) {
  if (!frTitle) return null;
  const cacheKey = frTitle.trim();
  if (wikiSummaryCache.has(cacheKey)) return wikiSummaryCache.get(cacheKey);
  const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(frTitle.replaceAll(" ", "_"))}`;
  try {
    const response = await fetchWithTimeoutAndRetry(
      url,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "AvantMoi/1.0 (contact: contact@avantmoi.com)"
        }
      },
      { timeoutMs: debugOptions?.noTimeout ? 8e3 : 2200, retries: debugOptions?.noTimeout ? 1 : 0 }
    );
    const payload = await response.json();
    const extract = String(payload?.extract || "").trim();
    if (!extract) {
      wikiSummaryCache.set(cacheKey, null);
      return null;
    }
    const summary = { extract };
    wikiSummaryCache.set(cacheKey, summary);
    return summary;
  } catch {
    wikiSummaryCache.set(cacheKey, null);
    return null;
  }
}
function parseWikipediaFrTitleFromUrl(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    if (url.hostname !== "fr.wikipedia.org") return null;
    const match2 = url.pathname.match(/^\/wiki\/(.+)$/);
    if (!match2) return null;
    return decodeURIComponent(match2[1]).replaceAll("_", " ").trim();
  } catch {
    return null;
  }
}
function isGenericYearPage(sourceUrl, wikiLead) {
  const url = String(sourceUrl || "");
  const lead = String(wikiLead || "");
  const badUrlPatterns = [
    /\/wiki\/1968$/i,
    /\/wiki\/19\d{2}$/i,
    /\/wiki\/Liste_/i,
    /\/wiki\/Chronologie/i,
    /\/wiki\/Ann%C3%A9e/i,
    /\/wiki\/Ann%C3%A9es/i,
    /\/wiki\/Année/i,
    /\/wiki\/Années/i
  ];
  const badLeadPatterns = [
    /est une année/i,
    /millésime/i,
    /liste des événements/i,
    /evenements survenus/i,
    /événements survenus/i,
    /chronologie/i
  ];
  if (badUrlPatterns.some((pattern) => pattern.test(url))) return true;
  if (badLeadPatterns.some((pattern) => pattern.test(lead))) return true;
  if (!lead || lead.length < 250) return true;
  return false;
}
function firstFactualSentence(extract) {
  const text = String(extract || "").replace(/\s+/g, " ").trim();
  if (!text) return null;
  const first = text.split(/(?<=[.!?])\s+/)[0]?.trim();
  if (!first) return null;
  return first.endsWith(".") ? first : `${first}.`;
}
function pickSummaryAnchors(extract, placeLabel) {
  const anchors = [];
  const badAnchors = /* @__PURE__ */ new Set([
    "les jeux",
    "le jeux",
    "des jeux",
    "xes jeux",
    "xes",
    "jeux",
    "bien"
  ]);
  const sanitizeAnchor = /* @__PURE__ */ __name((value) => String(value || "").replace(/^[Ll]es\s+/u, "").replace(/^[Ll]e\s+/u, "").replace(/^[Ll]a\s+/u, "").replace(/^[Dd]es\s+/u, "").trim(), "sanitizeAnchor");
  const pushAnchor = /* @__PURE__ */ __name((value) => {
    const text = sanitizeAnchor(value);
    if (!text) return;
    if (text.length < 4 || text.length > 40) return;
    if (/^\d+$/u.test(text)) return;
    if (/^x{1,4}(e|es)?$/iu.test(text)) return;
    if (badAnchors.has(normalizeText3(text))) return;
    if (anchors.some((a) => normalizeText3(a) === normalizeText3(text))) return;
    anchors.push(text);
  }, "pushAnchor");
  const properNouns = extract.match(/\b[A-ZÀ-ÖØ-Ý][\p{L}'’\-]{2,}(?:\s+[A-ZÀ-ÖØ-Ý][\p{L}'’\-]{2,}){0,2}\b/gu) || [];
  for (const noun of properNouns) {
    if (normalizeText3(noun) === normalizeText3(placeLabel)) continue;
    pushAnchor(noun);
    if (anchors.length >= 3) break;
  }
  for (const object of CONCRETE_OBJECTS) {
    const regex = new RegExp(`\\b(${object.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "iu");
    const match2 = extract.match(regex);
    if (match2) pushAnchor(match2[1]);
    if (anchors.length >= 4) break;
  }
  return anchors.slice(0, 2);
}
function buildTitleAnchors(title2) {
  const words = String(title2 || "").split(/[\s,:;()\-/'"’]+/).map((w2) => w2.trim()).filter((w2) => w2.length >= 5);
  const unique = [];
  for (const w2 of words) {
    if (!unique.some((u) => normalizeText3(u) === normalizeText3(w2))) unique.push(w2);
    if (unique.length >= 2) break;
  }
  return unique;
}
async function generateSceneWithAI2(candidate, anchors, summaryExtract, context2, debugOptions = null) {
  const apiKey = context2.env?.OPENAI_API_KEY;
  if (!apiKey || anchors.length < 2) return null;
  const prompt = [
    "\xC9cris UNE micro-sc\xE8ne immersive en fran\xE7ais (pas un r\xE9sum\xE9).",
    "Contraintes STRICTES: exactement 4 phrases, 50-80 mots, narration \xE0 la 2e personne, pr\xE9sent.",
    "Inclure explicitement le lieu fourni, une action visible, une r\xE9action humaine, une cons\xE9quence imm\xE9diate.",
    "Inclure EXACTEMENT les deux ancres textuelles fournies (sans les modifier).",
    "Interdits: analyse historique, morale, politique, guerre, style g\xE9n\xE9rique.",
    "Ne pas ins\xE9rer \xE9motion, m\xE9taphore, interpr\xE9tation psychologique.",
    'Aucune phrase commen\xE7ant par "tu sens", "tu comprends", "tu r\xE9alises".',
    "Interdits lexicaux: objet, chose, ph\xE9nom\xE8ne, \xE9v\xE9nement, innovation, dispositif, quelque chose, syst\xE8me, appareil.",
    "La sc\xE8ne contient au moins 2 objets mat\xE9riels, 1 action physique observable et 1 lieu pr\xE9cis.",
    `Titre: ${candidate.title}`,
    `Description: ${candidate.description || "n/a"}`,
    `Lieu France: ${candidate.placeLabel}`,
    `Date: ${candidate.dateText || "non pr\xE9cis\xE9e"}`,
    `R\xE9sum\xE9 source: ${summaryExtract}`,
    `Ancre 1: ${anchors[0]}`,
    `Ancre 2: ${anchors[1]}`
  ].join("\n");
  try {
    const response = await fetchWithTimeoutAndRetry(
      CONFIG.openaiResponsesEndpoint,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: context2.env?.OPENAI_MODEL || "gpt-4.1-mini",
          input: prompt,
          max_output_tokens: 220
        })
      },
      {
        timeoutMs: debugOptions?.noTimeout ? 2e4 : CONFIG.llmTimeoutMs,
        retries: debugOptions?.noTimeout ? 2 : 1
      }
    );
    const payload = await response.json();
    const direct = String(payload?.output_text || "").replace(/\s+/g, " ").trim();
    if (direct) return direct;
    const chunks = [];
    const output = Array.isArray(payload?.output) ? payload.output : [];
    for (const item of output) {
      const content = Array.isArray(item?.content) ? item.content : [];
      for (const part of content) {
        const text = String(part?.text || "").trim();
        if (text) chunks.push(text);
      }
    }
    return chunks.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    return null;
  }
}
function generateSourcedFallbackScene(candidate, anchors) {
  const prefix = candidate.dateText ? `${candidate.dateText}, ${candidate.placeLabel} :` : `${candidate.placeLabel} :`;
  const [anchor1, anchor2] = anchors;
  const pickMarker = /* @__PURE__ */ __name((value) => {
    const cleaned = String(value || "").trim();
    const normalized = normalizeText3(cleaned);
    if (!cleaned || cleaned.length < 4) return candidate.title;
    if (normalized === "bien" || normalized === "jeux") return candidate.title;
    return cleaned;
  }, "pickMarker");
  const marker1 = pickMarker(anchor1);
  const marker2 = pickMarker(anchor2);
  return [
    `${prefix} tu t\u2019arr\xEAtes devant une entr\xE9e marqu\xE9e \xAB ${marker1} \xBB, o\xF9 une file se forme contre la barri\xE8re.`,
    `Des passants lisent un panneau o\xF9 \xAB ${marker2} \xBB est \xE9crit, puis changent de trottoir pour mieux suivre.`,
    `Le bruit des pas sur les pav\xE9s couvre les discussions, et plusieurs mains pointent la m\xEAme entr\xE9e.`,
    `En quelques minutes, ton trajet habituel est d\xE9plac\xE9, car tout le quartier s\u2019organise autour de ce rep\xE8re.`
  ].join(" ");
}
function countWords3(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}
function sentenceCount3(text) {
  return String(text).split(/[.!?]/).map((part) => part.trim()).filter(Boolean).length;
}
function validateScene(scene, placeLabel, anchors) {
  if (!CONFIG.enableNarrativeFilters) {
    return Boolean(String(scene || "").trim());
  }
  if (!scene) return false;
  if (!String(placeLabel || "").trim()) return false;
  const sentences = sentenceCount3(scene);
  if (sentences !== 4) return false;
  const words = countWords3(scene);
  if (words < 50 || words > 80) return false;
  const lower = normalizeText3(scene);
  if (!lower.includes("tu")) return false;
  if (!/['’]/.test(scene)) return false;
  if (!/[àâçéèêëîïôûùüÿœ]/i.test(scene)) return false;
  if (!normalizeText3(scene).includes(normalizeText3(placeLabel))) return false;
  if (Array.isArray(anchors) && anchors.length >= 2) {
    if (!anchors.every((anchor) => scene.includes(anchor))) return false;
  }
  for (const banned of BANNED_SCENE_WORDS) {
    if (lower.includes(normalizeText3(banned))) return false;
  }
  for (const banned of BANNED_EMOTION_WORDS) {
    if (lower.includes(normalizeText3(banned))) return false;
  }
  for (const banned of BANNED_METAPHOR_PATTERNS) {
    if (lower.includes(normalizeText3(banned))) return false;
  }
  for (const banned of BANNED_PSYCH_WORDS) {
    if (lower.includes(normalizeText3(banned))) return false;
  }
  for (const pattern of BANNED_TEMPLATE_PATTERNS) {
    if (lower.includes(normalizeText3(pattern))) return false;
  }
  for (const fragment of BANNED_SCENE_FRAGMENTS) {
    if (lower.includes(normalizeText3(fragment))) return false;
  }
  if (/^\s*(\d{1,2}\s+\w+\s+\d{4},\s+)?france\s*:/i.test(scene)) return false;
  if (/\s,[^\d]/.test(scene)) return false;
  if (/\s\./.test(scene)) return false;
  if (/\bCette\b/.test(scene)) return false;
  if (/Coupe apparaît/i.test(scene)) return false;
  if (/(^|[.!?]\s*)tu\s+(sens|comprends|realises|réalises)\b/i.test(scene)) return false;
  const objectHits = REQUIRED_OBJECT_WORDS.filter((word) => new RegExp(`\\b${normalizeText3(word)}\\b`, "i").test(lower)).length;
  if (objectHits < 2) return false;
  if (!REQUIRED_ACTION_WORDS.some((word) => new RegExp(`\\b${normalizeText3(word)}\\b`, "i").test(lower))) return false;
  if (!REQUIRED_PRECISE_LOCATIONS.some((loc) => lower.includes(normalizeText3(loc)))) return false;
  return true;
}
function hasBannedSceneArtifacts(scene) {
  const lower = normalizeText3(scene);
  if (/^\s*(\d{1,2}\s+\w+\s+\d{4},\s+)?france\s*:/i.test(scene)) return true;
  return BANNED_SCENE_FRAGMENTS.some((fragment) => lower.includes(normalizeText3(fragment)));
}
function uniqueBy(items, keyFn) {
  const seen = /* @__PURE__ */ new Set();
  const output = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}
async function collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace }) {
  const query = buildCandidateQuery({ year, countryQid, limit, allowOverseas, strictPlace });
  const rows = await fetchSparqlRows(query);
  const parsed = parseRows(rows);
  return { rowsCount: rows.length, parsed };
}
async function enrichCandidates(rawCandidates, lang) {
  const ids = rawCandidates.flatMap((item) => [item.eventQid, item.placeQid, item.typeQid]).filter(Boolean);
  const entities = await fetchEntityBundle(ids, lang);
  const enriched = rawCandidates.map((candidate) => {
    const eventMeta = entities.get(candidate.eventQid);
    const placeMeta = candidate.placeQid ? entities.get(candidate.placeQid) : null;
    const typeMeta = candidate.typeQid ? entities.get(candidate.typeQid) : null;
    const title2 = String(eventMeta?.label || "").trim();
    const placeLabel = String(placeMeta?.label || "").trim();
    const placeDescription = String(placeMeta?.description || "").trim();
    const description = String(eventMeta?.description || "").trim();
    const typeLabel = String(typeMeta?.label || "").trim();
    const frTitle = String(eventMeta?.frTitle || "").trim();
    if (!title2 || !frTitle) {
      return null;
    }
    const dateInfo = parseDatePrecision(candidate.dateIso);
    const sourceUrl = sourceUrlForEvent(candidate.eventQid, eventMeta);
    if (!sourceUrl) return null;
    return {
      eventQid: candidate.eventQid,
      title: title2,
      frTitle,
      placeQid: candidate.placeQid,
      placeLabel: placeLabel || "",
      placeMissing: candidate.placeMissing || !placeLabel,
      placeDescription,
      description,
      typeLabel,
      sourceUrl,
      dateIso: candidate.dateIso,
      dateText: dateInfo.dateText,
      datePrecision: dateInfo.precision
    };
  }).filter(Boolean);
  return uniqueBy(enriched, (item) => item.eventQid);
}
function filterAndRankCandidates(candidates, { country, allowOverseas, safe }) {
  const filtered = candidates.filter((candidate) => {
    if (!candidate.sourceUrl?.includes("fr.wikipedia.org")) return false;
    if (candidate.placeMissing) return false;
    if (isTrashCompetitionCandidate(candidate)) return false;
    const safety = categorySignals(candidate);
    if (safe && safety.hardBan) return false;
    if (country === "FR" && !allowOverseas && isMetropolitanExcludedCandidate(candidate)) return false;
    candidate.softBannedHits = safe ? safety.softHits : 0;
    return true;
  });
  const unique = uniqueBy(filtered, (item) => item.eventQid);
  const scored = unique.map((candidate) => ({
    ...candidate,
    visualScore: computeVisualScore(candidate, { safe })
  }));
  scored.sort((a, b2) => b2.visualScore - a.visualScore);
  return scored;
}
function buildFact(candidate) {
  if (!candidate.placeLabel) return candidate.dateText ? `${candidate.dateText} : ${candidate.title}` : candidate.title;
  if (candidate.dateText) {
    return `${candidate.dateText}, ${candidate.placeLabel} : ${candidate.title}`;
  }
  return `${candidate.placeLabel} : ${candidate.title}`;
}
async function buildItemsFromCandidates({ year, country, rankedCandidates, topLimit, context: context2, deadlineTs, debugOptions }) {
  const top = rankedCandidates.slice(0, topLimit);
  const items = [];
  const usedQids = /* @__PURE__ */ new Set();
  const usedTitles = /* @__PURE__ */ new Set();
  const usedSources = /* @__PURE__ */ new Set();
  let skippedNoScene = 0;
  let validated = 0;
  let withSummary = 0;
  let withAnchors = 0;
  for (const candidate of top) {
    if (Date.now() > deadlineTs) break;
    if (items.length >= CONFIG.maxItems) break;
    if (candidate.placeMissing) continue;
    if (usedQids.has(candidate.eventQid)) continue;
    if (usedTitles.has(candidate.title.toLowerCase())) continue;
    if (usedSources.has(candidate.sourceUrl)) continue;
    let summaryExtract = "";
    let anchors = [];
    const summary = await fetchWikipediaSummary(candidate.frTitle, debugOptions);
    if (summary?.extract) {
      withSummary += 1;
      summaryExtract = summary.extract;
      if (isGenericYearPage(candidate.sourceUrl, summaryExtract)) {
        continue;
      }
      anchors = debugOptions?.noAnchors ? buildTitleAnchors(candidate.title) : pickSummaryAnchors(summary.extract, candidate.placeLabel);
      if (anchors.length >= 2) withAnchors += 1;
    }
    if (!summaryExtract) {
      continue;
    }
    if (anchors.length < 2) {
      anchors = buildTitleAnchors(candidate.title);
    }
    if (anchors.length < 2) {
      continue;
    }
    const aiScene = await generateSceneWithAI2(candidate, anchors, summaryExtract, context2, debugOptions);
    const allowFallback = CONFIG.enableFallbackNarratives && !debugOptions?.noFallback;
    const candidateScene = aiScene || (allowFallback ? generateSourcedFallbackScene(candidate, anchors) : "");
    const scene = debugOptions?.noConstraints ? candidateScene : validateScene(candidateScene, candidate.placeLabel, anchors) ? candidateScene : null;
    if (scene) validated += 1;
    if (!scene) {
      skippedNoScene += 1;
      continue;
    }
    usedQids.add(candidate.eventQid);
    usedTitles.add(candidate.title.toLowerCase());
    usedSources.add(candidate.sourceUrl);
    items.push({
      uniqueEventId: `${CONFIG.cacheVersion}-${candidate.eventQid}`,
      eventQid: candidate.eventQid,
      title: candidate.title,
      scene,
      fact: buildFact(candidate),
      sourceUrl: candidate.sourceUrl
    });
  }
  log5("info", "anecdotes_items_built", {
    year,
    country,
    ranked: rankedCandidates.length,
    top: top.length,
    built: items.length,
    validated,
    skippedNoScene,
    withSummary,
    withAnchors
  });
  return {
    year,
    country,
    items,
    partial: items.length < CONFIG.maxItems
  };
}
async function buildItemsFromSeed({ year, country, context: context2, debugOptions }) {
  const seeded = SEEDED_EVENTS[`${country}:${year}`] || [];
  const items = [];
  for (const seed of seeded) {
    const frTitle = parseWikipediaFrTitleFromUrl(seed.sourceUrl);
    if (!frTitle) continue;
    const summary = await fetchWikipediaSummary(frTitle, debugOptions);
    if (!summary?.extract) continue;
    if (isGenericYearPage(seed.sourceUrl, summary.extract)) continue;
    let anchors = debugOptions?.noAnchors ? buildTitleAnchors(seed.title) : pickSummaryAnchors(summary.extract, seed.placeLabel);
    if (anchors.length < 2) {
      anchors = buildTitleAnchors(seed.title);
    }
    if (anchors.length < 2) continue;
    const candidate = {
      eventQid: seed.eventQid,
      title: seed.title,
      description: "",
      placeLabel: seed.placeLabel,
      dateText: seed.dateText
    };
    const aiScene = await generateSceneWithAI2(candidate, anchors, summary.extract, context2, debugOptions);
    const allowFallback = CONFIG.enableFallbackNarratives && !debugOptions?.noFallback;
    const scene = aiScene || (allowFallback ? generateSourcedFallbackScene(candidate, anchors) : "");
    if (!scene) continue;
    if (!debugOptions?.noConstraints && !validateScene(scene, candidate.placeLabel, anchors)) continue;
    items.push({
      uniqueEventId: `${CONFIG.cacheVersion}-${seed.eventQid}`,
      eventQid: seed.eventQid,
      title: seed.title,
      scene,
      fact: firstFactualSentence(summary.extract) || buildFact(candidate),
      sourceUrl: seed.sourceUrl
    });
  }
  return {
    year,
    country,
    items,
    partial: items.length < CONFIG.maxItems
  };
}
function isMissingTableError4(error3) {
  const message = String(error3 instanceof Error ? error3.message : "");
  return message.includes("does not exist") || message.includes("relation") || message.includes("event_cache");
}
function isCacheValid(rows) {
  if (rows.length < 1 || rows.length > CONFIG.maxItems) return false;
  const qids = /* @__PURE__ */ new Set();
  const titles = /* @__PURE__ */ new Set();
  const sources = /* @__PURE__ */ new Set();
  for (const row of rows) {
    if (!String(row.uniqueEventId || "").startsWith(CONFIG.cacheVersion)) return false;
    if (!row.eventQid || !row.title || !row.sourceUrl || !row.scene) return false;
    if (hasBannedSceneArtifacts(String(row.scene || ""))) return false;
    const titleKey = row.title.toLowerCase();
    if (qids.has(row.eventQid) || titles.has(titleKey) || sources.has(row.sourceUrl)) return false;
    qids.add(row.eventQid);
    titles.add(titleKey);
    sources.add(row.sourceUrl);
  }
  return true;
}
async function readCache(client, { year, country, lang }) {
  const rows = await client.eventCache.findMany({
    where: { year, country, lang },
    orderBy: [{ createdAt: "asc" }],
    select: {
      eventQid: true,
      title: true,
      scene: true,
      fact: true,
      sourceUrl: true
    }
  });
  const hydrated = rows.map((row) => ({
    uniqueEventId: `${CONFIG.cacheVersion}-${row.eventQid}`,
    eventQid: row.eventQid,
    title: row.title,
    scene: row.scene,
    fact: row.fact,
    sourceUrl: row.sourceUrl
  }));
  if (!isCacheValid(hydrated)) return null;
  return {
    year,
    country,
    items: hydrated,
    partial: hydrated.length < CONFIG.maxItems
  };
}
async function saveCache(client, payload, lang) {
  for (const item of payload.items) {
    await client.eventCache.upsert({
      where: {
        year_country_lang_eventQid: {
          year: payload.year,
          country: payload.country,
          lang,
          eventQid: item.eventQid
        }
      },
      create: {
        year: payload.year,
        country: payload.country,
        lang,
        eventQid: item.eventQid,
        title: item.title,
        scene: item.scene,
        fact: item.fact,
        sourceUrl: item.sourceUrl
      },
      update: {
        title: item.title,
        scene: item.scene,
        fact: item.fact,
        sourceUrl: item.sourceUrl
      }
    });
  }
  await client.eventCache.deleteMany({
    where: {
      year: payload.year,
      country: payload.country,
      lang,
      eventQid: {
        notIn: payload.items.map((item) => item.eventQid)
      }
    }
  });
}
async function buildAndStoreBatch({ client, year, country, lang, cacheLang, allowOverseas, safe, context: context2, skipSave, debugOptions }) {
  const countryQid = await resolveCountryQid(country);
  const deadlineTs = Date.now() + 27e3;
  const safeCollect = /* @__PURE__ */ __name(async (limit) => {
    try {
      const fast = await collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace: false });
      if (fast.parsed.length > 0) return fast;
      const strict = await collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace: true });
      return strict;
    } catch (error3) {
      log5("error", "anecdotes_collect_failed", {
        year,
        country,
        lang,
        limit,
        error: error3 instanceof Error ? error3.message : "collect_failed"
      });
      try {
        const fallback = await collectCandidates({ year, countryQid, lang, allowOverseas, limit, strictPlace: true });
        log5("info", "anecdotes_collect_fallback_used", {
          year,
          country,
          lang,
          limit,
          sparqlRows: fallback.rowsCount,
          parsed: fallback.parsed.length
        });
        return fallback;
      } catch (fallbackError) {
        log5("error", "anecdotes_collect_fallback_failed", {
          year,
          country,
          lang,
          limit,
          error: fallbackError instanceof Error ? fallbackError.message : "collect_fallback_failed"
        });
        return { rowsCount: 0, parsed: [] };
      }
    }
  }, "safeCollect");
  const safeEnrich = /* @__PURE__ */ __name(async (raw2) => {
    try {
      return await enrichCandidates(raw2, lang);
    } catch (error3) {
      log5("error", "anecdotes_enrich_failed", {
        year,
        country,
        lang,
        raw: raw2.length,
        error: error3 instanceof Error ? error3.message : "enrich_failed"
      });
      return [];
    }
  }, "safeEnrich");
  const firstPass = await safeCollect(CONFIG.firstPassLimit);
  let enriched = await safeEnrich(firstPass.parsed);
  let ranked = debugOptions?.noFilters ? enriched.map((candidate) => ({ ...candidate, visualScore: 0 })) : filterAndRankCandidates(enriched, { country, allowOverseas, safe });
  log5("info", "anecdotes_first_pass_counts", {
    year,
    country,
    lang,
    sparqlRows: firstPass.rowsCount,
    parsed: firstPass.parsed.length,
    enriched: enriched.length,
    ranked: ranked.length
  });
  let payload = await buildItemsFromCandidates({
    year,
    country,
    rankedCandidates: ranked,
    topLimit: CONFIG.topCandidatesFirst,
    context: context2,
    deadlineTs,
    debugOptions
  });
  if (payload.items.length < CONFIG.maxItems && Date.now() < deadlineTs) {
    const secondPass = await safeCollect(CONFIG.secondPassLimit);
    const mergedRaw = uniqueBy([...firstPass.parsed, ...secondPass.parsed], (item) => `${item.eventQid}|${item.dateIso}`);
    const mergedRawLimited = mergedRaw.slice(0, 220);
    enriched = await safeEnrich(mergedRawLimited);
    ranked = debugOptions?.noFilters ? enriched.map((candidate) => ({ ...candidate, visualScore: 0 })) : filterAndRankCandidates(enriched, { country, allowOverseas, safe });
    log5("info", "anecdotes_second_pass_counts", {
      year,
      country,
      lang,
      sparqlRows: secondPass.rowsCount,
      parsed: secondPass.parsed.length,
      mergedRaw: mergedRaw.length,
      mergedRawLimited: mergedRawLimited.length,
      enriched: enriched.length,
      ranked: ranked.length
    });
    const secondPayload = await buildItemsFromCandidates({
      year,
      country,
      rankedCandidates: ranked,
      topLimit: CONFIG.topCandidatesSecond,
      context: context2,
      deadlineTs,
      debugOptions
    });
    if (secondPayload.items.length > payload.items.length) {
      payload = secondPayload;
    }
  }
  log5("info", "anecdotes_pipeline_counts", {
    year,
    country,
    lang,
    validated: payload.items.length,
    partial: payload.partial
  });
  const allowFallback = CONFIG.enableFallbackNarratives && !debugOptions?.noFallback;
  if (payload.items.length === 0 && allowFallback) {
    const seeded = await buildItemsFromSeed({ year, country, context: context2, debugOptions });
    if (seeded.items.length > 0) {
      payload = seeded;
      log5("info", "anecdotes_seed_fallback_used", {
        year,
        country,
        lang,
        count: seeded.items.length
      });
    }
  }
  if (!skipSave && payload.items.length > 0) {
    await saveCache(client, payload, cacheLang);
  }
  return payload;
}
function validateTransformInput(payload) {
  const year = parseYear3(payload?.year);
  const country = parseCountryStrict(payload?.country);
  const items = Array.isArray(payload?.items) ? payload.items : null;
  const errors = [];
  if (!year) errors.push("year is required and must be an integer between 1 and 2100");
  if (country !== "FR") errors.push("country must be FR for now");
  if (!items) errors.push("items must be an array");
  return { ok: errors.length === 0, errors, year, country, items: items || [] };
}
async function transformItemsToAnecdotes({ year, country, inputItems, context: context2 }) {
  const items = [];
  const rejected = [];
  const seenQid = /* @__PURE__ */ new Set();
  const seenTitle = /* @__PURE__ */ new Set();
  const seenSource = /* @__PURE__ */ new Set();
  for (const raw2 of inputItems) {
    if (items.length >= CONFIG.maxItems) break;
    const eventQid = String(raw2?.eventQid || "").trim();
    const title2 = String(raw2?.title || "").trim();
    const sourceUrl = String(raw2?.sourceUrl || "").trim();
    const dateText = raw2?.dateText ? String(raw2.dateText).trim() : void 0;
    const placeText = raw2?.placeText ? String(raw2.placeText).trim() : void 0;
    const reject = /* @__PURE__ */ __name((reason) => {
      rejected.push({ eventQid: eventQid || null, title: title2 || null, sourceUrl: sourceUrl || null, reason });
    }, "reject");
    if (!eventQid || !/^Q\d+$/.test(eventQid)) {
      reject("missing_or_invalid_eventQid");
      continue;
    }
    if (!title2) {
      reject("missing_title");
      continue;
    }
    if (!sourceUrl || !sourceUrl.includes("fr.wikipedia.org/wiki/")) {
      reject("source_not_fr_wikipedia");
      continue;
    }
    if (seenQid.has(eventQid)) {
      reject("duplicate_eventQid");
      continue;
    }
    if (seenTitle.has(title2.toLowerCase())) {
      reject("duplicate_title");
      continue;
    }
    if (seenSource.has(sourceUrl)) {
      reject("duplicate_sourceUrl");
      continue;
    }
    if (isTrashCompetitionCandidate({ title: title2, typeLabel: "" })) {
      reject("catalog_or_competition_item");
      continue;
    }
    const frTitle = parseWikipediaFrTitleFromUrl(sourceUrl);
    if (!frTitle) {
      reject("invalid_wikipedia_url");
      continue;
    }
    const summary = await fetchWikipediaSummary(frTitle);
    if (!summary?.extract) {
      reject("missing_wikipedia_summary");
      continue;
    }
    if (isGenericYearPage(sourceUrl, summary.extract)) {
      reject("generic_year_page");
      continue;
    }
    let anchors = pickSummaryAnchors(summary.extract, placeText || "");
    if (anchors.length < 2) {
      anchors = buildTitleAnchors(title2);
    }
    if (anchors.length < 2) {
      reject("missing_anchors");
      continue;
    }
    const candidate = {
      eventQid,
      title: title2,
      description: "",
      placeLabel: placeText || "France",
      dateText: dateText || null
    };
    const aiScene = await generateSceneWithAI2(candidate, anchors, summary.extract, context2);
    const scene = aiScene;
    if (!validateScene(scene, candidate.placeLabel, anchors)) {
      reject("scene_validation_failed");
      continue;
    }
    const fact = firstFactualSentence(summary.extract);
    if (!fact) {
      reject("missing_fact");
      continue;
    }
    seenQid.add(eventQid);
    seenTitle.add(title2.toLowerCase());
    seenSource.add(sourceUrl);
    items.push({
      uniqueEventId: `${CONFIG.cacheVersion}-${eventQid}`,
      eventQid,
      title: title2,
      ...dateText ? { dateText } : {},
      ...placeText ? { placeText } : {},
      scene,
      fact,
      sourceUrl
    });
  }
  if (items.length !== CONFIG.maxItems) {
    return {
      ok: false,
      error: {
        code: "INSUFFICIENT_VALID_ITEMS",
        message: `Expected 20 valid items, got ${items.length}`,
        year,
        country,
        produced: items.length,
        required: CONFIG.maxItems,
        rejected
      }
    };
  }
  return { ok: true, payload: { year, country, items } };
}
async function onRequestOptions7() {
  return new Response(null, { status: 204, headers: responseHeaders7() });
}
async function onRequestGet5(context2) {
  const searchParams = new URL(context2.request.url).searchParams;
  const debugOptions = parseDebugOptions(searchParams);
  const validation = validateInput(searchParams);
  if (!validation.ok) {
    return json7(400, { error: validation.errors.join("; ") });
  }
  const limiter = checkRateLimit(context2.request);
  if (!limiter.allowed) {
    return json7(429, { error: "rate_limited", retryAfterMs: limiter.retryAfterMs });
  }
  const { year, country, lang, allowOverseas, safe } = validation.data;
  const debugSuffix = Object.entries(debugOptions).filter(([, value]) => value).map(([key]) => key).join(".");
  const baseCacheLang = safe ? `${lang}-${CONFIG.cacheVersion}-safe` : `${lang}-${CONFIG.cacheVersion}`;
  const cacheLang = debugSuffix ? `${baseCacheLang}-${debugSuffix}` : baseCacheLang;
  try {
    const client = getPrismaClient2(context2.env);
    if (CONFIG.disableCache || debugOptions.noCache) {
      await client.eventCache.deleteMany({ where: { year, country } });
    } else {
      const cachedPayload = await readCache(client, { year, country, lang: cacheLang });
      if (cachedPayload) {
        log5("info", "anecdotes_cache_hit", { year, country, lang, count: cachedPayload.items.length, partial: cachedPayload.partial });
        return json7(200, cachedPayload);
      }
    }
    const payload = await buildAndStoreBatch({
      client,
      year,
      country,
      lang,
      cacheLang,
      allowOverseas,
      safe,
      context: context2,
      skipSave: CONFIG.disableCache || debugOptions.noCache,
      debugOptions
    });
    log5("info", "anecdotes_generated", { year, country, lang, count: payload.items.length });
    return json7(200, payload);
  } catch (error3) {
    if (isMissingTableError4(error3)) {
      log5("error", "event_cache_missing", { year, country, lang });
      return json7(500, { error: "event_cache table is missing. Run migration first." });
    }
    const message = error3 instanceof Error ? error3.message : "anecdote_generation_failed";
    log5("error", "anecdotes_generation_failed", { year, country, lang, error: message });
    return json7(502, { error: message });
  }
}
async function onRequestPost4(context2) {
  let payload;
  try {
    payload = await context2.request.json();
  } catch {
    return json7(400, { error: "invalid_json_body" });
  }
  const validation = validateTransformInput(payload);
  if (!validation.ok) {
    return json7(400, { error: validation.errors.join("; ") });
  }
  const result = await transformItemsToAnecdotes({
    year: validation.year,
    country: validation.country,
    inputItems: validation.items,
    context: context2
  });
  if (!result.ok) {
    return json7(422, result.error);
  }
  return json7(200, result.payload);
}
var CONFIG, OVERSEAS_QIDS, OVERSEAS_QID_SET, OVERSEAS_LABEL_KEYWORDS, BANNED_CATEGORY_KEYWORDS, HARD_BAN_CATEGORY_KEYWORDS, BANNED_SCENE_WORDS, BANNED_EMOTION_WORDS, BANNED_METAPHOR_PATTERNS, BANNED_PSYCH_WORDS, REQUIRED_OBJECT_WORDS, REQUIRED_ACTION_WORDS, REQUIRED_PRECISE_LOCATIONS, BANNED_TEMPLATE_PATTERNS, BANNED_SCENE_FRAGMENTS, VISUAL_KEYWORDS, CONCRETE_OBJECTS, TITLE_TRASH_KEYWORDS, TYPE_TRASH_KEYWORDS, rateLimitState, wikiSummaryCache, SEEDED_EVENTS;
var init_anecdotes = __esm({
  "api/anecdotes.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_prisma();
    CONFIG = {
      wikidataSparqlEndpoint: "https://query.wikidata.org/sparql",
      wikidataApiEndpoint: "https://www.wikidata.org/w/api.php",
      openaiResponsesEndpoint: "https://api.openai.com/v1/responses",
      cacheVersion: "V13",
      maxItems: 20,
      minWords: 55,
      maxWords: 90,
      firstPassLimit: 200,
      secondPassLimit: 500,
      topCandidatesFirst: 120,
      topCandidatesSecond: 120,
      retries: 1,
      sparqlTimeoutMs: 18e3,
      entityTimeoutMs: 5e3,
      llmTimeoutMs: 9e3,
      rateLimitWindowMs: 6e4,
      rateLimitMax: 30,
      disableCache: true,
      enableFallbackNarratives: false,
      enableNarrativeFilters: false
    };
    OVERSEAS_QIDS = [
      "Q17012",
      // Guadeloupe
      "Q17054",
      // Martinique
      "Q3769",
      // French Guiana
      "Q17070",
      // Reunion
      "Q17063",
      // Mayotte
      "Q34617",
      // Saint Pierre and Miquelon
      "Q126125",
      // Saint Martin (French part)
      "Q25362",
      // Saint Barthelemy
      "Q33788",
      // New Caledonia
      "Q30971",
      // French Polynesia
      "Q35555",
      // Wallis and Futuna
      "Q129003"
      // French Southern and Antarctic Lands
    ];
    OVERSEAS_QID_SET = new Set(OVERSEAS_QIDS);
    OVERSEAS_LABEL_KEYWORDS = [
      "guadeloupe",
      "martinique",
      "guyane",
      "reunion",
      "r\xE9union",
      "mayotte",
      "saint-pierre-et-miquelon",
      "saint-barthelemy",
      "saint-barth\xE9lemy",
      "saint-martin",
      "nouvelle-caledonie",
      "nouvelle-cal\xE9donie",
      "polynesie",
      "polyn\xE9sie",
      "wallis",
      "futuna",
      "terres australes"
    ];
    BANNED_CATEGORY_KEYWORDS = [
      "war",
      "battle",
      "assassination",
      "disaster",
      "earthquake",
      "flood",
      "cyclone",
      "politic",
      "election",
      "government",
      "massacre",
      "riot",
      "strike",
      "protest",
      "crash",
      "accident",
      "murder",
      "killing",
      "death",
      "guerre",
      "bataille",
      "assassinat",
      "catastrophe",
      "seisme",
      "s\xE9isme",
      "inondation",
      "politique",
      "election",
      "\xE9lection",
      "gouvernement",
      "emeute",
      "\xE9meute",
      "greve",
      "gr\xE8ve",
      "manifestation",
      "meurtre",
      "mort",
      "attentat",
      "terror",
      "terrorisme",
      "occupation"
    ];
    HARD_BAN_CATEGORY_KEYWORDS = [
      "murder",
      "assassination",
      "disaster",
      "meurtre",
      "assassinat",
      "catastrophe"
    ];
    BANNED_SCENE_WORDS = [
      "chose",
      "ph\xE9nom\xE8ne",
      "phenomene",
      "quelque chose",
      "atmosph\xE8re",
      "atmosphere",
      "symbole",
      "contexte",
      "impact",
      "soci\xE9t\xE9",
      "societe",
      "modernit\xE9",
      "modernite",
      "syst\xE8me",
      "systeme",
      "dynamique",
      "processus",
      "transformation",
      "\xE9v\xE9nement",
      "evenement",
      "objet",
      "innovation",
      "dispositif",
      "appareil"
    ];
    BANNED_EMOTION_WORDS = [
      "espoir",
      "peur",
      "tension",
      "incertitude",
      "fragile",
      "h\xE9sitant",
      "hesitant",
      "scepticisme",
      "angoisse",
      "anxieux",
      "anxieuse"
    ];
    BANNED_METAPHOR_PATTERNS = [
      "comme si",
      "tel un",
      "telle une",
      "dans une danse",
      "poids du possible",
      "au bord de"
    ];
    BANNED_PSYCH_WORDS = ["tu sens", "tu comprends", "tu r\xE9alises", "tu realises", "impression", "intuition"];
    REQUIRED_OBJECT_WORDS = [
      "affiche",
      "ticket",
      "panneau",
      "barri\xE8re",
      "barriere",
      "micro",
      "journal",
      "pav\xE9",
      "pave",
      "vitrine",
      "guichet",
      "tribune",
      "casque",
      "rideau",
      "urne",
      "combin\xE9",
      "combine",
      "radio",
      "t\xE9l\xE9viseur",
      "televiseur",
      "badge",
      "banderole"
    ];
    REQUIRED_ACTION_WORDS = [
      "court",
      "courent",
      "lit",
      "lisent",
      "applaudit",
      "applaudissent",
      "colle",
      "collent",
      "pointe",
      "pointent",
      "ouvre",
      "ouvrent",
      "ferme",
      "ferment",
      "grimpe",
      "grimpent",
      "change",
      "changent",
      "marche",
      "marchent",
      "arr\xEAte",
      "arr\xEAtent",
      "arrete",
      "arretent"
    ];
    REQUIRED_PRECISE_LOCATIONS = [
      "gare",
      "station",
      "quai",
      "place",
      "march\xE9",
      "marche",
      "boulevard",
      "rue",
      "tribune",
      "palais"
    ];
    BANNED_TEMPLATE_PATTERNS = [
      "apparait devant toi",
      "appara\xEEt devant toi",
      "coupe le passage",
      "un bruit sec part du trottoir"
    ];
    BANNED_SCENE_FRAGMENTS = [
      "se r\xE9pand sur le trottoir",
      "se repand sur le trottoir",
      "deux passants lisent le panneau \xE0 voix haute",
      "deux passants lisent le panneau a voix haute",
      "la foule se d\xE9cale vers la grille",
      "la foule se decale vers la grille",
      "quitter l\u2019axe principal et contourner la rue voisine",
      "quitter l'axe principal et contourner la rue voisine",
      "tu t\u2019arr\xEAtes devant une entr\xE9e marqu\xE9e",
      "tu t'arretes devant une entree marquee",
      "tout le quartier s\u2019organise autour de ce rep\xE8re",
      "tout le quartier s'organise autour de ce repere"
    ];
    VISUAL_KEYWORDS = [
      "gare",
      "station",
      "rue",
      "boulevard",
      "place",
      "caf\xE9",
      "cafe",
      "march\xE9",
      "marche",
      "vitrine",
      "radio",
      "affiche",
      "t\xE9l\xE9viseur",
      "televiseur",
      "tram",
      "bus",
      "quai",
      "palais",
      "hall",
      "guichet",
      "cabine"
    ];
    CONCRETE_OBJECTS = [
      "radio",
      "affiche",
      "t\xE9l\xE9viseur",
      "combin\xE9",
      "ticket",
      "pav\xE9",
      "barri\xE8re",
      "guichet",
      "micro",
      "panneau",
      "vitrine",
      "porti\xE8re",
      "horloge",
      "urne",
      "projecteur",
      "rideau",
      "journal"
    ];
    TITLE_TRASH_KEYWORDS = [
      "jeux olympiques",
      "relais",
      "epreuve",
      "\xE9preuve",
      "liste",
      "saison",
      "championnat",
      "tournoi",
      "finale"
    ];
    TYPE_TRASH_KEYWORDS = [
      "liste",
      "season",
      "saison",
      "olympic competition",
      "competition olympique",
      "comp\xE9tition olympique"
    ];
    rateLimitState = /* @__PURE__ */ new Map();
    wikiSummaryCache = /* @__PURE__ */ new Map();
    SEEDED_EVENTS = {
      "FR:1968": [
        { eventQid: "SEED-1968-1", title: "Mai 68", sourceUrl: "https://fr.wikipedia.org/wiki/Mai_68", placeLabel: "Paris", dateText: "mai 1968" },
        { eventQid: "SEED-1968-2", title: "Festival de Cannes 1968", sourceUrl: "https://fr.wikipedia.org/wiki/Festival_de_Cannes_1968", placeLabel: "Cannes", dateText: "mai 1968" },
        { eventQid: "SEED-1968-3", title: "Accords de Grenelle", sourceUrl: "https://fr.wikipedia.org/wiki/Accords_de_Grenelle", placeLabel: "Paris", dateText: "27 mai 1968" },
        { eventQid: "SEED-1968-4", title: "Jeux olympiques d'hiver de 1968", sourceUrl: "https://fr.wikipedia.org/wiki/Jeux_olympiques_d%27hiver_de_1968", placeLabel: "Grenoble", dateText: "f\xE9vrier 1968" },
        { eventQid: "SEED-1968-5", title: "Manifestations de mai 1968 en France", sourceUrl: "https://fr.wikipedia.org/wiki/Manifestations_de_mai_1968_en_France", placeLabel: "Paris", dateText: "mai 1968" }
      ]
    };
    __name(log5, "log");
    __name(responseHeaders7, "responseHeaders");
    __name(json7, "json");
    __name(normalizeText3, "normalizeText");
    __name(parseBoolean, "parseBoolean");
    __name(parseDebugOptions, "parseDebugOptions");
    __name(parseCountryStrict, "parseCountryStrict");
    __name(parseYear3, "parseYear");
    __name(validateInput, "validateInput");
    __name(rateLimitKey, "rateLimitKey");
    __name(checkRateLimit, "checkRateLimit");
    __name(sleep, "sleep");
    __name(fetchWithTimeoutAndRetry, "fetchWithTimeoutAndRetry");
    __name(extractQid, "extractQid");
    __name(resolveCountryQid, "resolveCountryQid");
    __name(buildOverseasExclusionClause, "buildOverseasExclusionClause");
    __name(buildCandidateQuery, "buildCandidateQuery");
    __name(fetchSparqlRows, "fetchSparqlRows");
    __name(parseRows, "parseRows");
    __name(isMetropolitanExcludedCandidate, "isMetropolitanExcludedCandidate");
    __name(chunk, "chunk");
    __name(fetchEntityBundle, "fetchEntityBundle");
    __name(wikiUrlFromTitle, "wikiUrlFromTitle");
    __name(sourceUrlForEvent, "sourceUrlForEvent");
    __name(categorySignals, "categorySignals");
    __name(isTrashCompetitionCandidate, "isTrashCompetitionCandidate");
    __name(computeVisualScore, "computeVisualScore");
    __name(parseDatePrecision, "parseDatePrecision");
    __name(fetchWikipediaSummary, "fetchWikipediaSummary");
    __name(parseWikipediaFrTitleFromUrl, "parseWikipediaFrTitleFromUrl");
    __name(isGenericYearPage, "isGenericYearPage");
    __name(firstFactualSentence, "firstFactualSentence");
    __name(pickSummaryAnchors, "pickSummaryAnchors");
    __name(buildTitleAnchors, "buildTitleAnchors");
    __name(generateSceneWithAI2, "generateSceneWithAI");
    __name(generateSourcedFallbackScene, "generateSourcedFallbackScene");
    __name(countWords3, "countWords");
    __name(sentenceCount3, "sentenceCount");
    __name(validateScene, "validateScene");
    __name(hasBannedSceneArtifacts, "hasBannedSceneArtifacts");
    __name(uniqueBy, "uniqueBy");
    __name(collectCandidates, "collectCandidates");
    __name(enrichCandidates, "enrichCandidates");
    __name(filterAndRankCandidates, "filterAndRankCandidates");
    __name(buildFact, "buildFact");
    __name(buildItemsFromCandidates, "buildItemsFromCandidates");
    __name(buildItemsFromSeed, "buildItemsFromSeed");
    __name(isMissingTableError4, "isMissingTableError");
    __name(isCacheValid, "isCacheValid");
    __name(readCache, "readCache");
    __name(saveCache, "saveCache");
    __name(buildAndStoreBatch, "buildAndStoreBatch");
    __name(validateTransformInput, "validateTransformInput");
    __name(transformItemsToAnecdotes, "transformItemsToAnecdotes");
    __name(onRequestOptions7, "onRequestOptions");
    __name(onRequestGet5, "onRequestGet");
    __name(onRequestPost4, "onRequestPost");
  }
});

// ../src/lib/ruptureTaxonomy.ts
var RuptureType, ALLOWED_CLAIM_TEMPLATES, REQUIRED_MATERIAL_ELEMENTS;
var init_ruptureTaxonomy = __esm({
  "../src/lib/ruptureTaxonomy.ts"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    RuptureType = {
      LEGAL_REGULATORY: "LEGAL_REGULATORY",
      INFRA_SERVICE: "INFRA_SERVICE",
      TECH_PUBLIC: "TECH_PUBLIC",
      FIRST_PUBLIC_DEMO: "FIRST_PUBLIC_DEMO",
      STATE_CHANGE_EVENT: "STATE_CHANGE_EVENT"
    };
    ALLOWED_CLAIM_TEMPLATES = {
      [RuptureType.LEGAL_REGULATORY]: [
        "Ce jour-l\xE0, cette r\xE8gle entre en vigueur et s'applique imm\xE9diatement.",
        "Cette interdiction devient effective et modifie les gestes autoris\xE9s.",
        "Cette obligation est officiellement appliqu\xE9e dans l'espace public."
      ],
      [RuptureType.INFRA_SERVICE]: [
        "Ce service ouvre au public et change les trajets d\xE8s aujourd'hui.",
        "Cette infrastructure est mise en service et devient utilisable imm\xE9diatement.",
        "Cette ligne/ce lieu fonctionne d\xE9sormais en conditions r\xE9elles."
      ],
      [RuptureType.TECH_PUBLIC]: [
        "Cette technologie est disponible pour le public \xE0 partir de ce moment.",
        "Ce lancement rend l'usage possible hors des cercles sp\xE9cialis\xE9s.",
        "Ce produit/service devient accessible en usage quotidien."
      ],
      [RuptureType.FIRST_PUBLIC_DEMO]: [
        "Cette premi\xE8re d\xE9monstration est visible publiquement ce jour-l\xE0.",
        "Cette premi\xE8re diffusion a lieu devant un public r\xE9el.",
        "Cette premi\xE8re occurrence publique est observ\xE9e dans un cadre ouvert."
      ],
      [RuptureType.STATE_CHANGE_EVENT]: [
        "Cet \xE9v\xE9nement modifie imm\xE9diatement les usages de l'espace concern\xE9.",
        "Cette rupture entra\xEEne des adaptations visibles dans la vie courante.",
        "Ce fait provoque une r\xE9organisation concr\xE8te et imm\xE9diate."
      ]
    };
    REQUIRED_MATERIAL_ELEMENTS = {
      [RuptureType.LEGAL_REGULATORY]: ["panneau", "affiche", "formulaire", "guichet", "tampon"],
      [RuptureType.INFRA_SERVICE]: ["quai", "ticket", "barri\xE8re", "horloge", "signal\xE9tique"],
      [RuptureType.TECH_PUBLIC]: ["terminal", "\xE9cran", "carte", "c\xE2ble", "combin\xE9"],
      [RuptureType.FIRST_PUBLIC_DEMO]: ["tribune", "micro", "projecteur", "rideau", "programme"],
      [RuptureType.STATE_CHANGE_EVENT]: ["sir\xE8ne", "ruban", "barri\xE8re", "file", "haut-parleur"]
    };
  }
});

// ../src/lib/ruptureClassifier.ts
function scoreKeywords(label, keywords) {
  const lower = label.toLowerCase();
  return keywords.reduce((acc, k2) => lower.includes(k2) ? acc + 1 : acc, 0);
}
function classifyRuptureWithConfidence(event) {
  const label = String(event.label || "");
  if (!label) return null;
  const legalScore = scoreKeywords(label, KEYWORDS[RuptureType.LEGAL_REGULATORY]);
  const infraScore = scoreKeywords(label, KEYWORDS[RuptureType.INFRA_SERVICE]);
  const techScore = scoreKeywords(label, KEYWORDS[RuptureType.TECH_PUBLIC]);
  const demoScore = scoreKeywords(label, KEYWORDS[RuptureType.FIRST_PUBLIC_DEMO]);
  const stateScore = scoreKeywords(label, KEYWORDS[RuptureType.STATE_CHANGE_EVENT]);
  const confidenceFromScore = /* @__PURE__ */ __name((score) => {
    const raw2 = Math.min(0.95, 0.6 + score * 0.15);
    return Number(raw2.toFixed(2));
  }, "confidenceFromScore");
  if (legalScore >= 1) return { type: RuptureType.LEGAL_REGULATORY, confidence: confidenceFromScore(legalScore) };
  if (infraScore >= 1) return { type: RuptureType.INFRA_SERVICE, confidence: confidenceFromScore(infraScore) };
  if (techScore >= 1) return { type: RuptureType.TECH_PUBLIC, confidence: confidenceFromScore(techScore) };
  if (demoScore >= 1) return { type: RuptureType.FIRST_PUBLIC_DEMO, confidence: confidenceFromScore(demoScore) };
  if (stateScore >= 1) return { type: RuptureType.STATE_CHANGE_EVENT, confidence: confidenceFromScore(stateScore) };
  return null;
}
function classifyRupture(event) {
  const result = classifyRuptureWithConfidence(event);
  return result ? result.type : null;
}
function isEligibleRupture(event) {
  if (!String(event.date || "").trim()) {
    return { ok: false, reason: "missing_date" };
  }
  if (!String(event.wikipediaUrl || "").trim()) {
    return { ok: false, reason: "missing_wikipedia_url" };
  }
  return { ok: true };
}
var KEYWORDS;
var init_ruptureClassifier = __esm({
  "../src/lib/ruptureClassifier.ts"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_ruptureTaxonomy();
    KEYWORDS = {
      [RuptureType.LEGAL_REGULATORY]: [
        "loi",
        "decret",
        "d\xE9cret",
        "interdiction",
        "obligation",
        "legalisation",
        "l\xE9galisation",
        "promulgation",
        "entree en vigueur",
        "entr\xE9e en vigueur",
        "ban",
        "legal",
        "act",
        "law",
        "decree",
        "regulation",
        "mandatory",
        "prohibited"
      ],
      [RuptureType.INFRA_SERVICE]: [
        "inauguration",
        "ouverture",
        "mise en service",
        "ligne",
        "station",
        "aeroport",
        "a\xE9roport",
        "port",
        "autoroute",
        "railway",
        "line",
        "opened",
        "in service"
      ],
      [RuptureType.TECH_PUBLIC]: [
        "lancement",
        "commercial",
        "premier",
        "first",
        "released",
        "available",
        "public access",
        "network",
        "internet",
        "carte bancaire",
        "credit card"
      ],
      [RuptureType.FIRST_PUBLIC_DEMO]: [
        "premiere",
        "premi\xE8re",
        "world premiere",
        "first performance",
        "first broadcast",
        "diffusion"
      ],
      [RuptureType.STATE_CHANGE_EVENT]: [
        "attentat",
        "attaque",
        "bombardement",
        "pandemie",
        "pand\xE9mie",
        "confinement",
        "earthquake",
        "explosion",
        "attack",
        "pandemic"
      ]
    };
    __name(scoreKeywords, "scoreKeywords");
    __name(classifyRuptureWithConfidence, "classifyRuptureWithConfidence");
    __name(classifyRupture, "classifyRupture");
    __name(isEligibleRupture, "isEligibleRupture");
  }
});

// api/batch.ts
function headers(contentType = "application/json; charset=utf-8") {
  return {
    "content-type": contentType,
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}
function json8(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: headers() });
}
function parseYear4(input) {
  if (!input) return null;
  const year = Number(input);
  if (!Number.isInteger(year) || year < 1e3 || year > 2100) return null;
  return year;
}
function parseCountry(input) {
  if (!input) return null;
  const value = input.trim().toUpperCase();
  return /^Q\d+$/.test(value) ? value : null;
}
function extractQid2(url) {
  const match2 = (url || "").match(/Q\d+/i);
  return match2 ? match2[0].toUpperCase() : "";
}
function buildFastSparqlQuery(year, countryQid) {
  return `
SELECT DISTINCT ?item ?itemLabel ?date ?article ?sitelinks WHERE {
  VALUES ?country { wd:${countryQid} }
  BIND(${year} AS ?year)

  ?item wdt:P17 ?country .

  OPTIONAL { ?item wdt:P585 ?d1 . }
  OPTIONAL { ?item wdt:P577 ?d2 . }
  OPTIONAL { ?item wdt:P580 ?d3 . }
  BIND(COALESCE(?d1, ?d2, ?d3) AS ?date)
  FILTER(BOUND(?date) && YEAR(?date) = ?year)

  OPTIONAL {
    ?frArticle schema:about ?item ;
               schema:isPartOf <https://fr.wikipedia.org/> .
  }
  OPTIONAL {
    ?enArticle schema:about ?item ;
               schema:isPartOf <https://en.wikipedia.org/> .
  }
  BIND(COALESCE(?frArticle, ?enArticle) AS ?article)
  FILTER(BOUND(?article))

  OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }

  FILTER(
    CONTAINS(LCASE(STR(?itemLabel)), "loi") ||
    CONTAINS(LCASE(STR(?itemLabel)), "d\xE9cret") ||
    CONTAINS(LCASE(STR(?itemLabel)), "interdiction") ||
    CONTAINS(LCASE(STR(?itemLabel)), "obligation") ||
    CONTAINS(LCASE(STR(?itemLabel)), "l\xE9galisation") ||
    CONTAINS(LCASE(STR(?itemLabel)), "creation") ||
    CONTAINS(LCASE(STR(?itemLabel)), "cr\xE9ation") ||
    CONTAINS(LCASE(STR(?itemLabel)), "inauguration") ||
    CONTAINS(LCASE(STR(?itemLabel)), "lancement") ||
    CONTAINS(LCASE(STR(?itemLabel)), "premier") ||
    CONTAINS(LCASE(STR(?itemLabel)), "first") ||
    CONTAINS(LCASE(STR(?itemLabel)), "ban") ||
    CONTAINS(LCASE(STR(?itemLabel)), "law") ||
    CONTAINS(LCASE(STR(?itemLabel)), "decree") ||
    CONTAINS(LCASE(STR(?itemLabel)), "legal")
  )
}
ORDER BY DESC(COALESCE(?sitelinks, 0)) DESC(?date)
LIMIT 20
`.trim();
}
function buildGeoSparqlQuery(year, countryQid) {
  return `
SELECT DISTINCT ?item ?itemLabel ?date ?article ?sitelinks WHERE {
  ?item wdt:P31/wdt:P279* wd:Q1656682 ;
        wdt:P585 ?date .
  FILTER(YEAR(?date) = ${year})

  {
    ?item wdt:P17 wd:${countryQid} .
  }
  UNION
  {
    ?item wdt:P276 ?place .
    ?place wdt:P131* ?admin .
    ?admin wdt:P17 wd:${countryQid} .
  }
  UNION
  {
    ?item wdt:P131* ?adminDirect .
    ?adminDirect wdt:P17 wd:${countryQid} .
  }

  OPTIONAL {
    ?frArticle schema:about ?item ;
               schema:isPartOf <https://fr.wikipedia.org/> .
  }
  OPTIONAL {
    ?enArticle schema:about ?item ;
               schema:isPartOf <https://en.wikipedia.org/> .
  }
  BIND(COALESCE(?frArticle, ?enArticle) AS ?article)
  FILTER(BOUND(?article))

  OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
ORDER BY DESC(COALESCE(?sitelinks, 0)) DESC(?date)
LIMIT 20
`.trim();
}
function cleanEvent(row) {
  return {
    qid: extractQid2(row.item?.value),
    label: row.itemLabel?.value || "",
    date: row.date?.value || "",
    placeLabel: row.placeLabel?.value || "",
    cityLabel: row.cityLabel?.value || "",
    wikipediaUrl: row.article?.value || ""
  };
}
async function onRequestOptions8() {
  return new Response(null, { status: 204, headers: headers("text/plain; charset=utf-8") });
}
async function onRequestGet6(context2) {
  const requestUrl = new URL(context2.request.url);
  const year = parseYear4(requestUrl.searchParams.get("year"));
  const country = parseCountry(requestUrl.searchParams.get("country"));
  const mode = requestUrl.searchParams.get("mode") === "geo" ? "geo" : "fast";
  if (!year || !country) {
    return json8(400, {
      error: "Missing or invalid query parameters. Expected ?year=YYYY&country=QID"
    });
  }
  const sparqlQuery = mode === "geo" ? buildGeoSparqlQuery(year, country) : buildFastSparqlQuery(year, country);
  const endpoint = "https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(sparqlQuery);
  const controller = new AbortController();
  const isLocal = requestUrl.hostname === "127.0.0.1" || requestUrl.hostname === "localhost" || requestUrl.hostname.endsWith(".local");
  const timeoutMs = isLocal ? 25e3 : 55e3;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/sparql-results+json, application/json",
        "user-agent": "AvantMoi/0.1 (contact: contact@avantmoi.com)"
      }
    });
    if (!response.ok) {
      return json8(502, {
        error: "Wikidata SPARQL request failed",
        status: response.status
      });
    }
    const raw2 = await response.json();
    const bindings = Array.isArray(raw2?.results?.bindings) ? raw2.results.bindings : [];
    const events = bindings.map(cleanEvent).filter((event) => event.qid && event.label);
    const ruptureEvents = [];
    for (const event of events) {
      const eligibility = isEligibleRupture(event);
      if (!eligibility.ok) continue;
      const rupture = classifyRuptureWithConfidence(event);
      if (!rupture) continue;
      const ruptureType = rupture.type || classifyRupture(event);
      if (!ruptureType) continue;
      ruptureEvents.push({
        ...event,
        rupture_type: ruptureType,
        confidence: rupture.confidence
      });
    }
    return json8(200, ruptureEvents);
  } catch (error3) {
    return json8(500, {
      error: "Failed to query Wikidata",
      detail: error3 instanceof Error ? error3.message : "unknown_error"
    });
  } finally {
    clearTimeout(timeout);
  }
}
var init_batch = __esm({
  "api/batch.ts"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_ruptureClassifier();
    init_ruptureTaxonomy();
    __name(headers, "headers");
    __name(json8, "json");
    __name(parseYear4, "parseYear");
    __name(parseCountry, "parseCountry");
    __name(extractQid2, "extractQid");
    __name(buildFastSparqlQuery, "buildFastSparqlQuery");
    __name(buildGeoSparqlQuery, "buildGeoSparqlQuery");
    __name(cleanEvent, "cleanEvent");
    __name(onRequestOptions8, "onRequestOptions");
    __name(onRequestGet6, "onRequestGet");
  }
});

// api/debug-env.js
function responseHeaders8() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function json9(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders8() });
}
async function onRequestOptions9() {
  return new Response(null, { status: 204, headers: responseHeaders8() });
}
async function onRequestGet7(context2) {
  return json9(200, {
    hasOpenAIKey: Boolean(String(context2.env?.OPENAI_API_KEY || "").trim()),
    hasOpenAIModel: Boolean(String(context2.env?.OPENAI_MODEL || "").trim()),
    hasDatabaseUrl: Boolean(String(context2.env?.DATABASE_URL || "").trim()),
    branch: String(context2.env?.CF_PAGES_BRANCH || ""),
    pagesUrl: String(context2.env?.CF_PAGES_URL || "")
  });
}
var init_debug_env = __esm({
  "api/debug-env.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(responseHeaders8, "responseHeaders");
    __name(json9, "json");
    __name(onRequestOptions9, "onRequestOptions");
    __name(onRequestGet7, "onRequestGet");
  }
});

// api/enrich-wikileads.js
function responseHeaders9() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function json10(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders9() });
}
function log6(level, message, context2 = {}) {
  const payload = { level, message, ts: (/* @__PURE__ */ new Date()).toISOString(), ...context2 };
  if (level === "error") console.error(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
}
function sanitizeItems(rawItems) {
  return (Array.isArray(rawItems) ? rawItems : []).map((item) => ({
    ...item,
    uniqueEventId: String(item?.uniqueEventId || "").trim(),
    eventQid: String(item?.eventQid || "").trim(),
    title: String(item?.title || "").trim(),
    sourceUrl: String(item?.sourceUrl || "").trim()
  }));
}
async function mapWithConcurrency2(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runOne() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }
  __name(runOne, "runOne");
  const runners = Array.from({ length: Math.max(1, Math.min(concurrency, 3)) }, () => runOne());
  await Promise.all(runners);
  return results;
}
async function onRequestOptions10() {
  return new Response(null, { status: 204, headers: responseHeaders9() });
}
async function onRequestPost5(context2) {
  const requestId = crypto.randomUUID();
  let payload;
  try {
    payload = await context2.request.json();
  } catch {
    return json10(400, { error: "invalid_json_body", requestId });
  }
  const year = Number(payload?.year);
  const country = String(payload?.country || "").toUpperCase();
  const items = sanitizeItems(payload?.items);
  if (!Number.isInteger(year) || !country || items.length === 0) {
    return json10(400, { error: "invalid_payload", requestId });
  }
  const start = Date.now();
  const enriched = await mapWithConcurrency2(items, 3, async (item) => {
    const wikiLead = await getWikiLead(item.sourceUrl);
    if (!wikiLead) {
      return { ...item, wikiLead: "", invalidReason: "missing_wikiLead" };
    }
    return { ...item, wikiLead };
  });
  const invalidCount = enriched.filter((item) => !item.wikiLead).length;
  log6("info", "enrich_wikileads_completed", {
    requestId,
    year,
    country,
    count: enriched.length,
    invalidCount,
    durationMs: Date.now() - start
  });
  return json10(200, { year, country, items: enriched });
}
var init_enrich_wikileads = __esm({
  "api/enrich-wikileads.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_wiki_lead();
    __name(responseHeaders9, "responseHeaders");
    __name(json10, "json");
    __name(log6, "log");
    __name(sanitizeItems, "sanitizeItems");
    __name(mapWithConcurrency2, "mapWithConcurrency");
    __name(onRequestOptions10, "onRequestOptions");
    __name(onRequestPost5, "onRequestPost");
  }
});

// api/history.js
function parseYear5(raw2) {
  const year = Number(raw2);
  if (!Number.isInteger(year) || year < 1 || year > 2100) return null;
  return year;
}
function normalizeLang(raw2) {
  return String(raw2 || "").toLowerCase().startsWith("fr") ? "fr" : "en";
}
function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 1831565813;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function pickFallbackEvents(year, lang) {
  const random = mulberry32(hashString(`${year}|${lang}|history`));
  const pool = [...FALLBACK_EVENTS[lang]];
  const items = [];
  while (pool.length > 0 && items.length < 5) {
    const index = Math.floor(random() * pool.length);
    items.push(pool.splice(index, 1)[0]);
  }
  return items;
}
function responseHeaders10(contentType = "application/json; charset=utf-8") {
  return {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=900",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function isHistoryItem(value) {
  return Boolean(
    value && typeof value === "object" && typeof value.summary === "string" && value.summary.length > 0 && typeof value.label === "string" && value.label.length > 0 && typeof value.url === "string" && value.url.length > 0
  );
}
function isHistoryPayload(value) {
  return Array.isArray(value) && value.every(isHistoryItem);
}
async function onRequestOptions11() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders10()
  });
}
async function onRequestGet8(context2) {
  const incoming = new URL(context2.request.url);
  const year = parseYear5(incoming.searchParams.get("year"));
  const lang = normalizeLang(incoming.searchParams.get("lang"));
  if (!year) {
    return new Response(JSON.stringify({ error: "Invalid year parameter" }), {
      status: 400,
      headers: responseHeaders10()
    });
  }
  const fallback = pickFallbackEvents(year, lang);
  if (!isHistoryPayload(fallback)) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: responseHeaders10()
    });
  }
  return new Response(JSON.stringify(fallback.slice(0, 5)), {
    status: 200,
    headers: responseHeaders10()
  });
}
var DEFAULT_URL, FALLBACK_EVENTS;
var init_history = __esm({
  "api/history.js"() {
    "use strict";
    init_functionsRoutes_0_2990754018219979();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    DEFAULT_URL = "https://avantmoi.com";
    FALLBACK_EVENTS = {
      fr: [
        { label: "Demonstration publique d un nouveau dispositif urbain", summary: "Une demonstration attire la foule et un geste quotidien change en ville.", url: DEFAULT_URL },
        { label: "Ouverture d un service collectif en centre-ville", summary: "Un service accessible au public modifie les habitudes de deplacement.", url: DEFAULT_URL },
        { label: "Premiere mise en usage d un outil pratique", summary: "Un outil jusque-la rare devient visible et teste par tous.", url: DEFAULT_URL },
        { label: "Nouvelle pratique diffusee dans les lieux publics", summary: "Une pratique se repand rapidement dans les espaces frequentes.", url: DEFAULT_URL },
        { label: "Presentation d une innovation d usage courant", summary: "Une presentation publique transforme un geste simple du quotidien.", url: DEFAULT_URL },
        { label: "Premier deploiement d un service en quartier", summary: "Un deploiement local change la facon d attendre et de circuler.", url: DEFAULT_URL },
        { label: "Lancement d un acces simplifie au public", summary: "Un acces simplifie rend un service plus direct pour les passants.", url: DEFAULT_URL },
        { label: "Diffusion d un nouvel usage dans la rue", summary: "Un usage encore neuf devient visible puis familier dans la rue.", url: DEFAULT_URL }
      ],
      en: [
        { label: "Public demonstration of a new city device", summary: "A public demo draws a crowd and shifts an everyday urban gesture.", url: DEFAULT_URL },
        { label: "Opening of a shared downtown service", summary: "A public-facing service changes how people move through the area.", url: DEFAULT_URL },
        { label: "First practical use of a visible tool", summary: "A once-rare tool appears in public and gets tested by everyone.", url: DEFAULT_URL },
        { label: "New public-place practice becomes common", summary: "A new practice spreads quickly across busy public places.", url: DEFAULT_URL },
        { label: "Presentation of a daily-use innovation", summary: "A public presentation changes a simple day-to-day behavior.", url: DEFAULT_URL },
        { label: "First neighborhood rollout of a service", summary: "A local rollout changes how people wait and get around.", url: DEFAULT_URL },
        { label: "Launch of simpler public access", summary: "Simpler access makes a familiar service feel immediate.", url: DEFAULT_URL },
        { label: "Spread of a new street-level habit", summary: "A new habit appears in public and quickly feels familiar.", url: DEFAULT_URL }
      ]
    };
    __name(parseYear5, "parseYear");
    __name(normalizeLang, "normalizeLang");
    __name(hashString, "hashString");
    __name(mulberry32, "mulberry32");
    __name(pickFallbackEvents, "pickFallbackEvents");
    __name(responseHeaders10, "responseHeaders");
    __name(isHistoryItem, "isHistoryItem");
    __name(isHistoryPayload, "isHistoryPayload");
    __name(onRequestOptions11, "onRequestOptions");
    __name(onRequestGet8, "onRequestGet");
  }
});

// ../.wrangler/tmp/pages-LeVkNp/functionsRoutes-0.2990754018219979.mjs
var routes;
var init_functionsRoutes_0_2990754018219979 = __esm({
  "../.wrangler/tmp/pages-LeVkNp/functionsRoutes-0.2990754018219979.mjs"() {
    "use strict";
    init_events();
    init_events();
    init_events();
    init_purge_cache();
    init_purge_cache();
    init_session();
    init_session();
    init_session();
    init_session();
    init_strict_editor();
    init_strict_editor();
    init_ad_config();
    init_ad_config();
    init_ad_config();
    init_anecdote();
    init_anecdote();
    init_anecdotes();
    init_anecdotes();
    init_anecdotes();
    init_batch();
    init_batch();
    init_debug_env();
    init_debug_env();
    init_enrich_wikileads();
    init_enrich_wikileads();
    init_history();
    init_history();
    routes = [
      {
        routePath: "/api/admin/events",
        mountPath: "/api/admin",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete]
      },
      {
        routePath: "/api/admin/events",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      },
      {
        routePath: "/api/admin/events",
        mountPath: "/api/admin",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions]
      },
      {
        routePath: "/api/admin/purge-cache",
        mountPath: "/api/admin",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions2]
      },
      {
        routePath: "/api/admin/purge-cache",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/admin/session",
        mountPath: "/api/admin",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete2]
      },
      {
        routePath: "/api/admin/session",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet2]
      },
      {
        routePath: "/api/admin/session",
        mountPath: "/api/admin",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions3]
      },
      {
        routePath: "/api/admin/session",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      },
      {
        routePath: "/api/anecdotes/strict-editor",
        mountPath: "/api/anecdotes",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions4]
      },
      {
        routePath: "/api/anecdotes/strict-editor",
        mountPath: "/api/anecdotes",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost3]
      },
      {
        routePath: "/api/ad-config",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet3]
      },
      {
        routePath: "/api/ad-config",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions5]
      },
      {
        routePath: "/api/ad-config",
        mountPath: "/api",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut]
      },
      {
        routePath: "/api/anecdote",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet4]
      },
      {
        routePath: "/api/anecdote",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions6]
      },
      {
        routePath: "/api/anecdotes",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet5]
      },
      {
        routePath: "/api/anecdotes",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions7]
      },
      {
        routePath: "/api/anecdotes",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost4]
      },
      {
        routePath: "/api/batch",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet6]
      },
      {
        routePath: "/api/batch",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions8]
      },
      {
        routePath: "/api/debug-env",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet7]
      },
      {
        routePath: "/api/debug-env",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions9]
      },
      {
        routePath: "/api/enrich-wikileads",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions10]
      },
      {
        routePath: "/api/enrich-wikileads",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost5]
      },
      {
        routePath: "/api/history",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet8]
      },
      {
        routePath: "/api/history",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions11]
      }
    ];
  }
});

// ../.wrangler/tmp/bundle-9zc9AA/middleware-loader.entry.ts
init_functionsRoutes_0_2990754018219979();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../.wrangler/tmp/bundle-9zc9AA/middleware-insertion-facade.js
init_functionsRoutes_0_2990754018219979();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_2990754018219979();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../../.npm/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_2990754018219979();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x2) {
    return x2;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x2) {
    return x2;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_functionsRoutes_0_2990754018219979();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_functionsRoutes_0_2990754018219979();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-9zc9AA/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
init_functionsRoutes_0_2990754018219979();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-9zc9AA/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.48248008503717954.mjs.map
