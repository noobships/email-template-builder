# Contributing

Contributions are welcome. Please follow these guidelines.

## Development Setup

```bash
npm install
npm run dev
```

## Before Submitting

Ensure your code passes all checks:

```bash
# Type checking
npx tsc --noEmit

# Linting
npx oxlint .

# Build
npm run build
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Ensure all checks pass
5. Submit a pull request

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Keep components focused and reusable
- Write descriptive commit messages

## Reporting Issues

When reporting issues, please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (browser, OS)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
