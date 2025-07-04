import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

export default function ArticleForm() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  // Validate form data
  if (!form.title || !form.content || !form.journalistId || !form.categoryId) {
    alert('All fields are required!');
    return;
  }
  // Convert journalistId and categoryId to numbers before sending
  const payload = {
    title: form.title,
    content: form.content,
    journalistId: Number(form.journalistId),
    categoryId: Number(form.categoryId),
  };
  try {
    const response = await axios.post('http://localhost:5000/articles', payload);
    console.log('Article created successfully:', response.data);
    setForm({
      title: '',
      content: '',
      journalistId: '',
      categoryId: '',
    });
  } catch (error) {
    console.error('Error creating article:', error.response?.data || error.message);
  }
};


  return (

    <div>
      {/* Navigation Links */}
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>📄 View Articles</Link>
        <Link to="/add"> ➕ Add Article</Link>
      </nav>

      <h2>Articles</h2>
      <form onSubmit={handleSubmit}>
        <h3>Add New Article</h3>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
        <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
        <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
        <button type="submit">Add</button>
      </form>

    </div>
  );
}
