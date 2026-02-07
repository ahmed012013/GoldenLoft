# GoldenLoft Backend - Security Implementation

## Overview

This document outlines the security measures implemented in the GoldenLoft backend API.

## ✅ Implemented Security Features

### 1. Rate Limiting

Protects against brute force and DoS attacks.

**Configuration:**

- **Global Default:** 20 requests per 60 seconds
- **Register:** 3 requests per 60 seconds
- **Login:** 5 requests per 60 seconds
- **Refresh Token:** 10 requests per 60 seconds
- **Change Password:** 3 requests per 5 minutes

**Files:**

- `src/app.module.ts` - Global throttler configuration
- `src/auth/auth.controller.ts` - Endpoint-specific limits

### 2. Refresh Token Rotation

Automatic token rotation with reuse detection.

**Features:**

- Token versioning (increments on each refresh)
- Automatic detection of token reuse (possible theft)
- All tokens invalidated on suspicious activity
- Security logging for audit trail

**How it works:**

1. User logs in → Token v0
2. User refreshes → Token v1 (v0 becomes invalid)
3. Attacker tries v0 → Security alert + all tokens invalidated
4. User must re-login

**Files:**

- `src/auth/auth.service.ts` - Token rotation logic
- `prisma/schema.prisma` - User.tokenVersion field

### 3. Input Validation

**ValidationPipe Configuration:**

```typescript
whitelist: true; // Strip unknown properties
forbidNonWhitelisted: true; // Reject unknown properties
enableImplicitConversion: false; // Prevent type coercion attacks
```

**Password Policy:**

- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- Maximum 128 characters

**All DTOs include:**

- `@IsUUID()` for ID fields (prevents injection)
- `@MaxLength()` on all string fields (prevents buffer overflow)
- Custom error messages for better UX
- Swagger/OpenAPI documentation

**Files:**

- `src/main.ts` - ValidationPipe configuration
- `src/common/validators/is-strong-password.validator.ts` - Custom validator
- `src/*/dto/*.dto.ts` - All DTOs

### 4. Security Headers (Helmet)

**Enabled Headers:**

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Content-Security-Policy`

**Configuration:**

```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false, // For Swagger UI
});
```

**Files:**

- `src/main.ts` - Helmet configuration

### 5. Request Size Limits

Prevents denial of service via large payloads.

**Limits:**

- JSON payload: 10MB
- URL-encoded data: 10MB

**Files:**

- `src/main.ts` - Express middleware configuration

### 6. Environment Variable Validation

Strong validation using Joi schema.

**Required Variables:**

- `JWT_SECRET` - Minimum 32 characters
- `JWT_REFRESH_SECRET` - Minimum 32 characters
- `DATABASE_URL` - Required
- `CORS_ORIGINS` - Required

**Optional:**

- `SENTRY_DSN`
- `THROTTLE_TTL` (default: 60000ms)
- `THROTTLE_LIMIT` (default: 20)

**Files:**

- `src/app.module.ts` - Joi validation schema

### 7. CORS Configuration

Strict CORS policy.

**Configuration:**

- Origins from `CORS_ORIGINS` environment variable
- Credentials enabled
- Specific allowed methods and headers

**Files:**

- `src/main.ts` - CORS configuration

### 8. Password Hashing

Using bcrypt with 12 rounds (strong protection against brute force).

**Files:**

- `src/auth/auth.service.ts` - Password hashing

### 9. Change Password Feature

Secure password change with automatic token invalidation.

**Security measures:**

- Requires current password verification
- All tokens invalidated after password change
- Rate limited (3 attempts per 5 minutes)
- Security logging

**Files:**

- `src/auth/auth.service.ts` - changePassword()
- `src/auth/auth.controller.ts` - /auth/change-password endpoint
- `src/auth/dto/change-password.dto.ts` - DTO

### 10. Database Security

**Indexes:**

- User.email (performance + security)
- User.tokenVersion (faster token validation)

**Files:**

- `prisma/schema.prisma` - Database indexes

### 11. Monitoring & Logging

**Implemented:**

- NestJS Logger (structured logging)
- Security event logging (token reuse, failed logins, etc.)
- Sentry integration (error tracking + APM)
- Prometheus metrics

**Files:**

- `src/auth/auth.service.ts` - Security logging
- `src/main.ts` - Sentry initialization
- `src/app.module.ts` - Prometheus module

## 🔐 Environment Setup

### Required Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://..."

# JWT Secrets (MUST be 32+ characters)
JWT_SECRET="<generate-secure-random-32+-char-string>"
JWT_REFRESH_SECRET="<generate-secure-random-32+-char-string>"

# Server
PORT=4000
NODE_ENV=production

# CORS
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=20

# Monitoring (optional)
SENTRY_DSN="https://..."
```

### Generate Secure Secrets

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## 📝 Database Migration

After schema changes:

```bash
cd backend
npx prisma migrate dev --name add_token_version
npx prisma generate
```

## 🚀 Installation

```bash
cd backend
npm install
npm run start:dev
```

## 🧪 Testing Security

### Test Rate Limiting

```bash
# Should block after 5 attempts
for i in {1..10}; do
  curl -X POST http://localhost:4000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### Test Token Rotation

1. Login and get refresh token
2. Use refresh token twice
3. Second use should fail with security alert

### Test Input Validation

```bash
# Should reject weak password
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak","name":"Test"}'
```

## 📚 Best Practices

1. **Never commit `.env` files**
2. **Rotate JWT secrets regularly** in production
3. **Monitor security logs** for suspicious activity
4. **Keep dependencies updated**
5. **Use HTTPS in production**
6. **Implement database backups**
7. **Enable audit logging for sensitive operations**

## 🔄 Future Improvements

- [ ] Two-factor authentication (2FA)
- [ ] Account lockout after failed attempts
- [ ] Email verification on registration
- [ ] Password reset flow
- [ ] Session management (max devices per user)
- [ ] IP-based rate limiting
- [ ] CSRF protection (if using cookies)
- [ ] API key authentication for external integrations
- [ ] Webhook signature verification

## 📖 API Documentation

Swagger UI available at: `http://localhost:4000/api`

## 🆘 Security Issues

If you discover a security vulnerability, please email: security@yourdomain.com

Do NOT create a public GitHub issue.
