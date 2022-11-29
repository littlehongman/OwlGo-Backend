"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const article_1 = require("../controllers/article");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/articles/:id?', article_1.getPosts);
router.put('/articles/:id', article_1.updatePost);
router.post('/article', upload.single('image'), article_1.createPost);
router.get('/test', article_1.updateTest);
exports.default = router;
