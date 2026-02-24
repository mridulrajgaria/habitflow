import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoginIllustration } from '../components/Illustrations';
import HabitFlowLogo from '../components/HabitFlowLogo';
import './Auth.css';

export default function Login() {
  const [form, setForm]               = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const { login }    = useAuth();
  const toast        = useToast();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🔥');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
        <div className="auth-blob blob-3" />
      </div>

      {/* Split layout: illustration left, form right */}
      <div className="auth-split">
        <div className="auth-illustration animate-fade">
          <div className="auth-illus-inner">
            <LoginIllustration />
          </div>
          <div className="auth-illus-text">
            <h2>Build habits that <span className="gradient-text">stick.</span></h2>
            <p>Track daily progress, maintain streaks, and unlock your best self — one habit at a time.</p>
            <div className="auth-stats-row">
              {[['🔥','Streak tracking'],['📊','Visual progress'],['🏆','Achievements']].map(([e, l]) => (
                <div key={l} className="auth-stat-pill">{e} {l}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-card animate-scale">
          <div className="auth-header">
            <div className="auth-logo-wrap"><HabitFlowLogo size={52} animate /></div>
            <h1>Welcome back</h1>
            <p>Continue building your streaks</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error animate-fade">{error}</div>}

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
                  placeholder="Your password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required autoComplete="current-password" />
                <button type="button" className="input-icon-btn" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
              {loading ? <span className="spinner" /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
