// Checks that every source link still resolves. Run it yourself (needs internet): npm run check:links
// Publishers such as Nature/Science/Cell often block scripts (HTTP 403/429); those are reported as
// "blocked" and need a manual look in a browser. 404/410/DNS failures are real problems and fail the run.
import { SOURCES } from "../src/data/sources.js";

const urls = [...new Set(Object.values(SOURCES).flat().map((e) => e[1]))];
const UA = "Mozilla/5.0 (compatible; DeepBranchesLinkCheck/1.0)";

async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        headers: { "user-agent": UA, accept: "text/html,*/*" },
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) return { url, status: "ok", code: res.status };
      if ([403, 429, 401, 999].includes(res.status)) {
        if (method === "GET") return { url, status: "blocked", code: res.status };
        continue;
      }
      if (res.status === 406 && method === "GET") {
        try {
          const fb = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
          if (fb.ok) return { url, status: "ok", code: fb.status };
          return { url, status: "blocked", code: fb.status };
        } catch {
          return { url, status: "blocked", code: 406 };
        }
      }
      if (method === "GET" || res.status === 404 || res.status === 410) return { url, status: "broken", code: res.status };
    } catch (e) {
      if (method === "GET") return { url, status: "broken", code: String(e.cause?.code || e.name) };
    }
  }
  return { url, status: "broken", code: "?" };
}

const results = [];
const queue = [...urls];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const r = await check(queue.shift());
      results.push(r);
      console.log(`${r.status.padEnd(8)} ${String(r.code).padEnd(8)} ${r.url}`);
    }
  }),
);
const broken = results.filter((r) => r.status === "broken");
const blocked = results.filter((r) => r.status === "blocked");
console.log(`\n${results.length} links: ${results.length - broken.length - blocked.length} ok, ${blocked.length} blocked (check by hand), ${broken.length} broken`);
process.exit(broken.length ? 1 : 0);
