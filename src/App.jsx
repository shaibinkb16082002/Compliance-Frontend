import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  LayoutDashboard,
  Ticket,
  Brain,
  Activity,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  XCircle,
  Mail,
  FileText,
  FileSearch,
  Cpu,
  SendHorizontal,
  Menu,
  X,
  MessageCircle,
  Phone
} from 'lucide-react'
import './App.css'

// API Base URL
const API_URL = 'http://localhost:8000'

// Professional Color Theme
const theme = {
  bg: '#FFFFFF',
  bgSecondary: '#FAFAFA',
  bgTertiary: '#F5F5F5',
  border: '#E5E5E5',
  borderDark: '#D4D4D4',
  text: '#171717',
  textSecondary: '#525252',
  textMuted: '#A3A3A3',
  accent: '#171717',
  accentHover: '#404040',
  success: '#16A34A',
  warning: '#CA8A04',
  error: '#DC2626',
  info: '#2563EB'
}

// CSS Keyframes for animations (injected once)
const injectStyles = () => {
  if (document.getElementById('pipeline-animations')) return
  const style = document.createElement('style')
  style.id = 'pipeline-animations'
  style.textContent = `
    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes flow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(37, 99, 235, 0.3), 0 0 10px rgba(37, 99, 235, 0.2); }
      50% { box-shadow: 0 0 15px rgba(37, 99, 235, 0.5), 0 0 25px rgba(37, 99, 235, 0.3); }
    }
    @keyframes particle-flow {
      0% { left: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
    }
    @keyframes particle-flow-vertical {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    @keyframes success-pop {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes toast-slide-out {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100%); }
    }
    .pipeline-step-enter {
      animation: fade-in-up 0.5s ease forwards;
    }
    .flow-line {
      background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.6), transparent);
      background-size: 200% 100%;
      animation: flow 1.5s linear infinite;
    }
    .flow-line-vertical {
      background: linear-gradient(180deg, transparent, rgba(37, 99, 235, 0.6), transparent);
      background-size: 100% 200%;
      animation: flow 1.5s linear infinite;
    }
    .pulse-active::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(37, 99, 235, 0.5);
      animation: pulse-ring 1.5s ease-out infinite;
    }
    .glow-active {
      animation: glow 2s ease-in-out infinite;
    }
    .bounce-active {
      animation: bounce 1s ease-in-out infinite;
    }
    .success-enter {
      animation: success-pop 0.4s ease forwards;
    }

    /* Mobile sidebar overlay */
    .sidebar-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 40;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .sidebar-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
  `
  document.head.appendChild(style)
}

// Custom hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Sidebar Navigation Component
function Sidebar({ collapsed, setCollapsed, activeTab, setActiveTab, isMobile, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'jira', icon: Ticket, label: 'JIRA Ticket' },
    { id: 'ai', icon: Brain, label: 'AI Analysis' },
  ]

  const sidebarWidth = isMobile ? '260px' : (collapsed ? '72px' : '240px')
  const showSidebar = isMobile ? mobileOpen : true

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside style={{
        position: 'fixed',
        left: isMobile ? (mobileOpen ? 0 : '-280px') : 0,
        top: 0,
        height: '100vh',
        width: sidebarWidth,
        backgroundColor: theme.bg,
        borderRight: `1px solid ${theme.border}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isMobile && mobileOpen ? '4px 0 20px rgba(0,0,0,0.1)' : 'none'
      }}>
        {/* Logo */}
        <div style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed && !isMobile ? '0 20px' : '0 20px',
          borderBottom: `1px solid ${theme.border}`,
          gap: '10px',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/PanasaLogo.png"
              alt="Logo"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            {(!collapsed || isMobile) && (
              <span style={{ fontWeight: 600, fontSize: '14px', color: theme.text, letterSpacing: '-0.3px' }}>
                Panasa Hub
              </span>
            )}
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: theme.textSecondary
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                if (isMobile) setMobileOpen(false)
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed && !isMobile ? '10px' : '10px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: activeTab === item.id ? theme.accent : 'transparent',
                color: activeTab === item.id ? 'white' : theme.textSecondary,
                fontWeight: 500,
                fontSize: '13px',
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                transform: activeTab === item.id ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <item.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse Button - Desktop Only */}
        {!isMobile && (
          <div style={{ padding: '12px 10px', borderTop: `1px solid ${theme.border}` }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: theme.bgSecondary,
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textSecondary,
                transition: 'all 0.2s ease'
              }}
            >
              {collapsed ? <ChevronRight style={{ width: '16px', height: '16px' }} /> : <ChevronLeft style={{ width: '16px', height: '16px' }} />}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

// Header Component
function Header({ isMobile, onMenuClick }) {
  return (
    <header style={{
      height: '56px',
      backgroundColor: theme.bg,
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              marginLeft: '-8px',
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>
        )}
      </div>
    </header>
  )
}

// Responsive Pipeline Step Component
function ResponsivePipelineStep({ step, icon: Icon, title, status, isLast, delay, isVertical }) {
  const stepRef = useRef(null)

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: delay * 0.1, ease: 'power2.out' }
      )
    }
  }, [delay])

  const getStatusColor = () => {
    switch(status) {
      case 'completed': return theme.success
      case 'running': return theme.info
      case 'error': return theme.error
      default: return theme.border
    }
  }

  const getStatusBg = () => {
    switch(status) {
      case 'completed': return 'rgba(22, 163, 74, 0.1)'
      case 'running': return 'rgba(37, 99, 235, 0.1)'
      case 'error': return 'rgba(220, 38, 38, 0.1)'
      default: return theme.bgTertiary
    }
  }

  if (isVertical) {
    // Vertical layout for mobile
    return (
      <div ref={stepRef} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            className={status === 'running' ? 'pulse-active glow-active' : status === 'completed' ? 'success-enter' : ''}
            style={{
              position: 'relative',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: `2px solid ${getStatusColor()}`,
              backgroundColor: getStatusBg(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 2
            }}
          >
            {status === 'completed' ? (
              <CheckCircle2 style={{ width: '20px', height: '20px', color: theme.success }} />
            ) : status === 'running' ? (
              <RefreshCw style={{ width: '20px', height: '20px', color: theme.info, animation: 'spin 1s linear infinite' }} />
            ) : status === 'error' ? (
              <AlertCircle style={{ width: '20px', height: '20px', color: theme.error }} />
            ) : (
              <Icon style={{ width: '20px', height: '20px', color: theme.textMuted }} />
            )}
          </div>
          {!isLast && (
            <div style={{
              width: '2px',
              height: '32px',
              position: 'relative',
              backgroundColor: theme.border,
              overflow: 'hidden'
            }}>
              {status === 'completed' && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.success }} />
              )}
              {status === 'running' && (
                <div className="flow-line-vertical" style={{ position: 'absolute', inset: 0 }} />
              )}
            </div>
          )}
        </div>
        <div style={{ flex: 1, paddingTop: '8px', paddingBottom: isLast ? 0 : '20px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: getStatusColor(),
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Step {step}
          </span>
          <p style={{
            fontSize: '13px',
            fontWeight: 500,
            color: status === 'pending' ? theme.textMuted : theme.text,
            margin: '2px 0 0 0'
          }}>
            {title}
          </p>
        </div>
      </div>
    )
  }

  // Horizontal layout for desktop
  return (
    <div ref={stepRef} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div
          className={status === 'running' ? 'pulse-active glow-active bounce-active' : status === 'completed' ? 'success-enter' : ''}
          style={{
            position: 'relative',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: `2px solid ${getStatusColor()}`,
            backgroundColor: getStatusBg(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: status === 'running' ? 'scale(1.1)' : 'scale(1)',
            zIndex: 2
          }}
        >
          {status === 'completed' ? (
            <CheckCircle2 style={{ width: '22px', height: '22px', color: theme.success }} />
          ) : status === 'running' ? (
            <RefreshCw style={{ width: '22px', height: '22px', color: theme.info, animation: 'spin 1s linear infinite' }} />
          ) : status === 'error' ? (
            <AlertCircle style={{ width: '22px', height: '22px', color: theme.error }} />
          ) : (
            <Icon style={{ width: '22px', height: '22px', color: theme.textMuted }} />
          )}
        </div>

        <div style={{ marginTop: '10px', textAlign: 'center', maxWidth: '80px' }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            color: getStatusColor(),
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'block',
            marginBottom: '2px'
          }}>
            Step {step}
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            color: status === 'pending' ? theme.textMuted : theme.text,
            lineHeight: 1.3,
            display: 'block'
          }}>
            {title}
          </span>
        </div>
      </div>

      {!isLast && (
        <div style={{
          flex: 1,
          height: '3px',
          margin: '0 -8px',
          marginBottom: '45px',
          position: 'relative',
          backgroundColor: theme.border,
          borderRadius: '2px',
          overflow: 'hidden',
          minWidth: '20px'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: status === 'completed' ? '100%' : '0%',
            backgroundColor: theme.success,
            borderRadius: '2px',
            transition: 'width 0.5s ease'
          }} />

          {status === 'running' && (
            <>
              <div className="flow-line" style={{ position: 'absolute', inset: 0, borderRadius: '2px' }} />
              <div style={{
                position: 'absolute',
                top: '-3px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.info,
                boxShadow: '0 0 8px rgba(37, 99, 235, 0.8)',
                animation: 'particle-flow 1.5s linear infinite'
              }} />
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Dashboard View with Responsive Pipeline
function Dashboard({ status, currentStep, runPipeline, resetPipeline, isLoading, isMobile, isTablet, logs }) {
  useEffect(() => {
    injectStyles()
  }, [])

  const getStepStatus = (stepNumber) => {
    if (status === 'error') {
      if (stepNumber < currentStep) return 'completed'
      if (stepNumber === currentStep) return 'error'
      return 'pending'
    }
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep && status === 'running') return 'running'
    if (status === 'completed') return 'completed'
    return 'pending'
  }

  const pipelineSteps = [
    { step: 1, icon: Mail, title: 'Gmail Check' },
    { step: 2, icon: FileText, title: 'Load Reference' },
    { step: 3, icon: FileSearch, title: 'Extract Text' },
    { step: 4, icon: Cpu, title: 'AI Analysis' },
    { step: 5, icon: SendHorizontal, title: 'Create JIRA' },
  ]

  const isVertical = isMobile || isTablet

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
      {/* Actions */}
      <div style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: isMobile ? '16px' : '20px',
        animation: 'fade-in-up 0.5s ease forwards'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '12px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Run Pipeline & Reset grouped together */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={runPipeline}
              disabled={status === 'running' || isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 18px',
                backgroundColor: status === 'running' ? '#374151' : '#000000',
                color: 'white',
                borderRadius: '6px',
                fontWeight: 600,
                border: 'none',
                cursor: status === 'running' ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: status === 'running' || isLoading ? 0.6 : 1
              }}
            >
              {status === 'running' ? (
                <RefreshCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Play style={{ width: '14px', height: '14px' }} />
              )}
              {status === 'running' ? 'Running...' : 'Run Pipeline'}
            </button>
            <button
              onClick={resetPipeline}
              disabled={status === 'running' || isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '10px 14px',
                backgroundColor: 'transparent',
                color: '#000000',
                borderRadius: '6px',
                fontWeight: 600,
                border: '1.5px solid #000000',
                cursor: status === 'running' ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: status === 'running' || isLoading ? 0.6 : 1
              }}>
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              Reset
            </button>
          </div>
          <button
            onClick={() => window.open('https://your-chatbot-url.com', '_blank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 18px',
              backgroundColor: '#000000',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
            <MessageCircle style={{ width: '14px', height: '14px' }} />
            Customer Care
          </button>
          <button
            onClick={() => window.open('https://your-calling-agent-url.com', '_blank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 18px',
              backgroundColor: '#000000',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
            <Phone style={{ width: '14px', height: '14px' }} />
            Calling Agent
          </button>
        </div>
      </div>

      {/* Pipeline */}
      <div style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: isMobile ? '16px' : '24px',
        animation: 'fade-in-up 0.5s ease forwards',
        animationDelay: '0.1s',
        opacity: 0,
        animationFillMode: 'forwards'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '16px' : '24px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, margin: 0 }}>Pipeline Progress</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              backgroundColor: status === 'completed' ? 'rgba(22, 163, 74, 0.1)' :
                              status === 'running' ? 'rgba(37, 99, 235, 0.1)' :
                              status === 'error' ? 'rgba(220, 38, 38, 0.1)' : theme.bgTertiary,
              color: status === 'completed' ? theme.success :
                     status === 'running' ? theme.info :
                     status === 'error' ? theme.error : theme.textMuted,
              transition: 'all 0.3s ease'
            }}>
              {status}
            </span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: status === 'completed' ? 'rgba(22, 163, 74, 0.1)' :
                              status === 'running' ? 'rgba(37, 99, 235, 0.1)' :
                              status === 'error' ? 'rgba(220, 38, 38, 0.1)' : theme.bgTertiary,
              color: status === 'completed' ? theme.success :
                     status === 'running' ? theme.info :
                     status === 'error' ? theme.error : theme.textMuted
            }}>
              {currentStep}/5 Steps
            </span>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: isVertical ? 'stretch' : 'flex-start',
          justifyContent: 'space-between',
          padding: isVertical ? '0' : '16px 0',
          gap: isVertical ? '0' : '0'
        }}>
          {pipelineSteps.map((step, idx) => (
            <ResponsivePipelineStep
              key={step.step}
              step={step.step}
              icon={step.icon}
              title={step.title}
              status={getStepStatus(step.step)}
              isLast={idx === pipelineSteps.length - 1}
              delay={idx}
              isVertical={isVertical}
            />
          ))}
        </div>

        {/* Status Message */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: status === 'completed' ? 'rgba(22, 163, 74, 0.05)' :
                          status === 'running' ? 'rgba(37, 99, 235, 0.05)' :
                          status === 'error' ? 'rgba(220, 38, 38, 0.05)' : theme.bgSecondary,
          border: `1px solid ${status === 'completed' ? 'rgba(22, 163, 74, 0.2)' :
                              status === 'running' ? 'rgba(37, 99, 235, 0.2)' :
                              status === 'error' ? 'rgba(220, 38, 38, 0.2)' : theme.border}`
        }}>
          <p style={{
            fontSize: '12px',
            color: status === 'completed' ? theme.success :
                   status === 'running' ? theme.info :
                   status === 'error' ? theme.error : theme.textSecondary,
            margin: 0,
            fontWeight: 500
          }}>
            {status === 'idle' && 'Ready to process. Click "Run Pipeline" to start.'}
            {status === 'running' && 'Pipeline running... Processing documents.'}
            {status === 'completed' && 'Completed! Check JIRA and AI Analysis tabs.'}
            {status === 'error' && 'Error occurred. Check logs for details.'}
          </p>
        </div>
      </div>

      {/* Pipeline Monitor - Live Logs */}
      <PipelineMonitor status={status} logs={logs} isMobile={isMobile} />
    </div>
  )
}

// Pipeline Monitor View
function PipelineMonitor({ status, logs, isMobile }) {
  const logsEndRef = useRef(null)
  const containerRef = useRef(null)
  const logsContainerRef = useRef(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)

  // Check if user is near bottom of logs
  const isNearBottom = () => {
    const container = logsContainerRef.current
    if (!container) return true
    const threshold = 50 // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  // Handle scroll events to detect if user scrolled up
  const handleScroll = () => {
    if (!isNearBottom()) {
      setIsUserScrolling(true)
    } else {
      setIsUserScrolling(false)
    }
  }

  // Only auto-scroll if user hasn't scrolled up
  useEffect(() => {
    if (!isUserScrolling && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, isUserScrolling])

  // Reset scroll state when pipeline starts or stops
  useEffect(() => {
    if (status === 'idle' || status === 'running') {
      setIsUserScrolling(false)
    }
  }, [status])

  useEffect(() => {
    injectStyles()
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  return (
    <div ref={containerRef} style={{
      backgroundColor: theme.bg,
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: isMobile ? '16px' : '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, margin: 0 }}>Live Logs</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {status === 'running' && (
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: theme.info,
              animation: 'pulse 1s infinite'
            }} />
          )}
          <span style={{ fontSize: '12px', color: theme.textMuted }}>{logs.length} entries</span>
        </div>
      </div>
      <div
        ref={logsContainerRef}
        onScroll={handleScroll}
        style={{
        backgroundColor: '#0f0f0f',
        borderRadius: '10px',
        padding: isMobile ? '12px' : '16px',
        fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
        fontSize: isMobile ? '11px' : '12px',
        height: isMobile ? '350px' : '450px',
        overflowY: 'auto'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#737373', padding: '16px', textAlign: 'center' }}>
            No logs yet. Run the pipeline to see output.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className="pipeline-step-enter"
              style={{
                padding: '6px 10px',
                marginBottom: '2px',
                borderRadius: '4px',
                backgroundColor: log.type === 'success' ? 'rgba(74, 222, 128, 0.1)' :
                                log.type === 'error' ? 'rgba(248, 113, 113, 0.1)' :
                                log.type === 'warning' ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                color: log.type === 'success' ? '#4ade80' :
                       log.type === 'error' ? '#f87171' :
                       log.type === 'warning' ? '#fbbf24' : '#d4d4d4',
                animationDelay: `${idx * 0.05}s`,
                wordBreak: 'break-word'
              }}
            >
              <span style={{ color: '#525252', marginRight: '8px' }}>[{log.time}]</span>
              {log.message}
            </div>
          ))
        )}
        {status === 'running' && (
          <div style={{ padding: '6px 10px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              display: 'inline-block',
              width: '4px',
              height: '12px',
              backgroundColor: '#60a5fa',
              animation: 'pulse 0.8s infinite'
            }} />
            Processing...
          </div>
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}

// JIRA View
function JiraView({ jiraTicket, status, isMobile }) {
  const containerRef = useRef(null)

  useEffect(() => {
    injectStyles()
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  if (!jiraTicket && status !== 'completed') {
    return (
      <div ref={containerRef} style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: isMobile ? '40px 24px' : '48px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: theme.bgTertiary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Ticket style={{ width: '28px', height: '28px', color: theme.textMuted }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, marginBottom: '6px' }}>No JIRA Ticket Yet</h3>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, maxWidth: '280px', marginInline: 'auto' }}>
          Run the pipeline to create a JIRA ticket.
        </p>
      </div>
    )
  }

  if (!jiraTicket && status === 'completed') {
    return (
      <div ref={containerRef} style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: isMobile ? '40px 24px' : '48px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(202, 138, 4, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <XCircle style={{ width: '28px', height: '28px', color: theme.warning }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, marginBottom: '6px' }}>No Ticket Created</h3>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, maxWidth: '280px', marginInline: 'auto' }}>
          Pipeline completed but no ticket was created.
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{
      backgroundColor: theme.bg,
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: isMobile ? '20px' : '24px'
    }}>
      <div className="success-enter" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CheckCircle2 style={{ width: '26px', height: '26px', color: theme.success }} />
        </div>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, margin: 0 }}>JIRA Ticket Created</h2>
          <p style={{ fontSize: '13px', color: theme.textMuted, margin: '4px 0 0 0' }}>Created from compliance analysis</p>
        </div>
      </div>

      <div style={{
        padding: isMobile ? '16px' : '20px',
        backgroundColor: theme.bgSecondary,
        borderRadius: '10px',
        border: `1px solid ${theme.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: theme.info,
              fontFamily: '"SF Mono", monospace'
            }}>
              {jiraTicket}
            </span>
            <p style={{ fontSize: '12px', color: theme.textMuted, margin: '6px 0 0 0' }}>
              Compliance update ticket
            </p>
          </div>
          <a
            href={`https://dataai12102.atlassian.net/browse/${jiraTicket}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: theme.accent,
              color: 'white',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            <ExternalLink style={{ width: '14px', height: '14px' }} />
            Open
          </a>
        </div>
      </div>
    </div>
  )
}

// Toast Notification Component
function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      animation: 'toast-slide-in 0.3s ease forwards'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #171717',
        borderRadius: '8px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '280px',
        maxWidth: '400px'
      }}>
        <Mail style={{ width: '20px', height: '20px', color: '#171717', flexShrink: 0 }} />
        <span style={{
          color: '#171717',
          fontSize: '14px',
          fontWeight: 500,
          flex: 1
        }}>
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#525252',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  )
}

// AI Analysis View
function AIAnalysisView({ result, status, isMobile }) {
  const containerRef = useRef(null)

  useEffect(() => {
    injectStyles()
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  if (!result && status !== 'completed') {
    return (
      <div ref={containerRef} style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: isMobile ? '40px 24px' : '48px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: theme.bgTertiary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Brain style={{ width: '28px', height: '28px', color: theme.textMuted }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, marginBottom: '6px' }}>No Analysis Yet</h3>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, maxWidth: '280px', marginInline: 'auto' }}>
          Run the pipeline to see AI analysis.
        </p>
      </div>
    )
  }

  if (!result && status === 'completed') {
    return (
      <div ref={containerRef} style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: isMobile ? '40px 24px' : '48px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(202, 138, 4, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <XCircle style={{ width: '28px', height: '28px', color: theme.warning }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.text, marginBottom: '6px' }}>No Analysis Available</h3>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0, maxWidth: '280px', marginInline: 'auto' }}>
          No analysis data was generated.
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Summary Card */}
      <div className="success-enter" style={{
        background: 'linear-gradient(135deg, #171717 0%, #374151 100%)',
        borderRadius: '12px',
        padding: isMobile ? '20px' : '24px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Brain style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Gemini AI Analysis</h2>
            <p style={{ fontSize: '12px', opacity: 0.7, margin: '2px 0 0 0' }}>Document Comparison</p>
          </div>
        </div>

        {result.effective_date_changes && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ opacity: 0.8, fontSize: '13px' }}>Effective Date</span>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>
              {result.effective_date_changes.old_date} → {result.effective_date_changes.new_date}
            </span>
          </div>
        )}

        {result.summary_for_jira && (
          <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <span style={{ opacity: 0.7, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Summary</span>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', lineHeight: 1.4 }}>{result.summary_for_jira.title}</p>
          </div>
        )}
      </div>

      {/* Added Points */}
      {result.added_points && result.added_points.length > 0 && (
        <div style={{
          backgroundColor: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: isMobile ? '16px' : '20px'
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.success }}></span>
            New Requirements ({result.added_points.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.added_points.map((point, idx) => (
              <div
                key={idx}
                className="pipeline-step-enter"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: theme.bgSecondary,
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <CheckCircle2 style={{ width: '16px', height: '16px', color: theme.success, flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: theme.text, fontSize: '13px', lineHeight: 1.4 }}>
                  {typeof point === 'string' ? point : point.point || JSON.stringify(point)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed Points */}
      {result.removed_points && result.removed_points.length > 0 && (
        <div style={{
          backgroundColor: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: isMobile ? '16px' : '20px'
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.error }}></span>
            Removed ({result.removed_points.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.removed_points.map((point, idx) => (
              <div
                key={idx}
                className="pipeline-step-enter"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: theme.bgSecondary,
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <XCircle style={{ width: '16px', height: '16px', color: theme.error, flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: theme.text, fontSize: '13px', lineHeight: 1.4 }}>
                  {typeof point === 'string' ? point : point.point || JSON.stringify(point)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Updated Sections */}
      {result.updated_sections && result.updated_sections.length > 0 && (
        <div style={{
          backgroundColor: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: isMobile ? '16px' : '20px'
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '12px' }}>
            Updated Sections ({result.updated_sections.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.updated_sections.map((section, idx) => (
              <div
                key={idx}
                className="pipeline-step-enter"
                style={{
                  padding: '12px',
                  backgroundColor: theme.bgSecondary,
                  borderRadius: '8px',
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <h3 style={{ fontWeight: 600, color: theme.text, marginBottom: '4px', fontSize: '13px' }}>{section.section_title}</h3>
                <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0, lineHeight: 1.4 }}>{section.change_summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <div style={{
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: isMobile ? '16px' : '20px'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '12px' }}>Raw Data</h2>
        <pre style={{
          backgroundColor: '#0f0f0f',
          color: '#d4d4d4',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '11px',
          fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
          overflow: 'auto',
          maxHeight: '250px',
          margin: 0
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// Main App
function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [status, setStatus] = useState('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [jiraTicket, setJiraTicket] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })

  const { width } = useWindowSize()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  useEffect(() => {
    injectStyles()
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  // Polling for status updates
  useEffect(() => {
    let interval
    if (status === 'running') {
      interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${API_URL}/api/status`)
          const statusData = await statusRes.json()
          setStatus(statusData.status)
          setCurrentStep(statusData.current_step)

          const logsRes = await fetch(`${API_URL}/api/logs`)
          const logsData = await logsRes.json()
          setLogs(logsData.logs)

          if (statusData.status === 'completed' || statusData.status === 'error') {
            const resultRes = await fetch(`${API_URL}/api/result`)
            const resultData = await resultRes.json()
            setResult(resultData.result)
            setJiraTicket(resultData.jira_ticket)
            setError(resultData.error)

            // Show toast if no new mails found
            if (resultData.result && resultData.result.message === 'No new compliance emails found') {
              setToast({ show: true, message: 'No new mails to fetch' })
            }

            clearInterval(interval)
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status])

  // Initial status fetch
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const statusRes = await fetch(`${API_URL}/api/status`)
        const statusData = await statusRes.json()
        setStatus(statusData.status)
        setCurrentStep(statusData.current_step)

        const logsRes = await fetch(`${API_URL}/api/logs`)
        const logsData = await logsRes.json()
        setLogs(logsData.logs)

        const resultRes = await fetch(`${API_URL}/api/result`)
        const resultData = await resultRes.json()
        setResult(resultData.result)
        setJiraTicket(resultData.jira_ticket)
        setError(resultData.error)
      } catch (err) {
        console.error('Initial fetch error:', err)
      }
    }
    fetchInitialStatus()
  }, [])

  const runPipeline = async () => {
    setIsLoading(true)
    try {
      await fetch(`${API_URL}/api/pipeline/run`, { method: 'POST' })
      setStatus('running')
      setLogs([])
      setResult(null)
      setJiraTicket(null)
      setError(null)
    } catch (err) {
      console.error('Run pipeline error:', err)
      alert('Failed to start pipeline. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetPipeline = async () => {
    setIsLoading(true)
    try {
      await fetch(`${API_URL}/api/pipeline/reset`, { method: 'POST' })
      setStatus('idle')
      setCurrentStep(0)
      setLogs([])
      setResult(null)
      setJiraTicket(null)
      setError(null)
    } catch (err) {
      console.error('Reset pipeline error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard
          status={status}
          currentStep={currentStep}
          runPipeline={runPipeline}
          resetPipeline={resetPipeline}
          isLoading={isLoading}
          isMobile={isMobile}
          isTablet={isTablet}
          logs={logs}
        />
      case 'jira':
        return <JiraView jiraTicket={jiraTicket} status={status} isMobile={isMobile} />
      case 'ai':
        return <AIAnalysisView result={result} status={status} isMobile={isMobile} />
      default:
        return <Dashboard
          status={status}
          currentStep={currentStep}
          runPipeline={runPipeline}
          resetPipeline={resetPipeline}
          isLoading={isLoading}
          isMobile={isMobile}
          isTablet={isTablet}
          logs={logs}
        />
    }
  }

  const titles = {
    dashboard: { title: 'Dashboard', desc: 'Control and monitor the pipeline' },
    jira: { title: 'JIRA Ticket', desc: 'Created compliance ticket' },
    ai: { title: 'AI Analysis', desc: 'Gemini analysis results' }
  }

  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 72 : 240)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bgSecondary }}>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div style={{
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Header
          isMobile={isMobile}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main style={{ padding: isMobile ? '16px' : isTablet ? '20px' : '24px 28px' }}>
          <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
            <h1 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: 700,
              color: theme.text,
              marginBottom: '4px',
              letterSpacing: '-0.5px'
            }}>
              {titles[activeTab]?.title}
            </h1>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: `1px solid rgba(220, 38, 38, 0.3)`,
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              animation: 'fade-in-up 0.3s ease forwards'
            }}>
              <AlertCircle style={{ width: '18px', height: '18px', color: theme.error, flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p style={{ fontWeight: 600, color: theme.error, margin: 0, fontSize: '13px' }}>Error</p>
                <p style={{ color: theme.text, margin: '2px 0 0 0', fontSize: '12px' }}>{error}</p>
              </div>
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
