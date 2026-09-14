const loginUser = async (usernameOrEmail, password) => {

    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            usernameOrEmail,
            password
        })
    });

    const data = await response.json();

};

const registerUser = async(username, password, email, first_name, middle_name, last_name) => {

    const response = await fetch("http://localhost:8080/api/auth/register", {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            username,
            password,
            email,
            first_name,
            middle_name,
            last_name
        })
    });

    const data = await response.json();
};

export { registerUser, loginUser };