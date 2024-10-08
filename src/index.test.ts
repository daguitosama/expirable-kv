import { afterAll, beforeAll, expect, test } from "vitest";
import { ExpirableKV } from "./index";
let cache: ExpirableKV;
let uniqueId: string;

beforeAll(() => {
    cache = ExpirableKV.init("test-cache.db");
    uniqueId = crypto.randomUUID();
});

afterAll(() => {
    cache.close();
});

test("Creates a cache instance", async () => {
    expect(cache).toBeDefined();
});

test("Inserts an entry", async () => {
    const currentDate = new Date();

    // Create a new date for three months from now
    const threeMonthsFromNow = new Date(currentDate);

    // Add three months to the current date
    threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

    const result = cache.set(uniqueId, { t: 1 }, threeMonthsFromNow.valueOf());
    if (result.isErr) {
        console.log(result.error);
    }
    // console.log({ result, uniqueId });
    expect(result.isErr).toBeFalsy();
});

test("Reads an entry", async () => {
    const result = cache.get<{ t: number }>(uniqueId);
    if (result.isErr) {
        console.log(result.error);
    }
    if (result.isOk) {
        // console.log(result.value);
        // console.log({ uniqueId, value: result.value });
    }
    expect(result.isErr).toBeFalsy();
    expect(result.isOk).toBeTruthy();
});
