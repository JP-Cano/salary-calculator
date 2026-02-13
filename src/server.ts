import index from "./frontend/index.html";
import { apiRoutes } from "./routes/index.ts";

const server = Bun.serve({
    port: Bun.env.PORT || 3005,
    routes: {
        "/": index,
        ...apiRoutes,
    },
    development: process.env.NODE_ENV !== "production" ? {
        hmr: true,
        console: true,
    } : false,
});

console.log(
    `Salary Calculator is running at ${server.hostname}:${server.port}`,
);
