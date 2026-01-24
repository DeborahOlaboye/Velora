# Security Policy

## Reporting a Vulnerability

We take security seriously at Velora. If you discover a security vulnerability, please report it responsibly.

**DO NOT open public issues for security vulnerabilities.**

### How to Report

Please send security reports to: **security@velora.network**

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

### Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Resolution Target**: Within 14 days for critical issues

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Smart Contract Security

Our smart contracts implement:
- OpenZeppelin security libraries
- ReentrancyGuard on all withdrawals
- Pausable emergency stop mechanism
- Multi-signature admin controls

A security audit is planned with CertiK or OpenZeppelin.

## Responsible Disclosure

We kindly ask that you:
- Give us reasonable time to fix the issue before public disclosure
- Do not exploit the vulnerability beyond what is necessary to demonstrate it
- Do not access or modify other users' data

Thank you for helping keep Velora secure!
