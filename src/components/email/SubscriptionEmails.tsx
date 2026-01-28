import * as React from "react";

export const PaymentFailedEmail = ({
  userName,
  daysLeft,
  billingUrl,
}: {
  userName: string;
  daysLeft: number;
  billingUrl: string;
}) => (
  <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
    <h1>Action Required: Subscription Renewal</h1>
    <p>Hi {userName},</p>
    <p>
      We noticed your Invoiss Pro subscription has expired. We have entered a
      <strong> 3-day grace period</strong> to keep your account active.
    </p>
    <p>
      <strong>You have {daysLeft} day(s) remaining</strong> before your account
      is automatically downgraded to the Basic plan.
    </p>
    <a
      href={billingUrl}
      style={{
        display: "inline-block",
        backgroundColor: "#1451cb",
        color: "white",
        padding: "12px 24px",
        borderRadius: "6px",
        textDecoration: "none",
        marginTop: "16px",
      }}
    >
      Renew Subscription
    </a>
  </div>
);

export const SubscriptionDowngradedEmail = ({
  userName,
  billingUrl,
}: {
  userName: string;
  billingUrl: string;
}) => (
  <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
    <h1>Your account has been downgraded</h1>
    <p>Hi {userName},</p>
    <p>
      Your grace period has ended, and we were unable to renew your
      subscription. Your account has been moved to the{" "}
      <strong>Basic Plan</strong>.
    </p>
    <p>
      You can still access your data, but you have lost access to Pro features
      like unlimited bank accounts and email sending.
    </p>
    <a
      href={billingUrl}
      style={{
        display: "inline-block",
        backgroundColor: "#1451cb",
        color: "white",
        padding: "12px 24px",
        borderRadius: "6px",
        textDecoration: "none",
        marginTop: "16px",
      }}
    >
      Reactivate Pro Plan
    </a>
  </div>
);

export const TrialExpiredEmail = ({
  userName,
  billingUrl,
}: {
  userName: string;
  billingUrl: string;
}) => (
  <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
    <h1>Your Free Trial has Ended</h1>
    <p>Hi {userName},</p>
    <p>
      Your 7-day free trial of Invoiss Pro has come to an end. We hope you
      enjoyed exploring all the premium features!
    </p>
    <p>
      Your account has been moved to the <strong>Basic Plan</strong>. To
      continue enjoying unlimited invoices, bank accounts, and email sending,
      upgrade to Pro today.
    </p>

    <a
      href={billingUrl}
      style={{
        display: "inline-block",
        backgroundColor: "#1451cb",
        color: "white",
        padding: "12px 24px",
        borderRadius: "6px",
        textDecoration: "none",
        marginTop: "16px",
      }}
    >
      Upgrade to Pro
    </a>
    <p style={{ marginTop: "24px", color: "#666", fontSize: "14px" }}>
      Don&apos;t want to upgrade? No problem! You can continue using Invoiss
      with the Basic plan features.
    </p>
  </div>
);
