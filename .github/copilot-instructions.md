# GitHub Copilot Instructions

## Shell Environment

When running terminal commands on Windows, use PowerShell 7 (pwsh.exe) instead of cmd.exe.

PowerShell 7 should be used for:

- Running build commands
- Executing scripts
- Managing dependencies
- Any other terminal operations

Use PowerShell 7 syntax and cmdlets when generating commands.

## Documentation Organization

All documentation files must be placed in the `docs/` folder, except for `README.md` which should remain in the root directory.

When creating or suggesting documentation:

- Place all `.md` files (except README.md) in the `docs/` folder
- Place all documentation-related files (guides, references, etc.) in the `docs/` folder
- Keep only `README.md` in the project root
