import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

export async function GET() {
    const docsDir = path.join(process.cwd(), "markdown", "docs");
    const filenames = fs.readdirSync(docsDir);

    const links = filenames.map((filename) => {
        const filePath = path.join(docsDir, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);

        return {
            slug: filename.replace(/\.mdx$/, ""), // Slug for dynamic routing
            title: data.title || filename.replace(/\.mdx$/, ""), // Fallback to filename if no title
        };
    });

    return NextResponse.json(links);
}
