function fetchApi(data) {
  fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
})
 .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    return data;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
export default fetchApi;