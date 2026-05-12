import { render } from "@emberkit/core";
import App from "./routes/_layout";
import "./styles/globals.css";

const root = document.getElementById("app");

if (root) {
  try {
    render(App, root);
  } catch (error) {
    console.error("[entry] Render error:", error);
  }
}
