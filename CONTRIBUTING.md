# Contributing to BSix.com

## Welcome

Thank you for your interest in contributing to BSix.com! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or identity.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

## Getting Started

### Prerequisites

- Node.js 18+ (use `.nvmrc` for version management)
- npm or yarn
- Git
- Modern browser for testing

### Setup

1. **Fork the repository**:
   ```bash
   gh repo fork bigGYZstar/BSix.com
   ```

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/BSix.com.git
   cd BSix.com
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up development environment**:
   ```bash
   # Use correct Node version
   nvm use
   
   # Install git hooks
   npm run prepare
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Project Structure

Familiarize yourself with the [Architecture](./ARCHITECTURE.md) before making changes.

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Emergency fixes

### Creating a Feature

1. **Create feature branch**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**:
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation

3. **Test your changes**:
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   npm run typecheck
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add new team comparison feature"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   gh pr create --base develop
   ```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

```typescript
/**
 * Calculates team performance metrics
 * @param teamId - The unique identifier for the team
 * @param season - The season to calculate metrics for
 * @returns Performance metrics object
 */
interface PerformanceMetrics {
  goals: number;
  assists: number;
  cleanSheets: number;
}

function calculatePerformance(
  teamId: string, 
  season: string
): PerformanceMetrics {
  // Implementation
}
```

### Code Style

- Use Prettier for formatting (configured in `.prettierrc`)
- Use ESLint for linting (configured in `.eslintrc`)
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas where valid

### File Naming

- Use kebab-case for files: `team-comparison.ts`
- Use PascalCase for classes: `TeamManager`
- Use camelCase for functions and variables: `calculateStats`
- Use UPPER_CASE for constants: `MAX_PLAYERS`

### Import Organization

```typescript
// 1. Node modules
import { defineConfig } from 'vite';
import { resolve } from 'path';

// 2. Internal modules (absolute imports)
import { teamsManager } from '@/features/teams';
import { DOMUtils } from '@/utils';

// 3. Relative imports
import './styles.css';
import { localHelper } from './helpers';
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(teams): add team comparison functionality"

# Bug fix
git commit -m "fix(stats): correct goal difference calculation"

# Documentation
git commit -m "docs: update API documentation for players module"

# Breaking change
git commit -m "feat!: change team data structure

BREAKING CHANGE: team.stats is now team.statistics"
```

### Scope Guidelines

- `teams`: Team-related functionality
- `players`: Player-related functionality
- `matches`: Match-related functionality
- `ui`: User interface components
- `data`: Data management
- `build`: Build system changes
- `deps`: Dependency updates

## Pull Request Process

### Before Creating a PR

1. **Ensure your branch is up to date**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-branch
   git rebase develop
   ```

2. **Run all checks**:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run test:e2e
   npm run build
   ```

3. **Update documentation** if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer
3. **Testing** on staging environment
4. **Approval** and merge

### Review Criteria

- Code quality and readability
- Test coverage
- Performance impact
- Security considerations
- Documentation completeness

## Testing Guidelines

### Unit Tests

- Write tests for all new functionality
- Aim for 80%+ coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('TeamManager', () => {
  it('should calculate correct win percentage for team', () => {
    // Arrange
    const team = createMockTeam({ wins: 8, losses: 2 });
    
    // Act
    const winPercentage = teamsManager.calculateWinPercentage(team.id);
    
    // Assert
    expect(winPercentage).toBe(80);
  });
});
```

### E2E Tests

- Test critical user journeys
- Test across different browsers
- Include accessibility testing
- Test responsive design

```typescript
test('user can navigate to team details', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Liverpool');
  await expect(page).toHaveURL(/liverpool/);
  await expect(page.locator('h1')).toContainText('Liverpool');
});
```

### Test Data

- Use factories for test data
- Keep tests isolated
- Clean up after tests
- Use realistic but anonymized data

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include examples in documentation
- Document complex algorithms
- Explain business logic

### README Updates

- Keep setup instructions current
- Update feature lists
- Maintain troubleshooting section

### Architecture Documentation

- Update when adding new features
- Document design decisions
- Maintain diagrams if applicable

## Performance Guidelines

### Code Performance

- Avoid unnecessary re-renders
- Use efficient algorithms
- Minimize bundle size
- Lazy load when appropriate

### Data Loading

- Implement caching strategies
- Use progressive loading
- Handle loading states
- Provide fallbacks

### Accessibility

- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Test with screen readers

## Security Guidelines

### Data Handling

- Validate all inputs
- Sanitize user data
- Use type guards
- Avoid XSS vulnerabilities

### Dependencies

- Keep dependencies updated
- Audit for vulnerabilities
- Use minimal dependencies
- Pin versions for stability

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Steps

1. **Update version**: `npm version [major|minor|patch]`
2. **Update CHANGELOG**: Document changes
3. **Create release**: `npm run release`
4. **Deploy**: Automatic via CI/CD

## Getting Help

### Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Rollback Guide](./ROLLBACK.md)
- [API Documentation](./docs/api.md)

### Communication

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Email**: [maintainer-email] for sensitive issues

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
nvm use
```

#### Test Failures

```bash
# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- tests/unit/teams.spec.ts
```

#### Linting Errors

```bash
# Auto-fix linting issues
npm run lint -- --fix

# Check specific files
npm run lint -- src/features/teams/
```

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- GitHub contributors section

## Questions?

Don't hesitate to ask questions! We're here to help:

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Reach out to maintainers directly

Thank you for contributing to BSix.com! 🚀
