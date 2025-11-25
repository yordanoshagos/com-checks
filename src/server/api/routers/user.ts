import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { sendMail } from "@/services/email/resend";
import { getBetaUserTemplateParams } from "@/services/email/templates/user/beta-user-template";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  list: adminProtectedProcedure.query(async () => {
    const rows = await db.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        members: {
          include: {
            organization: true,
          },
        },
        _count: {
          select: {
            chats: true,
          },
        },
        sessions: {
          select: {
            updatedAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
        },
      },
    });

    return rows.map((row) => ({
      organizationsList: row.members.map((m) => m.organization.name).join(", "),
      organizations: row.members.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        role: m.role,
        createdAt: m.organization.createdAt,
      })),
      chatActivity: row._count.chats,
      lastActive: row.sessions[0]?.updatedAt || null,
      ...row,
    }));
  }),

  toggleBetaProgram: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
        isBetaUser: z.boolean(),
        withWelcomeEmail: z.boolean().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { id, isBetaUser, withWelcomeEmail } = opts.input;

      const user = await db.user.update({
        where: {
          id,
        },
        data: {
          isBetaUser,
        },
      });

      if (!isBetaUser) {
        return user;
      }

      if (!user.email) {
        throw new Error("User does not have an email address");
      }

      if (withWelcomeEmail) {
        await sendMail(
          getBetaUserTemplateParams,
          user.email,
          user.name ?? undefined,
        );
      }

      return user;
    }),

  addUser: adminProtectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const exists = await db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
      }

      const user = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          isBetaUser: true,
        },
      });

      await sendMail(
        getBetaUserTemplateParams,
        user.email!,
        user.name ?? undefined,
      );
      return user;
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  get: adminProtectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input.id },
        include: {
          members: {
            include: {
              organization: true,
            },
          },
          sessions: {
            select: {
              updatedAt: true,
              createdAt: true,
              ipAddress: true,
              userAgent: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
            take: 10,
          },
          Subject: {
            select: {
              id: true,
              title: true,
              context: true,
              createdAt: true,
              isArchived: true,
              documents: {
                select: {
                  id: true,
                  name: true,
                  fileType: true,
                  pageCount: true,
                  supabaseURL: true,
                },
              },
              chats: {
                select: {
                  id: true,
                  type: true,
                  createdAt: true,
                  title: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
              _count: {
                select: {
                  chats: true,
                },
              },
            },
            where: {
              isArchived: false,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          chats: {
            select: {
              id: true,
              type: true,
              createdAt: true,
              title: true,
              Subject: {
                select: {
                  title: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              chats: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const chatsByType = user.chats.reduce(
        (acc, chat) => {
          acc[chat.type] = (acc[chat.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const subjectsWithGroupedChats = user.Subject.map((subject) => {
        const chatsByType = subject.chats.reduce(
          (acc, chat) => {
            acc[chat.type] = (acc[chat.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        return {
          ...subject,
          chatsByType,
        };
      });

      return {
        ...user,
        subjects: subjectsWithGroupedChats,
        chatsByType,
        organizationsList: user.members
          .map((m) => m.organization.name)
          .join(", "),
        organizations: user.members.map((m) => ({
          id: m.organization.id,
          name: m.organization.name,
          role: m.role,
          createdAt: m.organization.createdAt,
        })),
        chatActivity: user._count.chats,
        lastActive: user.sessions[0]?.updatedAt || null,
      };
    }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        members: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const primaryOrg = user.members[0]?.organization;

    return {
      email: user.email,
      organizationId: primaryOrg?.id,
      organizationName: primaryOrg?.name,
    };
  }),
});


