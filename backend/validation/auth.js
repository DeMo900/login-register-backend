const {z} = require("zod");

function registerValidation (data){

    const schema = z.object({
        email: z.email("Invalid email").min(6,{error:"Email must be at least 6 characters long"}).nonempty("Email is required"),

        username : z.string("Username must be a string").min(3,{error: "Username must be at least 3 characters long"})
        .max(50,{error: "Username must be at most 50 characters long"}).nonempty("Username is required"),

        password: z.string()
        .regex( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { error: "Password must be at least 8 characters long and include letters and numbers" } )
        .min(10,{error: "Password must be at least 10 characters long"})
        .max(50,{error: "Password must be at most 50 characters long"}).nonempty("Password is required")
    });

    return schema.safeParse(data);
}
///////////////////////////////////////
function loginValidation (data){

    const schema = z.object({
        email: z.email("Invalid email").min(6,{error:"Email must be at least 6 characters long"}).nonempty("Email is required"),

        password: z.string()
        .regex( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { error: "Password must be at least 8 characters long and include letters and numbers" } )
        .min(10,{error: "Password must be at least 10 characters long"})
        .max(50,{error: "Password must be at most 50 characters long"}).nonempty("Password is required")
    });

    return schema.safeParse(data);
}


module.exports = {registerValidation,loginValidation};