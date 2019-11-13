import express from 'express';
import Article from '../controllers/articleController';
import verifyToken from '../middleware/verifyToken';
import Validation from '../middleware/validation';


const articlesRouter = express.Router();


articlesRouter.post('/', [verifyToken, Validation.createArticleValidation], Article.createArticle);
articlesRouter.get('/', Article.getAllArticles);

export default articlesRouter;
