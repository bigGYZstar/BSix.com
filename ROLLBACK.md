# BSix.com Rollback Guide

## Overview

BSix.com uses a versioned deployment system that allows for quick and safe rollbacks to previous versions. This guide covers the rollback procedures for different scenarios.

## Deployment Structure

Our deployment uses versioned folders on GitHub Pages:

```
https://bigGYZstar.github.io/BSix.com/
├── latest/          # Symlink to current version
├── v1.0.0/         # Version 1.0.0
├── v1.1.0/         # Version 1.1.1
├── v1.2.0/         # Version 1.2.0
└── v1.2.1/         # Version 1.2.1 (current)
```

## Rollback Scenarios

### 1. Emergency Rollback (Production Issues)

**When to use**: Critical bugs, site down, security issues

**Time to rollback**: ~2 minutes

#### Steps:

1. **Identify target version**:
   ```bash
   # List available versions
   git tag --sort=-version:refname | head -10
   ```

2. **Update latest symlink** (GitHub Pages):
   ```bash
   # Clone the repository
   git clone https://github.com/bigGYZstar/BSix.com.git
   cd BSix.com
   
   # Switch to gh-pages branch
   git checkout gh-pages
   
   # Update symlink to previous stable version
   rm latest
   ln -s v1.2.0 latest
   
   # Commit and push
   git add latest
   git commit -m "Emergency rollback to v1.2.0"
   git push origin gh-pages
   ```

3. **Verify rollback**:
   - Visit https://bigGYZstar.github.io/BSix.com/latest/
   - Check version indicator on site
   - Test critical functionality

4. **Notify team**:
   ```bash
   # Create incident issue
   gh issue create --title "Emergency rollback to v1.2.0" \
     --body "Rolled back due to: [REASON]"
   ```

### 2. Planned Rollback (Feature Issues)

**When to use**: Feature not working as expected, user feedback

**Time to rollback**: ~5 minutes

#### Steps:

1. **Assess the situation**:
   - Review error reports
   - Check monitoring dashboards
   - Confirm rollback is necessary

2. **Prepare rollback**:
   ```bash
   # Check current version
   git describe --tags
   
   # Identify target version
   git log --oneline --decorate | head -10
   ```

3. **Execute rollback**:
   ```bash
   # Update GitHub Pages deployment
   git checkout gh-pages
   rm latest
   ln -s v1.1.0 latest
   git add latest
   git commit -m "Planned rollback to v1.1.0 - [REASON]"
   git push origin gh-pages
   ```

4. **Update documentation**:
   - Update CHANGELOG.md
   - Document issues found
   - Plan fix for next release

### 3. Partial Rollback (Specific Features)

**When to use**: Single feature causing issues

#### Steps:

1. **Identify problematic feature**:
   ```bash
   # Find commits related to feature
   git log --grep="feature-name" --oneline
   ```

2. **Create hotfix branch**:
   ```bash
   git checkout -b hotfix/rollback-feature-name
   
   # Revert specific commits
   git revert <commit-hash>
   
   # Or remove feature files
   git rm src/features/problematic-feature/
   ```

3. **Test and deploy**:
   ```bash
   npm run test
   npm run test:e2e
   npm run build
   ```

4. **Create emergency release**:
   ```bash
   git tag v1.2.2
   git push origin v1.2.2
   ```

## Rollback Verification Checklist

After any rollback, verify:

- [ ] Site loads correctly
- [ ] Navigation works
- [ ] Data displays properly
- [ ] Mobile responsiveness
- [ ] Core features functional
- [ ] No console errors
- [ ] Performance acceptable

## Data Rollback

### Schema Changes

If schema changes are involved:

1. **Check data compatibility**:
   ```bash
   # Validate data against old schema
   npm run validate:data -- --schema=v1.1.0
   ```

2. **Migrate data if needed**:
   ```bash
   # Run migration script
   npm run migrate:data -- --from=v1.2.0 --to=v1.1.0
   ```

### Data Source Rollback

1. **Revert data files**:
   ```bash
   git checkout v1.1.0 -- data/
   git commit -m "Rollback data to v1.1.0"
   ```

2. **Update data source URLs**:
   ```typescript
   // Update in src/datasource/index.ts
   const DATA_VERSION = 'v1.1.0';
   ```

## Monitoring During Rollback

### Key Metrics to Watch

1. **Site availability**: Response time, uptime
2. **Error rates**: JavaScript errors, failed requests
3. **User experience**: Page load times, interaction success
4. **Data integrity**: Correct data display, no corruption

### Monitoring Commands

```bash
# Check site status
curl -I https://bigGYZstar.github.io/BSix.com/latest/

# Monitor error logs (if available)
tail -f logs/error.log

# Check performance
lighthouse https://bigGYZstar.github.io/BSix.com/latest/
```

## Communication During Rollback

### Internal Communication

1. **Immediate notification**:
   ```
   🚨 ROLLBACK IN PROGRESS
   Version: v1.2.1 → v1.1.0
   Reason: [BRIEF DESCRIPTION]
   ETA: 5 minutes
   ```

2. **Status updates**:
   ```
   ✅ Rollback complete
   Site: https://bigGYZstar.github.io/BSix.com/latest/
   Status: Monitoring for 30 minutes
   ```

### External Communication (if needed)

1. **Status page update**
2. **Social media notification**
3. **User notification in app**

## Post-Rollback Actions

### Immediate (0-30 minutes)

1. **Monitor site stability**
2. **Verify all critical functions**
3. **Check user reports**
4. **Document incident**

### Short-term (1-24 hours)

1. **Root cause analysis**
2. **Plan fix implementation**
3. **Update testing procedures**
4. **Review deployment process**

### Long-term (1-7 days)

1. **Implement fixes**
2. **Enhanced testing**
3. **Process improvements**
4. **Team retrospective**

## Rollback Automation

### Automated Rollback Script

```bash
#!/bin/bash
# rollback.sh

VERSION=$1
REASON=$2

if [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <version> <reason>"
  exit 1
fi

echo "🚨 Starting rollback to $VERSION"
echo "Reason: $REASON"

# Backup current state
git tag "backup-$(date +%Y%m%d-%H%M%S)"

# Switch to gh-pages
git checkout gh-pages

# Update symlink
rm latest
ln -s "$VERSION" latest

# Commit and push
git add latest
git commit -m "Rollback to $VERSION: $REASON"
git push origin gh-pages

echo "✅ Rollback complete"
echo "Site: https://bigGYZstar.github.io/BSix.com/latest/"
```

### Usage

```bash
chmod +x rollback.sh
./rollback.sh v1.1.0 "Critical bug in team comparison"
```

## Prevention Strategies

### Pre-deployment Checks

1. **Comprehensive testing**:
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   npm run typecheck
   ```

2. **Performance validation**:
   ```bash
   npm run lighthouse
   ```

3. **Accessibility check**:
   ```bash
   npm run test:a11y
   ```

### Staging Environment

1. **Deploy to staging first**
2. **Manual testing on staging**
3. **Automated testing on staging**
4. **Stakeholder approval**

### Feature Flags

Consider implementing feature flags for:
- New features
- Experimental functionality
- A/B testing
- Gradual rollouts

## Recovery Planning

### Backup Strategy

1. **Code**: Git repository with tags
2. **Data**: Versioned data files
3. **Configuration**: Environment-specific configs
4. **Assets**: CDN with versioning

### Disaster Recovery

1. **Complete site failure**: Rollback to last known good version
2. **Data corruption**: Restore from backup
3. **Infrastructure issues**: Switch to backup hosting
4. **Security breach**: Immediate rollback + security audit

## Contact Information

### Emergency Contacts

- **Primary**: [Developer Name] - [Contact Info]
- **Secondary**: [Team Lead] - [Contact Info]
- **Escalation**: [Manager] - [Contact Info]

### Resources

- **Repository**: https://github.com/bigGYZstar/BSix.com
- **Deployment**: https://bigGYZstar.github.io/BSix.com/
- **Monitoring**: [Monitoring Dashboard URL]
- **Documentation**: [Wiki/Docs URL]

---

**Remember**: When in doubt, rollback first, investigate later. User experience is paramount.
