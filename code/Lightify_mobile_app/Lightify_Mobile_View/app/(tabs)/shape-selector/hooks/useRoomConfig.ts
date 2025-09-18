// hooks/useRoomConfig.ts
import { useEffect, useState } from "react";
import axiosClient from "../../../../utils/axiosClient";
import { Shape } from "../utils/types";

export default function useRoomConfig(username: string, roomName: string) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosClient.get(
          `/api/rooms/configure?username=${username}&roomName=${roomName}`
        );
        if (cancelled) return;
        const areas = res?.data?.Areas || [];
        setShapes(areas);
        setLoaded(true);
        console.log("✅ Room config loaded");
      } catch (e) {
        console.error("❌ Failed to fetch config:", e);
      }
    })();
    return () => { cancelled = true; };
  }, [username, roomName]);

  const saveShapes = async (areas: Shape[]) => {
    try {
      await axiosClient.post("/api/rooms/configure", {
        username,
        roomName,
        Areas: areas,
      });
      console.log("✅ Room configuration updated");
    } catch (e) {
      console.error("❌ Failed to update config:", e);
    }
  };

  return { shapes, setShapes, saveShapes, loaded };
}
