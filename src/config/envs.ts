import "dotenv/config"
import * as joi from "joi"

interface EnvVars {
    PORT:number
    DATABASE_URL:string
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required()
}).unknown(true)



const {value, error} = envsSchema.validate(process.env)
if(error){
    throw new Error("config validation error: "+error)
}

const envVars:EnvVars = value

export const envs = {
    PORT: envVars.PORT,
    DATABASE_URL: envVars.DATABASE_URL
}