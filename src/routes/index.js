import express from 'express';
import usersRouter from './userRoutes';
import articlesRouter from './articleRoutes';

const router = express();

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);


export default router;
