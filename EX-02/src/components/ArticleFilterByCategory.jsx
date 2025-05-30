import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByCategory() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedJournalistId, setSelectedJournalistId] = useState('');

  useEffect(() => {
    // Fetch categories and journalists
    axios.get('http://localhost:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));

    axios.get('http://localhost:5000/journalists')
      .then(res => setJournalists(res.data))
      .catch(err => console.error('Error fetching journalists:', err));

    fetchAllArticles();
  }, []);

  const fetchAllArticles = () => {
    axios.get('http://localhost:5000/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error('Error fetching articles:', err));
  };

  const applyFilters = () => {
    const params = {};
    if (selectedCategoryId) params.categoryId = selectedCategoryId;
    if (selectedJournalistId) params.journalistId = selectedJournalistId;

    axios.get('http://localhost:5000/articles', { params })
      .then(res => setArticles(res.data))
      .catch(err => console.error('Error fetching filtered articles:', err));
  };

  const resetFilters = () => {
    setSelectedCategoryId('');
    setSelectedJournalistId('');
    fetchAllArticles();
  };

  return (
    <div>
      <h2>Articles</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label htmlFor="categoryFilter">Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategoryId}
          onChange={e => setSelectedCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name || `Category #${c.id}`}</option>
          ))}
        </select>

        <label htmlFor="journalistFilter">Journalist:</label>
        <select
          id="journalistFilter"
          value={selectedJournalistId}
          onChange={e => setSelectedJournalistId(e.target.value)}
        >
          <option value="">All Journalists</option>
          {journalists.map(j => (
            <option key={j.id} value={j.id}>{j.name || `Journalist #${j.id}`}</option>
          ))}
        </select>

        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <strong>{article.title}</strong> <br />
            <small>By Journalist #{article.journalistId} | Category #{article.categoryId}</small><br />
            <button disabled>Delete</button>
            <button disabled>Update</button>
            <button disabled>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
