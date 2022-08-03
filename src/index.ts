import "dotenv/config";
import { config } from "./config";

async function run() {
  console.log("path to folder: ", config.pathToFolderWithVideos);
}

run();
