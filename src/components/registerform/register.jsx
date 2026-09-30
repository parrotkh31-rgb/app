import React, { useEffect, useState } from 'react';
import './register.css';
import Save from '../mechanikanimation/save';
import Zagruzka from '../xagruzka/zagruzka';
import Menu from '../menu/menu';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase';

function Register() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState('loading');
  const [authReady, setAuthReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setAccount(user);
    setStatus(user ? 'home' : 'idle');
    setAuthReady(true);
  }), []);

  function changeMode(nextMode) {
    setMode(nextMode);
    setEmail('');
    setNickname('');
    setPassword('');
    setError('');
    setStatus('idle');
    setShowPassword(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanEmail = email.trim();
    const cleanNickname = nickname.trim();

    setStatus('loading');
    setError('');

    try {
      if (mode === 'login') {
        const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        setAccount(credential.user);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(credential.user, { displayName: cleanNickname });
        setAccount(credential.user);
      }
      setStatus('home');
    } catch (authError) {
      const messages = {
        'auth/email-already-in-use': 'This email already has an account. Log in instead.',
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/network-request-failed': 'Network error. Check your internet connection.',
        'auth/weak-password': 'Password must be at least 6 characters.',
      };
      setError(messages[authError.code] || 'Could not access your account. Please try again.');
      setStatus('login-error');
    }
  }

  function returnToForm() {
    setStatus('idle');
    setPassword('');
  }

  if (status === 'home' && account) {
    return <Menu name={account.displayName || account.email} onLogout={() => signOut(auth)} />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Account access">
        <div className="auth-card-glow" aria-hidden="true" />
        <div className="auth-content">
          <header className="auth-header">
            <span className="auth-mark" aria-hidden="true">A</span>
            <span className="auth-brand">ACCOUNTS</span>
            <span className="auth-status"><span /> SECURE ACCESS</span>
          </header>

          {status === 'loading' || !authReady ? (
            <div className="auth-loading" role="status" aria-live="polite">
              {mode === 'login' ? <Zagruzka /> : <Save />}
              <p className="auth-kicker">
                {mode === 'login' ? 'LOGGING IN' : 'CREATING YOUR ACCOUNT'}
              </p>
              <h1>Just a moment...</h1>
              <p className="auth-subtitle">Setting things up for you.</p>
            </div>
          ) : status === 'login-error' ? (
            <div className="auth-result auth-error-result" role="alert" aria-live="assertive">
              <span className="error-mark" aria-hidden="true">×</span>
              <p className="auth-kicker">ACCOUNT ERROR</p>
              <h1>{error}</h1>
              <p className="auth-subtitle">Check your details and try again.</p>
              <button className="auth-submit" type="button" onClick={returnToForm}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="auth-intro">
                <p className="auth-kicker">YOUR ACCOUNT</p>
                <h1>{mode === 'login' ? 'Welcome back.' : 'Join us.'}</h1>
                <p className="auth-subtitle">
                  {mode === 'login' ? 'Log in to continue.' : 'Create your account in a few seconds.'}
                </p>
              </div>

              <div className="auth-tabs" role="tablist" aria-label="Account options">
                <button
                  className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => changeMode('login')}
                >
                  Log in
                </button>
                <button
                  className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  onClick={() => changeMode('register')}
                >
                  Register
                </button>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-label" htmlFor="auth-email">Email address</label>
                <input
                  className="auth-input"
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={status === 'loading'}
                />
                {mode === 'register' && (
                  <>
                    <label className="auth-label nickname-label" htmlFor="auth-nickname">Name / nickname</label>
                    <input
                      className="auth-input"
                      id="auth-nickname"
                      type="text"
                      autoComplete="nickname"
                      placeholder="How should we call you?"
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                      minLength={2}
                      required
                      disabled={status === 'loading'}
                    />
                  </>
                )}

                <label className="auth-label password-label" htmlFor="auth-password">Password</label>
                <div className="password-wrap">
                  <input
                    className="auth-input"
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    required
                    disabled={status === 'loading'}
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <button className="auth-submit" type="submit">
                  {mode === 'login' ? 'Log in' : 'Create account'}
                  <span aria-hidden="true">→</span>
                </button>
              </form>
              <p className="auth-footnote">{mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
                <button className="auth-link" type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? 'Create an account' : 'Log in'}
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Register;