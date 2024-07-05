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
    // console.log(authToken)
    try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products`, {
            params: { top, minPrice, maxPrice},
            headers: { Authorization: authToken }
        });
        //bubble sort to sort the data on the basis of price of each product.
        const data = response.data.map((product, index) => ({
            ...product,
            productid: `product-${index + 1}`
        }));
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = 0; j < data.length - 1 - i; j++) {
                if (data[j].price > data[j + 1].price) {
                    [data[j], data[j + 1]] = [data[j + 1], data[j]];
                }
            }
        }
        localStorage.setItem('myData', JSON.stringify(data));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get request for product details
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { categoryname, productid } = req.params;
    const authToken = req.headers.authorization;
    console.log(authToken)
    try {
        const storedData = localStorage.getItem('myData');
        const parsedData = JSON.parse(storedData);
        const foundItem = parsedData.find(item => item.productid === productid);
        res.json(foundItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
