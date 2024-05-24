// import { httpServer } from "./src/app.js";
// import { connectDB } from "./src/config/connectDB.js";
// import { logger } from "./src/utils/logger.js";

// // import cluster from "cluster";
// // import { cpus } from "os";

// // const numeroCPUs = cpus().length;
// // logger.info(process.pid);
// // logger.info(cluster.isPrimary);
// // logger.info(numeroCPUs)

// // if (cluster.isPrimary) {
// //   logger.info("Soy el proceso primario, generando workers");
// //   for (let i = 0; i < numeroCPUs; i++) {
// //     cluster.fork();
// //   }
// //   cluster.on("message", (worker) => {
// //     logger.info(`Mensaje recibido del worker ${worker.process.pid}`);
// //   });
// // } else {
// //  logger.info("Soy un worker");
// //  logger.info(`soy un proceso worker conel id ${process.pid}`);
// // }
// connectDB();
// httpServer();
