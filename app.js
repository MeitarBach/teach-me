const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redis/redisConnector');

// Routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const storeRouter = require('./routes/store');
const registerRouter = require('./routes/register');
const enrollRouter = require('./routes/enroll');
const uploadRouter = require('./routes/upload');
const usersRouter = require('./routes/users'); // accessible only by admin
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const purchaseHistoryRouter = require('./routes/purchaseHistory');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'TeachMeASecret',
  name: '_redisStore',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new RedisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 3 * 60 * 60 }), // 0.5 hour sessions
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/store', storeRouter);
app.use('/enroll', enrollRouter);
app.use('/upload', uploadRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/purchaseHistory', purchaseHistoryRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
