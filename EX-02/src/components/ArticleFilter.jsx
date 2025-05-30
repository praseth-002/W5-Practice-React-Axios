import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilter() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedJournalistId, setSelectedJournalistId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    // Q1: Fetch journalists and categories on mount
    axios.get('http://localhost:5000/journalists')
      .then(res => setJournalists(res.data))
      .catch(err => console.error('Error fetching journalists:', err));

    axios.get('http://localhost:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));

    // Also fetch all articles initially
    fetchAllArticles();
  }, []);

  const fetchAllArticles = () => {
    axios.get('http://localhost:5000/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error('Error fetching articles:', err));
  };

  // Q2 & Q3: Fetch articles by filters from backend API
  const applyFilters = () => {
    if (selectedJournalistId && selectedCategoryId) {
      // Q4: Bonus combined filter (you'll need backend support for this)
      axios.get(`http://localhost:5000/articles?journalistId=${selectedJournalistId}&categoryId=${selectedCategoryId}`)
        .then(res => setArticles(res.data))
        .catch(err => console.error('Error fetching filtered articles:', err));
    } else if (selectedJournalistId) {
      // Filter by journalist
      axios.get(`http://localhost:5000/journalists/${selectedJournalistId}/articles`)
        .then(res => setArticles(res.data))
        .catch(err => console.error('Error fetching articles by journalist:', err));
    } else if (selectedCategoryId) {
      // Filter by category
      axios.get(`http://localhost:5000/categories/${selectedCategoryId}/articles`)
        .then(res => setArticles(res.data))
        .catch(err => console.error('Error fetching articles by category:', err));
    } else {
      // No filters - get all articles
      fetchAllArticles();
    }
  };

  const resetFilters = () => {
    setSelectedJournalistId('');
    setSelectedCategoryId('');
    fetchAllArticles();
  };

  return (
    <div>
      <h2>Articles</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label htmlFor="journalistFilter">Filter by Journalist:</label>
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

        <label htmlFor="categoryFilter">Filter by Category:</label>
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
