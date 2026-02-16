
import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, verifyConnection } from '../services/githubService';
import { AppSettings } from '../types';
import { Save, Code, Copy, CheckCircle, AlertCircle, AlertTriangle, ArrowDown, Edit, Github, Server, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    githubToken: '',
    repoOwner: '',
    repoName: '',
    filePath: 'public/data/db.json',
    repoBranch: 'main'
  });
  
  const [saved, setSaved] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [testStatus, setTestStatus] = useState<{ loading: boolean, msg: string, success?: boolean } | null>(null);
  const [showCode, setShowCode] = useState(true); 

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
    
    // Si ya tenemos token y repo, asumimos que está configurado
    if (currentSettings.githubToken && currentSettings.repoName) {
        setIsConfigured(true);
        // Verificación silenciosa al cargar
        verifyConnection().then(res => {
            if(res.success) setTestStatus({ loading: false, msg: 'Conexión activa con la Web', success: true });
        });
    } else {
        setIsEditing(true); // Si no hay config, mostramos el formulario
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.filePath.endsWith('.json')) {
        alert("Error: El archivo debe terminar en .json (normalmente public/data/db.json)");
        return;
    }
    saveSettings(settings);
    setSettings(getSettings()); 
    setSaved(true);
    setIsConfigured(true);
    setIsEditing(false); // Cerrar modo edición
    setTestStatus(null);
    setTimeout(() => setSaved(false), 3000);
    
    // Probar conexión inmediatamente después de guardar
    handleTestConnection();
  };

  const handleTestConnection = async () => {
      saveSettings(settings); // Asegurar que probamos lo último escrito
      setTestStatus({ loading: true, msg: 'Buscando repositorio de la web...', success: false });
      const result = await verifyConnection();
      setTestStatus({ loading: false, msg: result.message, success: result.success });
  };

  const instructionCode = `
// GUÍA RÁPIDA:
// 1. Ve a GitHub.com y abre el repositorio de TU PÁGINA WEB (tendidodigital.es).
// 2. Copia el nombre del usuario y el nombre del repositorio.
//    (Ejemplo: si la url es github.com/manolo/web-toros, usuario="manolo", repo="web-toros")
// 3. Genera un Token clásico (Personal Access Token) con permiso de "Repo".
// 4. Pega esos datos en este formulario.
// 5. Dale a "Probar Conexión".
`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-12">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Conexión con la Web</h2>
        <p className="text-gray-500">Configura aquí el enlace con el repositorio de <strong>tendidodigital.es</strong> para publicar las noticias.</p>
      </div>

      {/* ESTADO DE CONEXIÓN (VISUAL) */}
      {isConfigured && !isEditing && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
              <div className="bg-green-50 p-4 border-b border-green-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-700">
                          <Globe size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-green-900">Enlazado con tendidodigital.es</h3>
                          <p className="text-green-700 text-sm">El panel está listo para enviar noticias a la web.</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-green-700 hover:text-green-900 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                      <Edit size={16} /> Cambiar Repositorio
                  </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 text-gray-600">
                      <Github size={20} />
                      <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">Repositorio Web</p>
                          <p className="font-medium text-gray-800">{settings.repoOwner}/{settings.repoName}</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                      <Code size={20} />
                      <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">Rama</p>
                          <p className="font-medium text-gray-800">{settings.repoBranch}</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                      <Server size={20} />
                      <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">Archivo de Datos</p>
                          <p className="font-medium text-gray-800">{settings.filePath}</p>
                      </div>
                  </div>
              </div>
              {testStatus && (
                <div className={`px-6 py-2 text-sm border-t ${testStatus.success ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    Estado: <strong>{testStatus.msg}</strong>
                </div>
              )}
          </div>
      )}

      {/* FORMULARIO (Solo visible si no hay config o se está editando) */}
      {(isEditing || !isConfigured) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 animate-fade-in-down">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-700">Datos del Repositorio de la WEB</h3>
                {isConfigured && (
                    <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">Cancelar</button>
                )}
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4 border border-blue-100 flex gap-2">
                <AlertCircle className="flex-shrink-0" />
                <p>Importante: Introduce aquí los datos del repositorio donde está alojada tu página web (tendidodigital.es), <strong>NO</strong> los datos de este panel de control.</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Token de GitHub (Debe ser tuyo)</label>
                <input 
                    type="password" 
                    name="githubToken" 
                    value={settings.githubToken} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none" 
                    placeholder="ghp_..."
                    required 
                />
                <p className="text-xs text-gray-400">Necesitas un 'Personal Access Token' con permisos de escritura (Repo).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Usuario de GitHub (Dueño de la Web)</label>
                    <input type="text" name="repoOwner" value={settings.repoOwner} onChange={handleChange} placeholder="Ej: manolo-herrera" className="w-full p-3 border border-gray-200 rounded-lg" required />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Repositorio de la WEB</label>
                    <input type="text" name="repoName" value={settings.repoName} onChange={handleChange} placeholder="Ej: tendidodigital-web" className="w-full p-3 border border-gray-200 rounded-lg" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Rama (Branch)</label>
                    <input type="text" name="repoBranch" value={settings.repoBranch} onChange={handleChange} placeholder="main" className="w-full p-3 border border-gray-200 rounded-lg" required />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Ruta donde guardar las noticias (db.json)</label>
                    <div className="flex gap-2">
                        <input type="text" name="filePath" value={settings.filePath} onChange={handleChange} placeholder="public/data/db.json" className="w-full p-3 border border-gray-200 rounded-lg" required />
                    </div>
                    <p className="text-xs text-gray-400">Normalmente es 'public/data/db.json' o 'src/data/db.json' en el repo de la web.</p>
                </div>
            </div>

            {testStatus && isEditing && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${testStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {testStatus.success ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                    {testStatus.msg}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={handleTestConnection} 
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    disabled={testStatus?.loading}
                >
                    {testStatus?.loading ? 'Probando...' : 'Probar Conexión'}
                </button>
                <button 
                    type="submit" 
                    className="bg-brand-dark text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 font-medium shadow-sm transition-colors"
                >
                    <Save size={18}/> Guardar y Conectar
                </button>
            </div>
        </form>
      )}

      {/* --- AYUDA --- */}
      <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <button 
            onClick={() => setShowCode(!showCode)}
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-2"
          >
             <AlertTriangle size={16} /> ¿Necesitas ayuda para conectar?
          </button>
          
          {showCode && (
            <div className="mt-4">
                 <div className="bg-slate-900 p-4 rounded-lg relative group border border-slate-700 overflow-hidden text-left">
                        <pre className="text-xs sm:text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap max-h-[400px]">
                            {instructionCode}
                        </pre>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Settings;
