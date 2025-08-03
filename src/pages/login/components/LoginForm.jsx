import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Mock credentials for different user roles
  const mockCredentials = {
    'admin@realestate.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'manager@realestate.com': { password: 'manager123', role: 'project_manager', name: 'Project Manager' },
    'sales@realestate.com': { password: 'sales123', role: 'sales_executive', name: 'Sales Executive' },
    'telecaller@realestate.com': { password: 'telecaller123', role: 'telecaller', name: 'Telecaller' }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear login error when user modifies form
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const user = mockCredentials[formData.email.toLowerCase()];
      
      if (!user || user.password !== formData.password) {
        setLoginError('Invalid email or password. Please check your credentials and try again.');
        return;
      }

      // Store user session (in real app, this would be handled by auth service)
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        role: user.role,
        name: user.name
      }));

      // Role-based navigation
      switch (user.role) {
        case 'admin': navigate('/dashboard');
          break;
        case 'project_manager': navigate('/dashboard');
          break;
        case 'sales_executive': navigate('/dashboard');
          break;
        case 'telecaller': navigate('/dashboard');
          break;
        default:
          navigate('/dashboard');
      }

    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // In real app, this would navigate to forgot password page
    alert('Forgot password functionality will be implemented. Please contact your administrator.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Login Error Message */}
        {loginError && (
          <div className="p-4 bg-error-50 border border-error-200 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error-600 flex-shrink-0" />
              <p className="text-sm text-error-700">{loginError}</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-text-primary">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full ${errors.email ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.email && (
            <p className="text-sm text-error-600 flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-text-primary">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full ${errors.password ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.password && (
            <p className="text-sm text-error-600 flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="mt-6"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary-700 transition-colors duration-200"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;