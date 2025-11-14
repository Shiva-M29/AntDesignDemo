import React from 'react';
import {Layout,Space,Typography,DatePicker,Button,Table,Modal,Input,Form,Select,Card,Row,Col,Divider} from 'antd';
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom";
function fetchSearchApi(query,setSearchResults){
  fetch(`https://dummyjson.com/products/search?q=${query}&limit=5`)
  .then(response => response.json())
  .then(data =>{setSearchResults(data.products);})
  .catch((error) => {
    console.error('Error:', error);
  });
}

function fetchFilteredResults(category,setFilterResults){
  fetch(`https://dummyjson.com/products/category/${category}?limit=3`)
  .then(response => response.json())
  .then(data =>{setFilterResults(data.products);})
  .catch((error) => {
    console.error('Error:', error);
  });
}
function Page1() {
    const [startDate,setStartDate]=React.useState(dayjs().add(-7,'day'));
    const [modeOpen,setModeOpen]=React.useState(false);
    const [searchResults, setSearchResults] = React.useState([]);
    const [filterResults, setFilterResults] = React.useState([]);
    const [form] = Form.useForm();
    const {Search}=Input;
    const { Title, Text } = Typography;
    const navigate=useNavigate();
    const onFinish=()=>{
      form.validateFields()
      .then(( )=>{const values=form.getFieldsValue();
      navigate('/page2',{state:values});})
      .catch((info) => {
        console.log('Validate Failed:', info);
      }
      );
    }
    const columns1=[
      {
        title:'Title', dataIndex:'title'
      },
      {
        title:'Price', dataIndex:'price'
      },
      {
        title:'Brand', dataIndex:'brand'
      },
      {
        title:'Category', dataIndex:'category'
      },
      ];
      
      const data1=searchResults.map((item)=>({
        key:item.id,
        title:item.title,
        price:item.price,
        brand:item.brand,
        category:item.category
      }));
      const data2=filterResults.map((item)=>({
        key:item.id,
        title:item.title,
        price:item.price,
        brand:item.brand,
        category:item.category
      }));
  return( <Layout style={{ minHeight: '100vh', padding: 24, background: '#f0f2f5' }}>
    <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row align="middle" gutter={16}>
          <Col xs={24} sm={24} md={6} lg={5}>
            <Title level={4} style={{ margin: 0 }}>Products</Title>
            <Text type="secondary">Search & filter products</Text>
          </Col>

          <Col xs={24} sm={24} md={6} lg={5}>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              <Text strong>Start date</Text>
   <DatePicker placeholder='start date' defaultValue={dayjs().add(-7,'day')} onChange={(date)=>setStartDate(date)} style={{ width: '100%' }} format="DD-MM-YYYY"/>
            </Space>
          </Col>
           <Col xs={24} sm={24} md={6} lg={5}>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              <Text strong>End date</Text>
   <DatePicker placeholder='end date' defaultValue={dayjs()} disabledDate={(current)=>{return current && current<=startDate}} style={{ width: '100%' }} format="DD-MM-YYYY"/>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={6} lg={9} style={{ textAlign: 'right' }}>
            <Space wrap>
   <Button type='primary' onClick={()=>setModeOpen(!modeOpen)} style={{marginLeft:10}}>{modeOpen?'Close Modal': 'Open Modal'}</Button>
   </Space>
          </Col>
        </Row>
      </Card>
   <Modal title="Form to Add product" open={modeOpen} onOk={onFinish} onCancel={()=>setModeOpen(false)} >
    <Form form={form} layout="vertical">
      <Form.Item name="title" label="title" rules={[{ required: true, message: 'Please input the title!' }]}>
        <Input />
      </Form.Item>
       <Form.Item name="price" label="price" rules={[{ required: true, message: 'Please input the price!' }]}>
        <Input type="number"/>
      </Form.Item>
       <Form.Item name="brand" label="brand" rules={[{ required: true, message: 'Please input the brand!' }]}>
        <Input />
      </Form.Item>
       <Form.Item name="category" label="category" rules={[{ required: true, message: 'Please input the category!' }]}>
        <Input />
      </Form.Item>
    </Form>
    </Modal>
    <Row>
  <Col span={24}>
    <Card title="Search" bordered={false}>
      <Row gutter={12} align="middle">
        <Col span={18}>
    <Search placeholder="Search products" enterButton="Search" style={{ width: '50%' }} onSearch={(value)=>{fetchSearchApi(value,setSearchResults)}}/>
       </Col>
        <Col span={6} style={{ textAlign: "right" }}>
          <Text type="secondary">Results: {searchResults.length}</Text>
        </Col>
      </Row>
      <Divider />
   { searchResults.length>0 ?( <Table columns={columns1} dataSource={data1} /> ) :(
        <div style={{ padding: 16, color: "#888" }}>No search results to display.</div>
      )}
       </Card>
  </Col>
</Row>
<Row style={{ marginTop: 16 }}>
  <Col span={24}>
    <Card title="Filter" bordered={false}>
    <Select placeholder="Filter by Category" style={{width:100, marginTop:20}} onChange={(value)=>{fetchFilteredResults(value,setFilterResults)}}>
      <Select.Option value="smartphones">smartphones</Select.Option>
      <Select.Option value="laptops">laptops</Select.Option>
      <Select.Option value="fragrances">fragrances</Select.Option>
      <Select.Option value="groceries">groceries</Select.Option>
    </Select>
    <Divider />
     {filterResults.length >0 ?( <Table columns={columns1} dataSource={data2} /> ):(
        <div style={{ padding: 16, color: "#888" }}>No category results to display.</div>
      )}
      </Card>
  </Col>
</Row>
   
  </Layout>);
}
export default Page1;