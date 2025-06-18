/** @type {import('next').NextConfig} */

// Bundle analyzer for development
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer;
