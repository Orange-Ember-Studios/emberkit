#!/usr/bin/env node
import { main } from '../dist/index.js';

main().catch((error) => {
  console.error('EmberKit CLI error:', error);
  process.exit(1);
});