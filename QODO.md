# Qodo Configuration Guide for Velora

This document explains the Qodo setup for the Velora project and how to use it effectively.

## What is Qodo?

Qodo is an AI-powered code quality and development assistant that helps with:
- Code review and quality analysis
- Smart contract security scanning
- Gas optimization suggestions
- Automated testing
- Documentation generation
- Development workflow automation

## Configuration Files

### `.qodo.toml`
The main configuration file that defines:
- Project structure and languages
- Smart contract settings (Foundry/Solidity)
- Frontend configuration (Next.js/TypeScript)
- Code quality rules
- Testing requirements
- Git integration settings
- Custom commands

### `.qodoignore`
Specifies files and directories to exclude from Qodo analysis:
- Dependencies (`node_modules`, `contract/lib`)
- Build outputs (`out`, `cache`, `.next`)
- Environment files
- Lock files
- IDE and OS-specific files

## Key Features Enabled

### 1. Smart Contract Security
- **Security Scanning**: Automatic detection of common vulnerabilities
- **Reentrancy Guards**: Enforces protection against reentrancy attacks
- **Access Control**: Validates proper permission checks
- **Gas Optimization**: Suggests improvements for gas efficiency

### 2. Code Quality
- **Auto Review**: Automatic code review on commits/PRs
- **Style Enforcement**: Maintains consistent code style
- **Test Coverage**: Enforces 80% minimum coverage threshold
- **Documentation**: Auto-generates docs with NatSpec support

### 3. Testing
- **Pre-commit Tests**: Runs tests before allowing commits
- **Fuzz Testing**: 256 runs for property-based testing
- **Invariant Testing**: 256 runs for invariant checks
- **Coverage Tracking**: Monitors test coverage metrics

### 4. Blockchain-Specific
- **Celo Network**: Optimized for Celo blockchain
- **Integration Context**: Aware of Self Protocol, GoodDollar, thirdweb
- **Gas Tracking**: Monitors gas usage and costs
- **Contract Size**: Enforces 24KB contract size limit

## Custom Commands

The configuration includes custom commands for common tasks:

```bash
# Build smart contracts
qodo run build

# Run tests
qodo run test

# Deploy contracts
qodo run deploy

# Start frontend dev server
qodo run dev

# Run linting
qodo run lint
```

## Usage Examples

### Code Review
```bash
# Review current changes
qodo review

# Review specific file
qodo review contract/src/BenefitsPool.sol

# Review with security focus
qodo review --security
```

### Testing
```bash
# Run all tests
qodo test

# Run with coverage
qodo test --coverage

# Run specific test file
qodo test contract/test/BenefitsPool.t.sol
```

### Security Analysis
```bash
# Scan for vulnerabilities
qodo security scan

# Check gas optimization
qodo gas analyze

# Full security audit
qodo audit
```

### Documentation
```bash
# Generate documentation
qodo docs generate

# Update NatSpec comments
qodo docs natspec
```

## Integration with Development Workflow

### Pre-commit Hooks
Qodo automatically runs before commits to:
1. Run tests
2. Check code quality
3. Scan for security issues
4. Validate gas efficiency

### Pull Request Reviews
On PR creation, Qodo will:
1. Perform comprehensive code review
2. Check test coverage
3. Identify security vulnerabilities
4. Suggest optimizations
5. Validate documentation

### Continuous Integration
Integrate Qodo with your CI/CD pipeline:
```yaml
# Example GitHub Actions workflow
- name: Qodo Analysis
  run: |
    qodo review --all
    qodo test --coverage
    qodo security scan
```

## Best Practices

### For Smart Contracts
1. **Always use reentrancy guards** on external calls
2. **Emit events** for all state changes
3. **Add NatSpec comments** to all public functions
4. **Optimize gas usage** before deployment
5. **Run security scans** before mainnet deployment

### For Frontend
1. **Maintain TypeScript types** for all components
2. **Write tests** for critical user flows
3. **Document API integrations** (Self Protocol, GoodDollar, thirdweb)
4. **Follow Next.js best practices**

### General
1. **Keep test coverage above 80%**
2. **Review Qodo suggestions** before merging
3. **Update documentation** with code changes
4. **Run full audit** before major releases

## Troubleshooting

### Qodo not detecting changes
```bash
# Clear cache and re-analyze
qodo cache clear
qodo analyze --force
```

### False positives in security scan
```bash
# Add exceptions in .qodo.toml
[security.exceptions]
files = ["contract/src/MockcUSD.sol"]  # Test contracts
```

### Performance issues
```bash
# Reduce analysis scope
qodo analyze --incremental  # Only changed files
```

## Configuration Customization

### Adjusting Test Coverage
Edit `.qodo.toml`:
```toml
[testing]
coverage_threshold = 90  # Increase to 90%
```

### Adding Custom Rules
```toml
[rules.custom]
max_function_lines = 50
max_contract_lines = 500
require_error_messages = true
```

### Excluding Specific Files
Add to `.qodoignore`:
```
# Exclude specific test files
contract/test/mocks/
```

## Resources

- [Qodo Documentation](https://qodo.ai/docs)
- [Solidity Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Celo Developer Docs](https://docs.celo.org/)

## Support

For issues or questions about Qodo configuration:
1. Check the [Qodo Documentation](https://qodo.ai/docs)
2. Review this guide
3. Contact the development team

---

**Last Updated**: Initial Setup
**Qodo Version**: Latest
**Project**: Velora - Mutual Aid Platform
