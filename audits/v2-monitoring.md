# Security Monitoring & Alerts

## Metrics Monitored

### On-Chain
1. **Transaction Volume**
   - Large deposits (>10K USDC)
   - Large withdrawals
   - Unusual activity patterns

2. **Contract State**
   - Vault TVL changes
   - Yield distribution
   - Parameter changes

3. **Gas Usage**
   - Spike detection
   - Unusual patterns

### Off-Chain
1. **API Health**
   - Response times
   - Error rates
   - Uptime

2. **User Activity**
   - Failed transactions
   - Suspicious behavior
   - Account creation spikes

## Alert Thresholds

### Critical Alerts
- Vault balance drops >5%
- Multiple failed transactions
- Contract paued

### Warning Alerts
- Large deposit/withdrawal
- Gas price spike
- API error rate >5%

### Info Alerts
- New user registration
- Daily volume summary
- Performance metrics

## Alert Channels
- Email: operations@yieldflow.io
- Slack: #security-alerts
- SMS: Critical only
- Dashboard: All levels

## Response Procedures

1. **Alert Received**
   - Acknowledge alert
   - Assess severity
   - Document issue

2. **Investigation**
   - Gather data
   - Identify root cause
   - Determine impact

3. **Resolution**
   - Apply fix
   - Verify resolution
   - Document lessons
