import { createRoot } from "react-dom/client";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/playfair-display/latin-900.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "@fontsource/playfair-display/latin-700-italic.css";
import "@fontsource/fira-sans/latin-400.css";
import "@fontsource/fira-sans/latin-500.css";
import "@fontsource/fira-sans/latin-600.css";
import "./styles.css";
import { App } from "./App.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { WebGLFallback } from "./components/WebGLFallback.jsx";
import { hasWebGL } from "./lib/webgl.js";

const root = document.getElementById("root");

createRoot(root).render(
  hasWebGL() ? (
    <ErrorBoundary fallback={<WebGLFallback reason="error" />}>
      <App />
    </ErrorBoundary>
  ) : (
    <WebGLFallback reason="unsupported" />
  ),
);
