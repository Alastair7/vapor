const winston = require('winston')
const path = require('path')

const loggerFormat = winston.format.printf(
    ({ level, message, timestamp, filePath }) => {
        return `\x1b[36m${timestamp}\x1b[0m - [${level}] >> ${message} << (\x1b[33m${filePath}\x1b[0m)`
    }
)

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format((info) => {
            if (info.stack) {
                const stackInfo = info.stack.split('\n')[1].trim()
                const fileName = stackInfo.match(/\((.*):\d+:\d+\)$/)

                if (fileName) {
                    return {
                        ...info,
                        filePath: path.relative(process.cwd(), fileName[1]),
                    }
                }
            }
            return info
        })(),
        loggerFormat
    ),
    transports: [new winston.transports.Console()],
})

module.exports = logger
