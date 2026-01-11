import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sendApprovalEmail, sendRejectionEmail } from "../../lib/email";

/**
 * Vetting Router
 * Handles approval and rejection of vetting applications
 */
export const vettingRouter = createTRPCRouter({
  /**
   * Get all vetting applications
   */
  getApplications: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "approved", "rejected", "all"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause =
        input.status && input.status !== "all"
          ? { status: input.status }
          : {};

      const applications = await ctx.db.vettingApplication.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
      });

      return applications;
    }),

  /**
   * Approve a vetting application
   */
  approveApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        reviewNotes: z.string().min(1, "Review notes are required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can approve applications",
        });
      }

      // Find the application
      const application = await ctx.db.vettingApplication.findUnique({
        where: { id: input.applicationId },
      });

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      if (application.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application has already been reviewed",
        });
      }

      // Generate a secure random password
      const password = generateSecurePassword();

      // Update the application
      const updatedApplication = await ctx.db.vettingApplication.update({
        where: { id: input.applicationId },
        data: {
          status: "approved",
          reviewNotes: input.reviewNotes,
          reviewedAt: new Date(),
          reviewedBy: ctx.session.user.email,
          generatedPassword: password,
        },
      });

      // Create user account
      await ctx.db.user.create({
        data: {
          email: application.email,
          name: application.fullName,
          password: await hashPassword(password),
          role: "admin"
          organization: application.organization,
        },
      });

      // Send approval email
      try {
        await sendApprovalEmail({
          to: application.email,
          name: application.fullName,
          password: password,
          reviewNotes: input.reviewNotes,
        });
      } catch (error) {
        console.error("Failed to send approval email:", error);
        // Don't fail the approval if email fails
      }

      return {
        success: true,
        application: updatedApplication,
        password: password,
      };
    }),

  /**
   * Reject a vetting application
   */
  rejectApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        reviewNotes: z.string().min(1, "Review notes are required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can reject applications",
        });
      }

      // Find the application
      const application = await ctx.db.vettingApplication.findUnique({
        where: { id: input.applicationId },
      });

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      if (application.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application has already been reviewed",
        });
      }

      // Update the application
      const updatedApplication = await ctx.db.vettingApplication.update({
        where: { id: input.applicationId },
        data: {
          status: "rejected",
          reviewNotes: input.reviewNotes,
          reviewedAt: new Date(),
          reviewedBy: ctx.session.user.email,
        },
      });

      // Send rejection email
      try {
        await sendRejectionEmail({
          to: application.email,
          name: application.fullName,
          reviewNotes: input.reviewNotes,
        });
      } catch (error) {
        console.error("Failed to send rejection email:", error);
        // Don't fail the rejection if email fails
      }

      return {
        success: true,
        application: updatedApplication,
      };
    }),

  /**
   * Get statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [total, pending, approved, rejected] = await Promise.all([
      ctx.db.vettingApplication.count(),
      ctx.db.vettingApplication.count({ where: { status: "pending" } }),
      ctx.db.vettingApplication.count({ where: { status: "approved" } }),
      ctx.db.vettingApplication.count({ where: { status: "rejected" } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }),
});

/**
 * Generate a secure random password
 */
function generateSecurePassword(length: number = 16): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  const crypto = require("crypto");

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }

  return password;
}

/**
 * Hash password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  const bcrypt = require("bcryptjs");
  return await bcrypt.hash(password, 10);
}
