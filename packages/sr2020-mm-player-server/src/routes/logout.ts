import { Router } from 'express';
import { createLogger } from 'sr2020-mm-server-event-engine';

const logger = createLogger('logout.ts');

const router = Router();

router.post('/logout', (req, res) => {
  logger.info('/api/logout');
  // req.logOut();
  res.status(200).clearCookie('mm_token', {
    // path: '/',
    // secure: false,
    httpOnly: true,
    // domain: 'place.your.domain.name.here.com',
    // sameSite: true,
  });
  res.end();
  // req.session.destroy(function (err) {
  //   res.redirect('/');
  // });
});

router.use('/api/secureEndpoint', (req, res, next) => {
  res.json({
    message: 'Secure endpoint answer',
    date: new Date(),
  });
});

export const logoutRouter = router;
