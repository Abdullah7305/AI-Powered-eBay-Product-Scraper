import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Link2, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { LOGIN, REGISTER } from "@/constant/testids/auth";
import { useAuth } from "@/AuthContext";
import "@/Auth.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;

function BrandMark() {
  return <span className="auth-mark" aria-hidden="true"><i /><i /><i /></span>;
}

export default function AuthPages({ mode }) {
  const isSignup = mode === "signup";
  const { user, startDemoSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const isFormValid = EMAIL_PATTERN.test(values.email.trim())
    && PASSWORD_PATTERN.test(values.password)
    && (!isSignup || (values.name.trim() && values.confirmPassword === values.password));

  if (user) {
    return <Navigate to="/workspace" replace />;
  }

  const submit = (event) => {
    event.preventDefault();
    setErrors({});
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "").trim();
    const confirmPassword = String(formData.get("confirmPassword") || "");

    const nextErrors = {};
    if (isSignup && !name) {
      nextErrors.name = "Please enter your name.";
    }
    if (!email) {
      nextErrors.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = "Enter a valid email address, such as name@example.com.";
    }
    if (!password) {
      nextErrors.password = "Please enter your password.";
    } else if (!PASSWORD_PATTERN.test(password)) {
      nextErrors.password = "Use 8+ characters with at least one letter, one number, and one special character.";
    }
    if (isSignup && !confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (isSignup && password !== confirmPassword) {
      nextErrors.confirmPassword = "Your passwords don’t match. Please try again.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      startDemoSession({ email, name });
      navigate(location.state?.from || "/workspace", { replace: true });
    } catch {
      setErrors({ form: "This browser could not save your demo session. Please check your browser settings and try again." });
    }
  };

  const clearError = (field) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    clearError(field);
  };

  return <main className="auth-page">
    <motion.aside className="auth-story" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55 }}>
      <Link to="/" className="auth-brand"><BrandMark /><span>DataMint <b>AI</b></span></Link>
      <div className="auth-story-content">
        <div className="auth-eyebrow"><span /> MARKET INTELLIGENCE, MADE CLEAR</div>
        <h1>Find the signal<br />in every <em>listing.</em></h1>
        <p>Bring product data into focus. Your next useful insight is only a URL away.</p>
        <div className="auth-story-card"><div className="auth-card-icon"><Sparkles size={16} /></div><div><span>YOUR WORKSPACE</span><strong>From listing to clarity.</strong></div><ArrowRight size={16} /></div>
      </div>
      <div className="auth-story-foot"><span><Check size={13} /> Built for sharper decisions</span><span>DATA, DISTILLED.</span></div>
      <div className="auth-story-orbit auth-orbit-one" /><div className="auth-story-orbit auth-orbit-two" />
    </motion.aside>
    <section className="auth-panel">
      <Link className="auth-back-link" to="/"><ArrowLeft size={14} /> Back to DataMint</Link>
      <motion.div className="auth-form-wrap" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .1 }}>
        <div className="auth-form-eyebrow"><span /> {isSignup ? "YOUR NEXT EDGE STARTS HERE" : "GOOD TO HAVE YOU BACK"}</div>
        <h2>{isSignup ? "Create your account." : "Welcome back."}</h2>
        <p className="auth-subtitle">{isSignup ? "Set up your DataMint workspace in a moment." : "Sign in to pick up where you left off."}</p>
        <form className="auth-form" onSubmit={submit} noValidate>
          {isSignup && <label className="auth-field"><span>Your name</span><div className={`auth-input-wrap ${errors.name ? "auth-input-invalid" : ""}`}><input name="name" type="text" autoComplete="name" placeholder="Alex Morgan" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "signup-name-error" : undefined} onChange={(event) => updateField("name", event.target.value)} data-testid={REGISTER.nameInput} /></div>{errors.name && <span className="auth-field-error" id="signup-name-error">{errors.name}</span>}</label>}
          <label className="auth-field"><span>Email address</span><div className={`auth-input-wrap ${errors.email ? "auth-input-invalid" : ""}`}><Mail size={16} /><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${mode}-email-error` : undefined} onChange={(event) => updateField("email", event.target.value)} data-testid={isSignup ? REGISTER.emailInput : LOGIN.emailInput} /></div>{errors.email && <span className="auth-field-error" id={`${mode}-email-error`}>{errors.email}</span>}</label>
          <label className="auth-field"><span>Password</span><div className={`auth-input-wrap ${errors.password ? "auth-input-invalid" : ""}`}><LockKeyhole size={16} /><input name="password" type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} placeholder="Enter your password" required aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? `${mode}-password-error` : `${mode}-password-hint`} onChange={(event) => updateField("password", event.target.value)} data-testid={isSignup ? REGISTER.passwordInput : LOGIN.passwordInput} /><button className="auth-show-password" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><span className="auth-field-hint" id={`${mode}-password-hint`}>At least 8 characters, including a letter, number, and special character.</span>{errors.password && <span className="auth-field-error" id={`${mode}-password-error`}>{errors.password}</span>}</label>
          {isSignup ? <label className="auth-field"><span>Confirm password</span><div className={`auth-input-wrap ${errors.confirmPassword ? "auth-input-invalid" : ""}`}><LockKeyhole size={16} /><input name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" required aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined} onChange={(event) => updateField("confirmPassword", event.target.value)} data-testid={REGISTER.passwordConfirmInput} /></div>{errors.confirmPassword && <span className="auth-field-error" id="signup-confirm-password-error">{errors.confirmPassword}</span>}</label> : <div className="auth-form-meta"><span className="auth-tab-note">Session ends when the browser session closes</span><span className="auth-demo-tag">DEMO MODE</span></div>}
          {errors.form && <p className="auth-error" role="alert">{errors.form}</p>}
          <button className="auth-submit" type="submit" disabled={!isFormValid} data-testid={isSignup ? REGISTER.submitButton : LOGIN.submitButton}>{isSignup ? "Create account" : "Log in"}<ArrowRight size={16} /></button>
        </form>
        <p className="auth-switch">{isSignup ? "Already have an account?" : "New to DataMint?"} <Link to={isSignup ? "/login" : "/signup"} data-testid={isSignup ? REGISTER.loginLink : LOGIN.registerLink}>{isSignup ? "Log in" : "Create an account"}</Link></p>
        <p className="auth-demo-notice"><Link2 size={13} /> Frontend demo only: passwords are not stored or verified. Any email and password matching the format opens a browser-session cookie; removing that cookie and reloading signs you out. This is not secure authentication.</p>
      </motion.div>
      <div className="auth-panel-foot">© 2025 DataMint AI <span>·</span> A clearer view of every listing.</div>
    </section>
  </main>;
}
