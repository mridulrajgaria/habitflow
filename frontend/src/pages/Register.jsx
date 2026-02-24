import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RegisterIllustration } from '../components/Illustrations';
import HabitFlowLogo from '../components/HabitFlowLogo';
import './Auth.css';


const RULES = [
  { id: 'length', label: 'At least 8 characters',     test: p => p.length >= 8 },
  { id: 'upper',  label: 'One uppercase letter (A-Z)', test: p => /[A-Z]/.test(p) },
  { id: 'lower',  label: 'One lowercase letter (a-z)', test: p => /[a-z]/.test(p) },
  { id: 'number', label: 'One number (0-9)',            test: p => /[0-9]/.test(p) },
];

function PasswordStrength({ password }) {
  const passed = RULES.filter(r => r.test(password)).length;
  const colors = ['#ff4d6d', '#ff7849', '#ffd60a', '#00e5a0'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div className="pw-strength animate-fade">
      <div className="pw-bar-track">
        {[0,1,2,3].map(i => (
          <div key={i} className="pw-bar-seg"
            style={{ background: i < passed ? colors[passed-1] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
        ))}
      </div>
      {passed > 0 && <span className="pw-label" style={{ color: colors[passed-1] }}>{labels[passed-1]}</span>}
      <div className="pw-rules">
        {RULES.map(rule => {
          const ok = rule.test(password);
          return (
            <div key={rule.id} className={`pw-rule ${ok ? 'ok' : 'fail'}`}>
              {ok ? <Check size={11} strokeWidth={3} style={{ color: '#00e5a0' }} /> : <X size={11} strokeWidth={3} style={{ color: '#ff4d6d' }} />}
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm]               = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState([]);
  const { register } = useAuth();
  const toast        = useToast();
  const navigate     = useNavigate();

  const validatePassword = (pw) => {
    const errs = [];
    if (pw.length < 8)         errs.push('At least 8 characters');
    if (!/[A-Z]/.test(pw))    errs.push('At least one uppercase letter (A-Z)');
    if (!/[a-z]/.test(pw))    errs.push('At least one lowercase letter (a-z)');
    if (!/[0-9]/.test(pw))    errs.push('At least one number (0-9)');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Client-side validation — show ALL issues at once
    const pwErrors = validatePassword(form.password);
    if (pwErrors.length > 0) {
      setErrors(pwErrors);
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Let\'s build some habits 🌱');
      navigate('/habits');
    } catch (err) {
      // Server errors — could be multiple validation errors
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && serverErrors.length > 0) {
        setErrors(serverErrors.map(e => e.msg));
      } else {
        setErrors([err.response?.data?.error || 'Registration failed. Please try again.']);
      }
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
            {errors.length > 0 && (
              <div className="auth-error animate-fade">
                {errors.length === 1
                  ? <span>{errors[0]}</span>
                  : <ul className="auth-error-list">
                      {errors.map((e, i) => <li key={i}>✗ {e}</li>)}
                    </ul>
                }
              </div>
            )}

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
              <PasswordStrength password={form.password} />
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
