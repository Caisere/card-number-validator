import { createApp } from "./app";
import { env } from "./config/env";

const server = createApp();

server.listen(env.port, () => {
  console.log(`Server is now running on port http://localhost:${env.port}`);
});
