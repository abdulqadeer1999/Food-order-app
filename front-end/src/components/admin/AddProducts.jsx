import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import Url from '../../baseUrl/BaseUrl'
function AddProducts() {
    let [msg, setMsg] = useState()

    function addProduct(e) {
        e.preventDefault()
        var fileInput = document.getElementById("customFile");
        var productName = document.getElementById("pName");
        var price = document.getElementById("price");
        var description = document.getElementById("description");
        var stock = document.getElementById("stock");
        let formData = new FormData();
        formData.append("myFile", fileInput.files[0]);
        formData.append("productName", productName.value);
        formData.append("price", price.value);
        formData.append("description", description.value);
        formData.append("stock", stock.value);

        axios({
            method: 'post',
            url: Url + "/addProduct",
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
            .then(response => {
                setMsg(response.data.message)
            })
            .catch(err => {
                console.log(err);
            })

    }
    console.log(msg)
    return (
       
        <div>
            <div>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap" style = {{marginTop:"70px",marginLeft:"100px",textAlign:"center"}}>Add New Products</button>
        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">New Product  Details</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={addProduct}>
                  <div className="form-group">
                    <label htmlFor="recipient-name" className="col-form-label">Product Name</label>
                    <input type="text" className="form-control" id="pName" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message-text" className="col-form-label">Price</label>
                    <input type="number" className="form-control" id="price" placeholder="Price" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message-text" className="col-form-label">Stock</label>
                    <input type="text" className="form-control" id="stock" placeholder="Stock" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message-text" className="col-form-label">Description</label>
                    <input type="text" className="form-control" id="description" placeholder="Description" />
                  </div>
                  <div className="form-group">
                         <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile" />
                                    <label className="custom-file-label" for="customFile">Choose Image</label>
                                 </div>
                         </div>
                         <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
                {msg ? <div class="alert alert-success" role="alert">
                             {msg}
                             </div> : null}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                {/* <button type="button" className="btn btn-primary">Send message</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
    )
}

export default AddProducts;