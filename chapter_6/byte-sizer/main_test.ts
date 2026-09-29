import { describe, it } from "@std/testing/bdd";
import {expect} from "@std/expect";
import { getFileSize } from "./main.ts";

describe("ByteSizer", () => {
  it("should return the correct size for a given file", () => {
    const path = "./test-data/test-file.txt";
    const expectedSize = 4; // Expected size in kilobytes
    const actualSize = getFileSize(path);
    expect(actualSize).toBe(expectedSize);
  });


})
