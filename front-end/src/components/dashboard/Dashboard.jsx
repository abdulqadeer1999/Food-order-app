import React, { useState, useEffect } from "react";
import Basket from './cart/Basket';
import URL from '../../baseUrl/BaseUrl'
import axios from 'axios'


function Dashboard() {

    const [hideCart, setHideCart] = useState(true)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        axios({
            method: 'get',
            url: URL + '/getProducts',
            withCredentials: true
        }).then((response) => {
            setProducts(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    ///////////////////////////////
    console.log(products)
    const onAdd = (product) => {
        const exist = cartItems.find((x) => x._id === product._id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
                )
            );

        } else {
            setCartItems([...cartItems, { ...product, qty: 1 }]);
        }
    };
    ///////////////////////////////
    ///////////////////////////////
    const onRemove = (product) => {
        const exist = cartItems.find((x) => x._id === product._id);
        if (exist.qty === 1) {
            setCartItems(cartItems.filter((x) => x._id !== product._id));
        } else {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...exist, qty: exist.qty - 1 } : x
                )
            );
        }
    };
    ///////////////////////////////

    return (
        <div>
            {/* <div className='bg-primary pt-3 pb-5 sticky-top'> */}
                <div className="container">
                    <div className="col-md-12">
                        <a className="btn btn-light float-right"
                            onClick={() => setHideCart(prev => !prev)} >
                            <i class="fas fa-cart-plus " /><span className="ml-1">{cartItems.length}</span>
                        </a>
                    </div>
                </div>
            {/* </div> */}
            <div className="row1">
                {hideCart === true ?
                    <main className="container">
                        <h1 className="text-center mt-5 ">All Products</h1>
                        <div className="row">
                            {products.map((product) => (
                                <div className="col-md-4 mt-5" key={product.id}>
                                    <div>
                                        <img className="w-100" height="200" src={product.image} alt={product.name} />
                                        <h3>{product.name}</h3>
                                        <div>PKR: {product.price}/- Per kg</div>
                                        <div>
                                            <button onClick={() => onAdd(product)} className="btn btn-success">Add To Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main> :
                    <>
                        <Basket cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} /></>}
            </div>
        </div>
    )
}

export default Dashboard