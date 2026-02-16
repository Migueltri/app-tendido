import React, { useEffect, useState, useRef } from 'react';
import { getAuthors, saveAuthor, deleteAuthor } from '../services/dataService';
import { Author, SystemRole } from '../types';
import { Plus, Trash2, User, ShieldCheck, UserCog, Edit2, Camera, X, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Authors: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estado para controlar a qué autor se le está cambiando la foto directamente
  const [photoUploadId, setPhotoUploadId] = useState<string | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{name: string, role: string, imageUrl: string, systemRole: SystemRole}>({ 
      name: '', 
      role: '', 
      imageUrl: '', 
      systemRole: 'EDITOR' 
  });

  const formFileInputRef = useRef<HTMLInputElement>(null);

  const loadAuthors = () => {
    setAuthors(getAuthors());
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  // --- Lógica del Formulario Principal (Admin) ---
  const handleEdit = (author: Author) => {
      setEditingId(author.id);
      setFormData({
          name: author.name,
          role: author.role,
          imageUrl: author.imageUrl || '',
          systemRole: author.systemRole
      });
      setIsFormOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setFormData({ name: '', role: '', imageUrl: '', systemRole: 'EDITOR' });
      setEditingId(null);
      setIsFormOpen(false);
  };

  const handleFormImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    saveAuthor({
      id: editingId || Date.now().toString(),
      name: formData.name,
      role: formData.role,
      imageUrl: formData.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
      systemRole: formData.systemRole
    });

    resetForm();
    loadAuthors();
  };

  const handleDelete = (id: string) => {
    if(!isAdmin) return;
    if (confirm('¿Borrar autor? Esta acción no se puede deshacer.')) {
        deleteAuthor(id);
        loadAuthors();
    }
  };

  // --- Lógica de Cambio Rápido de Foto (Cualquier Usuario) ---
  const triggerPhotoUpload = (id: string) => {
      setPhotoUploadId(id);
      hiddenFileInputRef.current?.click();
  };

  const handleQuickPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && photoUploadId) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64Image = reader.result as string;
              
              // Encontrar el autor actual y actualizar solo su imagen
              const authorToUpdate = authors.find(a => a.id === photoUploadId);
              if (authorToUpdate) {
                  const updatedAuthor = { ...authorToUpdate, imageUrl: base64Image };
                  saveAuthor(updatedAuthor);
                  loadAuthors(); // Recargar lista
              }
              setPhotoUploadId(null); // Resetear
          };
          reader.readAsDataURL(file);
      }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  return (
    <div className="space-y-8">
      {/* Input oculto global para cambios rápidos de foto */}
      <input 
        type="file" 
        ref={hiddenFileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleQuickPhotoChange}
      />

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-800">Equipo de Redacción</h2>
           <p className="text-gray-500">Gestiona quién escribe, sus fotos y sus permisos.</p>
        </div>
        {isAdmin && !isFormOpen && (
            <button 
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="bg-brand-dark hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
            <Plus size={18} />
            Añadir Autor
            </button>
        )}
      </div>

      {!isAdmin && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex gap-3">
              <UserCog size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                  Hola <strong>{currentUser?.name}</strong>. Puedes cambiar tu foto de perfil pulsando el icono de cámara sobre tu imagen. 
                  Para cambiar otros datos, contacta con la dirección.
              </p>
          </div>
      )}

      {/* Formulario de Edición Completa (Solo Admin) */}
      {isFormOpen && isAdmin && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in-down relative">
          <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
          </button>
          
          <h3 className="font-bold text-lg mb-6 text-gray-800 flex items-center gap-2">
              {editingId ? <Edit2 size={20} className="text-brand-red"/> : <Plus size={20} className="text-brand-red"/>}
              {editingId ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}
          </h3>

          <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-8">
             <div className="flex flex-col items-center gap-3">
                 <div 
                    className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-inner overflow-hidden relative group cursor-pointer"
                    onClick={() => formFileInputRef.current?.click()}
                 >
                     {formData.imageUrl ? (
                         <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                         <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                             <User size={48} />
                         </div>
                     )}
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera className="text-white" size={24} />
                     </div>
                 </div>
                 <button 
                    type="button" 
                    onClick={() => formFileInputRef.current?.click()}
                    className="text-xs font-bold text-brand-red hover:underline"
                 >
                     SUBIR FOTO
                 </button>
                 <input 
                    type="file" 
                    ref={formFileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFormImageUpload}
                 />
             </div>

             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Nombre Completo</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-red/20 outline-none" 
                        placeholder="Ej: Juan Belmonte"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Cargo Visible</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-red/20 outline-none" 
                        placeholder="Ej: Cronista / Director"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Permisos de Sistema</label>
                    <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-red/20 outline-none bg-white"
                        value={formData.systemRole}
                        onChange={e => setFormData({...formData, systemRole: e.target.value as SystemRole})}
                    >
                        <option value="EDITOR">Redactor (Solo puede editar sus noticias)</option>
                        <option value="ADMIN">Administrador (Control total)</option>
                    </select>
                </div>
                
                <div className="md:col-span-2 pt-2 flex justify-end gap-3">
                    <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">Cancelar</button>
                    <button type="submit" className="bg-brand-red text-white px-8 py-2 rounded hover:bg-red-700 font-bold shadow-md">
                        {editingId ? 'Guardar Cambios' : 'Crear Usuario'}
                    </button>
                </div>
             </div>
          </form>
        </div>
      )}

      {/* Grid de Autores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => {
            // Verificar si el usuario actual tiene permiso para editar la foto de este autor
            const isMe = currentUser?.id === author.id;
            const canEditPhoto = isAdmin || isMe;

            return (
              <div key={author.id} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group relative overflow-hidden transition-all hover:shadow-md ${isMe ? 'ring-2 ring-brand-red/20' : ''}`}>
                 
                 {/* Badge de Admin */}
                 {author.systemRole === 'ADMIN' && (
                     <div className="absolute top-0 right-0 bg-brand-red text-white text-[10px] px-2 py-1 rounded-bl font-bold uppercase tracking-wider flex items-center gap-1">
                         <ShieldCheck size={10} /> Admin
                     </div>
                 )}
                 
                 {/* Imagen de Perfil con Overlay de Edición */}
                 <div className="relative flex-shrink-0 group/img">
                     <img 
                        src={author.imageUrl} 
                        alt={author.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                        onError={(e) => handleImageError(e, author.name)}
                     />
                     
                     {/* Overlay Botón Cámara (Visible si es Admin o es el propio Usuario) */}
                     {canEditPhoto && (
                         <button 
                             onClick={() => triggerPhotoUpload(author.id)}
                             className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                             title="Cambiar foto de perfil"
                         >
                             <Camera size={20} className="text-white drop-shadow-md" />
                         </button>
                     )}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate flex items-center gap-2">
                        {author.name}
                        {isMe && <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold uppercase">Tú</span>}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">{author.role}</p>
                 </div>
                 
                 {/* Botones de acción (Solo para Admin y gestión completa) */}
                 {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleEdit(author)}
                            className="text-gray-400 hover:text-blue-500 p-2 bg-gray-50 rounded-full hover:bg-blue-50 transition-colors"
                            title="Editar datos"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => handleDelete(author.id)}
                            className="text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-full hover:bg-red-50 transition-colors"
                            title="Eliminar usuario"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                 )}
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Authors;