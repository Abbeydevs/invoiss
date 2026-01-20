import * as React from "react";

interface ResetPasswordTemplateProps {
  resetLink: string;
  userEmail: string;
}

export const ResetPasswordTemplate: React.FC<ResetPasswordTemplateProps> = ({
  resetLink,
  userEmail,
}) => (
  <div style={{ fontFamily: "sans-serif", lineHeight: 1.5, color: "#333" }}>
    <h2>Reset Your Password</h2>
    <p>Hello,</p>
    <p>
      We received a request to reset the password for the account associated
      with <strong>{userEmail}</strong>.
    </p>
    <p>
      If you made this request, please click the button below to set a new
      password:
    </p>

    <div style={{ margin: "24px 0" }}>
      <a
        href={resetLink}
        style={{
          backgroundColor: "#1451cb",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        Reset Password
      </a>
    </div>

    <p style={{ fontSize: "14px", color: "#666" }}>
      Or copy and paste this link into your browser:
      <br />
      <a href={resetLink} style={{ color: "#1451cb" }}>
        {resetLink}
      </a>
    </p>

    <hr
      style={{
        margin: "30px 0",
        border: "none",
        borderTop: "1px solid #eaeaea",
      }}
    />

    <p style={{ fontSize: "12px", color: "#888" }}>
      If you didn&apos;t request this, you can safely ignore this email. This
      link will expire in 1 hour.
    </p>
  </div>
);
