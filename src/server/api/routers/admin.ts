import {
  getSignedDownloadUrl,
  getUploadUrl,
  USER_UPLOADS_BUCKET,
} from "@/services/supabase";
import { createId } from "@paralleldrive/cuid2";
import path from "path";
import { z } from "zod";
import { adminProtectedProcedure, createTRPCRouter } from "../trpc";
import { db } from "@/server/db";

export const adminRouter = createTRPCRouter({
  getUploadUrl: adminProtectedProcedure
    .input(
      z.object({
        fileName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { fileName } = input;
      // Generate a unique ID for the file
      const fileExtension = path.extname(fileName);
      const uniqueId = createId();
      const filePath = `${USER_UPLOADS_BUCKET}/${uniqueId}${fileExtension}`;

      const uploadUrlData = await getUploadUrl(USER_UPLOADS_BUCKET, filePath);
      if (!uploadUrlData) {
        throw new Error("Failed to get upload URL");
      }

      return {
        ...uploadUrlData,
        filePath,
        fileName: path.basename(filePath),
        originalFileName: input.fileName,
        fileType: fileExtension.replace(".", "").toLowerCase(),
      };
    }),

  getSignedDownloadUrl: adminProtectedProcedure
    .input(
      z.object({
        filePath: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { filePath } = input;
      const downloadUrl = await getSignedDownloadUrl(
        USER_UPLOADS_BUCKET,
        filePath,
      );
      return downloadUrl;
    }),

  getStats: adminProtectedProcedure.query(async () => {
    const [
      chatCount,
      userCount,
      organizationCount,
      activeSubscriptionCount,
      documentCount,
    ] = await Promise.all([
      db.chat.count(),
      db.user.count(),
      db.organization.count(),
      db.subscription.count({
        where: {
          status: "active",
        },
      }),
      db.researchDocument.count(),
    ]);

    return {
      chatCount,
      userCount,
      organizationCount,
      activeSubscriptionCount,
      documentCount,
    };
  }),

  toggleAdminStatus: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
        isAdmin: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      const { id, isAdmin } = opts.input;

      const user = await db.user.update({
        where: {
          id,
        },
        data: {
          isAdmin,
        },
      });

      return user;
    }),
});
