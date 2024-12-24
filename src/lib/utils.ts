import crypto from 'node:crypto'
import winston from 'winston';

export const uuid = () => crypto.randomBytes(8).toString("hex")

const { combine, timestamp, prettyPrint, colorize } = winston.format;

export const winstonLogger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
        colorize({ all: true }),
    ),
    transports: [new winston.transports.Console()]
})
