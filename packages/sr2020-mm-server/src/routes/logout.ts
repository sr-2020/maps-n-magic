import { Router } from 'express';

const router = Router();

router.post('/api/logout', (req, res) => {
  console.log('/api/logout');
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
