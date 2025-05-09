import { auth } from "@/auth"
import { db } from "@/db";

export const getContestPoints = async (
  contestId: string,
  page: number,
  perPage: number,
) => {
  const session = await auth();

  const contestPoints = await db.contestPoints.findMany({
    where: {
      contestId: contestId,
    },
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: {
      rank: "asc",
    },
    select: {
      rank: true,
      points: true,
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  const myPoints = await db.contestPoints.findFirst({
    where: {
      contestId: contestId,
      userId: session?.user?.id ?? "-1",
    },
  });

  return { contestPoints, myPoints };
};
