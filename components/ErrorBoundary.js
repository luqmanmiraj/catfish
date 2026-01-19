/**
 * Error Boundary Component
 * Catches React errors and sends them to Sentry
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as SentryService from '../services/sentryService';
import colors from '../colors';
import styles from '../styles';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to Sentry
    SentryService.captureException(error, {
      tags: {
        error_boundary: true,
        component_stack: errorInfo.componentStack ? 'present' : 'missing',
      },
      extra: {
        errorInfo,
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.container, errorBoundaryStyles.container]}>
          <View style={errorBoundaryStyles.content}>
            <Text style={errorBoundaryStyles.title}>Something went wrong</Text>
            <Text style={errorBoundaryStyles.message}>
              We're sorry, but something unexpected happened. The error has been reported.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={errorBoundaryStyles.errorBox}>
                <Text style={errorBoundaryStyles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, errorBoundaryStyles.button]}
              onPress={this.handleReset}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorBoundaryStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  content: {
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    fontFamily: 'monospace',
  },
  button: {
    minWidth: 200,
  },
});

export default ErrorBoundary;
