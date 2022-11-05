import React, {useEffect} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {Row,Col,ListGroup,Image,Form,Button,Card} from 'react-bootstrap'
import Message from "../components/Message"
import {addToCart,removeFromCart} from '../features/CartSlice'

const CartScreen = () => {
  const history= useNavigate()  
  const location=useLocation()
  const {id}=useParams() 
  const qty= location.search ? Number(location.search.split('=')[1]) : 1 
  
  const dispatch=useDispatch()

  const {cartItems}=useSelector((store)=>store.cart)

  useEffect(()=>{
    if(id){
        dispatch(addToCart({id,qty}))
    }
  },[dispatch,id,qty])

  const removeFromCartHandler=(id)=>{
    dispatch(removeFromCart(id))
  }

  const checkoutHandler=()=>{
    history('/shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>

                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>

                  <Col md={2}>{item.price}</Col>

                  <Col md={3}>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) => {
                        let qty = Number(e.target.value);
                        let id = item.product;
                        dispatch(addToCart({ id, qty }));
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={1}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
                <h2>
                  SubTotal (
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) items
                </h2>
              {cartItems.length !== 0 ? 
              (<h2>{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}$</h2>
              ) : (
                <h2>0$ </h2>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <Button type="button" className="btn-block"
              onClick={checkoutHandler} disabled={cartItems.length===0}
              >
                Porceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>

        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen