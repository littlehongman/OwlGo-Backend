"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );
// Callback route after logging in
// router.get("/auth/google/redirect", passport.authenticate('google', { successRedirect: 'http://localhost:3000',
//         failureRedirect: '/' }));
router.get("/auth/google", (req, res) => {
    const state = req.query.state;
    passport_1.default.authenticate("google", {
        scope: ["email", "profile"],
        state: state,
        session: false
    })(req, res);
});
// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//     state: "login"
//   })
// );
router.get("/auth/google/redirect", passport_1.default.authenticate("google", { failureRedirect: 'http://localhost:3000/' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const session: any = req.session;
    // const user: any = session.passport;
    const googleUser = req.user;
    if (req.query.state === 'login') {
        res.redirect(`http://localhost:3000/main?username=${googleUser.username}`);
    }
    else {
        res.redirect("http://localhost:3000/profile");
    }
}));
exports.default = router;
