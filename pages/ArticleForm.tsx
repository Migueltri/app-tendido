
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, getAuthors, saveArticle, saveAuthor } from '../services/dataService';
import { syncWithGitHub } from '../services/githubService';
import { Article, Author, Category, BullfightResult } from '../types';
import { ArrowLeft, Image as ImageIcon, UploadCloud, X, Plus, Bold, Italic, List, Shield, MapPin, Award, Trash2, FileEdit, Send, User, Calendar, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ArticleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, currentUser } = useAuth();
  const isEditMode = !!id;

  const [authors, setAuthors] = useState<Author[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    summary: '',
    content: '',
    category: Category.ACTUALIDAD,
    imageUrl: '',
    contentImages: [],
    authorId: '',
    date: new Date().toISOString(), // Default to now
    isPublished: false,
    bullfightLocation: '',
    bullfightCattle: '',
    bullfightSummary: '',
    bullfightResults: []
  });

  const [newResult, setNewResult] = useState<BullfightResult>({ bullfighter: '', result: '' });

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const authorImageInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Ref para hacer foco después de añadir un resultado
  const bullfighterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAuthors(getAuthors());
    
    if (isEditMode && id) {
      const article = getArticleById(id);
      if (article) {
        // Permission Check: Admin can edit ALL. Users can only edit THEIR OWN.
        if (!isAdmin && article.authorId !== currentUser?.id) {
             alert("⛔ No tienes permisos para editar esta noticia porque pertenece a otro autor.");
             navigate('/noticias');
             return;
        }

        setFormData(article);
        if (editorRef.current) {
            editorRef.current.innerHTML = article.content;
        }
      } else {
        navigate('/noticias');
      }
    } else {
        // NEW ARTICLE
        setFormData({
            title: '',
            summary: '',
            content: '',
            category: Category.ACTUALIDAD,
            imageUrl: '',
            contentImages: [],
            authorId: currentUser?.id || '', // Auto-select current user
            date: new Date().toISOString(),
            isPublished: false,
            bullfightLocation: '',
            bullfightCattle: '',
            bullfightSummary: '',
            bullfightResults: []
        });
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
        }
    }
  }, [id, isEditMode, navigate, currentUser, isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!val) return;
      
      const localDate = new Date(val);
      if (!isNaN(localDate.getTime())) {
          setFormData(prev => ({ ...prev, date: localDate.toISOString() }));
      }
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuthorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && formData.authorId) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newImage = reader.result as string;
              
              // 1. Update local authors state
              const updatedAuthors = authors.map(a => 
                  a.id === formData.authorId ? { ...a, imageUrl: newImage } : a
              );
              setAuthors(updatedAuthors);

              // 2. Persist author change globally
              const authorToUpdate = authors.find(a => a.id === formData.authorId);
              if (authorToUpdate) {
                  saveAuthor({ ...authorToUpdate, imageUrl: newImage });
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      const promises: Promise<string>[] = [];

      Array.from(files).forEach(file => {
        const promise = new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
             resolve(reader.result as string);
          };
          reader.readAsDataURL(file as Blob);
        });
        promises.push(promise);
      });

      Promise.all(promises).then((results) => {
         setFormData(prev => ({
           ...prev,
           contentImages: [...(prev.contentImages || []), ...results]
         }));
      });
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
      setFormData(prev => ({
          ...prev,
          contentImages: prev.contentImages?.filter((_, index) => index !== indexToRemove)
      }));
  };

  const addResult = () => {
    if (newResult.bullfighter && newResult.result) {
        setFormData(prev => ({
            ...prev,
            bullfightResults: [...(prev.bullfightResults || []), newResult]
        }));
        setNewResult({ bullfighter: '', result: '' });
        
        // Devolver foco al primer input para seguir escribiendo rápido
        setTimeout(() => bullfighterInputRef.current?.focus(), 50);
    }
  };
  
  // Permitir añadir con la tecla ENTER
  const handleResultKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          e.preventDefault(); // Evitar submit del formulario global
          addResult();
      }
  };

  const removeResult = (index: number) => {
      setFormData(prev => ({
          ...prev,
          bullfightResults: prev.bullfightResults?.filter((_, i) => i !== index)
      }));
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  // Main Save Function
  const handleSave = async (e: React.MouseEvent, shouldPublish: boolean) => {
    e.preventDefault(); // Prevent standard form submit
    
    if (!formData.title || !formData.authorId) {
        alert('Por favor completa el Título y el Autor.');
        return;
    }

    const articleToSave: Article = {
      id: isEditMode ? id! : Date.now().toString(),
      title: formData.title || '',
      summary: formData.summary || '',
      content: formData.content || '',
      category: formData.category as Category,
      authorId: formData.authorId || '',
      imageUrl: formData.imageUrl || 'https://picsum.photos/800/600',
      contentImages: formData.contentImages || [],
      date: formData.date || new Date().toISOString(),
      isPublished: shouldPublish,
      bullfightLocation: formData.bullfightLocation,
      bullfightCattle: formData.bullfightCattle,
      bullfightSummary: formData.bullfightSummary,
      bullfightResults: formData.bullfightResults
    };

    if (shouldPublish) {
        setIsSubmitting(true);
        // 1. Guardar localmente sin disparar auto-sync para evitar colisión
        saveArticle(articleToSave, true); 
        
        // 2. Forzar sincronización explícita
        try {
            const result = await syncWithGitHub();
            setIsSubmitting(false);
            
            if (result.success) {
                alert("✅ ¡Noticia publicada con éxito en la web!");
                navigate('/noticias');
            } else {
                alert(`⚠️ Se guardó localmente, pero hubo un error subiendo a la web: ${result.message}`);
                navigate('/noticias');
            }
        } catch (error) {
            setIsSubmitting(false);
            alert("❌ Error de conexión al intentar publicar. Se ha guardado en local.");
            navigate('/noticias');
        }
    } else {
        // Solo guardar como borrador (el auto-sync se encargará en segundo plano)
        saveArticle(articleToSave);
        navigate('/noticias');
    }
  };

  // Helpers for UI
  const getSelectedAuthor = () => authors.find(a => a.id === formData.authorId);
  
  const getFormattedDateValue = () => {
      if (!formData.date) return '';
      try {
          const d = new Date(formData.date);
          if (isNaN(d.getTime())) return '';
          const offsetMs = d.getTimezoneOffset() * 60000;
          const localTime = new Date(d.getTime() - offsetMs);
          return localTime.toISOString().slice(0, 16);
      } catch (e) {
          return '';
      }
  };
  const formattedDateValue = getFormattedDateValue();

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Noticia' : 'Nueva Noticia'}
        </h2>
      </div>

      <form className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-lg font-medium bg-white"
            placeholder="Escribe un titular llamativo..."
            required
          />
        </div>

        {/* --- METADATA ROW 1: Category & Date --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white"
                >
                    {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={16} /> Fecha de Publicación
                </label>
                <input 
                    type="datetime-local"
                    value={formattedDateValue}
                    onChange={handleDateChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white text-gray-600 font-medium"
                />
            </div>
        </div>

        {/* --- METADATA ROW 2: Author Selection & Photo --- */}
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Autor</label>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 w-full">
                    <select
                        name="authorId"
                        value={formData.authorId}
                        onChange={handleChange}
                        className={`w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white appearance-none ${!isAdmin ? 'bg-gray-50 text-gray-500' : ''}`}
                        required
                        disabled={!isAdmin} 
                    >
                        <option value="">Selecciona un autor</option>
                        {authors.map(author => (
                        <option key={author.id} value={author.id}>{author.name}</option>
                        ))}
                    </select>
                    {!isAdmin && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <User size={16} />
                        </div>
                    )}
                </div>

                {/* Author Image Quick Edit */}
                {formData.authorId && (
                     <div className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg bg-gray-50 min-w-[200px]">
                         <img 
                            src={getSelectedAuthor()?.imageUrl} 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getSelectedAuthor()?.name || 'A')}`}
                         />
                         <div className="flex-1">
                             <p className="text-xs font-bold text-gray-700">Foto Actual</p>
                             <button 
                                type="button"
                                onClick={() => authorImageInputRef.current?.click()}
                                className="text-xs text-brand-red hover:underline flex items-center gap-1 mt-0.5"
                             >
                                 <Camera size={12} /> Cambiar Foto
                             </button>
                             <input 
                                type="file" 
                                ref={authorImageInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleAuthorImageUpload}
                             />
                         </div>
                     </div>
                )}
            </div>
            {!isAdmin && <p className="text-xs text-gray-400 mt-1">Como redactor, publicas bajo tu propio nombre.</p>}
        </div>

        {/* --- SECTION: Chronicle Specific Data (Visible only for Crónicas) --- */}
        {formData.category === Category.CRONICAS && (
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 space-y-6">
                <div className="flex items-center gap-2 text-orange-800 border-b border-orange-200 pb-2">
                    <Shield size={20} />
                    <h3 className="font-bold text-lg">Ficha del Festejo</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-orange-800 uppercase flex items-center gap-1">
                             <MapPin size={14} /> Plaza
                        </label>
                        <input
                            type="text"
                            name="bullfightLocation"
                            value={formData.bullfightLocation}
                            onChange={handleChange}
                            className="w-full p-2 border border-orange-200 rounded focus:border-orange-500 outline-none bg-white"
                            placeholder="Ej: Plaza Mayor de Ciudad Rodrigo"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-orange-800 uppercase flex items-center gap-1">
                             <Shield size={14} /> Ganadería
                        </label>
                        <input
                            type="text"
                            name="bullfightCattle"
                            value={formData.bullfightCattle}
                            onChange={handleChange}
                            className="w-full p-2 border border-orange-200 rounded focus:border-orange-500 outline-none bg-white"
                            placeholder="Ej: Novillos de Talavante"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-orange-800 uppercase">Resumen del Festejo (Ficha Técnica)</label>
                    <textarea
                        name="bullfightSummary"
                        value={formData.bullfightSummary}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border border-orange-200 rounded focus:border-orange-500 outline-none resize-none bg-white"
                        placeholder="Resumen general del comportamiento del ganado y la tarde..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold text-orange-800 uppercase flex items-center gap-1">
                        <Award size={14} /> Resultados
                    </label>
                    
                    <div className="space-y-2">
                        {formData.bullfightResults?.map((res, idx) => (
                            <div key={idx} className="flex items-center bg-white p-2 rounded border border-orange-200 shadow-sm animate-fade-in">
                                <div className="flex-1">
                                    <span className="font-bold text-gray-800">{res.bullfighter}</span>
                                    <span className="text-gray-400 mx-2">|</span>
                                    <span className="text-gray-600 italic">{res.result}</span>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeResult(idx)}
                                    className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 items-end bg-orange-100/50 p-3 rounded-lg border border-orange-200">
                        <div className="flex-1 w-full space-y-1">
                             <label className="text-[10px] text-orange-800 font-bold uppercase">Torero / Novillero</label>
                             <input 
                                ref={bullfighterInputRef}
                                type="text" 
                                placeholder="Ej: Diego Urdiales"
                                className="w-full p-2 text-sm border border-gray-300 rounded bg-white focus:border-orange-500 outline-none"
                                value={newResult.bullfighter}
                                onChange={(e) => setNewResult(prev => ({ ...prev, bullfighter: e.target.value }))}
                                onKeyDown={handleResultKeyDown}
                             />
                        </div>
                        <div className="flex-1 w-full space-y-1">
                             <label className="text-[10px] text-orange-800 font-bold uppercase">Resultado</label>
                             <input 
                                type="text" 
                                placeholder="Ej: una oreja"
                                className="w-full p-2 text-sm border border-gray-300 rounded bg-white focus:border-orange-500 outline-none"
                                value={newResult.result}
                                onChange={(e) => setNewResult(prev => ({ ...prev, result: e.target.value }))}
                                onKeyDown={handleResultKeyDown}
                             />
                        </div>
                        <button 
                            type="button"
                            onClick={addResult}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full md:w-auto h-[38px] flex items-center justify-center gap-1 shadow-sm"
                        >
                            <Plus size={16} /> Añadir
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 italic text-right">* Pulsa ENTER para añadir rápidamente.</p>
                </div>
            </div>
        )}

        {/* Summary */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Resumen / Entradilla (Portada)</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white"
            placeholder="Breve descripción que aparecerá en la portada..."
          />
        </div>

        {/* --- Images --- */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon size={18} />
            Imagen del Titular (Portada)
          </label>
          
          <div 
             className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden"
             onClick={() => mainImageInputRef.current?.click()}
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => {
               e.preventDefault();
               if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                 const file = e.dataTransfer.files[0];
                 const reader = new FileReader();
                 reader.onloadend = () => setFormData(p => ({ ...p, imageUrl: reader.result as string }));
                 reader.readAsDataURL(file);
               }
             }}
          >
             {formData.imageUrl ? (
               <div className="relative w-full h-64">
                  <img src={formData.imageUrl} alt="Portada" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white font-medium flex items-center gap-2"><UploadCloud size={20} /> Cambiar Imagen</p>
                  </div>
               </div>
             ) : (
               <div className="py-8 space-y-2">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <UploadCloud size={24} />
                 </div>
                 <p className="text-gray-600 font-medium">Haz clic o arrastra una imagen aquí</p>
                 <p className="text-xs text-gray-400">JPG, PNG hasta 5MB</p>
               </div>
             )}
             <input 
               type="file" 
               ref={mainImageInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleMainImageUpload}
             />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
             <ImageIcon size={18} />
             Imágenes de la Noticia (Galería)
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-red/50 hover:text-brand-red transition-all"
              >
                  <Plus size={32} className="mb-2 opacity-50" />
                  <span className="text-xs font-medium">Añadir Fotos</span>
                  <input 
                    type="file" 
                    ref={galleryInputRef} 
                    className="hidden" 
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                  />
              </div>

              {formData.contentImages?.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                      <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                          <X size={14} />
                      </button>
                  </div>
              ))}
          </div>
        </div>

        {/* Content (Rich Text Editor) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contenido de la Noticia</label>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-red/20 focus-within:border-brand-red bg-white">
              <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
                  <button 
                    type="button" 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFormat('bold')} 
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors" 
                    title="Negrita"
                  >
                      <Bold size={18} />
                  </button>
                  <button 
                    type="button" 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFormat('italic')} 
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors" 
                    title="Cursiva"
                  >
                      <Italic size={18} />
                  </button>
                  <button 
                    type="button" 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFormat('insertUnorderedList')} 
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors" 
                    title="Lista con viñetas"
                  >
                      <List size={18} />
                  </button>
              </div>

              <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full p-4 min-h-[300px] outline-none font-sans text-gray-700 leading-relaxed overflow-y-auto"
                  onInput={(e) => {
                      const newContent = e.currentTarget.innerHTML;
                      setFormData(prev => ({ ...prev, content: newContent }));
                  }}
                  style={{ minHeight: '300px' }}
              />
          </div>
        </div>

        {/* --- DUAL ACTION BUTTONS (Draft vs Publish) --- */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <button 
                type="button" 
                onClick={() => navigate('/noticias')}
                className="w-full sm:w-auto px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                disabled={isSubmitting}
            >
                Cancelar
            </button>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button 
                    type="button"
                    onClick={(e) => handleSave(e, false)}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                >
                    <FileEdit size={18} />
                    Guardar Borrador
                </button>
                
                <button 
                    type="button"
                    onClick={(e) => handleSave(e, true)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-red hover:bg-red-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Publicando...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            {isEditMode ? 'Actualizar y Publicar' : 'Publicar Noticia'}
                        </>
                    )}
                </button>
            </div>
        </div>

      </form>
    </div>
  );
};

export default ArticleForm;
