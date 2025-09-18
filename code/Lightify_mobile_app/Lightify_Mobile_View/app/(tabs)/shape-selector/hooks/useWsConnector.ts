import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import axiosClient from "../../../../utils/axiosClient";
import { LiveCoords } from "../utils/types";

const WS_PING_MS = 15000;
const MAX_BACKOFF_MS = 15000;

function makeConnector({
  getUrl,
  username,
  onMessageJson,
  onOpen,
  onClose,
  debug = true,
}: any) {
  let ws: WebSocket | null = null;
  let connecting = false;
  let authed = false;
  let aliveTs = 0;
  let pingTimer: any = null;
  let backoff = 1000;
  let stopped = false;
  const buffer: any[] = [];

  const log = (...a: any[]) => debug && console.log("[WS]", ...a);

  const safeSendNow = (obj: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(typeof obj === "string" ? obj : JSON.stringify(obj));
      return true;
    }
    return false;
  };

  const flush = () => {
    if (!authed) return;
    while (buffer.length && ws?.readyState === WebSocket.OPEN) {
      const m = buffer.shift();
      safeSendNow(m);
    }
  };

  const send = (obj: any) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !authed) {
      buffer.push(obj);
      log("buffered (not open/authed):", obj);
      return false;
    }
    return safeSendNow(obj);
  };

  const startPing = () => {
    stopPing();
    aliveTs = Date.now();
    pingTimer = setInterval(() => {
      safeSendNow({ type: "ping" });
      // Safety: if totally silent, force close to trigger reconnect
      if (Date.now() - aliveTs > WS_PING_MS * 2) {
        try { ws?.close(); } catch {}
      }
    }, WS_PING_MS);
  };

  const stopPing = () => {
    if (pingTimer) {
      clearInterval(pingTimer);
      pingTimer = null;
    }
  };

  const connect = async () => {
    // ⬅️ important: allow reconnect after a stop()
    stopped = false;

    if (connecting) return;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    connecting = true;
    try {
      authed = false;
      const url = await getUrl();
      log("getUrl →", url);
      ws = new WebSocket(url);

      ws.onopen = () => {
        connecting = false;
        aliveTs = Date.now();
        backoff = 1000;
        log("✅ WS open");
        onOpen?.();
        // authenticate
        safeSendNow({ username });
        startPing();
      };

      ws.onmessage = (e) => {
        aliveTs = Date.now();
        try {
          const msg = JSON.parse(e.data);
          if (msg.status === "ok") { authed = true; flush(); return; }
          if (msg.type === "pong") return;
          onMessageJson?.(msg);
        } catch {
          // ignore non-JSON frames
        }
      };

      ws.onerror = (err: any) => {
        log("❌ WS error", err?.message || err);
      };

      ws.onclose = () => {
        connecting = false;
        stopPing();
        authed = false;
        log("🔌 WS closed → will retry");
        onClose?.();
        if (stopped) return;
        const delay = Math.min(backoff, MAX_BACKOFF_MS) + Math.floor(Math.random() * 400);
        setTimeout(connect, delay);
        backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
      };
    } catch (e: any) {
      connecting = false;
      log("❌ connect threw:", e?.message || e);
      const delay = Math.min(backoff, MAX_BACKOFF_MS);
      setTimeout(connect, delay);
      backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
    }
  };

  const stop = () => {
    stopped = true;
    stopPing();
    try { ws?.close(); } catch {}
    ws = null;
    connecting = false;
  };

  return { connect, stop, send };
}

export default function useWsConnector(username: string, roomName: string) {
  const connectorRef = useRef<ReturnType<typeof makeConnector> | null>(null);
  const lastTsRef = useRef(0);
  const [coords, setCoords] = useState<LiveCoords>({ x: 0, y: 0 });

  useEffect(() => {
    let netSub: any;
    let appSub: any;

    const getUrl = async () => {
      try {
        const res = await axiosClient.get(
          `/api/backend/websocketIp?username=${username}&roomName=${roomName}`
        );
        const ip = res?.data?.ipaddress;
        if (!ip) throw new Error("No ipaddress");
        return `ws://${ip}:81`;
      } catch (e: any) {
        console.log("[WS] ❌ getUrl failed:", e?.message || e);
        throw e;
      }
    };

    connectorRef.current = makeConnector({
      getUrl,
      username,
      onMessageJson: (msg: any) => {
        if (msg.command === "coordinates" && msg.payload) {
          const now = Date.now();
          // ~10 Hz UI throttle
          if (now - lastTsRef.current > 100) {
            lastTsRef.current = now;
            setCoords({ x: msg.payload.x, y: msg.payload.y });
          }
        }
      },
      onOpen: () => console.log("✅ WS open"),
      onClose: () => console.log("🔌 WS closed → will retry"),
      debug: true,
    });

    const maybeConnect = (netState: any) => {
      const online = netState?.isConnected ?? true;
      const appActive = AppState.currentState === "active";
      console.log("[WS] NetInfo isConnected:", online, "AppState:", AppState.currentState);
      if (online && appActive) {
        connectorRef.current?.connect();
      } else {
        connectorRef.current?.stop();
      }
    };

    NetInfo.fetch().then(maybeConnect);
    netSub = NetInfo.addEventListener(maybeConnect);

    appSub = AppState.addEventListener("change", (s) => {
      console.log("[WS] AppState change:", s);
      if (s === "active") {
        NetInfo.fetch().then(maybeConnect);
      } else {
        connectorRef.current?.stop();
      }
    });

    return () => {
      netSub && netSub();
      appSub && appSub.remove();
      connectorRef.current?.stop();
      connectorRef.current = null;
    };
  }, [username, roomName]);

  const send = (payload: any) => {
    const ok = connectorRef.current?.send(payload);
    if (!ok) console.warn("WS not ready; buffered:", payload);
    return ok;
  };

  return { coords, send };
}
