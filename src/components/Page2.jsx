import React from 'react';
import {useLocation} from "react-router-dom";
import {Button, Form, Input,Modal,Layout,Typography,Card,Divider,Space} from 'antd';



function fetchApi(data,responseData,setResponseData,setIsModalOpen,isModalOpen) {
  fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
 .then(response => response.json())
  .then(data => {
    setResponseData(data);
    setIsModalOpen(!isModalOpen);
  })
  .catch((error) => {
    setResponseData(undefined);
    setIsModalOpen(!isModalOpen);
  });
}

function Page2() {  
    const location=useLocation();
    const data=location.state;
    const [form]=Form.useForm();
    const [isModalOpen,setIsModalOpen]=React.useState(false);
    const [responseData,setResponseData]=React.useState(null);
    form.setFieldsValue(data);
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
                  
            <Text strong>ID:</Text> <Text>{responseData.id}</Text><br />
            <Text strong>Title:</Text> <Text>{responseData.title}</Text><br />
            <Text strong>Price:</Text> <Text>{responseData.price}</Text><br />
            <Text strong>Brand:</Text> <Text>{responseData.brand}</Text><br />
            <Text strong>Category:</Text> <Text>{responseData.category}</Text>

            <Divider />

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
    <Modal title="Are you sure?" open={isModalOpen} onOk={()=>{fetchApi(data,responseData,setResponseData,setIsModalOpen,isModalOpen)}} onCancel={()=>setIsModalOpen(false)}>
       <p>This will send your product details to the server.</p>
    </Modal>
    </Layout>
   
    );
    
}
export default Page2;