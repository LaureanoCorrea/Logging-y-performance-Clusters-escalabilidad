import winston from "winston";

// Definir los niveles y colores de log
const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "magenta",
    info: "blue",
    http: "green",
    debug: "cyan",
  },
};

winston.addColors(levelOptions.colors);

// Crear el logger para desarrollo
const devLogger = winston.createLogger({
  levels: levelOptions.levels,
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Crear el logger para producción
const prodLogger = winston.createLogger({
  levels: levelOptions.levels,
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

// Seleccionar el logger basado en el entorno
const logger = process.env.NODE_ENV === "production" ? prodLogger : devLogger;

// Middleware para agregar el logger a las peticiones
const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

export { addLogger, logger };
