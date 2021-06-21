// taken from https://github.com/dubbelster/express-sse-ts/blob/master/src/index.ts

import { NextFunction, Response, Request } from "express";

interface sseClient {
    id: number,
    res: Response
}

export default class SSE {
    private clients: sseClient[] = [];
    private retryTime: number | null;

    constructor(retryTime: number | null = 5000) {
        this.retryTime = retryTime;
    }

    private _init(req: Request, res: Response, next: NextFunction): void {
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        });
        res.flushHeaders();

        // Tell the client to retry every x miliseconds if connectivity is lost
        if (this.retryTime) res.write(`retry: ${this.retryTime}\n\n`);
        // res.write(`retry: 10000\n\n`);

        const clientId = Date.now();
        this.clients.push({
            id: clientId,
            res: res
        });

        req.once('close', () => {
            for (let i = 0; i < this.clients.length; i++) {
                if (this.clients[i].id == clientId) {
                    this.clients.splice(i, 1);
                    break;
                }
            }
        });

        // next();
    }
    init = this._init.bind(this);

    private _send(data: string, eventName?: string, id?: string | number) {
        this.clients.forEach(c => {
            if (eventName) c.res.write(`event: ${eventName}\n`);
            if (id) c.res.write(`id: ${id}\n`)
            c.res.write(`data: ${data}\n\n`);
        });
    }
    send = this._send.bind(this);
}