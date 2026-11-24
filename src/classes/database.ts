import type { Entities, EntityMeta } from "../types";
import type { TypeDb } from './connection';


export const entityRegistry = new WeakMap<Function, Required<EntityMeta>>();


export abstract class DbEntity {
    protected connection: TypeDb;
    constructor(connection: TypeDb) {
        this.connection = connection;
    }

}

type Ctor<T> = new (...args: any[]) => T;

export class Repository<E extends DbEntity, T extends Entities> {
    private entity: Ctor<E>;
    private connection: TypeDb<T>;
    private metadata: EntityMeta;
    constructor(entity: Ctor<E>, connection: TypeDb<T>) {
        this.entity = entity;

        if (!entityRegistry.has(entity))
            throw new Error(`TypeDb: there is no metadata for ${entity.name} for the repository. You have to register it in the entities property of the connection config.\n\nconnect({\n\t...,\n\tentities: { ..., ${entity.name} }\n})`);
        else
            this.metadata = entityRegistry.get(entity)!;

        this.connection = connection;
    }
}