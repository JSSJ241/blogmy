import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const limit = 5;

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (page) => {
  const token = localStorage.getItem('token');
  const offset = (page - 1) * limit;
  const res = await fetch(
    `https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`,
    {
      headers: token ? { Authorization: `Token ${token}` } : {},
    },
  );
  const data = await res.json();
  return {
    articles: data.articles,
    totalPages: Math.ceil(data.articlesCount / limit),
    page,
  };
});

export const toggleFavorite = createAsyncThunk(
  'articles/toggleFavorite',
  async ({ slug, favorited }) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');

    const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
      method: favorited ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Error toggling favorite');

    const updated = await res.json();
    return updated.article;
  },
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    totalPages: 1,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.articles = [];
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedArticle = action.payload;
        const index = state.articles.findIndex((a) => a.slug === updatedArticle.slug);
        if (index !== -1) {
          state.articles[index] = updatedArticle;
        }
      });
  },
});

export const { setPage } = articlesSlice.actions;
export default articlesSlice.reducer;
