import type { TypeDb } from "./classes/connection.js";
import type { DbEntity } from "./classes/database.js";
import { stringTypes, numberTypes, binaryTypes, decimalTypes, dateTypes, integerTypes, textTypes, dateFpsTypes } from "./consts.js";

export interface Driver {
    query<R>(sql: string, ...params: unknown[]): Promise<R[]>;
    transaction<T, E extends Entities = Entities>(fn: (tx?: TypeDb<E>) => Promise<T>): Promise<T>;
    close(): Promise<void>;
};

export type SqlToTs = {
    [K in typeof numberTypes[number]]: number;
} & {
    [K in typeof stringTypes[number]]: string;
} & {
    [K in typeof binaryTypes[number]]: Uint8Array
} & {
    [K in typeof dateTypes[number]]: Date
} & {
    JSON: any
    GEOMETRY: Uint8Array | string,
    ENUM: string[],
    SET: string[]
};

export type SqlDecimalTypes = typeof decimalTypes[number]

export type SqlType = keyof SqlToTs;
export type VaildSqlType<T extends string> = Uppercase<T> extends SqlType ? T : never;

type AdditionalColOptions<T extends SqlType> =
    T extends typeof decimalTypes[number]
    ? { length?: number, percision?: number }
    : T extends typeof integerTypes[number] | typeof binaryTypes[number]
    ? { length?: number }
    : T extends typeof textTypes[number]
    ? { lenght?: number, charset?: string, collation?: string }
    : T extends typeof dateFpsTypes[number] | 'TIME'
    ? { percision?: number }
    : {};

export type ColumnMeta<T extends SqlType> = {
    propertyKey: string;
    columnName: string;
    sqlType: T;
    primaryKey: boolean;
    nullable: boolean;
} & AdditionalColOptions<T>;

export interface EntityMeta {
    tableName?: string;
    columns?: Record<string, ColumnMeta<SqlType>>;
}

export type ColumnOptions<T extends SqlType> = {
    name?: string;
    nullable?: boolean;
    primaryKey?: boolean;
} & AdditionalColOptions<T>;

export type SSLOptions = {
    ca?: string;
    cert: string;
    cipher?: string;
    minVersion?: string;
    maxVersion?: string;
    key?: string;
    passphrase?: string;
    rejectUnauthorized?: boolean;
}

export type Entities = {
    [key: string]: new (...args: any[]) => DbEntity;
}

export type PartialConfig<T extends Entities> = {
    connectionTimeout?: boolean;
    connectionLimit?: boolean;
    disableEval?: boolean;
    insecureAuth?: boolean;
    ssl?: SSLOptions;
    driver?: 'mysql' | 'postgres' | 'mssql' | 'sqlite';
    entities: T
};

export type TypeDbConfig<T extends Entities = Entities> = PartialConfig<T> & (
    { connectionString: string } | {
        host: string,
        port: number,
        user: string,
        password: string
        database: string,
    }
)