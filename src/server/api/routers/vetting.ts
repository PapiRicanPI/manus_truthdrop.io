import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sendApprovalEmail, sendRejectionEmail, sendMoreInfoEmail } from "../../lib/email";

export const vettingRouter = createTRPCRouter({
  getApplications: protectedProcedure
    .input(z.object({ status: z.enum(["pending", "approved", "rejected", "needs_info", "all"]).optional() }))
    .query(async ({ ctx, input }) => {
      const whereClause = input.status && input.status !== "all" ? { status: input.status } : {};
      return ctx.db.vettingApplication.findMany({ where: whereClause, orderBy: { createdAt: "desc" } });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [total, pending, approved, rejected, needs_info] = await Promise.all([
      ctx.db.vettingApplication.count(),
      ctx.db.vettingApplication.count({ where: { status: "pending" } }),
      ctx.db.vettingApplication.count({ where: { status: "approved" } }),
      ctx.db.vettingApplication.count({ where: { status: "rejected" } }),
      ctx.db.vettingApplication.count({ where: { status: "needs_info" } }),
    ]);
    return { total, pending, approved, rejected, needs_info };
  }),

  approveApplication: protectedProcedure
    .input(z.object({
      applicationId: z.string(),
      reviewNotes: z.string().min(1, "Review notes are required"),
      assignedRole: z.enum(["observer", "researcher", "custodian", "admin"]).default("observer"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can approve applications" });
      const application = await ctx.db.vettingApplication.findUnique({ where: { id: input.applicationId } });
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      const password = generateSecurePassword();
      const updatedApplication = await ctx.db.vettingApplication.update({
        where: { id: input.applicationId },
        data: { status: "approved", reviewNotes: input.reviewNotes, reviewedAt: new Date(), reviewedBy: ctx.session.user.email, generatedPassword: password },
      });
      try {
        await ctx.db.user.create({
          data: { email: application.email, name: application.fullName, password: await hashPassword(password), role: input.assignedRole, organization: application.organization },
        });
      } catch (e) { console.error("User create failed (may already exist):", e); }
      try {
        await sendApprovalEmail({ to: application.email, name: application.fullName, password, reviewNotes: input.reviewNotes, assignedRole: input.assignedRole });
      } catch (e) { console.error("Approval email failed:", e); }
      return { success: true, application: updatedApplication, password };
    }),

  rejectApplication: protectedProcedure
    .input(z.object({ applicationId: z.string(), reviewNotes: z.string().min(1, "Review notes are required") }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can reject applications" });
      const application = await ctx.db.vettingApplication.findUnique({ where: { id: input.applicationId } });
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      const updatedApplication = await ctx.db.vettingApplication.update({
        where: { id: input.applicationId },
        data: { status: "rejected", reviewNotes: input.reviewNotes, reviewedAt: new Date(), reviewedBy: ctx.session.user.email },
      });
      try { await sendRejectionEmail({ to: application.email, name: application.fullName, reviewNotes: input.reviewNotes }); }
      catch (e) { console.error("Rejection email failed:", e); }
      return { success: true, application: updatedApplication };
    }),

  requestMoreInfo: protectedProcedure
    .input(z.object({ applicationId: z.string(), infoMessage: z.string().min(10, "Please provide a detailed message about what information is needed") }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can request more info" });
      const application = await ctx.db.vettingApplication.findUnique({ where: { id: input.applicationId } });
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      const updatedApplication = await ctx.db.vettingApplication.update({
        where: { id: input.applicationId },
        data: { status: "needs_info", reviewNotes: input.infoMessage, reviewedAt: new Date(), reviewedBy: ctx.session.user.email },
      });
      try { await sendMoreInfoEmail({ to: application.email, name: application.fullName, infoMessage: input.infoMessage }); }
      catch (e) { console.error("More-info email failed:", e); }
      return { success: true, application: updatedApplication };
    }),

  deleteApplication: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete applications" });
      const application = await ctx.db.vettingApplication.findUnique({ where: { id: input.applicationId } });
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      await ctx.db.vettingApplication.delete({ where: { id: input.applicationId } });
      return { success: true };
    }),
});

function generateSecurePassword(length = 16): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const crypto = require("crypto");
  return Array.from({ length }, () => charset[crypto.randomInt(0, charset.length)]).join("");
}

async function hashPassword(password: string): Promise<string> {
  const bcrypt = require("bcryptjs");
  return bcrypt.hash(password, 10);
}
