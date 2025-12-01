import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, LayoutDashboard, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import useAuthStore from '../../stores/useAuthStore';
import './login.css';

const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  senha: z.string().min(1, 'A senha é obrigatória'),
});

function Login() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.login);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
      try {
      const response = await authService.login(data.email, data.senha);
      setLogin(response.token, response.user); 
      navigate('/');
    } catch (error) {
      console.error("Erro no login", error);
      setError('root', { 
        message: 'Credenciais inválidas. Tente novamente.' 
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg"></div>

      <div className="login-content">
        <div className="brand-header">
            <div className="logo-container">
                 <img src="/Logo_V.png" alt="Valisys" onError={(e) => e.target.style.display='none'} className="brand-img" />
                 <LayoutDashboard size={40} className="brand-fallback-icon" />
            </div>
            <h1>Valisys Production</h1>
            <span className="brand-subtitle">Gestão Inteligente de Produção</span>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2>Bem-vindo</h2>
            <p>Insira suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="email" style={{color:'white'}}>E-mail</label>
              <div className={`input-group ${errors.email ? 'error' : ''}`}>
                <input style={{color:'white'}}
                  id="email" 
                  type="email" 
                  placeholder="usuario@empresa.com"
                  {...register('email')} 
                />
              </div>
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="senha" style={{color:'white'}}>Senha</label>
              <div className={`input-group ${errors.senha ? 'error' : ''}`}>
                <input style={{color:'white'}}
                  id="senha" 
                  type="password" 
                  placeholder="••••••••"
                  {...register('senha')} 
                />
              </div>
              {errors.senha && <span className="field-error">{errors.senha.message}</span>}
            </div>

            {errors.root && (
                <div className="general-error">
                    <AlertCircle size={16} /> {errors.root.message}
                </div>
            )}

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                  <> <Loader2 size={20} className="spinner" /> Acessando... </>
              ) : (
                  <> Acessar Sistema <ArrowRight size={20} /> </>
              )}
            </button>
          </form>
        </div>
        
        <div className="login-footer">
            © {new Date().getFullYear()} Valisys. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}

export default Login;