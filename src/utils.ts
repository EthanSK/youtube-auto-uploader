import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { FileSortOrder } from "./model";

export function getEnvVarOrThrow<T = string>(name: string): T {
  const envVar = process.env[name]; //so it works on both firebase functions and regular server with environment setup
  if (!envVar) throw new Error(`${name} environment variable not set`);
  else return envVar as unknown as T;
}

export async function getFilesInDir(
  pathToDir: string,
  sortOrder: FileSortOrder
) {
  let files = await fs.readdir(pathToDir);
  files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item)); //remove hidden files such as .DS_Store
  const fileStats = files.reduce(
    (result: { [key: string]: fs.Stats }, fileName) => {
      result[fileName] = fs.statSync(path.join(pathToDir, fileName));
      return result;
    },
    {}
  ); //for efficiency, so we don't read fs.stat in the sort algorithm
  switch (sortOrder) {
    case "alphabetical":
      files = files.sort((a, b) => (a === b ? 0 : a < b ? -1 : 1));
      break;

    case "oldToNew":
      files = files.sort(
        (a, b) => fileStats[a].mtime.getTime() - fileStats[b].mtime.getTime()
      );
      break;

    case "newToOld":
      files = files.sort(
        (a, b) => fileStats[b].mtime.getTime() - fileStats[a].mtime.getTime()
      );
      break;
    case "random":
      files = shuffle(files, 69); //pseudo random, has a seed to ensure it's the same each time
      break;

    default:
      break;
  }

  return files;
}

function shuffle(array: any[], seed: number) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }

  return array;
}

function random(seed: number) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
