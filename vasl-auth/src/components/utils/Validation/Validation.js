//validate the fields is empty or not
export const isEmpty = value => {
    if (!value) return true
    return false
}

//validate the email is corect or not
export const isEmail = email => {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//make sure the length of password 
export const isLength = password => {
    if (password.length < 6) return true
    return false
}

//make sure the password is matched with password or not
export const isMatch = (password, cf_password) => {
    if (password === cf_password) return true
    return false
}