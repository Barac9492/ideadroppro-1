#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes bundle size and provides performance insights
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

/**
 * Get file size in a human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Analyze bundle files
 */
function analyzeBundleFiles() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('❌ Assets directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = fs.readdirSync(ASSETS_DIR);
  const analysis = {
    javascript: [],
    css: [],
    other: [],
    totalSize: 0,
    totalGzipEstimate: 0
  };

  files.forEach(file => {
    const filePath = path.join(ASSETS_DIR, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const gzipEstimate = Math.round(size * 0.3); // Rough gzip estimate

    analysis.totalSize += size;
    analysis.totalGzipEstimate += gzipEstimate;

    const fileInfo = {
      name: file,
      size,
      formattedSize: formatBytes(size),
      gzipEstimate: formatBytes(gzipEstimate)
    };

    if (file.endsWith('.js')) {
      analysis.javascript.push(fileInfo);
    } else if (file.endsWith('.css')) {
      analysis.css.push(fileInfo);
    } else {
      analysis.other.push(fileInfo);
    }
  });

  return analysis;
}

/**
 * Generate performance report
 */
function generateReport(analysis) {
  console.log('\n📊 Bundle Analysis Report\n');
  console.log('=' .repeat(50));

  // Summary
  console.log('\n📈 Summary:');
  console.log(`Total Files: ${analysis.javascript.length + analysis.css.length + analysis.other.length}`);
  console.log(`Total Size: ${formatBytes(analysis.totalSize)}`);
  console.log(`Estimated Gzipped: ${formatBytes(analysis.totalGzipEstimate)}`);

  // JavaScript Analysis
  console.log('\n🟨 JavaScript Files:');
  const jsSorted = analysis.javascript.sort((a, b) => b.size - a.size);
  jsSorted.forEach((file, index) => {
    const icon = index < 3 ? '🔥' : '📦';
    console.log(`${icon} ${file.name}: ${file.formattedSize} (${file.gzipEstimate} gzipped)`);
  });

  // CSS Analysis
  console.log('\n🟦 CSS Files:');
  const cssSorted = analysis.css.sort((a, b) => b.size - a.size);
  cssSorted.forEach(file => {
    console.log(`🎨 ${file.name}: ${file.formattedSize} (${file.gzipEstimate} gzipped)`);
  });

  // Performance recommendations
  console.log('\n💡 Performance Insights:');
  
  const largeFiles = jsSorted.filter(file => file.size > 100 * 1024); // > 100KB
  if (largeFiles.length > 0) {
    console.log('⚠️  Large files detected (>100KB):');
    largeFiles.forEach(file => {
      console.log(`   - ${file.name}: Consider further code splitting`);
    });
  } else {
    console.log('✅ All JavaScript chunks are optimally sized');
  }

  const totalJS = jsSorted.reduce((sum, file) => sum + file.size, 0);
  if (totalJS > 500 * 1024) {
    console.log('⚠️  Total JavaScript size is large. Consider:');
    console.log('   - Additional lazy loading');
    console.log('   - Tree shaking optimization');
    console.log('   - Dependency audit');
  } else {
    console.log('✅ Total JavaScript size is within optimal range');
  }

  // Vendor chunk analysis
  const vendorChunks = jsSorted.filter(file => file.name.includes('vendor'));
  if (vendorChunks.length > 0) {
    console.log('\n📚 Vendor Chunks:');
    vendorChunks.forEach(chunk => {
      console.log(`   - ${chunk.name}: ${chunk.formattedSize}`);
    });
  }

  console.log('\n' + '=' .repeat(50));
  console.log('✨ Analysis complete! Check dist/stats.html for detailed visualization.');
}

/**
 * Check for performance regressions
 */
function checkPerformanceThresholds(analysis) {
  const warnings = [];
  const totalJS = analysis.javascript.reduce((sum, file) => sum + file.size, 0);
  
  // Thresholds
  const MAX_TOTAL_JS = 800 * 1024; // 800KB
  const MAX_SINGLE_CHUNK = 200 * 1024; // 200KB
  const MAX_TOTAL_GZIP = 300 * 1024; // 300KB gzipped

  if (totalJS > MAX_TOTAL_JS) {
    warnings.push(`⚠️  Total JavaScript (${formatBytes(totalJS)}) exceeds threshold (${formatBytes(MAX_TOTAL_JS)})`);
  }

  const largestChunk = analysis.javascript.reduce((largest, file) => 
    file.size > largest.size ? file : largest, { size: 0 });
  
  if (largestChunk.size > MAX_SINGLE_CHUNK) {
    warnings.push(`⚠️  Largest chunk (${largestChunk.name}: ${formatBytes(largestChunk.size)}) exceeds threshold`);
  }

  if (analysis.totalGzipEstimate > MAX_TOTAL_GZIP) {
    warnings.push(`⚠️  Total gzipped size (${formatBytes(analysis.totalGzipEstimate)}) exceeds threshold`);
  }

  if (warnings.length > 0) {
    console.log('\n🚨 Performance Warnings:');
    warnings.forEach(warning => console.log(warning));
    return false;
  }

  console.log('\n✅ All performance thresholds met!');
  return true;
}

// Main execution
try {
  const analysis = analyzeBundleFiles();
  generateReport(analysis);
  const performanceOk = checkPerformanceThresholds(analysis);
  
  // Exit with appropriate code for CI/CD
  process.exit(performanceOk ? 0 : 1);
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}