// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Route Registered
app.post('/register', (req, res) => {
    // Your registration logic here
    res.send('Registered successfully');
});

// get request for categories
app.get('/companies/:companyname/categories/:categoryname/products', async (req, res) => {
    const { categoryname, companyname } = req.params;
    // const { top = 10, minPrice, maxPrice } = req.query;

    // Extracting the Authorization token from the request headers
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: 'Authorization header is required' });
    }
    const top = 10;
    const minPrice = 1;
    const maxPrice = 10000;
    console.log(authToken)
    try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products`, {
            params: { top, minPrice, maxPrice},
            headers: { Authorization: authToken }
        });
        //bubble sort to sort the data on the basis of price of each product.
        const data = response.data;
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = 0; j < data.length - 1 - i; j++) {
                if (data[j].price > data[j + 1].price) {
                    [data[j], data[j + 1]] = [data[j + 1], data[j]];
                }
            }
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get request for product details
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { categoryname, productid } = req.params;

    try {
        // const response = await axios.get(`http://20.244.56.144/test/companies/AMZ/categories/${categoryname}/products/${productid}`);
        axios.get(`http://20.244.56.144/test/companies/AMZ/categories/${categoryname}/products/${productid}`, {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwMTYxNDg2LCJpYXQiOjE3MjAxNjExODYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjIyNGE5OTdhLTZiMzMtNDJlMi05MmE4LTdhZWUyOThmYTk1MCIsInN1YiI6InByYWJhbC5ndXB0YTIwMDNAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiIyMjRhOTk3YS02YjMzLTQyZTItOTJhOC03YWVlMjk4ZmE5NTAiLCJjbGllbnRTZWNyZXQiOiJoS3NVa3hOV1hMRkVWZUxOIiwib3duZXJOYW1lIjoiUHJhYmFsIEd1cHRhIiwib3duZXJFbWFpbCI6InByYWJhbC5ndXB0YTIwMDNAZ21haWwuY29tIiwicm9sbE5vIjoiMDEzMjA4MDI3MjEifQ.XbsJt6ZTZcYdZ6Hu5cDaZs5IYgnWnd15cfrWAIzAokk`
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
