import React, { useEffect } from 'react';
import {Layout,Typography,DatePicker,Button,Table,Modal,Input,Form,Select,Card,Row,Col,Divider} from 'antd';
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom";
const LOCALSTORAGE_KEY = 'products';


function countSundays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);

  while (current <= new Date(endDate)) {
    if (current.getDay() === 0) {  
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}


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


function fetchApi(query,category,setResults){ 
  if(query==='' && category===''){
    fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data =>{  
    setResults(data.products);})
    .catch((error) => {
      setResults([]);
    });
    return;
  }
  const searchresults=query!==''?fetch(`https://dummyjson.com/products/search?q=${query}`)
  .then(response => response.json())
  .then(data =>
           data.products || [])
  .catch((error) => {
    return [];
  }):Promise.resolve([]);

const filterresults=
  category!==''?fetch(`https://dummyjson.com/products/category/${category}`)
  .then(response => response.json())
  .then(data =>data.products || [])
  .catch((error) => {
    return [];
  }):Promise.resolve([]);
Promise.all([searchresults,filterresults])
.then(([searchData,filterData])=>{
  if(query!=='' && category===''){
    setResults(searchData);
    return;
  }
  if(query==='' && category!==''){
    setResults(filterData);
  }
  if(query!=='' && category!==''){
    const results=searchData.filter(item=>item.category===category);
    setResults(results);
  }
});
}

function Page1() {
    const [startDate,setStartDate]=React.useState(dayjs().add(-7,'day'));
    const [endDate,setEndDate]=React.useState(dayjs());
    const [modeOpen,setModeOpen]=React.useState(false);
    const [results, setResults] = React.useState([]);
    const [query,setQuery]=React.useState('');
    const [category,setCategory]=React.useState('');
    const [form] = Form.useForm();
    const {Search}=Input;
    const { Title, Text } = Typography;
    const { Sider, Content } = Layout;
    useEffect(() => {
    if (localStorage.getItem(LOCALSTORAGE_KEY) === null) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify([]));
    }
  }, []);
    const navigate=useNavigate();
    const onFinish=()=>{
      form.validateFields()
      .then(()=>{const values=form.getFieldsValue();
      navigate('/page2',{state:values});})
      .catch((info) => {
        console.log('Validate Failed:', info);
      }
      );
    }
   useEffect(()=>{
     fetchApi('', '', setResults);
   },[]);
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
      }
      
      ];
      
const fetchedRows = results.map((item) => ({
  title: item.title,
  price: item.price,
  brand: item.brand,
  category: item.category
}));


const stored = getStoredProducts(); 


const storedRows = stored.map((item) => ({
  title: item.title,
  price: item.price,
  brand: item.brand,
  category: item.category
}));
const filteredStored = category
  ? storedRows.filter((p) => p.category === category)
  : storedRows;

const finalfilteredStored = query? filteredStored.filter((p) =>
  p.title.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())
):filteredStored;

const data1 = [ ...finalfilteredStored,...fetchedRows];


  return( <Layout style={{ minHeight: "100vh" }}>

    <Sider
      width={300}
      style={{
        background: "#fff",
        padding: 16,
        borderRight: "1px solid #eee",
      }}
    >
            <Title level={4} style={{ margin: 0 }}>Products</Title>
            <Text type="secondary" >Search & filter products</Text>
         <Divider />
         <Search placeholder="Search products" enterButton="Search" style={{ width: '100%',marginBottom:35}} onChange={(e)=>{ setQuery(e.target.value); fetchApi(e.target.value,category,setResults)}}/>
          
          <Text strong style={{display:'block'}}>Category</Text>
           <Select placeholder="Filter by Category" style={{width:100, marginTop:20}} onChange={(value)=>{ setCategory(value); fetchApi(query,value,setResults)}}>
      <Select.Option value="smartphones">smartphones</Select.Option>
      <Select.Option value="laptops">laptops</Select.Option>
      <Select.Option value="fragrances">fragrances</Select.Option>
      <Select.Option value="groceries">groceries</Select.Option>
      <Select.Option value="furniture">furniture</Select.Option>
      <Select.Option value="">None</Select.Option>
    </Select>
    <Divider />
         
              <Text strong >Start date</Text>
   <DatePicker placeholder='start date' defaultValue={dayjs().add(-7,'day')} onChange={(date)=>setStartDate(date)} style={{ width: '100%',marginTop:8}} format="DD-MM-YYYY"/>
           
              <Text strong >End date</Text>
   <DatePicker placeholder='end date' defaultValue={dayjs()} onChange={(date)=>setEndDate(date)} disabledDate={(current)=>{return current && current<=startDate}} style={{ width: '100%',marginTop:8 }} format="DD-MM-YYYY"/>
           

          
<Text strong style={{marginTop:50}}>
  Total Sundays between:
  {countSundays(startDate.toDate(), endDate.toDate())}
</Text>

<Divider />
   <Button type='primary' onClick={()=>setModeOpen(!modeOpen)} style={{marginLeft:10}}>{modeOpen?'Close Modal': 'Add Product'}</Button>
   <Divider />
       <Divider />

      <Text type="secondary">Results: {results.length}</Text>
      </Sider>
    <Content>
    {results.length>0 ?<Table columns={columns1} dataSource={data1} style={{marginTop:20}}/>: <Text style={{marginTop:20}} type="warning">No products found</Text>}
    </Content>
    <Modal title="Form to Add product" open={modeOpen} onOk={onFinish} onCancel={()=>setModeOpen(false)} >
    <Form form={form} layout="vertical">
      <Form.Item name="title" label="title" rules={[{ required: true, message: 'Please input the title!' },{pattern: /^[A-Za-z0-9 ]+$/, message: 'Title must contain only letters and spaces'}]}>
        <Input />
      </Form.Item>
       <Form.Item name="price" label="price" rules={[{ required: true, message: 'Please input the price!' },{type:'number', min:1 ,transform: (value) => Number(value), message:'Price must be a positive number'}]}>
        <Input/>
      </Form.Item>
       <Form.Item name="brand" label="brand" rules={[{ required: true, message: 'Please input the brand!' },{pattern: /^[A-Za-z ]+$/, message: 'Brand must contain only letters and spaces'}]}>
        <Input />
      </Form.Item>
       <Form.Item name="category" label="category" rules={[{ required: true, message: 'Please input the category!' },{pattern: /^[A-Za-z ]+$/, message: 'Category must contain only letters and spaces'}]}>
        <Input />
      </Form.Item>
    </Form>
    </Modal>
   
   
  </Layout>);
}
export default Page1;