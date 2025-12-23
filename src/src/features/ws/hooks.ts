import {useEffect} from "react";
import {QueryClient} from "@tanstack/react-query";
import {getConfig} from "@app/config";

export function useWebSocket(queryClient: QueryClient) {
    useEffect(() => {
        const ws = new WebSocket(getConfig().wsBaseUrl);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.info('Websocket Message Received:', msg);
            if (msg.type === "invalidate") {
                queryClient.invalidateQueries({
                    queryKey: msg.keys,
                });
            }
        };

        return () => ws.close();
    }, [queryClient]);
}