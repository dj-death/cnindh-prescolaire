var winston = require('winston');
let logger = winston.createLogger({
  transports: [
    new (winston.transports.File)({
      filename: 'error.log',
      level: 'error',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    })
  ],
  exitOnError: false, // do not exit on handled exceptions
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'info',
    json: false,
    colorize: true
  }));
}



module.exports = logger;
module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};
