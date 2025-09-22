# BSix.com Architecture

## Overview

BSix.com is a modern web application built with TypeScript, Vite, and a modular architecture designed for extensibility and maintainability. The application provides comprehensive Premier League Big 6 team information, statistics, and analysis.

## Project Structure

```
BSix.com/
├── src/                          # Source code
│   ├── features/                 # Domain features
│   │   ├── teams/               # Team management
│   │   ├── players/             # Player management
│   │   ├── matches/             # Match management
│   │   ├── lineup/              # Formation and lineup
│   │   ├── tactics/             # Tactical analysis
│   │   └── timeline/            # Match timeline
│   ├── components/              # Shared UI components
│   ├── utils/                   # Utility functions
│   ├── datasource/              # Data adapters
│   └── main.ts                  # Application entry point
├── schemas/                     # JSON Schema definitions
├── tests/                       # Test files
│   ├── e2e/                    # End-to-end tests
│   └── unit/                   # Unit tests
├── examples/                    # Example/experimental files
├── data/                       # Static data files
└── assets/                     # Static assets
```

## Feature Module Pattern

Each feature follows a consistent structure:

```typescript
// src/features/[feature]/index.ts
export interface [Feature]Manager {
  // Core methods
  add[Entity](entity: [Entity]): void;
  get[Entity](id: string): [Entity] | null;
  getAll[Entities](): [Entity][];
  
  // Feature-specific methods
  // ...
}

export const [feature]Manager: [Feature]Manager = {
  // Implementation
};
```

### Features

#### Teams (`src/features/teams/`)
- Team data management
- Big 6 team identification
- Team comparison functionality
- Statistics aggregation

#### Players (`src/features/players/`)
- Player profile management
- Performance statistics
- Position-based filtering
- Top scorer tracking

#### Matches (`src/features/matches/`)
- Match scheduling and results
- Live score updates
- Team-based match filtering
- Competition management

#### Lineup (`src/features/lineup/`)
- Formation management
- Player positioning
- Tactical setup validation

#### Tactics (`src/features/tactics/`)
- Tactical analysis
- Formation strengths/weaknesses
- Team comparison
- Playing style analysis

#### Timeline (`src/features/timeline/`)
- Match event tracking
- Chronological event ordering
- Match summary generation

## Data Management

### Data Sources (`src/datasource/`)

The application uses a flexible data source system:

```typescript
interface DataSource<T> {
  fetch(): Promise<T>;
  validate(data: unknown): data is T;
}
```

#### Available Data Sources:
- `StaticJSONDataSource`: For static JSON files
- `APIDataSource`: For REST API endpoints
- `CachedDataSource`: Wrapper for caching

#### Data Manager
Coordinates multiple data sources and provides centralized data loading:

```typescript
const dataManager = new DataManager();
dataManager.registerSource('teams', teamsDataSource);
const data = await dataManager.loadData('teams');
```

### Schema Management (`schemas/`)

JSON Schema definitions ensure data consistency:
- `match.schema.json`: Match data structure
- `team.schema.json`: Team data structure  
- `player.schema.json`: Player data structure

#### Schema Versioning
- Schemas include version numbers
- Migration utilities handle version upgrades
- Backward compatibility maintained where possible

## Component System (`src/components/`)

Shared UI components follow a consistent pattern:

```typescript
export interface ComponentProps {
  // Props definition
}

export function Component(props: ComponentProps): HTMLElement {
  // Component implementation
}
```

## Utilities (`src/utils/`)

Common utility functions:
- DOM manipulation helpers
- Data transformation utilities
- Validation functions
- Type guards

## Build System

### Vite Configuration
- TypeScript compilation
- Path aliases for clean imports
- Asset optimization
- Development server with HMR

### Build Targets
- Modern ES modules for development
- Optimized bundles for production
- Source maps for debugging

## Testing Strategy

### Unit Tests (`tests/unit/`)
- Feature module testing
- Utility function testing
- 80% coverage requirement
- Vitest with jsdom environment

### E2E Tests (`tests/e2e/`)
- Playwright across multiple browsers
- Smoke tests for critical paths
- Accessibility testing with axe
- Performance validation

### Quality Gates
- Lint and type checking
- Unit test coverage ≥80%
- E2E test passing
- Lighthouse scores ≥90

## Deployment

### Versioned Deployments
- GitHub Pages with versioned folders (`/v1.2.3/`)
- Latest symlink for current version
- Rollback capability via symlink update

### CI/CD Pipeline
1. **Lint + TypeCheck + Unit**: Code quality validation
2. **E2E**: End-to-end testing
3. **Deploy**: Triggered on semver tag push

## Development Workflow

### Getting Started
```bash
npm install
npm run dev
```

### Available Scripts
- `dev`: Development server
- `build`: Production build
- `preview`: Preview production build
- `test`: Run unit tests
- `test:e2e`: Run E2E tests
- `lint`: Lint code
- `format`: Format code
- `typecheck`: Type checking
- `release`: Create release

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Pre-commit hooks with husky

## Extensibility

### Adding New Features
1. Create feature directory in `src/features/`
2. Implement feature manager interface
3. Add unit tests
4. Update documentation
5. Add E2E tests if needed

### Adding New Data Sources
1. Implement `DataSource<T>` interface
2. Add validation logic
3. Register with DataManager
4. Add schema if needed

### Schema Evolution
1. Update schema with version bump
2. Add migration utility if breaking
3. Update TypeScript types
4. Test with existing data

## Performance Considerations

### Bundle Optimization
- Code splitting by feature
- Tree shaking for unused code
- Asset optimization
- Lazy loading where appropriate

### Data Loading
- Caching strategies
- Progressive data loading
- Error handling and fallbacks
- Loading states

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility

## Security

### Data Validation
- JSON Schema validation
- Type guards for runtime safety
- Input sanitization
- XSS prevention

### External Dependencies
- Regular security audits
- Minimal dependency footprint
- Trusted package sources
- Version pinning for stability
