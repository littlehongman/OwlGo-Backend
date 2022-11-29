"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const profile_1 = require("../controllers/profile");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/headline/:user?', profile_1.getUserHeadline);
router.put('/headline', profile_1.updateHeadline);
router.get('/email/:user?', profile_1.getUserEmail);
router.put('/email', profile_1.updateEmail);
router.get('/dob/:user?', profile_1.getDateOfBirth);
router.get('/zipcode/:user?', profile_1.getUserZipcode);
router.put('/zipcode', profile_1.updateZipcode);
router.get('/avatar/:user?', profile_1.getUserAvatar);
router.put('/avatar', upload.single('image'), profile_1.updateAvatar);
router.get('/profile', profile_1.getProfile);
router.put('/phone', profile_1.updatePhone);
router.get('/account', profile_1.getAccount);
router.put('/google/unlink', profile_1.unlinkGoogle);
// router.put('/profile', updateProfile)
exports.default = router;
