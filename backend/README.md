# Piso WiFi Backend

Voucher-based authentication system for Piso WiFi captive portal.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure MySQL database in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=piso_wifi_db
```

3. Create database:
```sql
CREATE DATABASE piso_wifi_db;
```

4. Seed database with demo data:
```bash
npm run seed
```

5. Start server:
```bash
npm run dev
```

## API Endpoints

### Voucher Routes
- `POST /api/vouchers/validate` - Validate voucher and create session
- `GET /api/vouchers/:code/status` - Get voucher status

### Session Routes
- `GET /api/sessions/:sessionId` - Get session by ID
- `GET /api/sessions/mac/:macAddress` - Get session by MAC address
- `POST /api/sessions/:sessionId/pause` - Pause session
- `POST /api/sessions/:sessionId/resume` - Resume session
- `PUT /api/sessions/:sessionId/time` - Update session time
- `POST /api/sessions/:sessionId/terminate` - Terminate session

### Admin Routes
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/vouchers` - Get all vouchers
- `POST /api/admin/vouchers/generate` - Generate new vouchers
- `PUT /api/admin/vouchers/:code/status` - Update voucher status
- `DELETE /api/admin/vouchers/:code` - Delete voucher
- `GET /api/admin/sessions` - Get all sessions
- `GET /api/admin/users/active` - Get active users

## Demo Vouchers

After seeding, you'll have:
- 10 vouchers for 1 hour (WIFI-XXXX-XXXX)
- 5 vouchers for 3 hours (PISO-XXXX-XXXX)
- 5 vouchers for whole day (GILNET-XXXX-XXXX)

Default admin credentials:
- Username: admin
- Password: admin123

## Socket.io Events

### Client → Server
- `join-session` - Join a session room

### Server → Client
- `time-update` - Real-time time update
- `session-paused` - Session paused notification
- `session-resumed` - Session resumed notification
- `session-expired` - Session expired notification
- `session-terminated` - Session terminated notification
