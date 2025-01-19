// hash password

// validation

// Email regex
export function validateEmail(string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(string);
}

console.log(validateEmail("test?gmail.com"));
console.log(validateEmail("test/gmail.com"));
console.log(validateEmail("test.gmail.com"));
console.log(validateEmail("test@gmail.c"));
console.log(validateEmail("test@gmail.comwwww"));
console.log(validateEmail("rabitechs@gmail.com"));