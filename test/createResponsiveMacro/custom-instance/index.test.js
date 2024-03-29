import { babelTester } from "test-utils";
import plugin from "../../../src";

babelTester("babel-plugin-dash/responsive", __dirname, {
  // we add a duplicate of our own plugin
  // users may run babel twice, and our plugin should be smart enough to not duplicate fields
  plugins: [[plugin, { instances: { responsive: ["./src/responsive"] } }]],
});
