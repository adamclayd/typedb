import { createConnection, type Connection, type RowDataPacket } from 'mysql2/promise';
import type { Driver, Entities, TypeDbConfig } from "../types.js";
import type { TypeDb } from '../classes/connection.js';

export class MySqlDriver implements Driver {
    private connection!: Connection;

    constructor(private config: TypeDbConfig) {
        (async () => {
            this.connection = await createConnection({

            })
        });
    }

    async query<R>(query: string, ...params: unknown[]): Promise<R> {
        throw new Error('Unimplemented');
    }

    async transaction<R, E extends Entities>(fn: () => Promise<R>): Promise<R> {
        throw new Error('Unimplemented');
    }

    async close() {
        throw new Error('Unimplemented');
    }
}