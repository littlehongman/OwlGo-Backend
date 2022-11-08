"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_1 = require("../controllers/article");
const router = (0, express_1.Router)();
router.get('/articles/:id?', article_1.getPosts);
router.put('/articles/:id', article_1.updatePost);
router.post('/article', article_1.createPost);
exports.default = router;
