if (
  typeof AbortSignal !== "undefined" &&
  typeof AbortController !== "undefined" &&
  typeof AbortSignal.any !== "function"
) {
  Object.defineProperty(AbortSignal, "any", {
    configurable: true,
    writable: true,
    value(signals) {
      const controller = new AbortController();
      const signalList = Array.from(signals || []);

      if (signalList.length === 0) {
        return controller.signal;
      }

      const abort = (signal) => {
        for (const item of signalList) {
          item?.removeEventListener?.("abort", onAbort);
        }

        try {
          controller.abort(signal?.reason);
        } catch {
          controller.abort();
        }
      };

      function onAbort(event) {
        abort(event.target);
      }

      const abortedSignal = signalList.find((signal) => signal?.aborted);
      if (abortedSignal) {
        abort(abortedSignal);
        return controller.signal;
      }

      for (const signal of signalList) {
        signal?.addEventListener?.("abort", onAbort, { once: true });
      }

      return controller.signal;
    },
  });
}
