import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RegisterIllustration } from '../components/Illustrations';
import HabitFlowLogo from '../components/HabitFlowLogo';
import './Auth.css';

export default function Register() {
  const [form, setForm]               = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const { register } = useAuth();
  const toast        = useToast();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Let\'s build some habits 🌱');
      navigate('/habits');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Registration failed.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
        <div className="auth-blob blob-3" />
      </div>

      <div className="auth-split auth-split-reverse">
        <div className="auth-card animate-scale">
          <div className="auth-header">
            <div className="auth-logo-wrap"><HabitFlowLogo size={52} animate /></div>
            <h1>Start your journey</h1>
            <p>Build habits. Track progress. Transform.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error animate-fade">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" placeholder="Your name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                required autoComplete="name" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                required autoComplete="email" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <input id="password" type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, uppercase & number"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required autoComplete="new-password" />
                <button type="button" className="input-icon-btn" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem',
                background: 'linear-gradient(135deg, #00e5a0, #3bc4f2)',
                boxShadow: '0 4px 20px rgba(59,196,242,0.35)' }}
              disabled={loading}>
              {loading ? <span className="spinner" /> : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className="auth-illustration animate-fade">
          <div className="auth-illus-inner">
            <RegisterIllustration />
          </div>
          <div className="auth-illus-text">
            <h2>Your streak starts <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #00e5a0, #3bc4f2)' }}>today.</span></h2>
            <p>Join thousands building better habits. Set goals, track completions, and celebrate every win.</p>
            <div className="auth-stats-row">
              {[['🌱','Free forever'],['⚡','Instant setup'],['💪','Daily tracking']].map(([e, l]) => (
                <div key={l} className="auth-stat-pill">{e} {l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
