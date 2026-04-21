// Configuración inicial de Supabase (Placeholder)
// Para usarlo, debes reemplazar SUPABASE_URL y SUPABASE_ANON_KEY con tus credenciales reales.

const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';

// Simulación de cliente Supabase si no se carga la librería externa
const supabase = (typeof createClient !== 'undefined')
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : {
        from: (table) => ({
            select: () => ({
                order: () => Promise.resolve({ data: [], error: null }),
                eq: () => Promise.resolve({ data: [], error: null })
            }),
            insert: () => Promise.resolve({ data: null, error: 'Supabase no configurado' })
        }),
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null })
        }
    };

async function getPosts() {
    // Ejemplo de cómo se obtendrían las publicaciones
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) console.error('Error cargando posts:', error);
    return data || [];
}

async function createPost(content, userId) {
    const { data, error } = await supabase
        .from('posts')
        .insert([{ content, user_id: userId }]);

    return { data, error };
}

window.devSupabase = { getPosts, createPost };
