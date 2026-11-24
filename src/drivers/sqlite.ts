import type { TypeDb } from "../classes/connection";
import type { Driver, Entities, TypeDbConfig } from "../types";

export class SqliteDriver implements Driver {

    constructor(private config: TypeDbConfig) {
        throw new Error('Unimplemented')
    }

    async query<R>(query: string, ...params: unknown[]): Promise<R> {
        throw new Error('Unimplemented');
    }

    async transaction<R, E extends Entities>(fn: (tx: TypeDb<E>) => Promise<R>): Promise<R> {
        throw new Error('Unimplemented');
    }

    async close() {
        throw new Error('Unimplemented');
    }
}