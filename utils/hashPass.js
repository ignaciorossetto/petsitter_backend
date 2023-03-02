import bcrypt from 'bcrypt'

export const createHash = (password) => {
    const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    return hashedPass
}

export const isValidPassword = (user, password) =>{
    const comparedPass = bcrypt.compareSync(password, user.password)
    return comparedPass
}