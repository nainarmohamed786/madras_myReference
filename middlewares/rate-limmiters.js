import {rateLimit} from 'express-rate-limit';

export const signUpLimiter=rateLimit({
    windowMs:15*60*1000, //15 minutes
    limit:50,
    legacyHeaders:false,
    standardHeaders:"draft-7"
});

export const verificationLimiter=rateLimit({
    windowMs:15*60*1000,
    limit:30,
    legacyHeaders:false,
    standardHeaders:"draft-7"
});

export const refreshTokenLimiter=rateLimit({
    windowMs:15*60*1000,
    limit:30,
    standardHeaders:"draft-7",
    legacyHeaders:false
});

export const routesLimiter=rateLimit({
    windowMs:15*60*1000,
    limit:100,
    standardHeaders:"draft-7",
    legacyHeaders:false
})