import React, { useEffect } from 'react';
import {Link, useLocation} from "react-router-dom";
import {Button, Form, Input,Modal,Layout,Typography,Card,Divider,Space} from 'antd';



const LOCALSTORAGE_KEY = 'products';


function getStoredProducts() {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Could not parse stored products, returning empty array.', e);
    return [];
  }
}


function setStoredProducts(arr) {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('Could not write products to localStorage', e);
  }
}

function fetchApi(data,setResponseData,setIsModalOpen) {
  fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
 .then(response => response.json())
  .then(apiData => {
    setResponseData(apiData);
    setIsModalOpen(false);
  })
  .catch((error) => {
    setResponseData(undefined);
    setIsModalOpen(false);
  });
}

function Page2() {  
    const location=useLocation();
    const data=location.state;
    const [form]=Form.useForm();
    const [isModalOpen,setIsModalOpen]=React.useState(false);
    const [responseData,setResponseData]=React.useState(null);
    useEffect(()=>{
      form.setFieldsValue(data);
    },[]);
    useEffect(() => {
  if (responseData) {
    const stored = getStoredProducts();
      stored.unshift(responseData);
      setStoredProducts(stored);
    
  }
}, [responseData]);


    const { Header, Content } = Layout;
    const { Title, Text } = Typography;
   
  if(responseData){
    return( <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <Header style={{ background: "#001529", padding: "12px 24px" }}>
          <Title level={4} style={{ color: "white", margin: 0 }}>Product Added</Title>
        </Header>

        <Content style={{ padding: 24 }}>
          <Card bordered={false} style={{ maxWidth: 600, margin: "0 auto" }}>
            <Title level={4}>Product Added Successfully!</Title>
            <Divider />
            <Text strong>Title:</Text> <Text>{responseData.title}</Text><br />
            <Text strong>Price:</Text> <Text>{responseData.price}</Text><br />
            <Text strong>Brand:</Text> <Text>{responseData.brand}</Text><br />
            <Text strong>Category:</Text> <Text>{responseData.category}</Text>

            <Divider />
            <Link to="/">
              <Button type="primary">
                Add Another Product
              </Button>
            </Link>
          </Card>
        </Content>
      </Layout>);
  }

  else if(responseData===undefined){
    return( <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <Header style={{ background: "#001529", padding: "12px 24px" }}>
          <Title level={4} style={{ color: "white", margin: 0 }}>Error</Title>
        </Header>

        <Content style={{ padding: 24 }}>
          <Card bordered={false} style={{ maxWidth: 600, margin: "0 auto" }}>
            <Title level={4} type="danger">Error adding product!</Title>
            <Divider />
            <Button type="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        </Content>
      </Layout>);
  }
    
    return(<Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header style={{ background: "#001529", padding: "12px 24px" }}>
        <Title level={4} style={{ color: "white", margin: 0 }}>Confirm Product</Title>
      </Header>
       <Content style={{ padding: 24 }}>
        <Card bordered={false} style={{ maxWidth: 600, margin: "0 auto" }}>
          <Title level={4}>Review Product Details</Title>
          <Divider />
    <Form form={form}>
        <Form.Item label="Title" name="title"><Input/></Form.Item>
        <Form.Item label="Price" name="price"><Input type="number"/></Form.Item>
        <Form.Item label="Brand" name="brand"><Input/></Form.Item>
        <Form.Item label="Category" name="category"><Input/></Form.Item>
         <Divider />
        <Button type="primary" onClick={()=>{
            setIsModalOpen(true);
        }}>Add Product</Button>
    </Form>
        </Card>
      </Content>
    <Modal title="Are you sure?" open={isModalOpen} onOk={()=>{fetchApi(form.getFieldsValue(),setResponseData,setIsModalOpen)}} onCancel={()=>setIsModalOpen(false)}>
       <p>This will send your product details to the server.</p>
    </Modal>
    </Layout>
    );  
}
export default Page2;