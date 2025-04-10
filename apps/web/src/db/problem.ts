"use server"
import { Problem } from "@prisma/client";
import { db } from "@/db";

export const getProblem = async (problemId: string, contestId?: string) => {
  if (contestId) {
    const contest = await db.contest.findFirst({
      where: {
        id: contestId,
        hidden: false,
      },
    });

    if (!contest) {
      return null;
    }

    const problem = await db.problem.findFirst({
      where: {
        id: problemId,
        contests: {
          some: {
            contestId: contestId,
          },
        },
      },
      include: {
        defaultCode: true,
      },
    });
    return problem;
  }

  const problem = await db.problem.findFirst({
    where: {
      id: problemId,
    },
    include: {
      defaultCode: true,
    },
  });
  return problem;
};

export const getProblems = async (query?: string): Promise<Problem[]> => {
  const problems = await db.problem.findMany({
    where: {
      hidden: false,
      ...(query && {
        title: {
          contains: query,
          mode: "insensitive",
        },
      }),
    },
    include: {
      defaultCode: true,
    },
  });
  return problems;
};
