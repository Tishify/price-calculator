import React, { useState, useEffect } from 'react';
import './App.css';
import pricingConfig from './pricing-config.json';

function App() {
  const [formData, setFormData] = useState({
    serviceType: 'consulting',
    projectSize: 'small',
    complexity: 1.0, // Changed from 'medium' to numeric value
    features: {
      customDevelopment: false,
      maintenance: false,
      training: false,
      documentation: false,
      integration: false,
      testing: false,
      deployment: false,
      monitoring: false,
      optimization: false
    },
    teamSize: 1,
    timeline: 6 // Changed from 4 to 6 (standard timeline)
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState([]);

  // Calculate total price
  useEffect(() => {
    calculatePrice();
  }, [formData]);

  const calculatePrice = () => {
    let basePrice = 0;
    let breakdown = [];

    // Base price calculation
    basePrice = pricingConfig.basePrices[formData.serviceType][formData.projectSize];
    breakdown.push({
      item: `${pricingConfig.serviceTypes[formData.serviceType].name} - ${pricingConfig.projectSizes[formData.projectSize].name}`,
      price: basePrice
    });

    // Complexity multiplier (now using direct numeric value)
    const complexityMultiplier = formData.complexity;
    const complexityPrice = basePrice * (complexityMultiplier - 1);
    if (complexityPrice !== 0) {
      breakdown.push({
        item: `Complexity (${complexityMultiplier.toFixed(1)}x)`,
        price: complexityPrice
      });
    }

    // Features calculation
    let featuresPrice = 0;
    Object.entries(formData.features).forEach(([feature, enabled]) => {
      if (enabled) {
        featuresPrice += pricingConfig.features[feature].price;
        breakdown.push({
          item: pricingConfig.features[feature].name,
          price: pricingConfig.features[feature].price
        });
      }
    });

    // Team size multiplier (using direct numeric value)
    const teamMultiplier = formData.teamSize;
    const teamPrice = (basePrice + featuresPrice) * (teamMultiplier - 1);
    if (teamPrice > 0) {
      breakdown.push({
        item: `${formData.teamSize} Team Member${formData.teamSize > 1 ? 's' : ''}`,
        price: teamPrice
      });
    }

    // Timeline multiplier (using direct numeric value)
    const timelineMultiplier = formData.timeline / 6; // Normalize to 6 weeks as baseline
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

  const getComplexityText = (value) => {
    if (value <= 0.7) return 'Simple';
    if (value <= 1.0) return 'Basic';
    if (value <= 1.3) return 'Medium';
    if (value <= 1.6) return 'Advanced';
    return 'Hard';
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span>Tishify Price Calculator</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1>Tishify Price Calculator</h1>
            <p>Calculate the cost of our professional IT services. Get accurate estimates for consulting, tech support, software development, and data analytics projects.</p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="calculator-section">
          <div className="container">
            <h2 className="section-title">Calculate Your Project Cost</h2>
            
            <div className="calculator-container">
              {/* Service Type Selection */}
              <div className="form-group">
                <label>Service Type</label>
                <select 
                  value={formData.serviceType} 
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                >
                  {Object.entries(pricingConfig.serviceTypes).map(([key, service]) => (
                    <option key={key} value={key}>{service.name}</option>
                  ))}
                </select>
              </div>

              {/* Project Size Selection */}
              <div className="form-group">
                <label>Project Size</label>
                <select 
                  value={formData.projectSize} 
                  onChange={(e) => handleInputChange('projectSize', e.target.value)}
                >
                  {Object.entries(pricingConfig.projectSizes).map(([key, size]) => (
                    <option key={key} value={key}>{size.name}</option>
                  ))}
                </select>
              </div>

              {/* Complexity Selection */}
              <div className="form-group">
                <label>Project Complexity: <span className="slider-value">{getComplexityText(formData.complexity)}</span></label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1" 
                  value={formData.complexity} 
                  onChange={(e) => handleInputChange('complexity', parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>Simple</span>
                  <span>Hard</span>
                </div>
              </div>

              {/* Features Section */}
              <div className="form-group">
                <label>Additional Services</label>
                <div className="switch-group">
                  {Object.entries(formData.features).map(([feature, enabled]) => (
                    <div 
                      key={feature}
                      className={`switch-item ${enabled ? 'active' : ''}`}
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      <div>
                        <div className="switch-label">
                          {pricingConfig.features[feature].name}
                        </div>
                        <div className="switch-price">
                          {formatPrice(pricingConfig.features[feature].price)}
                        </div>
                      </div>
                      <div className={`toggle-switch ${enabled ? 'active' : ''}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Size */}
              <div className="form-group">
                <label>Team Size: <span className="slider-value">{formData.teamSize} Member{formData.teamSize > 1 ? 's' : ''}</span></label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1" 
                  value={formData.teamSize} 
                  onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 Member</span>
                  <span>10+ Members</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="form-group">
                <label>Project Timeline: <span className="slider-value">{formData.timeline} Week{formData.timeline > 1 ? 's' : ''}</span></label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1" 
                  value={formData.timeline} 
                  onChange={(e) => handleInputChange('timeline', parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 Week (Rush)</span>
                  <span>20 Weeks (Extended)</span>
                </div>
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
            <h2 className="section-title">Why Choose Tishify?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">💼</div>
                <h3>Professional Services</h3>
                <p>Expert IT consulting, tech support, and software development services tailored to your needs.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Data Analytics</h3>
                <p>Comprehensive data analysis and insights to drive your business decisions.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Fast Delivery</h3>
                <p>Quick turnaround times with flexible timelines to meet your project deadlines.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3>Dedicated Support</h3>
                <p>Ongoing technical support and maintenance to ensure your systems run smoothly.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Custom Solutions</h3>
                <p>Tailored solutions designed specifically for your business requirements.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>Growth Focused</h3>
                <p>Solutions that scale with your business and support your long-term growth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Plan Section */}
        <section className="business-plan-section">
          <div className="container">
            <h2 className="section-title">Our Business Plan</h2>
            
            <div className="plan-grid">
              {/* Goals */}
              <div className="plan-card">
                <h3>🎯 Goals</h3>
                <div className="plan-content">
                  <h4>Short-Term Goals:</h4>
                  <ul>
                    <li>Make approximately 5000 EUR as a starting budget</li>
                  </ul>
                  
                  <h4>Long-Term Goals:</h4>
                  <ul>
                    <li>Have 5-7 clients monthly</li>
                    <li>Employ a matching number of project managers (PMs)</li>
                    <li>Ensure the business becomes self-sufficient</li>
                    <li>The main source of income will be Ad/Course Revenue</li>
                  </ul>
                </div>
              </div>

              {/* Products */}
              <div className="plan-card">
                <h3>📦 Products Offered</h3>
                <div className="plan-content">
                  <ul>
                    <li>IT/Consulting</li>
                    <li>Tech Support</li>
                    <li>Software Development</li>
                    <li>Data Analytics</li>
                  </ul>
                </div>
              </div>

              {/* Revenue Sources */}
              <div className="plan-card">
                <h3>💰 Sources of Revenue</h3>
                <div className="plan-content">
                  <ul>
                    <li>Percentage earned from complete orders</li>
                    <li>Support of the existing product</li>
                    <li>YouTube revenue</li>
                    <li>Courses sold</li>
                  </ul>
                </div>
              </div>

              {/* Client Acquisition */}
              <div className="plan-card">
                <h3>👥 Where to Get First Clients</h3>
                <div className="plan-content">
                  <ul>
                    <li>Reach out to acquaintances (e.g., Anna, parents' friends, etc.)</li>
                    <li>Complete their jobs according to requirements as cheaply as possible</li>
                    <li>In exchange for the low price, implement a referral system</li>
                    <li>Possibly reach out to schools and university</li>
                    <li>Extra: Start going "door to door"</li>
                  </ul>
                </div>
              </div>

              {/* Team Building */}
              <div className="plan-card">
                <h3>👨‍💼 Where to Get First Members</h3>
                <div className="plan-content">
                  <ul>
                    <li>Friends, coursemates, and university peers</li>
                    <li>Start reaching out to new developers on LinkedIn</li>
                    <li>Once some jobs are done:</li>
                    <ul>
                      <li>Organize courses</li>
                      <li>Set up a LinkedIn profile</li>
                    </ul>
                  </ul>
                </div>
              </div>

              {/* Growth Steps */}
              <div className="plan-card">
                <h3>📈 Steps to Grow the Business</h3>
                <div className="plan-content">
                  <ol>
                    <li>Get 5-10 projects done</li>
                    <li>Start reaching out to external clients (not acquaintances or freelance offers)</li>
                    <li>Figure out cost per project (including developer pay)</li>
                    <li>Begin online advertising (for both clients and developers)</li>
                  </ol>
                </div>
              </div>

              {/* Post-Goals Steps */}
              <div className="plan-card">
                <h3>🏢 Steps Once Short-Term Goals Are Accomplished</h3>
                <div className="plan-content">
                  <ol>
                    <li>Decide where to register the business officially (e.g., Kazakhstan with possible affiliate in Europe)</li>
                    <li>Consult professionals about laws and taxes (use the 5000 EUR budget)</li>
                    <li>Register on all platforms</li>
                    <li>Officially promote the business</li>
                  </ol>
                </div>
              </div>

              {/* Revenue Setup */}
              <div className="plan-card">
                <h3>💡 Steps to Set Up Revenue Sources</h3>
                <div className="plan-content">
                  <h4>Percentage Earned:</h4>
                  <p>Once the agency is running somewhat self-efficiently, calculate costs and taxes to determine net revenue and whether to reinvest or save it.</p>
                  
                  <h4>Support of the Existing Product:</h4>
                  <p>Price customer support based on the type of product sold.</p>
                  
                  <h4>YouTube Revenue:</h4>
                  <p>Once YouTube is somewhat profitable, evaluate how to manage this revenue stream and whether to include it in the budget.</p>
                  
                  <h4>Courses Sold:</h4>
                  <p>A long-term goal, to be discussed once the other three revenue streams are in place.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 