import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContactMessage, subscribeToNewsletter } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        message: z.string().min(1, "Message is required"),
      }))
      .mutation(async ({ input }) => {
        try {
          await createContactMessage({
            name: input.name,
            email: input.email,
            message: input.message,
          });
          return { success: true, message: "Message sent successfully" };
        } catch (error) {
          console.error("Contact form error:", error);
          throw new Error("Failed to submit contact form");
        }
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email"),
      }))
      .mutation(async ({ input }) => {
        try {
          await subscribeToNewsletter(input.email);
          return { success: true, message: "Successfully subscribed to newsletter" };
        } catch (error: any) {
          console.error("Newsletter subscription error:", error);
          const isDuplicate = error.code === "ER_DUP_ENTRY" || error.cause?.code === "ER_DUP_ENTRY";
          if (isDuplicate) {
            return { success: true, message: "Email already subscribed" };
          }
          throw new Error("Failed to subscribe to newsletter");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
