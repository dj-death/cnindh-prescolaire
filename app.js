var express = require('express');
var compression = require('compression')
var cors = require('cors');
var cron = require('node-cron');
var merge = require('deepmerge');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var direct = require('extdirect');
var config = require('./config.json');
var data = require('./utils/data.js');
var helpers = require('./utils/helpers.js');

var importer = require('./utils/importer.js');
var excelUtils = require('./utils/excel.js');
var errors = require('./utils/errors.js');

var fs = require('fs');
var Q = require('q');
var logger = require("./utils/logger");

var models = require('./models');

require("console-stamp")(console);

// Override main config (config.json) with potential local config (config.local.json): that's
// useful when deploying the app on a server with different server url and port (Ext.Direct).
try {
    config = merge(config, require('./config.local.json'));
} catch (e) {
}

var yargs = require('yargs')
    .option('client-path', {
        describe: 'Path to the client app (absolute or relative to the server directory)'
    })
    .option('client-environment', {
        describe: "Client app build environment, either 'development', 'testing' or 'production'",
        choice: ['development', 'testing', 'production'],
        default: 'development'
    })
    .help()
    .argv

/*
if (yargs['client-path']) {
config.client.path = yargs['client-path'];
} else {
process.env.NODE_ENV === 'production' ? 'front' : 
}

switch (yargs['client-environment']) {
case 'production':
case 'testing':
    config.client.path = path.join(config.client.path, 'build', yargs['client-environment'], 'App');
    break;

default:
    //config.client.path = path.join(config.client.path, 'build', 'production', 'App');
    break;
}*/

config.client.path = process.env.NODE_ENV === 'production' ? './front' : path.resolve(__dirname, config.client.path)
console.log(path.resolve(__dirname, config.client.path))


var app = express();
app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(require('morgan')('default', { "stream": logger.stream }));
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '150mb' }));

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '150mb',
    extended: true
}));

app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, config.client.path)));


// CORS
if (config.cors && config.cors.enabled) {
    app.use(cors(config.cors));
}

// warm up extdirect


if (process.env.NODE_ENV !== 'production') {
    config.direct.server = "localhost";
    config.direct.port = "3000";
    config.direct.protocol = "http";
    config.direct.cacheAPI = false;
}

var directApi = direct.initApi(config.direct);
var directRouter = direct.initRouter(config.direct);


// GET method returns API
app.get(config.direct.apiUrl, function (req, res, next) {
    try {
        directApi.getAPI(
            function (api) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(api);
            }, req, res);

    } catch (exception) {
        var err = new Error('Internal Server Error');
        err.message = exception;
        err.status = 500;
        next(err);
    }
});


// ignoring any GET requests on class path
app.get(config.direct.classRouteUrl, function (req, res, next) {
    var err = new Error('Internal Server Error');
    err.message = 'Unsupported method. Use POST instead.';
    err.status = 500;
    next(err);
});


// POST request process route and calls class
app.post(config.direct.classRouteUrl, function (req, res) {
    directRouter.processRoute(req, res);
});


if (config.server.uploadEnabled) {
    const multer = require('multer')

    const multerMid = multer({
        storage: multer.memoryStorage(),
        limits: {
            // no larger than 100mb.
            fileSize: 100 * 1024 * 1024
        }
    })

    app.post('/upload', multerMid.any(), async function (req, res, next) {
        const records = await excelUtils.readWorkbook(req.files[0], req.body.nature);
        const ids = records.map(rec => rec.fp_id);
        const unique = [...new Set(ids)].length;

        if (unique !== ids.length) {            
            const groupedByFPID = helpers.groupBy(records, 'fp_id');

            let msg = '';

            for (const [key, value] of Object.entries(groupedByFPID)) {
               if (value.length === 1) continue;
               msg += `Id [${key}]: ${value.map(r => r.douar_quartier).join(', ')}`;
            }

            return res.json({
                success: false,
                error: `Unicité des ID FP non respectée ! ${unique} uniques sur ${ids.length}. ${msg}`
            });            
        }

        try {
            data.upsertUnites(records).then(function (rows) {
                res.json({
                    success: true,
                    count: rows.length
                })
            }).catch(function (err) {
                return res.json({
                    success: false,
                    error: err.message
                });   
            })
        } catch (err) {
            return res.json({
                success: false,
                error: err.message
            });   
        }
    });
}



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


if (yargs['first-launch']) {
    // schedule dataset reset
    cron.schedule(config.cron.reset, function () {
        data.reset();
    });

    // populate initial data
    data.reset();
} else {

    data.sync().then(function () {
        console.info('Table creation: DONE');
        
        //const Heroku = require('heroku-client')
        //const heroku = new Heroku({ token: "dc53688c-1f72-4878-af5f-a57115e6ca29" })
        // data.insertReportings()
        /*data.insertUsers().then(function () {
            data.insertDelegations()
        })*/

        //data.insertDelegations()
    })
}


process.on('SIGINT', function () {
    models.Sequelize.close();
    process.exit(err ? 1 : 0)
})

module.exports = app;
