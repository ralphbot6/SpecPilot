#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { validateCommand } from './commands/validate';
import { migrateCommand } from './commands/migrate';
import { listCommand } from './commands/list';
import { refineCommand } from './commands/refine';
import { addSpecsCommand } from './commands/add-specs';
import { archiveCommand } from './commands/archive';
import { backfillCommand } from './commands/backfill';
import { Logger } from './utils/logger';

const packageJson = require('../package.json');

program
  .name('specpilot')
  .description('Specification-driven development CLI — initialize, validate, and maintain high-quality .specs/ folders for any project.')
  .version(packageJson.version);

// Initialize command
program
  .command('init')
  .alias('i')
  .description('Create a new specification-driven project with a complete .specs/ folder, onboarding prompts, and IDE integration.')
  .argument('<name>', 'Project name (required)')
    .option('-l, --lang <language>', 'Programming language: typescript, javascript, python, or java (default: typescript)')
  .option('-f, --framework <framework>', 'Framework (react, express, next, nest, spring-boot, fastapi, django, etc.)')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .option('--specs-name <name>', 'Folder name for specifications', '.specs')
  .option('--no-prompts', 'Skip all interactive prompts and use sensible defaults')
  .option('--dry-run', 'Show exactly which files would be created without writing any of them')
  .action(initCommand);

// Validate command
program
  .command('validate')
  .alias('v')
  .description('Check that your .specs/ folder is complete and follows all mandates. Use --fix to auto-repair missing files.')
  .option('-d, --dir <directory>', 'Project directory to validate', '.')
  .option('--fix', 'Automatically create missing spec files and apply simple fixes')
  .option('--verbose', 'Show detailed per-file validation results and cross-reference issues')
  .action(validateCommand);

// Migrate command
program
  .command('migrate')
  .alias('m')
  .description('Migrate an old .project-spec folder to the modern .specs/ structure. Only needed for very old projects.')
  .option('-d, --dir <directory>', 'Project directory containing the legacy folder', '.')
  .option('--from <structure>', 'Source structure type (default: complex)')
  .option('--to <structure>', 'Target structure type (default: simple)')
  .option('--backup', 'Create a backup of the original folder before migrating')
  .action(migrateCommand);

// List templates command
program
  .command('list')
  .alias('ls')
  .description('Show all available language and framework templates that SpecPilot can generate.')
  .option('--lang <language>', 'Only show templates for a specific language (typescript, python, java, ...)')
  .option('--verbose', 'Display the full list of files each template generates')
  .action(listCommand);

// Refine command
program
  .command('refine')
  .alias('ref')
  .description('Update your project specifications using a natural language description of new requirements or changes.')
  .argument('[description]', 'Description of the change or new feature (e.g. "add user authentication")')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .option('--specs-name <name>', 'Specs folder name', '.specs')
  .option('--no-prompts', 'Apply changes without asking for confirmation')
  .option('-u, --update', 'Force regeneration of spec files with the new description')
  .action(refineCommand);

// Archive command
program
  .command('archive')
  .alias('ar')
  .description('Move old entries from prompts.md and tasks.md into their archive files to keep working files short and fast.')
  .option('--dry-run', 'Preview which entries would be archived without touching any files')
  .option('--force', 'Skip the "not on main branch" warning and confirmation prompt')
  .action(archiveCommand);

// Add-specs command
program
  .command('add-specs')
  .alias('add')
  .description('Add a full .specs/ folder to an existing codebase. Analyzes your project and generates tailored specifications.')
  .option('-l, --lang <language>', 'Programming language of the existing project (auto-detected if possible)')
  .option('-f, --framework <framework>', 'Framework used in the project (react, spring-boot, fastapi, etc.)')
  .option('--no-analysis', 'Skip codebase analysis and generate generic .specs/ templates only')
  .option('--deep-analysis', 'Run deeper static analysis (slower but produces more accurate architecture guidance)')
  .option('--no-prompts', 'Skip all prompts and use defaults')
  .action(addSpecsCommand);

// Backfill command
program
  .command('backfill')
  .alias('bf')
  .description('Inject any missing mandates, rules, or sections that newer versions of SpecPilot expect (safe, non-destructive update).')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .option('--specs-name <name>', 'Specs folder name', '.specs')
  .option('--dry-run', 'Preview all changes that would be made without writing anything')
  .option('--no-prompts', 'Automatically accept the suggested developer prefix (no prompt)')
  .action(backfillCommand);

program.addHelpText('afterAll', `
${chalk.bold('Aliases')}
  init → i     validate → v     migrate → m     list → ls
  refine → ref archive → ar    add-specs → add  backfill → bf

${chalk.bold('Quick examples')}
  specpilot init my-app --lang java --framework spring-boot
  specpilot add-specs --lang typescript --framework react
  specpilot validate --fix
  specpilot backfill --dry-run

${chalk.gray('Run')} specpilot <command> --help ${chalk.gray('for detailed options on any command.')}
`);

// Parse command line arguments
const args = process.argv.slice(2);

// If no arguments provided, show welcome message
if (args.length === 0) {
  const logger = new Logger();
  logger.displayWelcome();
  console.log('\n' + chalk.gray('Use --help to see all available commands'));
  process.exit(0);
}

program.parse();