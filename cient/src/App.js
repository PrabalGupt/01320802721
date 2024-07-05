import React, { useState } from 'react';
import './App.css';

function App() {
    const [companyname, setCompanyName] = useState('');
    const [categoryname, setCategoryName] = useState('');
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/companies/${companyname}/categories/${categoryname}/products`);
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="App">
            <h1>Product Listing</h1>
            <div>
                <input type="text" placeholder="Company Name" value={companyname} onChange={(e) => setCompanyName(e.target.value)} />
                <input type="text" placeholder="Category Name" value={categoryname} onChange={(e) => setCategoryName(e.target.value)} />
                <button onClick={fetchProducts}>Fetch Products</button>
            </div>
            <div>
                <h2>Products:</h2>
                <ul>
                    {products.map(product => (
                      <ul key={product.id}>
                        <li >{product.productName}</li>
                        <li >{product.price}</li>
                        <li >{product.rating}</li>
                        <li >{product.discount}</li>
                        <li >{product.availability}</li>
                      </ul>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
