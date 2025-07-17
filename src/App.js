import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    appType: 'mobile',
    platform: 'ios',
    complexity: 'medium',
    features: {
      userAuth: false,
      paymentIntegration: false,
      pushNotifications: false,
      realTimeChat: false,
      mapsIntegration: false,
      socialLogin: false,
      analytics: false,
      adminPanel: false,
      multiLanguage: false,
      offlineMode: false,
      biometricAuth: false,
      cloudStorage: false
    },
    teamSize: 3,
    timeline: 12
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState([]);

  // Price configuration for EU market
  const priceConfig = {
    basePrices: {
      mobile: {
        ios: 25000,
        android: 22000,
        cross: 35000
      },
      web: {
        simple: 15000,
        complex: 25000,
        ecommerce: 40000
      }
    },
    complexityMultipliers: {
      simple: 0.8,
      medium: 1.0,
      complex: 1.5
    },
    features: {
      userAuth: 3000,
      paymentIntegration: 5000,
      pushNotifications: 2000,
      realTimeChat: 8000,
      mapsIntegration: 4000,
      socialLogin: 2500,
      analytics: 2000,
      adminPanel: 6000,
      multiLanguage: 3000,
      offlineMode: 4000,
      biometricAuth: 3500,
      cloudStorage: 3000
    },
    teamSizeMultiplier: {
      1: 1.0,
      2: 1.2,
      3: 1.4,
      4: 1.6,
      5: 1.8
    },
    timelineMultiplier: {
      6: 1.3,
      8: 1.2,
      10: 1.1,
      12: 1.0,
      16: 0.9,
      20: 0.8
    }
  };

  // Calculate total price
  useEffect(() => {
    calculatePrice();
  }, [formData]);

  const calculatePrice = () => {
    let basePrice = 0;
    let breakdown = [];

    // Base price calculation
    if (formData.appType === 'mobile') {
      basePrice = priceConfig.basePrices.mobile[formData.platform];
      breakdown.push({
        item: `${formData.platform.toUpperCase()} Mobile App`,
        price: basePrice
      });
    } else {
      basePrice = priceConfig.basePrices.web[formData.platform];
      breakdown.push({
        item: `${formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)} Web App`,
        price: basePrice
      });
    }

    // Complexity multiplier
    const complexityMultiplier = priceConfig.complexityMultipliers[formData.complexity];
    const complexityPrice = basePrice * (complexityMultiplier - 1);
    if (complexityPrice > 0) {
      breakdown.push({
        item: `${formData.complexity.charAt(0).toUpperCase() + formData.complexity.slice(1)} Complexity`,
        price: complexityPrice
      });
    }

    // Features calculation
    let featuresPrice = 0;
    Object.entries(formData.features).forEach(([feature, enabled]) => {
      if (enabled) {
        featuresPrice += priceConfig.features[feature];
        breakdown.push({
          item: feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          price: priceConfig.features[feature]
        });
      }
    });

    // Team size multiplier
    const teamMultiplier = priceConfig.teamSizeMultiplier[formData.teamSize];
    const teamPrice = (basePrice + featuresPrice) * (teamMultiplier - 1);
    if (teamPrice > 0) {
      breakdown.push({
        item: `${formData.teamSize} Developer Team`,
        price: teamPrice
      });
    }

    // Timeline multiplier
    const timelineMultiplier = priceConfig.timelineMultiplier[formData.timeline];
    const timelinePrice = (basePrice + featuresPrice) * (timelineMultiplier - 1);
    if (timelinePrice !== 0) {
      breakdown.push({
        item: `${formData.timeline} Week Timeline`,
        price: timelinePrice
      });
    }

    // Calculate total
    const total = (basePrice + featuresPrice) * complexityMultiplier * teamMultiplier * timelineMultiplier;
    
    setTotalPrice(Math.round(total));
    setPriceBreakdown(breakdown);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">EU App Calculator</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1>EU App Development Price Calculator</h1>
            <p>Calculate the cost of developing your app for the European market. Get accurate estimates based on features, complexity, and team size.</p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="calculator-section">
          <div className="container">
            <h2 className="section-title">Calculate Your App Development Cost</h2>
            
            <div className="calculator-container">
              {/* App Type Selection */}
              <div className="form-group">
                <label>App Type</label>
                <select 
                  value={formData.appType} 
                  onChange={(e) => handleInputChange('appType', e.target.value)}
                >
                  <option value="mobile">Mobile App</option>
                  <option value="web">Web Application</option>
                </select>
              </div>

              {/* Platform Selection */}
              <div className="form-group">
                <label>Platform</label>
                <select 
                  value={formData.platform} 
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                >
                  {formData.appType === 'mobile' ? (
                    <>
                      <option value="ios">iOS</option>
                      <option value="android">Android</option>
                      <option value="cross">Cross-Platform</option>
                    </>
                  ) : (
                    <>
                      <option value="simple">Simple Web App</option>
                      <option value="complex">Complex Web App</option>
                      <option value="ecommerce">E-commerce Platform</option>
                    </>
                  )}
                </select>
              </div>

              {/* Complexity Selection */}
              <div className="form-group">
                <label>App Complexity</label>
                <select 
                  value={formData.complexity} 
                  onChange={(e) => handleInputChange('complexity', e.target.value)}
                >
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                </select>
              </div>

              {/* Features Section */}
              <div className="form-group">
                <label>Additional Features</label>
                <div className="switch-group">
                  {Object.entries(formData.features).map(([feature, enabled]) => (
                    <div 
                      key={feature}
                      className={`switch-item ${enabled ? 'active' : ''}`}
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      <div>
                        <div className="switch-label">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="switch-price">
                          {formatPrice(priceConfig.features[feature])}
                        </div>
                      </div>
                      <div className={`toggle-switch ${enabled ? 'active' : ''}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Size */}
              <div className="form-group">
                <label>Development Team Size</label>
                <select 
                  value={formData.teamSize} 
                  onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                >
                  <option value={1}>1 Developer</option>
                  <option value={2}>2 Developers</option>
                  <option value={3}>3 Developers</option>
                  <option value={4}>4 Developers</option>
                  <option value={5}>5+ Developers</option>
                </select>
              </div>

              {/* Timeline */}
              <div className="form-group">
                <label>Development Timeline (Weeks)</label>
                <select 
                  value={formData.timeline} 
                  onChange={(e) => handleInputChange('timeline', parseInt(e.target.value))}
                >
                  <option value={6}>6 Weeks (Rush)</option>
                  <option value={8}>8 Weeks</option>
                  <option value={10}>10 Weeks</option>
                  <option value={12}>12 Weeks (Standard)</option>
                  <option value={16}>16 Weeks</option>
                  <option value={20}>20 Weeks (Relaxed)</option>
                </select>
              </div>

              {/* Results */}
              <div className="results-section">
                <div className="total-price">
                  {formatPrice(totalPrice)}
                </div>
                <div className="price-breakdown">
                  {priceBreakdown.map((item, index) => (
                    <div key={index} className="breakdown-item">
                      <span>{item.item}</span>
                      <span>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                  <div className="breakdown-item">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose EU Development?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🇪🇺</div>
                <h3>EU Compliance</h3>
                <p>Built-in GDPR compliance and EU data protection standards for your app.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💶</div>
                <h3>Transparent Pricing</h3>
                <p>Clear, upfront pricing with no hidden costs. All prices in EUR.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Fast Development</h3>
                <p>Experienced EU-based teams deliver high-quality apps quickly.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Security First</h3>
                <p>Enterprise-grade security and data protection for your users.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h3>Global Reach</h3>
                <p>Apps optimized for European markets with multi-language support.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Modern Tech</h3>
                <p>Latest technologies and frameworks for scalable, future-proof apps.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 