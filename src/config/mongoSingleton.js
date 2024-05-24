import mongoose from "mongoose"
import { logger } from "../utils/logger.js";

class MongoSingleton {
    static #instance
    constructor() {
       mongoose.connect(process.env.MONGO_URL);
    }
    static getInstance() {
        if(this.#instance) {
            logger.info("Ya existe una instancia de MongoSingleton")
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        logger.info("Se ha creado una nueva instancia de MongoSingleton")
        return this.#instance
    }
}
export default MongoSingleton