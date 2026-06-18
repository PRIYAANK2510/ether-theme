import { prepareWebsiteData } from "./prepare-data.mjs";
import { needsSitePrepare } from "./site-prepare-needs.mjs";

if (needsSitePrepare()) {
  await prepareWebsiteData();
}
