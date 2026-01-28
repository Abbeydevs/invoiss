import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import {
  PaymentFailedEmail,
  SubscriptionDowngradedEmail,
  TrialExpiredEmail,
} from "@/components/email/SubscriptionEmails";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const today = new Date();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://invoiss.thesoftwarehub.tech";

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const expiredTrialUsers = await prisma.user.findMany({
      where: {
        planType: "PRO",
        trialEndsAt: {
          lt: today,
        },
        subscriptionEndsAt: null,
      },
      include: { profile: true },
    });

    console.log(
      `Found ${expiredTrialUsers.length} users with expired trials to downgrade.`,
    );

    for (const user of expiredTrialUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          planType: "BASIC",
          trialEndsAt: null,
        },
      });

      await sendEmail({
        to: user.email,
        subject: "Your Free Trial has Ended",
        react: TrialExpiredEmail({
          userName: user.profile?.firstName || "User",
          billingUrl: `${appUrl}/dashboard/settings`,
        }),
      });
    }

    const usersToDowngrade = await prisma.user.findMany({
      where: {
        planType: "PRO",
        subscriptionEndsAt: {
          lt: threeDaysAgo,
        },
      },
      include: { profile: true },
    });

    console.log(
      `Checking Subscriptions: Found ${usersToDowngrade.length} users to downgrade.`,
    );

    for (const user of usersToDowngrade) {
      await prisma.user.update({
        where: { id: user.id },
        data: { planType: "BASIC" },
      });

      await sendEmail({
        to: user.email,
        subject: "Your Subscription has Expired",
        react: SubscriptionDowngradedEmail({
          userName: user.profile?.firstName || "User",
          billingUrl: `${appUrl}/dashboard/billing`,
        }),
      });
    }

    const usersInGracePeriod = await prisma.user.findMany({
      where: {
        planType: "PRO",
        subscriptionEndsAt: {
          lt: today,
          gte: threeDaysAgo,
        },
      },
      include: { profile: true },
    });

    console.log(`Found ${usersInGracePeriod.length} users in grace period.`);

    for (const user of usersInGracePeriod) {
      if (!user.subscriptionEndsAt) continue;

      const msSinceExpiry =
        today.getTime() - new Date(user.subscriptionEndsAt).getTime();
      const daysSinceExpiry = Math.floor(msSinceExpiry / (1000 * 60 * 60 * 24));
      const daysLeft = 3 - daysSinceExpiry;

      if (daysLeft > 0) {
        await sendEmail({
          to: user.email,
          subject: `Action Required: ${daysLeft} Days Left to Renew`,
          react: PaymentFailedEmail({
            userName: user.profile?.firstName || "User",
            daysLeft: daysLeft,
            billingUrl: `${appUrl}/dashboard/billing`,
          }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      downgraded: usersToDowngrade.length,
      reminded: usersInGracePeriod.length,
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json(
      { error: "Failed to process subscriptions" },
      { status: 500 },
    );
  }
}
