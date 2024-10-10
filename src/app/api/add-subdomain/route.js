import { NextResponse } from "next/server";
import path from "path";

export async function POST(request) {
  // Parse request body
  const body = await request.json();
  const subdomain = body.subdomain;

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  // Ensure file system operations run only on the server side
  const fs = await import("fs").then((mod) => mod.promises);

  try {
    // Define the file path
    const filePath = path.join(process.cwd(), "subdomains.json");
    console.log({filePath})

    // Read the existing file (async)
    const fileData = await fs.readFile(filePath, "utf8");
    const subdomains = JSON.parse(fileData);

    // Add the new subdomain
    subdomains.push({ subdomain });

    // Write back to the file
    await fs.writeFile(filePath, JSON.stringify(subdomains, null, 2));

    return NextResponse.json(
      { message: "Subdomain added successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors (e.g., file not found)
    console.log(error)
    return NextResponse.json(
      { error: "Error handling subdomains" },
      { status: 500 }
    );
  }
}
