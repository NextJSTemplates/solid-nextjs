// import prisma client
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
export async function POST(req) {        //login user
    const res = await loginUserHandler(req);
    return res;

}
async function loginUserHandler(req) {
    const { email, password } = await req.json(); // Parse request body
    if (!email || !password) {
        return new Response(JSON.stringify({ message: "require password and email" }),
            { status: 400, headers: { "Content-Type": "application/json" } })
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });
        if (user && await bcrypt.compare(password, user.password ? user.password : "password")) {
            // exclude password from json response
            return new Response(JSON.stringify(exclude(user, ["password"])),
                { status: 200, headers: { "Content-Type": "application/json" } })
        } else {
            return new Response(JSON.stringify({ message: String("invalid Password") }),
                { status: 401, headers: { "Content-Type": "application/json" } })
        }
    } catch (e) {
        console.log("signin error", e)
        return new Response(JSON.stringify({ message: "internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } })
    }
}
// Function to exclude user password returned from prisma
function exclude(user, keys) {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
const hashPassword = (pass) => {
    return bcrypt.hash(pass, 10)
};



