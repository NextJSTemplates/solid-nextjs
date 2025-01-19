// We impot our prisma client
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

// Prisma will help handle and catch errors
import { Prisma } from "@prisma/client";
export async function POST(req: any) {
    console.log("Signup request received", JSON.stringify(req))
    // create user
    console.log("Signup request received", JSON.stringify(req))

    const res = await createUserHandler(req);
    return res

}
// We hash the user entered password using crypto.js
const hashPassword = (pass) => {
    return bcrypt.hash(pass, 10)
};

// function to create user in our database
async function createUserHandler(req: any) {
    const errors: string[] = [];
    const body = await req.json(); // Parse the JSON body from the request
    console.log("Request Body:", body);
    const { name, email, password } = body;
    if (!email || !password) {
        return new Response(JSON.stringify({ message: "require password and email" }),
            { status: 400, headers: { "Content-Type": "application/json" } })
    }
    if (password.length < 6) {
        errors.push("password length should be more than 6 characters");
        return new Response(JSON.stringify({ message: "password must be greater than 6 characters" }),
            { status: 400, headers: { "Content-Type": "application/json" } })
    }
    try {
        const hashPass = await hashPassword(password)
        const user = await prisma.user.create({
            data: { name: name, email: email, password: hashPass },
        });
        return new Response(JSON.stringify({ user }),
            { status: 201, headers: { "Content-Type": "application/json" } })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                return new Response(JSON.stringify({ message: e.message }),
                    { status: 400, headers: { "Content-Type": "application/json" } })
            }
            return new Response(JSON.stringify({ message: e.message }),
                { status: 400, headers: { "Content-Type": "application/json" } })
        }
    }
}

