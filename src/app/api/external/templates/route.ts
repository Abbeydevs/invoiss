import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.EXTERNAL_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const availableTemplates = [
    { id: "blank", name: "Blank (Standard)" },
    { id: "modern", name: "Modern Dark" },
    { id: "classic", name: "Classic Professional" },
    { id: "executive", name: "Executive" },
  ];

  return NextResponse.json({ templates: availableTemplates }, { status: 200 });
}
