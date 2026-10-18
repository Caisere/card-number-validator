import { registry } from "./registry";
import { z } from "../lib/zod";

registry.registerPath({
  method: "get",
  path: "/api/v1/health",
  tags: ["Health-Check"],
  operationId: "health-check",
  summary: "Api health-check route",
  description: "On success, it means the server is working perfectly",
  request: {},
  responses: {
    200: {
      description: "Health Route is working",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("ok"),
            timestamp: z.string().datetime(),
          }),
        },
      },
    },
  },
});
