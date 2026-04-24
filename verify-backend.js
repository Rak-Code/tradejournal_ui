#!/usr/bin/env node

/**
 * Backend Connection Verification Script
 * Tests connection to production backend at https://backend-tkiz.onrender.com
 */

const https = require('https');

const BACKEND_URL = 'https://backend-tkiz.onrender.com';
const API_BASE = `${BACKEND_URL}/api`;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({ status: res.statusCode, data, duration, headers: res.headers });
      });
    }).on('error', reject);
  });
}

async function testHealthEndpoint() {
  log('\n🔍 Testing Health Endpoint...', 'cyan');
  try {
    const result = await makeRequest(`${API_BASE}/health`);
    if (result.status === 200) {
      log(`✅ Health check passed (${result.duration}ms)`, 'green');
      return true;
    } else {
      log(`❌ Health check failed with status ${result.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Health check error: ${error.message}`, 'red');
    return false;
  }
}

async function testLoginEndpoint() {
  log('\n🔍 Testing Login Endpoint...', 'cyan');
  try {
    const postData = JSON.stringify({
      username: 'rakesh',
      password: 'ChangeMe@123'
    });

    const options = {
      hostname: 'backend-tkiz.onrender.com',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const startTime = Date.now();
    const result = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          const duration = Date.now() - startTime;
          resolve({ status: res.statusCode, data, duration });
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    if (result.status === 200) {
      const response = JSON.parse(result.data);
      log(`✅ Login successful (${result.duration}ms)`, 'green');
      log(`   Token received: ${response.token ? 'Yes' : 'No'}`, 'blue');
      return response.token;
    } else {
      log(`❌ Login failed with status ${result.status}`, 'red');
      log(`   Response: ${result.data}`, 'yellow');
      return null;
    }
  } catch (error) {
    log(`❌ Login error: ${error.message}`, 'red');
    return null;
  }
}

async function testTradesEndpoint(token) {
  log('\n🔍 Testing Trades Endpoint...', 'cyan');
  if (!token) {
    log('⚠️  Skipping (no auth token)', 'yellow');
    return false;
  }

  try {
    const options = {
      hostname: 'backend-tkiz.onrender.com',
      port: 443,
      path: '/api/trades?page=1&per_page=10',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const startTime = Date.now();
    const result = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          const duration = Date.now() - startTime;
          resolve({ status: res.statusCode, data, duration });
        });
      });
      req.on('error', reject);
      req.end();
    });

    if (result.status === 200) {
      const response = JSON.parse(result.data);
      log(`✅ Trades endpoint working (${result.duration}ms)`, 'green');
      log(`   Trades found: ${response.data?.length || 0}`, 'blue');
      return true;
    } else {
      log(`❌ Trades endpoint failed with status ${result.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Trades endpoint error: ${error.message}`, 'red');
    return false;
  }
}

async function testCORS() {
  log('\n🔍 Testing CORS Configuration...', 'cyan');
  try {
    const result = await makeRequest(`${API_BASE}/health`);
    const corsHeaders = {
      'access-control-allow-origin': result.headers['access-control-allow-origin'],
      'access-control-allow-methods': result.headers['access-control-allow-methods'],
      'access-control-allow-credentials': result.headers['access-control-allow-credentials'],
    };

    if (corsHeaders['access-control-allow-origin']) {
      log('✅ CORS headers present', 'green');
      log(`   Allow-Origin: ${corsHeaders['access-control-allow-origin']}`, 'blue');
      log(`   Allow-Methods: ${corsHeaders['access-control-allow-methods'] || 'Not set'}`, 'blue');
      log(`   Allow-Credentials: ${corsHeaders['access-control-allow-credentials'] || 'Not set'}`, 'blue');
      return true;
    } else {
      log('⚠️  CORS headers not found (may still work)', 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ CORS test error: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('═══════════════════════════════════════════════════', 'cyan');
  log('  Backend Connection Verification', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  log(`\n🌐 Backend URL: ${BACKEND_URL}`, 'blue');
  log(`📡 API Base: ${API_BASE}`, 'blue');

  const results = {
    health: false,
    login: false,
    trades: false,
    cors: false,
  };

  // Run tests
  results.health = await testHealthEndpoint();
  
  if (results.health) {
    const token = await testLoginEndpoint();
    results.login = !!token;
    
    if (token) {
      results.trades = await testTradesEndpoint(token);
    }
  }

  results.cors = await testCORS();

  // Summary
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  Test Summary', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  log(`\n${results.health ? '✅' : '❌'} Health Check`, results.health ? 'green' : 'red');
  log(`${results.login ? '✅' : '❌'} Authentication`, results.login ? 'green' : 'red');
  log(`${results.trades ? '✅' : '❌'} Trades API`, results.trades ? 'green' : 'red');
  log(`${results.cors ? '✅' : '❌'} CORS Configuration`, results.cors ? 'green' : 'red');
  
  log(`\n📊 Results: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Backend is ready for integration.', 'green');
  } else if (results.health && results.login) {
    log('\n⚠️  Core functionality working, but some tests failed.', 'yellow');
  } else {
    log('\n❌ Backend connection issues detected. Please check configuration.', 'red');
  }
  
  log('\n💡 Next Steps:', 'cyan');
  log('   1. Run: pnpm dev', 'blue');
  log('   2. Open: http://localhost:3000', 'blue');
  log('   3. Login with: rakesh / ChangeMe@123', 'blue');
  log('   4. Test all features in the UI', 'blue');
  
  log('\n═══════════════════════════════════════════════════\n', 'cyan');
  
  process.exit(passed === total ? 0 : 1);
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
