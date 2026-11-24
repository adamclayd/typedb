import type { TypeDbConfig } from "./types.js";

const integerTypes = Object.freeze(['BIGINT', 'BIT', 'INTEGER', 'SMIALLINT', 'TINYINT'] as const)
const decimalTypes = Object.freeze(['DECIMAL', 'FLOAT', 'REAL', 'NUMERIC'] as const);
const numberTypes = Object.freeze([...integerTypes, ...decimalTypes, 'YEAR'] as const)
const dateFpsTypes = Object.freeze(['DATETIME', 'TIMESTAMP'] as const);
const dateTypes = Object.freeze([...dateFpsTypes, 'DATE'] as const);
const textTypes = Object.freeze(['CHAR', 'NCHAR', 'VARCHAR', 'NVARCHAR', 'TEXT'] as const);
const stringTypes = Object.freeze([...textTypes, 'TIME'] as const);
const binaryTypes = Object.freeze(['BINARY', 'VBINARY', 'BLOB'] as const);

export { integerTypes, decimalTypes, numberTypes, dateFpsTypes, dateTypes, textTypes, stringTypes, binaryTypes };