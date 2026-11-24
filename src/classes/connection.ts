import { Repository } from "./database"
import { type Driver, type TypeDbConfig, type Entities } from "../types"
import { MySqlDriver } from "../drivers/mysql";
import { MSSqlDriver } from "../drivers/mssql";
import { PostgresDriver } from "../drivers/postgrres";
import { SqliteDriver } from "../drivers/sqlite";


export function connect<T extends Entities>(config: TypeDbConfig<T>) { return new TypeDbDriver<T>(config) as TypeDb<T>; }

type Repos<T extends Entities> = {
    [K in keyof T as Uncapitalize<K & string>]: Repository<InstanceType<T[K]>, T>;
}

class TypeDbDriver<T extends Entities = Entities> implements Driver {
    private readonly driver: Driver;
    readonly config: Readonly<TypeDbConfig<T>>;
    constructor(config: TypeDbConfig<T>) {
        const defaults = {
            disableEval: false,
            driver: 'sqlite',
            insecureAuth: false
        }

        config = Object.assign({}, defaults, config);

        this.config = Object.freeze(config);

        if (config.driver === 'mysql') {
            this.driver = new MySqlDriver(config)
        }
        else if (config.driver === 'mssql') {
            this.driver = new MSSqlDriver(config);
        }
        else if (config.driver === 'postgres') {
            this.driver = new PostgresDriver(config);
        }
        else if (config.driver === 'sqlite') {
            this.driver = new SqliteDriver(config);
        }
        else {
            throw new Error(`Invalid database driver ${config.driver}`);
        }

        for (let [_, v] of Object.entries(config.entities)) {
            (this as any)[`${v.name.slice(0, 1).toLowerCase() ?? ''}${v.name.slice(1)}`] = new Repository(v, this as TypeDb<T>);
        }
    }

    async query<R>(query: string, ...params: unknown[]) {
        return this.driver.query<R>(query, ...params);
    }

    transaction<R, E extends Entities = Entities>(fn: (tx?: TypeDb<T>) => Promise<R>): Promise<R> {

        return this.driver.transaction(fn);
    }
}

export type TypeDb<T extends Entities = Entities> = TypeDbDriver<T> & Repos<T>;