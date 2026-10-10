import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Deep Branches: the 3D view crashed", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
