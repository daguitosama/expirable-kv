import DatabaseConstructor, { Database } from "better-sqlite3";
import { Result } from "true-myth";
// const A_DAY = 1000 * 60 * 60 * 24;
export class ExpirableKV {
    private db: Database;
    static init(fileName: string): ExpirableKV {
        const db = new DatabaseConstructor(fileName);
        db.pragma("journal_mode = WAL");
        db.prepare(queryCreateDataTable).run();
        return new this(db);
    }

    constructor(db: Database) {
        this.db = db;
    }

    public set<T>(
        /**
         * Name of the cache entry
         */
        key: string,
        /**
         * Data to store
         */
        value: T,
        /**
         * Date in milliseconds
         */
        expiresAt: number
    ): Result<true, Error> {
        try {
            const now = Date.now();
            if (now > expiresAt) {
                throw new Error("Failed to set a cache entry with an expiration all ready passed");
            }
            const statement = this.db.prepare(
                `
                INSERT INTO data (key, value, expiresAt) VALUES (?, ?, ?)
                `
            );

            statement.run(key, JSON.stringify(value), expiresAt);
            return Result.ok(true);
        } catch (error) {
            if (error instanceof Error) {
                return Result.err(error);
            }

            return Result.err(new Error("Unknown Error"));
        }
    }

    public get<T>(key: string): Result<T | null, Error> {
        try {
            const stmt = this.db.prepare(
                `
                select value from data where key = ?
                `
            );
            const result = stmt.get(key) as { value: string } | undefined;

            if (!result) {
                return Result.ok(null);
            }

            return Result.ok(JSON.parse(result.value));
        } catch (error) {
            if (!(error instanceof Error)) {
                return Result.err(new Error("Unknown Error"));
            }
            return Result.err(error);
        }
    }

    public close() {
        this.db.close();
    }
}

const queryCreateDataTable = `
    CREATE TABLE IF NOT EXISTS data (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        expiresAt INTEGER NOT NULL
    );
`;
