import { Manifest } from "deno-slack-sdk/mod.ts";
import { HelloFunction } from "./functions/hello.ts";

export default Manifest({
  name: "deno-hello-app",
  description: "A sample Slack app built with Deno",
  icon: "assets/icon.png",
  functions: [HelloFunction],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
