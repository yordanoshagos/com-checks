import { Prisma } from "@prisma/client";

// Basic Prisma Subject type with documents
export type SubjectWithDocuments = Prisma.SubjectGetPayload<{
  include: {
    documents: {
      select: {
        name: true;
        id: true;
      };
    };
  };
}>;
